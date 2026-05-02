import { IsString, IsNotEmpty, IsDateString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PrecioDto {
  @IsNumber()
  adulto: number;

  @IsNumber()
  reducido: number;

  @IsNumber()
  jubilado: number;
}

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  movieId: string;

  @IsDateString()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsString()
  @IsNotEmpty()
  sala: string;

  @ValidateNested()
  @Type(() => PrecioDto)
  precio: PrecioDto;

  @IsArray()
  asientos: boolean[][];
}

export class UpdateSessionDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsArray()
  @IsString({ each: true })
  hora: string[];

  @IsOptional()
  @IsString()
  sala?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PrecioDto)
  precio?: PrecioDto;
}