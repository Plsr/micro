import fs from "fs/promises";
import path from "path";

export const generateIndexPage = async (outputDir: string = "output") => {
  const files = await fs.readdir(outputDir);
  const pageLinks = files.map((file) => path.join(outputDir, file));

  const links = pageLinks
    .map((link) => `<li><a href="${path.basename(link)}">${link}</a></li>`)
    .join("\n");
  // Need the links for all posts here eventually
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>My New HTML File</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <h2>Links to Markdown Files</h2>
  <ul>
    ${links}
  </ul>
</body>
</html>
`;

  try {
    fs.writeFile(`${outputDir}/index.html`, htmlContent);
  } catch (error) {
    console.error("Error writing index.html:", error);
    throw error;
  }
};
