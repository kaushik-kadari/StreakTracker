import { useState, useEffect } from 'react';
import { api } from './api';
import { useToast } from '@/hooks/use-toast';

interface Task {
    id: string;
    task: string;
    completed: boolean;
}

export function useTasks(token: string | null) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { toastSuccess, toastError, toastInfo } = useToast();

    useEffect(() => {
        const fetchTasks = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await api.getTasks(token);
                setTasks(data);
            } catch (error) {
                toastError('Error fetching tasks');
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [token]);

    const createTask = async (task : string, completed : boolean) => {
        if (!token) return;
        try {
            const newTask = await api.createTask(token, { task, completed });
            setTasks([...tasks, newTask]);
            toastSuccess(`Task ${newTask.task} created successfully`);
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
            setTasks(tasks.map(task => 
                task.id === id ? updatedTask : task
            ));
            toastInfo(`Task ${updatedTask.task} updated successfully`);
        } catch (error) {
            toastError('Error updating task');
            console.error('Error updating task:', error);
            throw error;
        }
    };

    const toggleTask = async (id: string) => {
        if (!token) return;
        try {
            await api.toggleTask(token, id);
            setTasks(tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            ));
        } catch (error) {
            console.error('Error toggling task:', error);
            throw error;
        }
    };

    const deleteTask = async (id: string) => {
        if (!token) return;
        try {
            await api.deleteTask(token, id);
            setTasks(tasks.filter(task => task.id !== id));
            toastSuccess(`Task ${tasks.find(task => task.id === id)?.task} deleted successfully`);
        } catch (error) {
            toastError('Error deleting task');
            console.error('Error deleting task:', error);
            throw error;
        }
    };

    return {
        tasks,
        loading,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
    };
}
