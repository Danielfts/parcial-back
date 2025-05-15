import { Test, TestingModule } from '@nestjs/testing';
import { BonoController } from './bono.controller';
import { BonoService } from './bono.service';

describe('BonoController', () => {
  let controller: BonoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BonoController],
      providers: [BonoService],
    }).compile();

    controller = module.get<BonoController>(BonoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
