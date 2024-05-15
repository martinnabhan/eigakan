import { z } from 'zod';

const id = z.number().positive();

export { id };
