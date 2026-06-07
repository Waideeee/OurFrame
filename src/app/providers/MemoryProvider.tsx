import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { Memory } from '@/types';
import { memories as seedMemories } from '@/data';
import { MemoryDetailModal } from '@/components/media/MemoryDetailModal';
import { MemoryContext, type MemoryContextValue } from './memory-context';

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>(() => seedMemories);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  const patchFlag = useCallback(
    (id: string, key: 'archived' | 'liked' | 'inCollection') =>
      setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, [key]: !m[key] } : m))),
    [],
  );

  const toggleArchive = useCallback((id: string) => patchFlag(id, 'archived'), [patchFlag]);
  const toggleLike = useCallback((id: string) => patchFlag(id, 'liked'), [patchFlag]);
  const toggleCollection = useCallback((id: string) => patchFlag(id, 'inCollection'), [patchFlag]);

  const addMemory = useCallback((memory: Memory) => {
    setMemories((prev) => [memory, ...prev]);
  }, []);

  const updateMemory = useCallback((id: string, patch: Partial<Memory>) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    setActiveMemory((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setActiveMemory((prev) => (prev && prev.id === id ? null : prev));
  }, []);

  const openMemory = useCallback((memory: Memory) => setActiveMemory(memory), []);
  const closeMemory = useCallback(() => setActiveMemory(null), []);

  const value = useMemo<MemoryContextValue>(() => {
    return {
      memories,
      getMemory: (id) => memories.find((m) => m.id === id),
      memoriesByType: (type) => memories.filter((m) => m.type === type),
      memoriesByCategory: (category) => memories.filter((m) => m.category === category),
      featuredMemories: memories.filter((m) => m.featured),
      continueWatching: memories.filter(
        (m) =>
          m.type === 'video' && m.progress !== undefined && m.progress > 0 && m.progress < 1,
      ),
      recentMemories: [...memories].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
      toggleArchive,
      toggleLike,
      toggleCollection,
      addMemory,
      updateMemory,
      deleteMemory,
      activeMemory,
      openMemory,
      closeMemory,
    };
  }, [
    memories,
    activeMemory,
    toggleArchive,
    toggleLike,
    toggleCollection,
    addMemory,
    updateMemory,
    deleteMemory,
    openMemory,
    closeMemory,
  ]);

  return (
    <MemoryContext.Provider value={value}>
      {children}
      <MemoryDetailModal />
    </MemoryContext.Provider>
  );
}
