import { extractTextFromUrl } from "../utils/extractText";

export const extractText = async (url: string, fileName: string): Promise<string> => {
  try {
    const text = await extractTextFromUrl(url, fileName);
    return text;
  } catch (error: any) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
};