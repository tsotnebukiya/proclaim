import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    THIRDWEB_CLIENT_ID: z.string(),
    THIRDWEB_SECRET_KEY: z.string(),
    ETH_ADDRESS: z.string(),
    PROCHAIN_PUBLIC_KEY: z.string(),
    PROCHAIN_PRIVATE_KEY: z.string(),
    PROCHAIN_DEPOSITORY_CONTRACT: z.string(),
    PROCHAIN_ID: z.string(),
    PROCHAIN_RPC_URL: z.string(),
    HUB_API: z.string(),
    USD_CONTRACT: z.string(),
    EUR_CONTRACT: z.string(),
    BANK: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    BANK: process.env.BANK,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    THIRDWEB_CLIENT_ID: process.env.THIRDWEB_CLIENT_ID,
    THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY,
    ETH_ADDRESS: process.env.ETH_ADDRESS,
    PROCHAIN_PUBLIC_KEY: process.env.PROCHAIN_PUBLIC_KEY,
    PROCHAIN_PRIVATE_KEY: process.env.PROCHAIN_PRIVATE_KEY,
    PROCHAIN_DEPOSITORY_CONTRACT: process.env.PROCHAIN_DEPOSITORY_CONTRACT,
    PROCHAIN_ID: process.env.PROCHAIN_ID,
    PROCHAIN_RPC_URL: process.env.PROCHAIN_RPC_URL,
    HUB_API: process.env.HUB_API,
    USD_CONTRACT: process.env.USD_CONTRACT,
    EUR_CONTRACT: process.env.EUR_CONTRACT,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
