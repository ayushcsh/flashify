import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const savePdfMetadata = mutation({
    args: {
        storageId: v.id("_storage"),
        title: v.string(),
        fileName: v.string(),
        contentType: v.optional(v.string()),
        userId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("pdfs", {
            userId: args.userId ?? undefined,
            title: args.title,
            fileName: args.fileName,
            storageId: args.storageId,
            contentType: args.contentType || undefined,
            createdAt: Date.now(),
        });
        return id;
    },
});