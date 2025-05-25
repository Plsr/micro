import fs from "fs/promises";
import path from "path";

export const clearOutputDirectory = async (outputDir = "output") => {
  try {
    // Check if the output directory exists
    await fs.access(outputDir);

    // Read all files in the output directory
    const files = await fs.readdir(outputDir);

    // Delete each file
    await Promise.all(
      files.map((file) => fs.unlink(path.join(outputDir, file)))
    );

    console.log(`All files in ${outputDir} have been deleted.`);
  } catch (error) {
    console.error("Error clearing output directory:", error);
  }
};
