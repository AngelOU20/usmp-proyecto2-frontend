import logger from "../logger";
import { getChunkedDocsFromUploadedPDFs, loadPDFsAsDocuments } from "../pdf-loader";
import { getPineconeClient } from "../pinecone-client";
import { embedAndStoreDocs } from "../vector-store";

// Función para guardar en Pinecone
export const saveOnPinecone = async (files: File[]) => {
  try {
    logger.info("Preparing chunks from PDF files");
    const docs = await getChunkedDocsFromUploadedPDFs(files);

    logger.info(`Loading ${docs.length} chunks into pinecone...`);

    await embedAndStoreDocs(docs);
    logger.info("Data embedded and stored in pine-cone successfully.");
  } catch (error) {
    console.error("saveOnPinecone failed ", error);
  }
};

// Función para eliminar el vector en Pinecone
export async function deleteVectorFromPinecone (vectorId: string) {
  if (!vectorId || vectorId.trim() === "") {
    logger.error("El ID del vector no es válido.");
    throw new Error("El ID del vector no es válido.");
  }

  const pinecone = await getPineconeClient();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  try {
    // Eliminar el vector por ID utilizando deleteOne
    await index.deleteOne(vectorId); // Pasa el ID directamente como cadena
    logger.info("Vector eliminado de Pinecone:", vectorId);
  } catch (error) {
    logger.error(`Error al eliminar el vector de Pinecone (ID: ${vectorId}):`, error);
    throw new Error(`Error al eliminar el vector de Pinecone con ID: ${vectorId}`);
  }
}
