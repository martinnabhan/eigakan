import { z } from 'zod';

const code = z.string().regex(/^\d{4}$/);

export { code };
