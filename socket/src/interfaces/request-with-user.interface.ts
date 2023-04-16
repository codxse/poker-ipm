import { Request } from 'express'
import { User } from '@app/entities/user.entity'

export interface RequestWithUser extends Request {
  user: User
}
