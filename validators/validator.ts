import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { IllegalArgumentException } from "./exception";
import { isNullOrUndefined } from "./util";

interface Validations {
  bodySchema?: z.ZodObject<any, any>;
  urlSchema?: z.ZodObject<any, any>;
  querySchema?: z.ZodObject<any, any>;
}
export function validator({ bodySchema, urlSchema, querySchema }: Validations) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isNullOrUndefined(bodySchema)) {
        bodySchema.parse(req.body);
      }
      if (!isNullOrUndefined(urlSchema)) {
        urlSchema.parse(req.params);
      }
      if (!isNullOrUndefined(querySchema)) {
        querySchema.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        return next(new IllegalArgumentException("Bad request", errors));
      }
      return next(error);
    }
  };
}
