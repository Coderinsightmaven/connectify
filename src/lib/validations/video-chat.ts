import { z } from "zod"

export const createVideoChatSessionSchema = z.object({
  preferences: z.object({
    countries: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    ageRange: z.object({
      min: z.number().min(13).max(100),
      max: z.number().min(13).max(100),
    }).optional(),
  }).optional(),
})

export const sendChatMessageSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(500, "Message must be less than 500 characters"),
})

export const reportVideoChatSchema = z.object({
  sessionId: z.string().cuid("Invalid session ID"),
  reason: z.enum([
    "inappropriate_behavior",
    "harassment",
    "spam",
    "underage",
    "nudity",
    "violence",
    "other"
  ]),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
})

export const updateVideoChatPreferencesSchema = z.object({
  countries: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  ageRange: z.object({
    min: z.number().min(13).max(100),
    max: z.number().min(13).max(100),
  }).optional(),
  autoSkip: z.boolean().optional(),
  allowMessages: z.boolean().optional(),
})

export type CreateVideoChatSessionInput = z.infer<typeof createVideoChatSessionSchema>
export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>
export type ReportVideoChatInput = z.infer<typeof reportVideoChatSchema>
export type UpdateVideoChatPreferencesInput = z.infer<typeof updateVideoChatPreferencesSchema> 