import axios from "axios";
import {PDFParse} from "pdf-parse";
import mammoth from "mammoth";

/**
 * Fetches a file from a public URL and returns its data as a Buffer.
 * @param url - The public URL of the file.
 * @returns The file data as a Buffer.
 * @throws Error if the fetch fails.
 */
async function fetchFileBuffer(url: string): Promise<Buffer> {
  try {
    const response = await axios.get<ArrayBuffer>(url, {
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  } catch (err: any) {
    throw new Error(`Failed to fetch file from URL ${url}: ${err.message}`);
  }
}

/**
 * Extracts text from a PDF file at the given public URL.
 * @param url - The public URL of the PDF file.
 * @returns The extracted text.
 */
export async function extractPDFText(url: string): Promise<string> {
  const buffer = await fetchFileBuffer(url);
  try {
    const parser = new PDFParse({ data: buffer });
    const { text } = await parser.getText();
    return text;
  } catch (err: any) {
    throw new Error(`PDF parsing error for ${url}: ${err.message}`);
  }
}

/**
 * Extracts text from a DOC or DOCX file at the given public URL.
 * @param url - The public URL of the DOC/DOCX file.
 * @returns The extracted text.
 */
export async function extractDocText(url: string): Promise<string> {
  const buffer = await fetchFileBuffer(url);
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err: any) {
    throw new Error(`DOC/DOCX parsing error for ${url}: ${err.message}`);
  }
}

/**
 * Determines the file type by URL extension and delegates to the appropriate extractor.
 * Supports PDF, DOC, and DOCX.
 * @param url - The public URL of the file.
 * @returns The extracted text.
 * @throws Error if the file type is unsupported or parsing fails.
 */
export async function extractTextFromUrl(
  url: string,
  fileName: string,
): Promise<string> {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return extractPDFText(url);
  }
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) {
    return extractDocText(url);
  }
  throw new Error(`Unsupported file extension in URL: ${url}`);
}
