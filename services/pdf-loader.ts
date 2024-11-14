import type { Document } from "@langchain/core/documents";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import flattenDeep from "lodash/flattenDeep";
import logger from "./logger";

// Función para extraer el encabezado y capturar campos específicos
function extractHeaderInfo (content: string): { projectTitle: string; studentNames: string; advisorName: string; week: string; } {
  let projectTitle = "Unknown Project";
  let studentNames = "Unknown Students";
  let advisorName = "Unknown Advisor";
  let week = "Unknown Week";

  const projectTitleMatch = content.match(/Título del Proyecto:\s*(.+)/i);
  if (projectTitleMatch) {
    projectTitle = projectTitleMatch[1].trim();
  }

  const studentNamesMatch = content.match(/ALUMNO-[0-9]+\s+([^\n]+)/gi);
  if (studentNamesMatch) {
    studentNames = studentNamesMatch.map((student) => student.replace(/ALUMNO-[0-9]+\s+/i, "").trim()).join(", ");
  }

  const advisorNameMatch = content.match(/ASESOR:\s*(.+)/i);
  if (advisorNameMatch) {
    advisorName = advisorNameMatch[1].trim();
  }

  const weekMatch = content.match(/\b(S[0-9]+)\b/);
  if (weekMatch) {
    week = weekMatch[1].trim();
  }

  return {
    projectTitle,
    studentNames,
    advisorName,
    week,
  };
}

export async function getChunkedDocsFromUploadedPDFs (
  fileList: File[],
  documentType: string
): Promise<Document<Record<string, unknown>>[]> {
  try {
    const docList = [];

    for (const file of fileList) {
      const pdfLoader = new WebPDFLoader(file);
      const docs = await pdfLoader.load();
      docList.push(docs);
    }

    const flatDocs = flattenDeep(docList);
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 3000,
      chunkOverlap: 400,
    });

    const chunkedDocs: Document<Record<string, unknown>>[] = [];
    logger.info("Preparing chunks from PDF files");

    // Extraer los metadatos del encabezado solo si el documentType es "Bitácora"
    let headerInfo = { projectTitle: "", studentNames: "", advisorName: "", week: "" };
    if (documentType === "bitacora" && flatDocs.length > 0) {
      headerInfo = extractHeaderInfo(flatDocs[0].pageContent); // Extraer encabezado de la primera página
      logger.info(`Extracted header: ${JSON.stringify(headerInfo)}`);
    }

    // Procesar cada documento
    for (const doc of flatDocs) {
      logger.info(`Processing document with metadata: ${JSON.stringify(doc.metadata)}`);

      // Dividir el contenido del documento en chunks
      const chunks = await textSplitter.splitText(doc.pageContent);

      // Crear chunks con metadatos adicionales
      const formattedChunks = chunks.map((chunk) => ({
        pageContent: chunk.trim(),
        metadata: {
          ...doc.metadata,
          documentType,
          ...(documentType === "bitacora" ? { // Solo aplicar metadatos si es una bitácora
            projectTitle: headerInfo.projectTitle,
            studentNames: headerInfo.studentNames,
            advisorName: headerInfo.advisorName,
            week: headerInfo.week, // Agregar metadato de la semana
          } : {}),
        },
      }));

      chunkedDocs.push(...formattedChunks);
      logger.info(`Created ${formattedChunks.length} chunks from document.`);
    }

    logger.info(`Total chunks created and prepared for storage: ${chunkedDocs.length}`);
    return chunkedDocs;
  } catch (error) {
    logger.error(`Error loading PDF: ${fileList} ${error}`);
    throw new Error("Error loading PDF");
  }
}

// Función para cargar los PDFs completos
export async function loadPDFsAsDocuments (files: File[]): Promise<Document<Record<string, unknown>>[]> {
  try {
    const docList = [];

    for (const file of files) {
      const pdfLoader = new WebPDFLoader(file);  // Cargar el PDF completo
      const docs = await pdfLoader.load();  // Esto devuelve los documentos completos
      docList.push(docs);  // Agregar el documento a la lista
    }

    return docList.flat();  // Aplanar la lista de documentos y devolverla
  } catch (error) {
    logger.error(`Error loading PDFs: ${error}`);
    throw new Error("Failed to load PDF documents.");
  }
}