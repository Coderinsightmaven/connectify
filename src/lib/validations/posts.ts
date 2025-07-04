import { z } from "zod"

export const createPostSchema = z.object({
  content: z.string()
    .min(1, "Post content cannot be empty")
    .max(280, "Post content must be less than 280 characters"),
  images: z.array(z.string().url()).max(4, "Maximum 4 images allowed").optional(),
})

export const updatePostSchema = z.object({
  content: z.string()
    .min(1, "Post content cannot be empty")
    .max(280, "Post content must be less than 280 characters")
    .optional(),
  images: z.array(z.string().url()).max(4, "Maximum 4 images allowed").optional(),
})

export const createCommentSchema = z.object({
  content: z.string()
    .min(1, "Comment cannot be empty")
    .max(280, "Comment must be less than 280 characters"),
  parentCommentId: z.string().cuid().optional(),
})

export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, "Comment cannot be empty")
    .max(280, "Comment must be less than 280 characters"),
})

export const searchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty").max(100, "Search query too long"),
  type: z.enum(["posts", "users", "hashtags"]).default("posts"),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
})

export const feedSchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
  type: z.enum(["following", "trending", "latest"]).default("following"),
})

export const userPostsSchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
  includeReplies: z.boolean().default(false),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type FeedInput = z.infer<typeof feedSchema>
export type UserPostsInput = z.infer<typeof userPostsSchema> 