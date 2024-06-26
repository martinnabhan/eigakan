import { slug } from '@eigakan/validation/slug';
import { string } from '@eigakan/validation/string';
import { z } from 'zod';

const cinemaName = z.object({ cinemaSlug: slug.nullable(), name: string });

export { cinemaName };
