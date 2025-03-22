import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI('AIzaSyB25o3qeXESYDlOVMBKdM-xFEbZaUZjwGc');

// Converts local file information to base64
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = "return the ingredients displayed in the image as a JSON object";

  const imageParts = [
    fileToGenerativePart("elprimo.jpg", "image/jpeg"),
  ];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);
  
  console.log(generatedContent.response.text());
}

run();
