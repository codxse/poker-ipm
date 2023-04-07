import { Test, TestingModule } from '@nestjs/testing'
import { RootController } from '@app/controllers/root.controller'

describe('RootController', () => {
  let controller: RootController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
    }).compile()

    controller = module.get<RootController>(RootController)
  })

  it('should return "Ok" text', () => {
    expect(controller.root()).toBe('Ok')
  })
})
