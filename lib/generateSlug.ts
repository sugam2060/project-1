import slugify from 'slugify';
import {v5 as uuidv5} from 'uuid'
import crypto from 'crypto'

export const generateSlug = (name: string, description: string): string => {
  // Take first 5 words from description as snippet
  const descSnippet = description.split(' ').slice(0, 5).join(' ');

  // Combine name and description snippet
  const hash = crypto.createHash('sha256').update(uuidv5(`${Date.now()}`,uuidv5.URL)).digest('base64')
  const baseString = `${name}_${descSnippet}_${hash.slice(0,10)}`

  // Generate slug with options: lowercase, strict (remove special chars)
  const slug = slugify(baseString, {
    lower: true,
    strict: true,
    replacement:'_'
  });

  return slug;
};
