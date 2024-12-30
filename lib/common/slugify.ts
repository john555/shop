import s from 'slugify';

s.extend({ '+': 'plus' }); // Handle special characters

export function slugify(text: string) {
  console.log('Slugifying:', text);
  return s(text, {
    lower: true, // Convert to lowercase
    strict: true, // Replace spaces with -
    remove: /[*+~.()'"!:@]/g, // Remove special characters
    trim: true, // Trim leading/trailing spaces
    locale: 'en', // Use English locale
  });
}
