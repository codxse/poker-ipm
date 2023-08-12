import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000', 'https://api.ipm.poker', 'https://ipm.poker']
}
