import { slug } from '@eigakan/validation/slug';
import { string } from '@eigakan/validation/string';
import { z } from 'zod';

const area = z.object({ label: string, slug });

export { area };
