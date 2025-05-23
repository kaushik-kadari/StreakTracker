import { useState, useEffect } from 'react';
import { api } from './api';
import { useToast } from '@/hooks/use-toast';

export interface Streak {
    id: string;
    name: string;
    description: string;
    currentStreak: number;
    bestStreak: number;
    history: string[];
    lastCompleted: string | null;
    createdAt: string;
    updatedAt: string;
}

export type StreakUpdate = {
    name?: string;
    description?: string;
}

export function useStreaks(token: string | null) {
    const [streaks, setStreaks] = useState<Streak[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toastSuccess, toastError, toastInfo } = useToast()

    useEffect(() => {
        const fetchStreaks = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const data = await api.getStreaks(token);
                setStreaks(data);
            } catch (error) {
                console.error('Error fetching streaks:', error);
                toastError('Error fetching streaks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStreaks();
    }, [token]);

    const createStreak = async (name: string, description: string) => {
        if (!token) return;
        try {
            setIsLoading(true);
            const newStreak = await api.createStreak(token, { name, description });
            setStreaks([...streaks, newStreak]);
            toastSuccess(`Streak "${newStreak.name}" created successfully`);
        } catch (error) {
            console.error('Error creating streak:', error);
            toastError('Error creating streak');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateStreak = async (id: string, updates: Partial<Streak>) => {
        if (!token) return;
        try {
            const updatedStreak = await api.updateStreak(token, id, updates);
            setStreaks(streaks.map(streak => 
                streak.id === id ? updatedStreak : streak
            ));
            toastInfo(`Streak "${updatedStreak.name}" updated successfully`);
        } catch (error) {
            console.error('Error updating streak:', error);
            toastError('Error updating streak');
            throw error;
        }
    };

    const completeStreak = async (id: string) => {
        if (!token) return;
        try {
            const updatedStreak = await api.completeStreak(token, id);
            setStreaks(streaks.map(streak => 
                streak.id === id ? updatedStreak : streak
            ));
        } catch (error) {
            console.error('Error completing streak:', error);
            toastError('Error completing streak');
            throw error;
        }
    };

    const deleteStreak = async (id: string) => {
        if (!token) return;
        try {
            setIsLoading(true);
            await api.deleteStreak(token, id);
            setStreaks(streaks.filter(streak => streak.id !== id));
            toastSuccess(`Streak "${streaks.find(streak => streak.id === id)?.name}" deleted successfully`);
        } catch (error) {
            console.error('Error deleting streak:', error);
            toastError('Error deleting streak');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        streaks,
        loading: isLoading,
        createStreak,
        updateStreak,
        completeStreak,
        deleteStreak,
    };
}
