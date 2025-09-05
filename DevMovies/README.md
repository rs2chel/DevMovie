# 🎬 DevMovie

Projeto desenvolvido como parte do curso **Mais Pra Ti**.  
O objetivo do **DevMovie** é exibir informações sobre filmes de forma prática e intuitiva, consumindo a API do **TMDb (The Movie Database)** e utilizando **React** com **Material UI** para a interface.

---

## ✨ Funcionalidades

- Listagem de filmes populares e em destaque
- Favoritar
- Visualização de detalhes como título, sinopse, avaliação e data de lançamento  
- Interface responsiva e moderna com Material UI  
- Consumo da API TMDb (necessário configurar sua chave pessoal)

---
## 🛠️ Tecnologias utilizadas

- [React](https://react.dev/)  
- [Vite](https://vitejs.dev/) – bundler e setup rápido para React  
- [Material UI](https://mui.com/)  
- [TMDb API](https://www.themoviedb.org/)  

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão LTS recomendada)  
- npm ou yarn (gerenciador de pacotes)

---

## 🚀 Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/rs2chel/DevMovie.git
   cd DevMovie
Instale as dependências:
    ```bash
         npm install
         # ou
         yarn install```

Configure sua chave da API do TMDb:

Crie uma conta gratuita no TMDb.

Vá até Configurações → API e gere sua chave de API.

Crie um arquivo .env na raiz do projeto e adicione:

env

REACT_APP_TMDB_API_KEY=SUA_CHAVE_AQUI
Inicie a aplicação:

```bash
npm start
# ou
yarn start
Acesse no navegador:
 ```

http://localhost:3000
📝 Observações
Não compartilhe sua chave de API pública no repositório.

O arquivo .env deve estar listado no .gitignore.

Este projeto pode ser expandido para incluir pesquisa por filmes, filtros por gênero e muito mais.

📧 Contato
Desenvolvido por Rachel (rs2chel) ✨
Se quiser trocar ideias ou colaborar, fique à vontade para entrar em contato!
