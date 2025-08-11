export interface User {
  id: string;
  email: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  user_id: string | null;
  created_at?: string;
}

export interface TransactionFormData {
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionsCount: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
}