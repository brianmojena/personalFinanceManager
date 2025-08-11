import { useState, useEffect } from 'react';
import { Category } from '../types';
import { supabase } from '../services/supabase';

// Default categories that are available to all users
const DEFAULT_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Salud',
  'Educación',
  'Entretenimiento',
  'Compras',
  'Servicios',
  'Sueldo',
  'Freelance',
  'Inversiones',
  'Otros'
];

export const useCategories = (userId?: string) => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  const fetchUserCategories = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('user_id', userId);

      if (error) throw error;

      const userCategories = data?.map(c => c.name) || [];
      const allCategories = [...DEFAULT_CATEGORIES, ...userCategories];
      
      // Remove duplicates
      setCategories([...new Set(allCategories)]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string) => {
    if (!userId) return { error: 'User not authenticated' };
    
    // Check if category already exists
    if (categories.includes(name)) {
      return { error: 'Category already exists' };
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, name]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create category';
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchUserCategories();
  }, [userId]);

  return {
    categories,
    loading,
    createCategory,
    refetch: fetchUserCategories,
  };
};