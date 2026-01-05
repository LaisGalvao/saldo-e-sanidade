# Saldo & Sanidade 💰

Um aplicativo simples e elegante para planejamento financeiro mensal.

## 🎯 Objetivo

Planeje suas finanças mensais de forma simples e objetiva. Gerencie rendas, obrigações e regras financeiras com cálculos em tempo real.

## 🚀 Stack

- **Vue 3** (Composition API)
- **Supabase** (Authentication + PostgreSQL)
- **Vite** (Build tool)

## ✨ Funcionalidades

- 📅 **Planejamento Mensal**: Organize suas finanças por mês (formato YYYY-MM)
- 💰 **Gestão de Rendas**: Adicione e gerencie suas fontes de renda
- 📋 **Controle de Obrigações**: 
  - Marque como pago, pendente ou ignorado
  - Ajuste valores quando necessário
- 📝 **Regras Personalizadas**: Crie regras financeiras específicas
- 📊 **Cálculos em Tempo Real**: Veja sua sobra atualizar automaticamente
- 🔐 **Autenticação Segura**: Sistema de login com Supabase Auth

## 🛠️ Setup

### 1. Clone o repositório

```bash
git clone https://github.com/LaisGalvao/saldo-e-sanidade.git
cd saldo-e-sanidade
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute o SQL disponível em `SUPABASE.md` no SQL Editor do Supabase
4. Copie suas credenciais (URL e Anon Key) do dashboard

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Preencha com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 5. Execute o projeto

```bash
npm run dev
```

Acesse http://localhost:5173

## 📖 Como Usar

1. **Criar Conta**: Registre-se com email e senha
2. **Selecionar Mês**: Use o seletor para escolher o mês que deseja planejar
3. **Adicionar Rendas**: Cadastre suas fontes de renda (salário, freelance, etc.)
4. **Cadastrar Obrigações**: Adicione suas contas e despesas
5. **Gerenciar Status**: Marque obrigações como pagas ou ignore as que não se aplicam
6. **Ajustar Valores**: Modifique valores quando necessário
7. **Criar Regras**: Defina regras financeiras personalizadas
8. **Acompanhar Sobra**: Veja em tempo real quanto sobra no mês

## 🏗️ Estrutura do Projeto

```
src/
├── composables/        # Lógica reutilizável
│   ├── useAuth.js      # Autenticação
│   ├── useSupabase.js  # Cliente Supabase
│   └── useMonthlyPlan.js  # Lógica de planejamento
├── components/         # Componentes Vue
│   ├── AuthComponent.vue
│   ├── MonthSelector.vue
│   ├── IncomeManager.vue
│   ├── ObligationsList.vue
│   ├── RulesList.vue
│   └── TotalsSummary.vue
├── views/             # Páginas
│   └── Dashboard.vue
├── App.vue            # Componente raiz
└── main.js           # Entry point
```

## 🗄️ Modelo de Dados

### Incomes (Rendas)
- `description`: Descrição da renda
- `amount`: Valor

### Obligations (Obrigações)
- `description`: Descrição da obrigação
- `amount`: Valor original
- `adjusted_amount`: Valor ajustado
- `status`: pending | paid | ignored

### Rules (Regras)
- `description`: Descrição da regra
- `amount`: Valor

### Cálculos
- **Total de Rendas** = Soma de todas as rendas
- **Total de Obrigações** = Soma das obrigações não ignoradas (valores ajustados)
- **Sobra** = Total de Rendas - Total de Obrigações

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

## 📝 Documentação Adicional

- [SUPABASE.md](./SUPABASE.md) - Setup completo do banco de dados

## 🎨 Filosofia

Código simples, uso de composables, sem overengineering. O foco é na funcionalidade e usabilidade.

## 📄 Licença

MIT

---

Desenvolvido com ❤️ para ajudar no planejamento financeiro mensal
