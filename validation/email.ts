import { z } from 'zod';

const email = z.string().email();

export { email };
