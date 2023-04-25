import { EntityManager } from 'typeorm'

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const entityManager: EntityManager = this.manager
      if (!entityManager) {
        throw new Error('EntityManager not found in the current context.')
      }

      const queryRunner =
        entityManager.queryRunner ||
        entityManager.connection.createQueryRunner()
      if (!queryRunner) {
        throw new Error('Unable to create a QueryRunner instance.')
      }

      await queryRunner.connect()
      await queryRunner.startTransaction()

      try {
        const result = await originalMethod.apply(this, args)
        await queryRunner.commitTransaction()
        return result
      } catch (error) {
        await queryRunner.rollbackTransaction()
        throw error
      } finally {
        await queryRunner.release()
      }
    }

    return descriptor
  }
}
