import { action, internalMutation } from "../convex/_generated/server";
import { Id } from "../convex/_generated/dataModel";
import { v } from 'convex/values'
import { chunktext } from '../utils/chunktext'
import { getEmbedding } from '../utils/getEmbedding'
import { api, internal } from "../convex/_generated/api";
import { ActionCtx } from "../convex/_generated/server";
import { internalQuery } from "../convex/_generated/server";
import { PDFParse } from "pdf-parse";
import { readFile } from 'node:fs/promises';
// import {nodeActions} from "";





export const getid = internalQuery({
    args: {
        pdfId: v.id("pdfs"),

    },
    handler: async (ctx, { pdfId }: { pdfId: Id<"pdfs"> }) => {
        const pdf = await ctx.db.get(pdfId);
        if (!pdf) {
            throw new Error('PDF not found');
        }
        return pdf;
    }

});

export const insert = internalMutation({
    args: {
        pdfId: v.id("pdfs"),
        chunk: v.string(),
        embedding: v.array(v.number()),
        createdAt: v.number(),
    },
    handler: async (ctx, { pdfId, chunk, embedding, createdAt }: { pdfId: Id<"pdfs">, chunk: string, embedding: number[], createdAt: number }) => {
        await ctx.db.insert('pdfembeddings', {
            pdfId,
            chunk,
            embedding,
            createdAt,
        });
    }

});

export const embedings = action({
    args: {
        pdfId: v.id("pdfs"),
        extractedText: v.string(),

    },

    handler: async (ctx, { pdfId, extractedText }: { pdfId: Id<"pdfs">, extractedText: string }) => {
        // get the pdf record 
        // const pdf = await ctx.db.get(pdfId);
        const pdf = await ctx.runQuery(internal.embedings.getid, { pdfId });
        if (!pdf) {
            throw new Error('PDF not found')
        }
        // fetch pdf content from storage 
        const url = await ctx.storage.getUrl(pdf.storageId);
        if (!url) {
            throw new Error('Failed to get PDF URL from storage');
        }

        // 3Extract text from PDF (you can use a server utility or library)
        // const text = await ctx.runAction(api.nodeActions,.extractText, {
        //     url,
        //     fileName: pdf.fileName,
        // });
        const pdfFile = await fetch(url);
        const pdfdata = await pdfFile.arrayBuffer();
        const parser = new PDFParse({ data: pdfdata });
        const textResult = await parser.getText();
        await parser.destroy();
        console.log(textResult.text);
        const text = textResult.text;

        // chunk text into smaller pieces
        const chunks = chunktext(text, 200); // adjust chunk size as needed

        // process each chunk and store into convex 

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const embedding = await getEmbedding(chunk);
            // store this embedding 

            await ctx.runMutation(internal.embedings.insert, {
                pdfId,
                chunk,
                embedding,
                createdAt: Date.now(),
            });
        }



    }

})