// backend/src/services/mockImageGenerator.ts
import sharp from "sharp";
import path from "path";

export const mockGenerateImage = async (
  inputPath: string,
  prompt: string
): Promise<string> => {
  const outputFilename = `generated-${Date.now()}.png`;
  const outputPath = path.join(path.dirname(inputPath), outputFilename);

  // SVG overlay — positioned at the top, with translucent bar
  const svgOverlay = `
    <svg width="800" height="150">
      <style>
        .prompt-bg { fill: rgba(0, 0, 0, 0.5); }
        .prompt-text {
          fill: #fff;
          font-size: 28px;
          font-weight: bold;
          font-family: 'Arial, sans-serif';
          text-anchor: middle;
        }
      </style>
      <rect x="0" y="0" width="100%" height="100%" class="prompt-bg"/>
      <text x="50%" y="60%" class="prompt-text">${prompt}</text>
    </svg>
  `;

  await sharp(inputPath)
    .resize({ width: 800 }) // Normalize image width
    .composite([
      {
        input: Buffer.from(svgOverlay),
        gravity: "north", // 👈 place overlay on top
      },
    ])
    .modulate({ brightness: 1.05, saturation: 1.1 }) // slight enhancement
    .blur(0.3)
    .toFile(outputPath);

  return outputPath;
};
