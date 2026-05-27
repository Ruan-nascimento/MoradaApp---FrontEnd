# Morada App — FrontEnd

Aplicativo mobile desenvolvido em **React Native com Expo** para aluguel e visualização de imóveis, seguindo uma proposta parecida com plataformas como Airbnb. O projeto tem como objetivo permitir que usuários se cadastrem, façam login, visualizem imóveis disponíveis, consultem informações básicas dos locais e mantenham a sessão autenticada no aplicativo.

Atualmente, o app já possui uma base funcional de autenticação, comunicação com API, listagem de imóveis, estrutura visual com NativeWind/Tailwind, carregamento de dados do usuário autenticado e organização inicial por páginas, componentes, hooks, contexto e utilitários.

---

## 📱 Sobre o projeto

O **Morada App** é o front-end mobile de uma aplicação de reservas e aluguel de imóveis. A proposta é oferecer uma experiência simples e direta para usuários que desejam encontrar locais disponíveis para hospedagem ou aluguel.

Nesta versão atual, o app já trabalha com:

- autenticação de usuários;
- cadastro de novos usuários;
- armazenamento seguro do token;
- verificação de sessão ativa;
- consumo de uma API externa;
- listagem de imóveis;
- busca visual por imóveis;
- cards para exibição de imóveis;
- cálculo de avaliações por reviews;
- tela de perfil com informações do usuário;
- logout;
- estrutura inicial para páginas como favoritos, reservas, mapas e apartamentos.

---

## 🚀 Tecnologias utilizadas

O projeto foi construído utilizando as seguintes tecnologias principais:

| Tecnologia | Função no projeto |
|---|---|
| **React Native** | Desenvolvimento da interface mobile |
| **Expo** | Ambiente de desenvolvimento, build e execução do app |
| **TypeScript** | Tipagem estática e melhor organização do código |
| **NativeWind** | Uso de classes parecidas com Tailwind CSS no React Native |
| **Tailwind CSS** | Base de estilos utilizada pelo NativeWind |
| **Expo Secure Store** | Armazenamento seguro do token de autenticação |
| **Expo Splash Screen** | Configuração da tela inicial do aplicativo |
| **Expo Blur** | Efeito visual de blur na interface |
| **Expo Linear Gradient** | Gradientes visuais usados em componentes |
| **React Native Reanimated** | Animações e efeitos baseados no scroll |
| **React Navigation** | Base instalada para navegação mobile |
| **React Native SVG** | Suporte a ícones e elementos SVG |

---

## 📦 Principais dependências

As principais dependências do projeto são:

```json
{
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "nativewind": "^4.2.3",
  "tailwindcss": "^3.4.19",
  "typescript": "~5.9.2",
  "expo-secure-store": "~15.0.8",
  "expo-splash-screen": "~31.0.13",
  "expo-linear-gradient": "~15.0.8",
  "expo-blur": "~15.0.8",
  "react-native-reanimated": "~4.1.1",
  "@react-navigation/native": "^7.2.5",
  "@react-navigation/bottom-tabs": "^7.16.2"
}
```

---

## 🧠 Funcionalidades implementadas até o momento

### 🔐 Autenticação

O app possui um fluxo de autenticação baseado em token.

O usuário consegue:

- fazer login com e-mail e senha;
- receber um token da API;
- salvar o token de forma segura no dispositivo;
- manter a sessão mesmo após fechar o app;
- carregar automaticamente o token salvo ao abrir o aplicativo;
- remover o token ao fazer logout.

A autenticação é controlada pelo contexto global `AuthProvider`, localizado em:

```txt
contexts/authContext/index.tsx
```

Esse contexto fornece:

```ts
token
isAuthenticated
isLoadingToken
saveToken()
removeToken()
```

Com isso, o aplicativo consegue saber se o usuário está autenticado ou não.

---

### 📝 Cadastro de usuário

O app também possui função de cadastro integrada à API.

A função `signUp` recebe:

```ts
name
email
password
```

E envia esses dados para a rota:

```txt
POST /cadastro
```

Essa lógica está no hook:

```txt
hooks/useUser.ts
```

---

### 🔑 Login de usuário

O login é feito através da função `signIn`, que recebe:

```ts
email
password
```

E envia os dados para:

```txt
POST /login
```

Quando a API retorna um token válido, ele pode ser salvo no `SecureStore` pelo contexto de autenticação.

---

### 👤 Busca dos dados do usuário autenticado

Depois que o usuário está autenticado, o app consegue buscar os dados da conta usando a função:

```ts
getUserAuth(token)
```

Essa função faz uma requisição para:

