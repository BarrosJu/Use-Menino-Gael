# Use Menino Gael | Moda Infantil

Site institucional e sistema de gestão de catálogo para a loja de moda infantil **Use Menino Gael**. O projeto é uma atividade extensionista do curso de **Análise e Desenvolvimento de Sistemas (ADS) da UNIG** e está alinhado ao **ODS 8 - Trabalho Decente e Crescimento Econômico**.

O sistema possui uma vitrine pública para clientes e um painel administrativo protegido por login, no qual a loja cadastra, edita, ativa, oculta e exclui produtos e categorias. Todas as alterações aparecem automaticamente no catálogo público.

## Objetivo geral

Desenvolver um site funcional, seguro e responsivo que permita à loja de moda infantil divulgar seus produtos online e receber interesse de compra pelo WhatsApp, com gestão real de dados.

## Objetivos específicos

- Apresentar a loja com identidade visual moderna, delicada e profissional.
- Disponibilizar um catálogo digital com filtros por categoria, pesquisa e ordenação por preço.
- Permitir que o cliente manifeste interesse em um produto com um clique, abrindo o WhatsApp com a mensagem já preenchida.
- Oferecer ao administrador um painel para gerenciar produtos, fotos, categorias e disponibilidade.
- Garantir persistência dos dados, armazenamento permanente das imagens e controle de acesso ao painel.

## Problema identificado

Pequenos comércios de moda infantil dependem quase exclusivamente de redes sociais e de mensagens individuais para mostrar seus produtos. Isso dificulta a organização do catálogo, a atualização de preços e de tamanhos e a localização dos produtos pelos clientes.

## Justificativa

A digitalização do catálogo e do atendimento reduz essa dependência, dá visibilidade a um negócio local e moderniza a forma como a loja se apresenta. Ao usar ferramentas acessíveis e gratuitas, o projeto torna essa modernização possível para pequenos empreendedores.

## Público-alvo

- **Clientes:** famílias que procuram roupas infantis, do recém-nascido ao pré-adolescente.
- **Administradores:** proprietários e equipe da loja responsáveis por manter o catálogo.

## Tecnologias utilizadas

- **React 18** com **TypeScript** e **Vite**
- **Tailwind CSS** para estilização responsiva
- **React Router** para navegação entre páginas
- **Supabase** para banco de dados PostgreSQL, autenticação por e-mail e senha, armazenamento de imagens e atualizações em tempo real
- **Lucide React** para ícones

## Funcionalidades

### Site público
- Página inicial com banner, categorias, produtos em destaque, seção sobre a loja e atalhos para WhatsApp e Instagram.
- Página "Sobre a loja" com missão, visão, valores e seção institucional sobre o ODS 8.
- Catálogo com filtro por categoria, pesquisa por nome ou descrição e ordenação por preço.
- Página de detalhes com galeria de fotos, tamanhos, disponibilidade, descrição e botão "Quero comprar".
- Página de contato com formulário que envia a mensagem pelo WhatsApp.
- Mensagem de catálogo vazio quando ainda não há produtos cadastrados.

### Painel administrativo
- Login com e-mail e senha. Não há cadastro público de administradores.
- Visão geral com indicadores e últimos produtos cadastrados.
- Produtos: cadastro com fotos, edição, ativação/desativação, disponibilidade e exclusão com confirmação.
- Cadastro de produtos com validação de nome, descrição, preço, categoria, tamanhos e fotos.
- Categorias: criar, editar e excluir. Uma categoria só pode ser excluída quando não possui produtos.

## Estrutura do sistema

```
src/
  components/
    admin/        Painel: menu lateral, proteção de rotas, formulário de produto, fotos e tamanhos
    catalog/      Cartões de produto, filtros, galeria e botão de WhatsApp
    layout/       Cabeçalho, rodapé e marca da loja
    ui/           Botões, janelas, alertas e estados de carregamento
  config/         Dados da loja (WhatsApp, Instagram, tamanhos e limites de imagem)
  contexts/       Estado de autenticação
  hooks/          Carregamento de dados e atualização em tempo real
  lib/            Cliente do Supabase, formatação e validações
  pages/          Páginas públicas e páginas do painel administrativo
  services/       Acesso ao banco de dados e ao armazenamento de imagens
  types/          Tipos dos dados
scripts/
  create-admin.mjs  Criação do primeiro administrador (uso restrito)
```

