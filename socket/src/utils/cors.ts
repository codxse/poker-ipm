import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

export const corsOptions: CorsOptions = {
  origin: [
    /(.*)localhost:([0-9]*)$/,
    /(.*)\.?poker\.ipm$/,
    'http://localhost:3000',
    'http://localhost:5000',
    'http://api.poker.ipm',
    'https://api.poker.ipm',
    'http://poker.ipm',
    'https://poker.ipm',
    'ws://api.poker.ipm',
    'wss://api.poker.ipm',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
}
