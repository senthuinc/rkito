import { PillarStatusCode } from "@prisma/client";
import { z } from "zod";
import { ValidationSchema } from "../../../lib/validationschema";

export class PillarsValidationSchema {
  public static index = z.object({
    uid: ValidationSchema.Uid,
  });

  public static list = z.object({
    page: z.string().optional(),
    search: ValidationSchema.search,
  });

  public static create = z.object({
    name: z.string().max(123),
    description: z.string().optional().nullable(),
    visionUid: ValidationSchema.Uid.optional().nullable(),
  });

  public static update = z.object({
    name: z.string().max(123),
    statusCode: z.enum([PillarStatusCode.ACTIVE, PillarStatusCode.INACTIVE]),
    visionUid: ValidationSchema.Uid.optional().nullable(),
    description: z.string().optional().nullable(),
  });

  public static delete = z.object({
    uid: ValidationSchema.Uid,
  });
}
