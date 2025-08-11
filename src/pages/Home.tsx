import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { Transaction, TransactionFormData } from '../types';
import { Button } from '../components/ui/Button';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { 
    transactions, 
    loading, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions(user?.id);
  const { categories } = useCategories(user?.id);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleCreateTransaction = async (data: TransactionFormData) => {
    const { error } = await createTransaction(data);
    return { error };
  };

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!editingTransaction) return { error: 'No transaction selected' };
    
    const { error } = await updateTransaction(editingTransaction.id, data);
    return { error };
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      await deleteTransaction(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(undefined);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenido a Finance Manager
          </h1>
          <p className="text-gray-600 mb-8">
            Gestiona tus finanzas personales de manera simple y efectiva
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mis Transacciones
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus ingresos y gastos
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Transacción</span>
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando transacciones...</p>
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <TransactionForm
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          transaction={editingTransaction}
          userId={user.id}
        />
      </div>
    </div>
  );
};