import type { Document } from "@langchain/core/documents";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import flattenDeep from "lodash/flattenDeep";
import logger from "./logger";

export async function getChunkedDocsFromUploadedPDFs (
  fileList: File[],
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
      chunkSize: 4000,
      chunkOverlap: 800,
    });

    const chunkedDocs = await textSplitter.splitDocuments(flatDocs);

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