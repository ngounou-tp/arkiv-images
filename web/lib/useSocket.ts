'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL, ObjectItem } from './api';

export function useSocket({
  onObjectCreated,
  onObjectDeleted,
}: {
  onObjectCreated?: (obj: ObjectItem) => void;
  onObjectDeleted?: (id: string) => void;
}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('object:created', (obj: ObjectItem) => {
      onObjectCreated?.(obj);
    });

    socket.on('object:deleted', ({ id }: { id: string }) => {
      onObjectDeleted?.(id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
