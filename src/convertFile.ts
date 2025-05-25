import fs from "fs/promises";
import { marked } from "marked";
import path from "path";

async function readFile(path: string) {
  try {
    const data = await fs.readFile(path, "utf-8");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

async function convertMarkdownToHtml(markdown: string): Promise<string> {
  try {
    const html = marked(markdown);
    return html;
  } catch (error) {
    console.error("Error converting markdown to HTML:", error);
    throw error;
  }
}

async function writeHtmlToFile(html: string, fileName: string) {
  try {
    await fs.writeFile(`output/${fileName}.html`, html, "utf-8");
    console.log("HTML file written successfully.");
  } catch (error) {
    console.error("Error writing HTML file:", error);
  }
}

export async function convertFile(pathName: string) {
  const fileName = path.basename(pathName, ".md");
  const markdownContent = await readFile(pathName);
  if (markdownContent) {
    const htmlContent = await convertMarkdownToHtml(markdownContent);
    console.log(htmlContent);
    await writeHtmlToFile(htmlContent, fileName);
  }
}
