import { id } from '@eigakan/validation/id';
import { string } from '@eigakan/validation/string';
import { z } from 'zod';

const movieTitle = z.object({ movieId: id.nullable(), title: string });

export { movieTitle };
