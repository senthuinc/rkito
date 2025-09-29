import { z } from "zod";

export class ValidationSchema {
  public static Uid = z
    .string()
    .max(31)
    .regex(/^[a-zA-Z0-9_-]{21}$/, {
      message: "Invalid Uid",
    });

  public static LinkedOjbect = z.object({
    uid: ValidationSchema.Uid,
  });

  public static LinkedOjbects = z
    .array(ValidationSchema.LinkedOjbect)
    .optional()
    .nullable();

  public static search = z
    .string()
    .max(63)
    .regex(/^[^'"\\;`]+$/, {
      message: "Invalid search query",
    })
    .optional();

  public static filter = z
    .string()
    .max(15)
    .regex(/^[^'"\\;`]+$/, {
      message: "Invalid filter query",
    })
    .optional();
}

export const STANDARD_LIFECYCLE_STATUS_CODES = z.enum([
  "PROPOSED",
  "UNDER_EVALUATION",
  "CURRENT",
  "GAP",
  "PLANNED",
  "ROADMAP_INCLUDED",
  "DESIGNED",
  "IN_IMPLEMENTATION",
  "READY_FOR_USE",
  "IMPLEMENTED",
  "UNDER_PERFORMANCE_REVIEW",
  "STEADY_STATE",
  "DEPRECATED",
  "RETIRED",
]);
