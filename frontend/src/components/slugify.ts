export function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/ /g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove all non-word characters except hyphens
  }
  