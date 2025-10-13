import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const savePdfEmbeddings = mutation({
  args: {
    pdfId: v.id("pdfs"),        // link to the original PDF
    chunk: v.string(),           // text chunk
    embedding: v.array(v.number()), // vector embedding
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("pdfembeddings", {
      pdfId: args.pdfId,
      chunk: args.chunk,
      embedding: args.embedding,
      createdAt: Date.now(),
    });
    return id;
  },
});
