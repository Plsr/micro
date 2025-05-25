import fs from "fs/promises";
import path from "path";

export const getFiles = async (dir: string) => {
  try {
    const files = await fs.readdir(dir);
    const filePaths = files.map((file) => path.join(dir, file));
    console.log("Files in directory:", filePaths);
    return filePaths;
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
};
