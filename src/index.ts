import { convertFile } from "./convertFile";
import { getFiles } from "./getFiles";
import { clearOutputDirectory } from "./cleanup";
import { generateIndexPage } from "./generatePage";

async function main() {
  await clearOutputDirectory(); // Ensure this function is defined in your cleanup.ts
  const filePaths = await getFiles("content"); // Adjust the directory path as needed
  await Promise.all(filePaths.map(convertFile));
  generateIndexPage(); // Ensure this function is defined in your generatePage.ts
}

main();