## Instalação

1. Tenha instalado o **Node.js 20.6 ou superior** e o **npm**.
2. Instale as dependências do projeto:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` na raiz do projeto com as variáveis descritas na seção abaixo.
4. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Para gerar a versão de produção:
   ```bash
   npm run build
   ```

## Configuração do banco de dados

O banco de dados é um projeto Supabase (PostgreSQL). A estrutura foi criada por migrações que já estão aplicadas ao projeto e contém:

| Tabela | Finalidade |
| --- | --- |
| `admins` | Lista de contas autorizadas a acessar o painel. Cada registro aponta para uma conta de autenticação. |
| `categories` | Categorias de produtos (nome e identificador amigável). Já vêm cadastradas as oito categorias da loja. |
| `products` | Produtos com nome, descrição, preço, tamanhos, disponibilidade (`available`) e visibilidade (`active`). Cada produto pertence a uma categoria. |
| `product_images` | Fotos de cada produto. A primeira foto (menor posição) é a capa. |

Além das tabelas, o projeto possui:

- **Segurança por linha (Row Level Security):** em todas as tabelas. Visitantes leem apenas produtos ativos; somente administradores criam, alteram e excluem registros.
- **Função `is_admin()`:** verifica se a conta conectada está na lista de administradores.
- **Bucket `product-images`:** armazenamento público de leitura para as fotos, limitado a 5 MB por arquivo e aos formatos JPEG, PNG e WEBP. Somente administradores enviam ou removem arquivos.
- **Atualização em tempo real:** alterações em categorias, produtos e fotos são publicadas no catálogo sem recarregar a página.

### Criação do primeiro administrador

Não existe cadastro público de administradores. A primeira conta é criada pelo script de configuração, que usa a chave de serviço do Supabase guardada apenas no arquivo `.env` do computador responsável pelo projeto:

```bash
node --env-file=.env scripts/create-admin.mjs seuemail@exemplo.com "SuaSenhaForte123"
```

A senha precisa ter pelo menos 8 caracteres. O comando também pode ser usado para trocar a senha de um administrador já existente. Depois de criada, a conta entra pela página `/admin/login`.

## Variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto (ele não é enviado ao repositório):

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | Endereço do projeto Supabase. Usado pelo site. |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase. Usada pelo site; a segurança é garantida pelas regras do banco. |
| `SUPABASE_URL` | Mesmo endereço do projeto. Usado pelo script de configuração. |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço. **Secreta**: usada somente pelo script `create-admin.mjs` e nunca deve ser colocada no código do site. |

## Orientações de utilização

### Para os clientes
1. Acesse a página inicial e toque em **Ver catálogo**.
2. Use as categorias, a pesquisa ou a ordenação por preço para encontrar o produto.
3. Abra o produto, confira tamanhos e disponibilidade e toque em **Quero comprar**. O WhatsApp da loja abre com a mensagem pronta.

### Para a loja (administradores)
1. Acesse `/admin/login` e entre com o e-mail e a senha de administrador.
2. Em **Categorias**, confira ou crie as categorias antes de cadastrar produtos.
3. Em **Cadastro de produtos**, preencha as informações, selecione os tamanhos, envie as fotos (a primeira será a capa) e defina se o produto está disponível e visível.
4. Em **Produtos**, use **Ativar/Desativar** para mostrar ou ocultar um produto, **Editar** para alterar qualquer informação ou fotos, e **Excluir** para remover o produto (é pedida confirmação).
5. Use **Sair da conta** ao terminar.

## Relação com o ODS 8

O Objetivo de Desenvolvimento Sustentável 8 trata de trabalho decente e crescimento econômico. O projeto contribui com ele ao:

- **Fortalecer o pequeno comércio**, oferecendo uma vitrine digital profissional.
- **Estimular o empreendedorismo local**, com ferramentas simples de gestão que não exigem conhecimento técnico.
- **Ampliar a divulgação digital**, com catálogo sempre atualizado e integrado ao WhatsApp e ao Instagram.
- **Modernizar o atendimento**, permitindo que o cliente escolha e manifeste interesse de compra em poucos cliques.
- **Ampliar o acesso aos produtos**, para que famílias conheçam a coleção sem depender de deslocamento.
- **Promover o desenvolvimento econômico local**, ao manter a circulação de renda dentro da comunidade.

A seção institucional com essas informações está na página **Sobre a loja**.
