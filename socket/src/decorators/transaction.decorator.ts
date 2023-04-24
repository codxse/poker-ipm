export const TRANSACTION_DECORATOR = 'TRANSACTION_DECORATOR'

export function Transaction() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(TRANSACTION_DECORATOR, true, descriptor.value)
  }
}
