import { z } from 'zod';

const reCaptchaToken = z
  .string()
  .optional()
  // 環境変数が設定されていればトークンが必須です。
  .refine(token => Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_KEY || process.env.RECAPTCHA_SECRET_KEY) === Boolean(token));

export { reCaptchaToken };
