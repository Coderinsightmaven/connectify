import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters").optional(),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  location: z.string().max(50, "Location must be less than 50 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export const followUserSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
})

export const getUsersSchema = z.object({
  search: z.string().min(1).max(50).optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
  filter: z.enum(["all", "verified", "suggested"]).default("all"),
})

export const getUserFollowersSchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
})

export const getUserFollowingSchema = z.object({
  limit: z.number().min(1).max(50).default(20),
  cursor: z.string().cuid().optional(),
})

export const reportUserSchema = z.object({
  userId: z.string().cuid("Invalid user ID").optional(),
  postId: z.string().cuid("Invalid post ID").optional(),
  commentId: z.string().cuid("Invalid comment ID").optional(),
  reason: z.enum([
    "spam",
    "harassment",
    "hate_speech",
    "violence",
    "misinformation",
    "inappropriate_content",
    "copyright",
    "other"
  ]),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
}).refine((data) => data.userId || data.postId || data.commentId, {
  message: "Must report either a user, post, or comment",
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type FollowUserInput = z.infer<typeof followUserSchema>
export type GetUsersInput = z.infer<typeof getUsersSchema>
export type GetUserFollowersInput = z.infer<typeof getUserFollowersSchema>
export type GetUserFollowingInput = z.infer<typeof getUserFollowingSchema>
export type ReportUserInput = z.infer<typeof reportUserSchema> 