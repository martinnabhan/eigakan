import { z } from 'zod';

const string = z.string().min(1).max(191);

export { string };