```txt
GET /me
```

Enviando o token no header:

```ts
Authorization: Bearer token
```

A resposta esperada inclui dados como:

- id do usuário;
- nome;
- e-mail;
- reservas vinculadas ao usuário.

---

### 🏠 Listagem de imóveis

A tela inicial já possui integração com a API para buscar imóveis.

A lógica fica no hook:

```txt
hooks/useImoveis.ts
```

A função principal é:

```ts
fetchImoveis()
```

Ela busca os imóveis na rota:

```txt
GET /imoveis?page=1&limit=1000
```

Atualmente o hook:

- busca os imóveis da API;
- evita chamadas duplicadas usando `useRef`;
- controla estado de carregamento;
- controla erros;
- armazena os imóveis em estado local;
- permite atualizar a lista com `refresh()`.

---

### 🔄 Atualização da lista

O hook `useImoveis` possui a função:

```ts
refresh()
```

Ela chama novamente `fetchImoveis(true)` e permite recarregar a listagem de imóveis.

Na tela inicial, também existe uso de `RefreshControl`, indicando preparação para comportamento de "puxar para atualizar".

---

### 🔎 Barra de busca

O projeto possui um componente próprio para busca:

```txt
components/searchBar
```

Na `HomePage`, existe o estado:

```ts
searchText
```

Esse estado é usado para controlar o texto digitado na busca.

A barra de busca fica fixa no topo da tela inicial, com efeito visual usando `BlurView`.

---

### 🏡 Card de imóvel

O projeto possui um componente para exibir imóveis:

```txt
components/cardImovel
```

Esse componente é usado na tela inicial para renderizar cada imóvel vindo da API.

A tela inicial calcula informações de avaliação com base nos reviews do imóvel:

```ts
const totalReviews = item.reviews?.length || 0;
const totalStars = item.reviews?.reduce((acc, curr) => acc + curr.stars, 0) || 0;
```

Com isso, o card pode trabalhar com:

- quantidade de avaliações;
- soma das estrelas;
- dados do imóvel;
- imagem;
- título;
- preço;
- cidade;
- UF;
- informações complementares vindas da API.

---

### 💀 Skeleton/loading de imóveis

O projeto possui um componente de skeleton:

```ts
SkeletonImovel
```

Ele é usado enquanto os imóveis estão sendo carregados.

Na tela inicial, quando `loading` está ativo e ainda não há imóveis carregados, o app exibe skeletons para melhorar a experiência visual do usuário.

---

### 👋 Home com dados do usuário

A `HomePage` também busca os dados do usuário autenticado ao carregar.

Ela utiliza:

```ts
useAuth()
useUser()
getUserAuth(token)
```

A tela consegue mostrar uma mensagem personalizada quando encontra o nome do usuário.

---

### 🚪 Logout

O logout já está implementado na tela de perfil e remove o token salvo no dispositivo.

A função usada é:

```ts
removeToken()
```

Ela apaga o token do `SecureStore` e muda o estado global da autenticação para usuário não autenticado.

---

### 👤 Tela de perfil

A página de perfil está em:

```txt
pages/profile.tsx
```

Ela:

- carrega os dados do usuário autenticado;
- mostra mensagem de carregamento;
- exibe saudação com o nome do usuário quando disponível;
- possui botão de logout.

---

### ❤️ Tela de favoritos

A página de favoritos já existe em:

```txt
pages/favorites.tsx
```

Atualmente ela é uma tela inicial/placeholder, mostrando a mensagem:

```txt
Favoritos
Seus imóveis favoritos aparecerão aqui.
```

Ou seja, a estrutura visual já foi iniciada, mas a funcionalidade completa de favoritar imóveis ainda não está implementada nesta versão.

---

### 🏢 Tela de apartamentos

A página existe em:

```txt
pages/apartments.tsx
```

Atualmente o arquivo está vazio, indicando que a tela ainda será desenvolvida.

---

### 🗺️ Tela de mapas

A página existe em:

```txt
pages/maps.tsx
```

Essa tela indica uma futura área para visualização dos imóveis em mapa.

---

### 📅 Tela de reservas

A página existe em:

```txt
pages/reserves.tsx
```

Essa tela indica uma futura área para exibição ou gerenciamento das reservas do usuário.

---

## 🧭 Fluxo atual do aplicativo

O fluxo principal do app funciona da seguinte forma:

```txt
Usuário abre o app
        ↓
AuthProvider tenta carregar token salvo no SecureStore
        ↓
Se estiver carregando:
    mostra loading
        ↓
Se existir token:
    usuário é considerado autenticado
    app abre a HomePage
        ↓
Se não existir token:
    app abre a tela de login/cadastro
```

