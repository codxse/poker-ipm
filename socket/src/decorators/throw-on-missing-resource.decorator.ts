import { NotFoundException } from '@nestjs/common'

class ResourceNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message)
  }
}

export function ThrowOnMissingResource(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args)
      if (!result) {
        throw new ResourceNotFoundException(message)
      }
      return result
    }

    return descriptor
  }
}
