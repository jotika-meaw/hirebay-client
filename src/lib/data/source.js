import * as apiSource from "@/lib/data/api-source";
import * as mockSource from "@/lib/mock/source";

export const source =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? apiSource : mockSource;
