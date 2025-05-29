import fs from "fs/promises";
import matter from "gray-matter";
import { marked } from "marked";
import path from "path";

type SupportedMetaData = "title" | "date" | "slug";

export type Post = {
  content: string;
  metadata: Record<SupportedMetaData, string>;
};

export class Converter {
  private contentDir: string;

  constructor(contentDir: string) {
    this.contentDir = contentDir;
  }

  async convert() {
    const files = await fs.readdir(this.contentDir);
    const posts = await Promise.all(
      files.map(async (file) => {
        const markdown = await this.readFile(path.join(this.contentDir, file));
        if (!markdown) {
          return null;
        }
        return this.convertMarkdownToHtml(markdown, file);
      })
    );

    return posts.filter((post) => post !== null);
  }

  private async readFile(path: string) {
    try {
      const data = await fs.readFile(path, "utf-8");
      return data;
    } catch (error) {
      console.error("Error reading file:", error);
      return null;
    }
  }
  private async convertMarkdownToHtml(
    markdown: string,
    fileName: string
  ): Promise<Post> {
    try {
      const parsed = matter(markdown);
      const htmlContent = await marked(parsed.content);
      return {
        content: htmlContent,
        metadata: {
          slug: parsed.data.slug || fileName.replace(".md", ""),
          title: parsed.data.title || "Untitled",
          date: parsed.data.date || new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error converting markdown to HTML:", error);
      throw error;
    }
  }
}
