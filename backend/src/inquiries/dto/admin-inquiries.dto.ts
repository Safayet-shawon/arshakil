import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { KINDS, STATUSES, WORK_FIELDS, type InquiryKind, type InquiryStatus, type WorkField } from "../inquiry.constants";

const blankToUndefined = ({ value }: { value: unknown }) => (typeof value === "string" && value.trim() === "" ? undefined : value);

/** Filters for the admin feed. Everything is optional; results are newest first. */
export class ListInquiriesQuery {
  @IsOptional() @Transform(blankToUndefined) @IsIn(WORK_FIELDS) field?: WorkField;
  @IsOptional() @Transform(blankToUndefined) @IsIn(KINDS) kind?: InquiryKind;
  @IsOptional() @Transform(blankToUndefined) @IsIn(STATUSES) status?: InquiryStatus;
  /** Free text: matches name, email, phone, message, service and notes. */
  @IsOptional() @Transform(blankToUndefined) @IsString() @MaxLength(100) q?: string;
  /** Inclusive range of the date the inquiry came in (YYYY-MM-DD or a full ISO date). */
  @IsOptional() @Transform(blankToUndefined) @IsDateString() from?: string;
  @IsOptional() @Transform(blankToUndefined) @IsDateString() to?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) pageSize?: number;
}

export class UpdateInquiryDto {
  @IsOptional() @IsIn(STATUSES) status?: InquiryStatus;
  /** Empty string clears the note. */
  @IsOptional() @IsString() @MaxLength(4000) notes?: string;
}

export class MarkAllReadDto {
  /** Limit to one work field; leave out to mark every new inquiry as read. */
  @IsOptional() @IsIn(WORK_FIELDS) field?: WorkField;
  @IsOptional() @IsIn(KINDS) kind?: InquiryKind;
}

/** One message from the old (pre-database) store, for the one-time import. */
export class LegacyMessageDto {
  @IsString() @MaxLength(64) id: string;
  @IsIn(KINDS) kind: InquiryKind;
  @IsString() @MaxLength(80) name: string;
  @IsOptional() @IsString() @MaxLength(120) email?: string;
  @IsOptional() @IsString() @MaxLength(30) phone?: string;
  @IsString() @MaxLength(2000) message: string;
  @IsOptional() @IsString() @MaxLength(80) service?: string;
  @IsDateString() createdAt: string;
  @IsOptional() read?: boolean;
  /** Present when the message was already triaged in the old store. */
  @IsOptional() @IsIn(STATUSES) status?: InquiryStatus;
  @IsOptional() @IsString() @MaxLength(4000) notes?: string;
}

export class ImportInquiriesDto {
  @IsArray() @ArrayMaxSize(2000) @ValidateNested({ each: true }) @Type(() => LegacyMessageDto)
  messages: LegacyMessageDto[];
}
