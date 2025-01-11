import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./config/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://jollysidecoder:2m9uIHTnLxzq@ep-late-voice-a5hdao7i.us-east-2.aws.neon.tech/ai-kids-storybuilder?sslmode=require",
  },
  verbose: true,
  strict: true,
});
