import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Memory } from '@/types';
import { MemoryDetailModal } from '@/components/media/MemoryDetailModal';
import { MemoryContext, type MemoryContextValue } from './memory-context';
import { useAuth } from './auth-context';
import { useProfile } from './profile-context';
import { apiFetch } from '@/lib/api';

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const { isAuthenticated } = useAuth();
  const { activeProfile, getProfile } = useProfile();

  useEffect(() => {
    if (!isAuthenticated || !activeProfile) return;

    apiFetch<any[]>(`/memories?profileId=${activeProfile.profileId}`)
      .then((data) => {
        const mapped: Memory[] = data.map((m) => ({
          memoryId: m.memoryId,
          profileId: m.profileId,
          title: m.title,
          description: m.description,
          mediaUrl: m.mediaUrl,
          coverPhoto: m.coverPhoto,
          type: m.type,
          category: m.category,
          mood: m.mood,
          date: m.date,
          location: m.location ?? undefined,
          hearts: m.hearts,
          featured: m.featured,
          liked: m.isLoved,
          archived: m.isArchived,
          inCollection: m.isInCollection,
          inList: m.isInList,
          durationSeconds: m.videoMeta?.durationSeconds,
          progress: m.videoMeta?.progress,
          uploadedBy: getProfile(m.profileId)?.name,
        }));
        setMemories(mapped);
        console.log("📦 Memories from API");
          console.table(
            mapped.map((m) => ({
              title: m.title,
              type: m.type,
              category: m.category,
            }))
          );
      })
      
      .catch((err) => console.error('Failed to load memories:', err));
      
  }, [isAuthenticated, activeProfile, getProfile]);

  const toggleArchive = useCallback(async (id: string) => {
    if (!activeProfile) return;
    await apiFetch(`/memories/${id}/archived`, {
      method: 'PATCH',
      body: { profileId: activeProfile.profileId },
    });
    setMemories((prev) => prev.map((m) => (m.memoryId === id ? { ...m, archived: !m.archived } : m)));
  }, [activeProfile]);

  const toggleLike = useCallback(async (id: string) => {
    if (!activeProfile) return;
    const result = await apiFetch<{ hearts: number }>(`/memories/${id}/loved`, {
      method: 'PATCH',
      body: { profileId: activeProfile.profileId },
    });
    setMemories((prev) => prev.map((m) => (m.memoryId === id ? { ...m, liked: !m.liked, hearts: result.hearts } : m)));
  }, [activeProfile]);

 const toggleCollection = useCallback(async (id: string) => {
    if (!activeProfile) return;
    await apiFetch(`/memories/${id}/collection`, {
        method: 'PATCH',
        body: { profileId: activeProfile.profileId },   // ← dagdag!
    });
    setMemories((prev) => prev.map((m) => (m.memoryId === id ? { ...m, inCollection: !m.inCollection } : m)));
}, [activeProfile]); 

  const toggleList = useCallback(async (id: string) => {
    if (!activeProfile) return;
    await apiFetch(`/memories/${id}/list`, {
      method: 'PATCH',
      body: { profileId: activeProfile.profileId },
    });
    setMemories((prev) => prev.map((m) => (m.memoryId === id ? { ...m, inList: !m.inList } : m)));
  }, [activeProfile]);

  const addMemory = useCallback(async (data: {
    title: string;
    description: string;
    mediaUrl: string;
    coverPhoto?: string;
    type: Memory['type'];
    category: Memory['category'];
    mood?: Memory['mood'];
    date: string;
    location?: string;
    durationSeconds?: number;
    featured?: boolean;
  }): Promise<Memory> => {
    if (!activeProfile) throw new Error('No active profile');

    const created = await apiFetch<any>('/memories', {
      method: 'POST',
      body: { ...data, profileId: activeProfile.profileId },
    });

    const memory: Memory = {
      memoryId: created.memoryId,
      profileId: activeProfile.profileId,
      title: created.title,
      description: created.description,
      mediaUrl: created.mediaUrl,
      coverPhoto: created.coverPhoto,
      type: created.type,
      category: created.category,
      mood: created.mood,
      date: created.date,
      location: created.location ?? undefined,
      hearts: created.hearts,
      featured: created.featured,
      liked: false,
      archived: false,
      inCollection: created.isInCollection,
      inList: false,
      uploadedBy: activeProfile.name,
    };

    setMemories((prev) => [memory, ...prev]);
    return memory;
  }, [activeProfile]);

 const updateMemory = useCallback(
  async (id: string, patch: Partial<Memory>) => {
    if (!activeProfile) return;

    await apiFetch(`/memories/${id}`, {
      method: 'PUT',
      body: {
        ...patch,
        profileId: activeProfile.profileId,
      },
    });

    setMemories((prev) =>
      prev.map((m) =>
        m.memoryId === id ? { ...m, ...patch } : m
      )
    );

    setActiveMemory((prev) =>
      prev && prev.memoryId === id
        ? { ...prev, ...patch }
        : prev
    );
  },
  [activeProfile],
);

  const deleteMemory = useCallback(
  async (id: string) => {
    await apiFetch(`/memories/${id}`, {
      method: 'DELETE',
      body: {
        profileId: activeProfile?.profileId,
      },
    });

    setMemories((prev) =>
      prev.filter((m) => m.memoryId !== id),
    );

    setActiveMemory((prev) =>
      prev?.memoryId === id ? null : prev,
    );
  },
  [activeProfile],
);

  const openMemory = useCallback((memory: Memory) => setActiveMemory(memory), []);
  const closeMemory = useCallback(() => setActiveMemory(null), []);

  const value = useMemo<MemoryContextValue>(() => {
    return {
      memories,
      getMemory: (id) => memories.find((m) => m.memoryId === id),
      memoriesByType: (type) => memories.filter((m) => m.type === type),
      memoriesByCategory: (category) => memories.filter((m) => m.category === category),
      featuredMemories: memories.filter((m) => m.featured),
      continueWatching: memories.filter(
        (m) => m.type === 'video' && m.progress !== undefined && m.progress > 0 && m.progress < 1,
      ),
      recentMemories: [...memories].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
      toggleArchive,
      toggleLike,
      toggleCollection,
      toggleList,
      addMemory,
      updateMemory,
      deleteMemory,
      activeMemory,
      openMemory,
      closeMemory,
    };
  }, [
    memories, activeMemory, toggleArchive, toggleLike, toggleCollection, toggleList,
    addMemory, updateMemory, deleteMemory, openMemory, closeMemory,
  ]);

  return (
    <MemoryContext.Provider value={value}>
      {children}
      <MemoryDetailModal />
    </MemoryContext.Provider>
  );
}