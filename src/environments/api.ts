import { devApiConfig } from "@/environments/dev";
import { prodApiConfig } from "@/environments/prod";

const isProduction = process.env.NODE_ENV === "production";

export const apiConfig = isProduction ? prodApiConfig : devApiConfig;
