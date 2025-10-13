// /convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
// minimal pdfs table — adjust fields as you need
pdfs: defineTable({
userId: v.optional(v.id("users")),
title: v.string(),
fileName: v.string(),
storageId: v.id("_storage"),
contentType: v.optional(v.string()),
createdAt: v.number(),
}).index("by_user", ["userId"]),

pdfembeddings: defineTable({
    pdfId : v.id("pdfs"),
    chunk : v.string(),
    embedding : v.array(v.number()),
    createdAt: v.number(),
}).index("by_pdf", ["pdfId"]),
});