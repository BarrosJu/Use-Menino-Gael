import { STORE } from '@/config/store';

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildPurchaseMessage(productName: string): string {
  return `Olá! Tenho interesse no produto "${productName}" da ${STORE.name}. Poderia me passar mais informações e disponibilidade?`;
}

export function buildWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${STORE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
