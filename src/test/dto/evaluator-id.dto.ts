import { IsInt, IsNotEmpty } from 'class-validator';

export class EvaluatorIdDto {
  @IsNotEmpty()
  @IsInt()
  evaluatorId: bigint;
}
