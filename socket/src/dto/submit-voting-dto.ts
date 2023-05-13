import { IsNotEmpty, IsNumber } from 'class-validator'

export class SubmitVotingDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number

  @IsNumber()
  @IsNotEmpty()
  storyId: number

  @IsNumber()
  @IsNotEmpty()
  voteOptionId: number
}
