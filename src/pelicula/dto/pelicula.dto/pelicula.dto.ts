import { IsString, IsNotEmpty, IsArray, IsNumber, IsEnum, Min, Max } from 'class-validator';

export class PeliculaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  sinopsis: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  year: number;

  @IsString()
  @IsNotEmpty()
  posterURL: string;

  @IsString()
  @IsNotEmpty()
  duracion: string;

  @IsEnum(['+0', '+7', '+12', '+16', '+18'])
  @IsNotEmpty()
  clasEdad: string;
}
