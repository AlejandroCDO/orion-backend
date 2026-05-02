import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class EntradasDto {
  @IsNumber()
  adulto: number;

  @IsNumber()
  reducido: number;

  @IsNumber()
  jubilado: number;
}

export class CreateReservaDto {
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  sesionId: string;

  @ValidateNested()
  @Type(() => EntradasDto)
  entradas: EntradasDto;

  @IsArray()
  @IsString({ each: true })
  asientosSeleccionados: string[];

  @IsNumber()
  totalPagado: number;

  @IsOptional()
  @IsString()
  horaElegida?: string;
}