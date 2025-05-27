import slugify from 'slugify';

export const generateSlug = (name: string, description: string): string => {
  // Take first 5 words from description as snippet
  const descSnippet = description.split(' ').slice(0, 5).join(' ');

  // Combine name and description snippet
  const baseString = `${name} ${descSnippet}`;

  // Generate slug with options: lowercase, strict (remove special chars)
  const slug = slugify(baseString, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g, // extra remove chars if needed
  });

  return slug;
};
