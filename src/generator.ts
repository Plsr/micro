import fs from "fs/promises";
import { Post } from "./converter";
import { config } from "./index";
import path from "path";

export class Generator {
  private posts: Post[];

  constructor(posts: Post[]) {
    this.posts = posts;
    console.log(this.posts);
  }

  async generate() {
    await this.cleanOutputDirectory();
    await this.generatePosts();
    await this.generateIndexPage();
  }

  async generatePosts() {
    await Promise.all(
      this.posts.map((post) => {
        const htmlPage = baseHtmlTemplate(post.metadata.title, post.content);
        try {
          fs.writeFile(
            `${config.outputDir}/${post.metadata.slug}.html`,
            htmlPage
          );
        } catch (error) {
          console.error("Error writing index.html:", error);
          throw error;
        }
      })
    );
  }

  async generateIndexPage() {
    const links = this.posts
      .map(
        (post) =>
          `<li><a href="${path.basename(
            `${config.outputDir}/${post.metadata.slug}.html`
          )}">${post.metadata.title}</a></li>`
      )
      .join("\n");
    // Need the links for all posts here eventually
    const htmlContent = `
    <h1>Hello, World!</h1>
    <h2>Links to Markdown Files</h2>
    <ul>
      ${links}
    </ul>
  `;

    console.log(htmlContent);

    const htmlPage = baseHtmlTemplate("Index", htmlContent);

    try {
      fs.writeFile(`${config.outputDir}/index.html`, htmlPage);
    } catch (error) {
      console.error("Error writing index.html:", error);
      throw error;
    }
  }

  private async cleanOutputDirectory() {
    const outputDir = config.outputDir;
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
  }
}

const baseHtmlTemplate = (title: string, body: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    ${body}
  </body>
</html>
`;
