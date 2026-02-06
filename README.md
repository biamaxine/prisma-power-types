# Node.js + TypeScript Template 🚀

Um template robusto e minimalista para iniciar projetos Node.js utilizando **TypeScript**, configurado com as melhores práticas de desenvolvimento, linting e formatação de código.

## 📋 Sobre o Projeto

Este repositório serve como ponto de partida para aplicações Node.js modernas. Ele já vem configurado com um ambiente de desenvolvimento otimizado, garantindo que você foque no que importa: **escrever código**.

### Tecnologias Principais:

- **Node.js** (Ambiente de execução)
- **TypeScript** (Superset de JavaScript com tipagem estática)
- **ESLint** (Padronização e análise de código)
- **Prettier** (Formatação de código automática)
- **Nodemon** (Recarregamento automático em desenvolvimento)

---

## 🛠️ Configurações Incluídas

O projeto foi estruturado seguindo estas etapas de configuração:

1. **TypeScript:** Configurado com `target: esnext` e `module: nodenext` para suporte às funcionalidades mais recentes.
2. **Linting & Estilo:** Integração total entre ESLint e Prettier para evitar conflitos de formatação.
3. **Ambiente Dev:** Utilização do `ts-node` em conjunto com `nodemon` para execução direta de arquivos `.ts` sem necessidade de build manual constante.

---

## 🚀 Como usar

### 1. Clonar o repositório

```bash
git clone https://github.com/biamaxine/nodets-template.git
cd nodets-template

```

### 2. Instalar dependências

```bash
npm install

```

### 3. Scripts disponíveis

| Comando         | Descrição                                                     |
| --------------- | ------------------------------------------------------------- |
| `npm run dev`   | Inicia o servidor em modo de desenvolvimento com **Nodemon**. |
| `npm run build` | Compila o código TypeScript para JavaScript na pasta `/dist`. |
| `npm start`     | Executa o código compilado (necessário rodar o build antes).  |
| `npm run lint`  | Executa o ESLint para encontrar e corrigir erros de estilo.   |

---

## 📂 Estrutura de Pastas

```text
.
├── src/           # Código fonte (TypeScript)
│   └── index.ts   # Ponto de entrada da aplicação
├── dist/          # Código compilado (JavaScript) - gerado após o build
├── .prettierrc    # Configurações do Prettier
├── eslint.config.mjs # Configurações do ESLint
├── nodemon.json   # Configurações do ambiente de desenvolvimento
├── tsconfig.json  # Configurações do compilador TypeScript
└── package.json   # Dependências e scripts do projeto

```

---

## 👤 Autora

**Bianca Maxine**

- **GitHub:** [@biamaxine](https://github.com/biamaxine)
- **Email:** 2023005718@ifam.edu.br

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.
