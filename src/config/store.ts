export const STORE = {
  name: 'Use Menino Gael',
  tagline: 'Moda infantil com conforto, delicadeza e estilo para cada fase da infância.',
  whatsappNumber: '5521971773509',
  whatsappDisplay: '+55 21 97177-3509',
  instagramUrl: 'https://www.instagram.com/usemeninogael/',
  instagramHandle: '@usemeninogael',
  // Identidade visual oficial: informe aqui o endereço da imagem do logotipo quando disponível.
  logoUrl: '',
} as const;

export const SIZE_OPTIONS = ['RN', 'PP', 'P', 'M', 'G', 'GG', '1', '2', '3', '4', '6', '8', '10', '12', '14', '16'];

export const PRODUCT_IMAGE_BUCKET = 'product-images';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_IMAGES_PER_PRODUCT = 8;
