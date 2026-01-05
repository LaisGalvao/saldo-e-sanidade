# Supabase Setup - Saldo & Sanidade

## Database Schema

Execute the following SQL commands in your Supabase SQL Editor to set up the database:

### 1. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
```

### 2. Create Tables

```sql
-- Incomes table
CREATE TABLE incomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Obligations table
CREATE TABLE obligations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  adjusted_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rules table
CREATE TABLE rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Create Indexes for Performance

```sql
-- Indexes for faster queries
CREATE INDEX idx_incomes_user_month ON incomes(user_id, month);
CREATE INDEX idx_obligations_user_month ON obligations(user_id, month);
CREATE INDEX idx_rules_user_month ON rules(user_id, month);
```

### 4. Row Level Security Policies

```sql
-- Incomes policies
CREATE POLICY "Users can view their own incomes"
  ON incomes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own incomes"
  ON incomes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incomes"
  ON incomes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incomes"
  ON incomes FOR DELETE
  USING (auth.uid() = user_id);

-- Obligations policies
CREATE POLICY "Users can view their own obligations"
  ON obligations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own obligations"
  ON obligations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own obligations"
  ON obligations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own obligations"
  ON obligations FOR DELETE
  USING (auth.uid() = user_id);

-- Rules policies
CREATE POLICY "Users can view their own rules"
  ON rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rules"
  ON rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules"
  ON rules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules"
  ON rules FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Trigger for updated_at timestamp

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for each table
CREATE TRIGGER update_incomes_updated_at
  BEFORE UPDATE ON incomes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obligations_updated_at
  BEFORE UPDATE ON obligations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Environment Setup

1. Create a `.env` file in the root of the project
2. Copy the values from `.env.example`
3. Get your Supabase URL and Anon Key from the Supabase dashboard:
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Authentication Setup

Authentication is already configured in Supabase by default. The app uses:
- Email/Password authentication
- No email confirmation required (can be enabled in Supabase settings)

To enable email confirmation:
1. Go to Authentication > Settings in Supabase
2. Enable "Confirm email" under Email Auth settings

## Testing the Setup

1. Start the dev server: `npm run dev`
2. Create a new account
3. Verify you can:
   - Add incomes
   - Add obligations
   - Change obligation status (pending/paid/ignored)
   - Adjust obligation amounts
   - Add rules
   - See real-time calculations update

## Data Model

### Month Format
All tables use `YYYY-MM` format for the month field (e.g., "2026-01")

### Entities

**Incomes**: Sources of money for the month
- description: What the income is (e.g., "Salário")
- amount: How much money

**Obligations**: Bills and expenses that need to be paid
- description: What needs to be paid (e.g., "Aluguel")
- amount: Original amount
- adjusted_amount: Can be different if user adjusts it
- status: pending (default), paid, or ignored

**Rules**: Custom financial rules or goals
- description: What the rule is (e.g., "Reserva de emergência")
- amount: The amount allocated for this rule

### Calculations
- Total Income = Sum of all income amounts
- Total Obligations = Sum of adjusted_amounts for non-ignored obligations
- Surplus = Total Income - Total Obligations

The calculations update in real-time as data changes.
