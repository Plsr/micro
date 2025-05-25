import fs from "fs/promises";
import { marked } from "marked";
import matter from "gray-matter";
import path from "path";
import { singlePageTemplate } from "./generatePage";

async function readFile(path: string) {
  try {
    const data = await fs.readFile(path, "utf-8");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

type SupportedMetaData = "title" | "date";

export type FileData = {
  content: string;
  metadata: Record<SupportedMetaData, string>;
};

async function convertMarkdownToHtml(markdown: string): Promise<FileData> {
  try {
    const parsed = matter(markdown);
    console.log("Parsed front matter:", parsed);
    const htmlContent = await marked(parsed.content);
    return {
      content: htmlContent,
      metadata: {
        title: parsed.data.title || "Untitled",
        date: parsed.data.date || new Date().toISOString(),
      },
    };
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
    const fileData = await convertMarkdownToHtml(markdownContent);
    const htmlContent = singlePageTemplate(
      fileData.content,
      fileData.metadata.date,
      fileData.metadata.title
    );
    await writeHtmlToFile(htmlContent, fileName);
  }
}
