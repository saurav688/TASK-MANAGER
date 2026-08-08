import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useTasks = (addToast) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.sort) params.append('sort', filters.sort);
      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (err) {
      setError(err.message);
      addToast && addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    setTasks(prev => [data, ...prev]);
    addToast && addToast('Task created successfully!', 'success');
    return data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    setTasks(prev => prev.map(t => t._id === id ? data : t));
    addToast && addToast('Task updated!', 'success');
    return data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
    addToast && addToast('Task deleted.', 'info');
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const { data } = await api.put(`/tasks/${task._id}`, { status: newStatus });
    setTasks(prev => prev.map(t => t._id === task._id ? data : t));
    addToast && addToast(
      newStatus === 'completed' ? '✓ Marked as completed!' : 'Marked as pending.',
      newStatus === 'completed' ? 'success' : 'info'
    );
    return data;
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleStatus };
};

export default useTasks;
