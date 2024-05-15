import { slug } from '@eigakan/validation/slug';
import { string } from '@eigakan/validation/string';
import { z } from 'zod';

const cinema = z.object({ areaSlug: slug, name: string, slug });

export { cinema };
