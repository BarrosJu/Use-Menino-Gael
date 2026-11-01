import { MessageCircle } from 'lucide-react';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { buildPurchaseMessage, buildWhatsAppLink } from '@/lib/format';

export default function WhatsAppBuyButton({
  productName,
  className = '',
}: {
  productName: string;
  className?: string;
}) {
  return (
    <a
      href={buildWhatsAppLink(buildPurchaseMessage(productName))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Quero comprar: ${productName} (abre o WhatsApp)`}
      className={buttonClasses('primary', 'lg', `w-full sm:w-auto ${className}`)}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      Quero comprar
    </a>
  );
}
