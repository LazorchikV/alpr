import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';

describe('ApiController', () => {
  let controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
