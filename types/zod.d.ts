import { ZodDate, ZodEffects, ZodOptional, ZodString } from 'zod';

type Validator = ZodDate | ZodEffects<ZodString, string, string> | ZodOptional<ZodDate | ZodString> | ZodString;

export { Validator };