Esse fluxo está centralizado no arquivo:

```txt
App.tsx
```

---

## 🗂️ Estrutura de pastas

A estrutura atual do projeto é organizada assim:

```txt
MoradaApp---FrontEnd/
│
├── assets/
│   └── Imagens e ícones do aplicativo
│
├── components/
│   ├── background/
│   │   └── Tela/estrutura visual inicial para autenticação
│   │
│   ├── bottomNavigation/
│   │   └── Estrutura de navegação inferior
│   │
│   ├── cardImovel/
│   │   └── Card visual para exibir imóveis
│   │
│   ├── loginWrapper/
│   │   └── Formulário/estrutura de login
│   │
│   ├── registerWrapper/
│   │   └── Formulário/estrutura de cadastro
│   │
│   └── searchBar/
│       └── Barra de busca de imóveis
│
├── contexts/
│   └── authContext/
│       └── Contexto global de autenticação
│
├── hooks/
│   ├── useImoveis.ts
│   │   └── Hook para buscar imóveis na API
│   │
│   └── useUser.ts
│       └── Hook para login, cadastro e busca do usuário autenticado
│
├── pages/
│   ├── apartments.tsx
│   │   └── Tela de apartamentos
│   │
│   ├── favorites.tsx
│   │   └── Tela de favoritos
│   │
│   ├── homepage.tsx
│   │   └── Tela inicial com listagem de imóveis
│   │
│   ├── maps.tsx
│   │   └── Tela de mapas
│   │
│   ├── profile.tsx
│   │   └── Tela de perfil do usuário
│   │
│   └── reserves.tsx
│       └── Tela de reservas
│
├── utils/
│   ├── exports.ts
│   │   └── URLs da API
│   │
│   └── interfaces/
│       └── Interfaces TypeScript usadas no app
│
├── App.tsx
├── app.json
├── global.css
├── index.ts
├── metro.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🌐 Integração com API

O app se comunica com uma API externa utilizando `fetch`.

A URL base da API é configurada em:

```txt
utils/exports.ts
```

Atualmente existe:

```ts
export const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.180.254.87:3000/api";

export const API_URL_REAL = process.env.EXPO_PUBLIC_API_URL || "http://10.180.254.87:3000/api";
```

Ou seja, o app tenta usar primeiro a variável de ambiente:

```txt
EXPO_PUBLIC_API_URL
```

Caso ela não exista, usa uma URL local como fallback.

---

## 🔌 Rotas da API usadas atualmente

| Método | Rota | Função |
|---|---|---|
| `POST` | `/login` | Autenticar usuário |
| `POST` | `/cadastro` | Criar novo usuário |
| `GET` | `/me` | Buscar usuário autenticado |
| `GET` | `/imoveis?page=1&limit=1000` | Buscar lista de imóveis |

---

## 🎨 Identidade visual

O projeto utiliza NativeWind com uma paleta personalizada configurada no `tailwind.config.js`.

Cores principais:

| Nome | Cor |
|---|---|
| `main` | `#18181B` |
| `second` | `#27272A` |
| `third` | `#3F3F46` |
| `warm-yellow` | `#F2B705` |
| `blue-detail` | `#3B82F6` |
| `white` | `#ffffff` |
| `off-white` | `#F7F7F8` |

A identidade visual atual segue um estilo escuro, com destaque em amarelo quente e elementos em tons de cinza.

---

## ⚙️ Configuração do Expo

O aplicativo está configurado como:

```json
{
  "name": "Morada App",
  "slug": "morada-app",
  "version": "1.0.0",
  "orientation": "portrait",
  "scheme": "moradaapp"
}
```

Também possui configuração para:

- ícone do app;
- splash screen;
- suporte a iOS;
- suporte a Android;
- suporte web;
- uso de `expo-secure-store`;
- projeto EAS configurado.

---

## ▶️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Ruan-nascimento/MoradaApp---FrontEnd.git
```

### 2. Entre na pasta do projeto

```bash
cd MoradaApp---FrontEnd
```

### 3. Instale as dependências

```bash
npm install
```

Ou, caso queira instalar exatamente com base no `package-lock.json`:

```bash
npm ci
```

### 4. Configure a URL da API

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_OU_DOMINIO:3000/api
```

