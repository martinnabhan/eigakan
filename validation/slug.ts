import { string } from '@eigakan/validation/string';

const slug = string.regex(/^[a-z0-9-]+$/);

export { slug };
