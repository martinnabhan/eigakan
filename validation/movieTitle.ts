import { string } from '@eigakan/validation/string';
import { z } from 'zod';

const movieTitle = z.object({ movieId: z.string().uuid(), title: string });

export { movieTitle };
