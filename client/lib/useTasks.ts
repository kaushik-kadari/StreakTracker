import { useState, useEffect } from 'react';
import { api } from './api';
import { useToast } from '@/hooks/use-toast';

export interface Task {
    id: string;
    task: string;
    completed: boolean;
}

export function useTasks(token: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [taskToDelete, setTaskToDelete] = useState<{ id: string; task: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toastSuccess, toastError, toastInfo } = useToast();

    // Fetch tasks on mount or when token changes
    useEffect(() => {
        const fetchTasks = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const data = await api.getTasks(token);
                setTasks(data);
            } catch (error) {
                toastError('Error fetching tasks');
                console.error('Error fetching tasks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [token]);

    // Task CRUD operations
    const createTask = async (task: string, completed: boolean) => {
        if (!token) return;
        try {
            const newTask = await api.createTask(token, { task, completed });
            setTasks(prev => [...prev, newTask]);
            toastSuccess(`Task "${newTask.task}" created successfully`);
        } catch (error) {
            toastError('Error creating task');
            console.error('Error creating task:', error);
            throw error;
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        if (!token) return;
        try {
            const updatedTask = await api.updateTask(token, id, updates);
            setTasks(prev => 
                prev.map(task => task.id === id ? updatedTask : task)
            );
            toastInfo(`Task "${updatedTask.task}" updated successfully`);
        } catch (error) {
            toastError('Error updating task');
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const toggleTask = async (id: string) => {
        if (!token) return;
        
        const taskToToggle = tasks.find(task => task.id === id);
        if (!taskToToggle) return;
        
        const originalTasks = [...tasks];
        
        try {
            // Optimistic update
            const updatedTasks = tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            setTasks(updatedTasks);
            
            const updatedTask = await api.toggleTask(token, id);
            
            // Update with server response
            setTasks(prev => prev.map(task => 
                task.id === id ? updatedTask : task
            ));
            
        } catch (error) {
            console.error('Error toggling task:', error);
            setTasks(originalTasks);
            toastError('Failed to update task status');
            throw error;
        }
    };

    const deleteTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            setTaskToDelete({ id, task: task.task });
        }
    };

    const confirmDelete = async () => {
        if (!taskToDelete || !token) return;
        
        setIsDeleting(true);
        try {
            await api.deleteTask(token, taskToDelete.id);
            setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
            toastSuccess(`Task "${taskToDelete.task}" deleted successfully`);
            setTaskToDelete(null);
        } catch (error) {
            toastError('Error deleting task');
            console.error('Error deleting task:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        tasks,
        loading: isLoading,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        taskToDelete,
        setTaskToDelete,
        isDeleting,
        confirmDelete
    };
}
