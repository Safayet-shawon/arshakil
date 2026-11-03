import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length, MaxLength } from "class-validator";

const trim = ({ value }: { value: unknown }) => (typeof value === "string" ? value.trim() : value);

export class CreateContactDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80)
  name: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(120)
  email: string;

  @Transform(trim)
  @IsString()
  @Length(10, 2000)
  message: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60)
  service?: string;
}
