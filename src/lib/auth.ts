import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        unique: true,
      },
      bio: {
        type: "string",
        required: false,
      },
      location: {
        type: "string", 
        required: false,
      },
      website: {
        type: "string",
        required: false,
      },
      isVerified: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      followerCount: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      followingCount: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
      postCount: {
        type: "number",
        required: false,
        defaultValue: 0,
      },
    },
  },
  trustedOrigins: ["http://localhost:3000"],
})

export type Session = typeof auth.$Infer.Session 