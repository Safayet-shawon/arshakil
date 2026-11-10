import { Transform } from "class-transformer";
import { IsEmail, IsIn, IsOptional, IsString, Length, Matches, MaxLength } from "class-validator";
import { WORK_FIELDS, type WorkField } from "../inquiry.constants";

/** Trims strings; an empty string (an untouched form field) counts as "not given". */
const clean = ({ value }: { value: unknown }) => {
  if (typeof value !== "string") return value;
  const v = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  return v === "" ? undefined : v;
};

/** What the website's contact form sends. At least one of email / phone is required (checked in the service). */
export class CreateInquiryDto {
  @Transform(clean)
  @IsString()
  @Length(2, 80)
  name: string;

  @IsOptional()
  @Transform(clean)
  @IsEmail()
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @Transform(clean)
  @Matches(/^\+?[\d\s\-()]{6,}$/, { message: "phone must be a valid phone number" })
  @MaxLength(30)
  phone?: string;

  @Transform(clean)
  @IsString()
  @Length(10, 2000)
  message: string;

  /** The "Hire me as ..." label. Present = a hire request; absent = a general message. */
  @IsOptional()
  @Transform(clean)
  @IsString()
  @MaxLength(80)
  service?: string;

  /** The work field. Optional: when missing it is worked out from `service`. */
  @IsOptional()
  @IsIn(WORK_FIELDS)
  field?: WorkField;

  /** Honeypot: real visitors never see this field. A filled-in value means a bot. */
  @IsOptional()
  @Transform(clean)
  @IsString()
  @MaxLength(100)
  website?: string;
}
