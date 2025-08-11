import React, { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { getCurrentDate } from '../../utils/dateUtils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<{ error: string | null }>;
  transaction?: Transaction;
  userId: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  userId
}) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: getCurrentDate(),
    description: '',
    category: '',
    type: 'expense',
    amount: 0,
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { categories, createCategory } = useCategories(userId);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
      });
    } else {
      setFormData({
        date: getCurrentDate(),
        description: '',
        category: '',
        type: 'expense',
        amount: 0,
      });
    }
    setError('');
    setNewCategory('');
    setShowNewCategory(false);
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.amount <= 0) {
      setError('El monto debe ser mayor a 0');
      setLoading(false);
      return;
    }

    try {
      const { error } = await onSubmit(formData);
      if (error) {
        setError(error);
      } else {
        onClose();
      }
    } catch (err) {
      setError('Error al procesar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const { error } = await createCategory(newCategory.trim());
    if (error) {
      setError(error);
    } else {
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const handleChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Editar Transacción' : 'Nueva Transacción'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
          
          <Select
            label="Tipo"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as 'income' | 'expense')}
            required
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </Select>
        </div>

        <Input
          label="Descripción"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          placeholder="Descripción de la transacción"
        />

        <div className="space-y-2">
          <Select
            label="Categoría"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            <option value="__new__">+ Crear nueva categoría</option>
          </Select>
          
          {formData.category === '__new__' && (
            <div className="flex space-x-2">
              <Input
                placeholder="Nueva categoría"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
              >
                Crear
              </Button>
            </div>
          )}
        </div>

        <Input
          label="Monto"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
          required
          placeholder="0.00"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || formData.category === '__new__'}
            className="flex-1"
          >
            {loading ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};