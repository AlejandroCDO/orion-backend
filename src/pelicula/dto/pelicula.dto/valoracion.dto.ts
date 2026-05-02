import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CrearValoracionDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  puntuacion: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}