Exemplo em rede local:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api
```

> Importante: em aplicativos Expo rodando no celular, `localhost` normalmente aponta para o próprio celular, não para o computador. Por isso, use o IP da máquina onde a API está rodando.

### 5. Rode o app

```bash
npm start
```

Depois, escolha onde deseja abrir:

```bash
npm run android
npm run ios
npm run web
```

---

## 📜 Scripts disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `start` | `expo start` | Inicia o servidor de desenvolvimento do Expo |
| `android` | `expo start --android` | Abre o app no Android |
| `ios` | `expo start --ios` | Abre o app no iOS |
| `web` | `expo start --web` | Abre o app no navegador |

---

## 📌 Status atual do projeto

### Já implementado

- Estrutura Expo com TypeScript;
- NativeWind configurado;
- Paleta de cores personalizada;
- Contexto global de autenticação;
- Salvamento seguro de token com SecureStore;
- Login integrado com API;
- Cadastro integrado com API;
- Busca de usuário autenticado;
- Logout;
- Tela inicial protegida por autenticação;
- Listagem de imóveis consumindo API;
- Refresh da listagem;
- Skeleton/loading para imóveis;
- Card de imóvel;
- Barra de busca;
- Tela de perfil;
- Placeholder de favoritos;
- Estrutura inicial de páginas futuras.

### Em desenvolvimento ou pendente

- Navegação final entre páginas;
- Tela completa de favoritos;
- Função de favoritar/desfavoritar imóveis;
- Tela completa de reservas;
- Tela completa de mapas;
- Tela completa de apartamentos;
- Detalhes do imóvel;
- Paginação real ou scroll infinito;
- Tratamento visual completo de erros;
- Testes automatizados;
- Melhor organização de estados globais;
- Ajustes finais de build.

---

## 🧩 Melhorias recomendadas

Algumas melhorias futuras para deixar o projeto mais completo:

### 1. Implementar navegação real

O projeto já possui dependências de navegação instaladas, como:

```txt
@react-navigation/native
@react-navigation/bottom-tabs
```

A próxima etapa natural é conectar as páginas:

- Home;
- Favoritos;
- Reservas;
- Mapa;
- Perfil.

### 2. Criar tela de detalhes do imóvel

Ao clicar em um card, o app poderia abrir uma tela com:

- galeria de fotos;
- título;
- localização;
- preço;
- reviews;
- highlights;
- dados do host;
- botão de reservar;
- botão de favoritar.

### 3. Implementar favoritos

A tela de favoritos já existe, mas ainda está como placeholder. O ideal seria:

- salvar favoritos localmente ou na API;
- listar imóveis favoritados;
- permitir remover dos favoritos;
- sincronizar com usuário autenticado.

### 4. Implementar reservas

A API já retorna reservas no objeto do usuário autenticado. A tela de reservas pode usar esses dados para mostrar:

- nome da reserva;
- data;
- horário;
- status;
- imóvel relacionado.

### 5. Melhorar feedback visual de erro

O hook `useImoveis` já possui estado de erro. Uma melhoria seria criar um componente visual para exibir:

- erro de conexão;
- API fora do ar;
- token inválido;
- lista vazia.

### 6. Criar paginação ou scroll infinito

Atualmente o app busca até 1000 imóveis de uma vez. Em produção, o ideal seria buscar por páginas menores, como:

```txt
/imoveis?page=1&limit=10
/imoveis?page=2&limit=10
```

Isso melhora performance e reduz carga na API.

---

## 🧪 Testes

Até o momento, não há estrutura de testes automatizados identificada no projeto.

Sugestões futuras:

- Jest;
- React Native Testing Library;
- testes para hooks;
- testes para autenticação;
- testes para componentes principais;
- testes de renderização dos cards.

---

## 🏗️ Build

O projeto possui arquivo `eas.json`, indicando preparação para builds usando EAS.

Com isso, futuramente o app pode ser compilado para:

- Android APK/AAB;
- iOS;
- builds de preview;
- builds de produção.

---

## 👨‍💻 Autor

Desenvolvido por **Ruan Carlos**.

Repositório:

```txt
https://github.com/Ruan-nascimento/MoradaApp---FrontEnd
```

---

## 📄 Licença

Este projeto ainda não possui uma licença definida no repositório.

Caso deseje tornar o projeto open-source, recomenda-se adicionar um arquivo `LICENSE`, como:

- MIT;
- Apache 2.0;
- GPL;
- BSD.

---

## ✅ Resumo final

O **Morada App** já possui uma base sólida para um aplicativo mobile de aluguel de imóveis. A autenticação está estruturada, o token é armazenado com segurança, a API já é consumida, a listagem de imóveis está iniciada e a organização do projeto permite crescimento para novas funcionalidades.

O próximo grande passo do projeto é finalizar a navegação entre telas e implementar as áreas de favoritos, reservas, detalhes do imóvel e mapa.
