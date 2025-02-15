import { execFile } from "child_process";
import * as path from "path";

export async function recognizeWithEasyOCR(imagePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, "easyocr_script.py");

    execFile("python", [pythonScript, imagePath], (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error execute Python-scripts:", error);
        reject(error);
        return;
      }

      if (stderr) {
        console.error("⚠️ STDERR:", stderr);
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}
