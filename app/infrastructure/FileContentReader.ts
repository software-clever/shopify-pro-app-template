import fs from "fs-extra";
import logger from "app/utils/logger";

export default class FileContentReader {
  private readonly resourceDir: string;
  constructor(resourceDir = "app/resources") {
    this.resourceDir = resourceDir;
  }
  public async read(name: string): Promise<string> {
    const folder = name.split(".").pop();
    const filePath = `${this.resourceDir}/${folder}/${name}`;
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (err) {
      if (err instanceof Error) {
        logger.error({ err }, `file doesn't exist at ${filePath}`);
      } else {
        logger.error(`file doesn't exist at ${filePath}. ${err}`);
      }
      return "";
    }
  }
}
