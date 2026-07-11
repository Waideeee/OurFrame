
import type { Memory } from '@/types';

export function getMemoryPreview(memory: Memory) {
    if (memory.type === 'video') {
        return memory.coverPhoto ?? memory.mediaUrl;
    }

    return memory.mediaUrl;
}