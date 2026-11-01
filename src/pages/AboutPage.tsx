import { Link } from 'react-router-dom';
import { ArrowRight, Globe2, Handshake, Megaphone, MessageCircle, Monitor, Store, TrendingUp, Users } from 'lucide-react';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { STORE } from '@/config/store';
import { buildWhatsAppLink } from '@/lib/format';

const ODS_CONTRIBUTIONS = [
  { icon: Store, title: 'Fortalecimento do pequeno comércio', text: 'Uma vitrine digital profissional coloca a loja de bairro no mesmo nível das grandes marcas.' },
  { icon: Handshake, title: 'Empreendedorismo local', text: 'Ferramentas simples ajudam o empreendedor a gerenciar produtos sem depender de conhecimento técnico.' },
  { icon: Megaphone, title: 'Divulgação digital', text: 'Catálogo sempre atualizado e compartilhável, com integração direta ao WhatsApp e ao Instagram.' },
  { icon: MessageCircle, title: 'Modernização do atendimento', text: 'O cliente escolhe o produto online e conversa com a loja em um clique, com a mensagem já preenchida.' },
  { icon: Globe2, title: 'Ampliação do acesso aos produtos', text: 'Famílias de qualquer cidade ou horário podem conhecer a coleção antes de visitar a loja.' },
  { icon: TrendingUp, title: 'Desenvolvimento econômico local', text: 'Mais vendas e mais empregos gerados pela circulação de renda dentro da própria comunidade.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-100 py-20">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-600">Sobre a loja</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Moda infantil com carinho em cada detalhe</h1>
          <p className="mx-auto max-w-2xl text-lg leading-normal text-stone-700">
            A {STORE.name} reúne roupas infantis pensadas para o conforto das crianças e a tranquilidade dos pais.
            Cada peça é escolhida com atenção à qualidade, à delicadeza e ao estilo.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { title: 'Nossa missão', text: 'Vestir as crianças com conforto e beleza, oferecendo um atendimento próximo e confiável.' },
          { title: 'Nossa visão', text: 'Ser a referência de moda infantil da região, unindo tradição no atendimento e praticidade digital.' },
          { title: 'Nossos valores', text: 'Respeito às famílias, transparência nos preços, cuidado com cada peça e compromisso com a comunidade.' },
        ].map((item) => (
          <article key={item.title} className="rounded-3xl bg-white p-8 shadow-soft">
            <h2 className="mb-3 text-xl font-extrabold text-primary-900">{item.title}</h2>
            <p className="text-base leading-normal text-stone-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="ods-titulo" className="bg-primary-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-primary-100">
              <Users className="h-4 w-4" aria-hidden="true" />
              Atividade extensionista - ODS 8
            </p>
            <h2 id="ods-titulo" className="text-3xl font-extrabold text-white sm:text-4xl">
              Trabalho decente e crescimento econômico
            </h2>
            <p className="text-base leading-normal text-primary-100">
              O Objetivo de Desenvolvimento Sustentável 8, da Organização das Nações Unidas, busca promover o
              crescimento econômico inclusivo e sustentável, com trabalho decente para todos. Este site foi
              desenvolvido como projeto extensionista do curso de Análise e Desenvolvimento de Sistemas (ADS) da UNIG
              para mostrar como a tecnologia pode apoiar o pequeno comércio local.
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ODS_CONTRIBUTIONS.map((item) => (
              <li key={item.title} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/20 text-primary-200">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-normal text-primary-100">{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <Monitor className="h-8 w-8 text-primary-300" aria-hidden="true" />
            <p className="max-w-2xl text-base leading-normal text-primary-100">
              Ao digitalizar o catálogo e o atendimento de uma loja local, o projeto gera visibilidade, facilita vendas e
              contribui para a permanência de negócios que movimentam a economia da comunidade.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="section-title">Conheça as novidades da coleção</h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/catalogo" className={buttonClasses('primary', 'lg')}>
            Ver catálogo
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer" className={buttonClasses('outline', 'lg')}>
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Falar com a loja
          </a>
        </div>
      </section>
    </div>
  );
}
