import { env } from "@/env";

export const accounts = [
  {
    icsd: "15555",
    us: "14444",
    api: env.CITI_API,
    name: "citi",
  },
  {
    icsd: "25555",
    us: "24444",
    api: env.JP_API,
    name: "jp",
  },
  {
    icsd: "35555",
    us: "34444",
    api: env.GOLDMAN_API,
    name: "goldman",
  },
];
