import {
  BadRequestException,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
} from '@nestjs/common'

@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const isPositiveInteger = Number.isInteger(+value) && +value > 0

    if (!isPositiveInteger) {
      throw new BadRequestException(
        `${metadata.data} must be a positive integer`,
      )
    }

    return parseInt(value, 10)
  }
}
