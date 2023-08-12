import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOptions: CorsOptions = {
  origin: [/\.localhost:3000$/, /\.localhost:5000$/, /\.ipm\.poker$/],
  credentials: true,
}
