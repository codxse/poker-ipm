import {
  IsOptional,
  IsString,
  IsUrl,
  IsBoolean,
  IsPositive,
} from 'class-validator'

export class CreateStoryDto {
  @IsPositive()
  createdById: number

  @IsPositive()
  roomId: number

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  @IsUrl()
  url: string

  @IsString()
  description: string

  @IsBoolean()
  isFinished: boolean
}
