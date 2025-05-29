import { Converter } from "./converter";
import { Generator } from "./generator";

export const config = {
  contentDir: "content",
  outputDir: "output",
};

async function main() {
  const converter = new Converter(config.contentDir);
  const posts = await converter.convert();

  const generator = new Generator(posts);
  await generator.generate();
}

main();
