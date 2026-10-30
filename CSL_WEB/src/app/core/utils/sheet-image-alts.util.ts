/**
 * Alt text from the SEO alt text sheet ("CSL Website - Image Alt texts") for images uploaded in the admin,
 * keyed by image file name without extension. The same image gets the same alt text on every page.
 */
const SHEET_IMAGE_ALTS: Record<string, string> = {
  // Blog card / blog post images (Homepage sheet rows 65-69)
  'image-cde18dfa-af4b-4875-ae23-742d4b838db4': 'Train simulation 3D railway station model| how simulations are changing industries',
  'image-b37227b9-56dd-47d5-8472-b00b81eee52e': 'Casual game concept of a rider on horseback inside a shopping mall',
  'image-5629bd99-9f6d-4e36-94d3-d540b713fafb': 'Open-world MMORPG fantasy landscape illustration',
  'image-aea39ce7-e195-4aeb-96d3-44092b4619af': 'Project Demigod VR superhero game by Carina Softlabs',
  'image-9e11af83-e20d-4e2e-881d-1d22e77529cc': 'Star Atlas website design with futuristic space theme',
  // News images (Newsroom sheet rows 3-21)
  'image_2-0ba3f7b5-8478-4b9d-ad85-69ece521d38f': 'The Best Gift is Fun: simple surprises at the Carina Softlabs office',
  'image_2-685f2c7c-61b4-4ae0-a7af-bf0762967c94': 'Carina Softlabs team Diwali party celebration',
  'image_2-08caf86d-cb34-4a44-b216-523584a1842f': 'Carina Softlabs welcomes tech expert from Europe for strategic discussion',
  'image_2-7b3d5d31-7f60-49ba-9711-f3c7db97708b': 'Mayank Pande birthday celebration at Carina Softlabs',
  'image_2-fd5e65e7-8262-4c24-b9d5-5aae7c57661c': 'Carina Softlabs celebrates 14 years of growth with its team',
  'image_2-57818d65-115e-4d13-8a44-0929a3287d11': 'Carina Softlabs team celebrates Ganesh Chaturthi at the office',
  'image_2-c4fa0580-e6b0-4171-ae06-892ed741ec19': 'Fun Friday activities for the Carina Softlabs team',
  'image_2-e4f22b49-67d1-4061-86dc-fba9561dc2cf': 'Carina Softlabs recognised at IGDC 2024',
  'image_2-f0030b59-015a-4999-920f-4d0f92768429': 'Carina Softlabs announces partnership with Skywalk Games',
  'image_2-836af001-0413-45f3-8c91-d10cb3276866': 'Carina Softlabs presents record-time game at Startup Expo',
  'image_2-1731504197401': 'Carina Softlabs VR experience of Ayodhya featured in Indian media',
  'image_2-1731504745295': 'Carina Softlabs at Startup Expo 2024| SGSITS Indore',
  'image_2-1731506036408': 'Pragati Singh Suman at International Eminence Excellence Awards 2023| Dubai',
};

/** The sheet's alt text for an uploaded image, or `fallback` when the image is not in the sheet. */
export function sheetImageAlt(image: string | null | undefined, fallback: string): string {
  const file = String(image || '').split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') || '';
  return SHEET_IMAGE_ALTS[file] || fallback;
}
