import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateVoteOptionDto {
  @IsNumber()
  @IsNotEmpty()
  roomId: number

  @IsString()
  label: string

  @IsNumber()
  @IsNotEmpty()
  value: number
}
