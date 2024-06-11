import { id } from '@eigakan/validation/id';
import { string } from '@eigakan/validation/string';
import { z } from 'zod';

const movie = z.object({ id, poster: string, title: string });

export { movie };
