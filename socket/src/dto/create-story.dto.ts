import { IsOptional, IsString, IsUrl, IsBoolean } from 'class-validator'

export class CreateStoryDto {
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
