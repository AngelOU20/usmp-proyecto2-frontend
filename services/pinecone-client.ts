// import { uniqueId } from "lodash";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { env } from "./config";
import { delay } from "./utils";
import logger from "./logger";

class Pinecone {
  client: PineconeClient;
  indexName: string;

  constructor (indexName?: string) {
    this.client = new PineconeClient({
      apiKey: env.PINECONE_API_KEY || "",
    });
    this.indexName = indexName || env.PINECONE_INDEX_NAME;
  }

  async init () {
    try {
      const existingIndexes = await this.client.listIndexes();
      const existingIndexNames =
        existingIndexes.indexes?.map((index) => index.name) || [];

      // Verificar y crear el índice solo si no existe
      if (!existingIndexNames.includes(this.indexName)) {
        logger.info(
          `Pinecone index name: ${this.indexName} does not exist. Creating index...`,
        );
        await this.createIndex(this.indexName);
      } else {
        logger.info(`Pinecone index name: ${this.indexName} already exists.`);
      }

      return this.client;
    } catch (error) {
      logger.error(`Error initializing Pinecone, error: ${error}`);
      throw new Error("Error initializing Pinecone");
    }
  }

  private async createIndex (indexName: string) {
    try {
      const indexCreated = await this.client.createIndex({
        name: indexName,
        dimension: 1536,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });

      logger.info(
        `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index : ${indexName} initializing to complete...`,
      );
      await delay(Number(env.INDEX_INIT_TIMEOUT));
      logger.info(
        `Index : ${indexName} initialized successfully. indexCreated: ${indexCreated}`,
      );
      return indexCreated;
    } catch (error) {
      logger.error(`Error creating index: ${indexName}, error: ${error}`);
      throw new Error("Error creating index");
    }
  }

  async deleteIndex (indexName: string) {
    return await this.client.deleteIndex(indexName);
  }
}

export const getPineconeClient = async (indexName: string) => {
  const pineconeInstance = new Pinecone(indexName);
  const initialized = await pineconeInstance.init();
  return initialized;
};

export default Pinecone;
