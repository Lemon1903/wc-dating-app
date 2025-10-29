import { ZodIssue } from "zod/v3";

type ResponseResult<T> =
  | {
      data: T;
    }
  | {
      error: string | ZodIssue[];
    };
