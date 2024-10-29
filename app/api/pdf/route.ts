// import logger from "@/services/logger";
// import { type NextRequest, NextResponse } from "next/server";
// import { getChunkedDocsFromUploadedPDFs, loadPDFsAsDocuments } from "@/services/pdf-loader";
// import { getPineconeClient } from "@/services/pinecone-client";
// import { embedAndStoreDocs } from "@/services/vector-store";

// export async function POST (req: NextRequest) {
//   const formData = await req.formData();
//   const searchParams = new URL(req.url).searchParams;
//   const sessionId = searchParams.get("sessionId") || "";

//   if (!searchParams.has("sessionId")) {
//     return NextResponse.json(
//       { error: "Bad Request", reason: "No sessionId provided" },
//       {
//         status: 400,
//       },
//     );
//   }

//   // Eliminar la protección Arcjet, continuar con el proceso de archivos.
//   const files = [];
//   for (const [_name, file] of formData) {
//     files.push(file as File);
//   }

//   try {
//     await saveOnPinecone(files);

//     return NextResponse.json({
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Internal server error ", error);
//     return NextResponse.json(
//       {
//         error: "Error: Something went wrong. Try again!",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// const saveOnPinecone = async (files: File[]) => {
//   try {
//     // Cargar los archivos PDF completos sin dividirlos en chunks
//     const docs = await loadPDFsAsDocuments(files);  // Nueva función para cargar PDFs completos

//     // Almacenar los documentos directamente en Pinecone
//     await embedAndStoreDocs(docs);
//     logger.info("Data embedded and stored in Pinecone successfully.");
//   } catch (error) {
//     console.error("saveOnPinecone failed ", error);
//   }
// };
