import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOptions: CorsOptions = {
  origin: [/(.*)localhost:([0-9]*)$/, /(.*)\.?poker\.ipm$/],
  credentials: true,
}
