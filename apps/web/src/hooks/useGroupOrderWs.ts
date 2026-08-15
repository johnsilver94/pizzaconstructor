"use client";

import * as React from "react";
import type {
  GroupOrderRoom,
  GroupParticipant,
  GroupOrderItem,
  GroupOrderStatus,
  GroupWsMessage,
} from "@pizzaconstructor/shared";

interface UseGroupOrderWsReturn {
  room: GroupOrderRoom | null;
  currentParticipant: GroupParticipant | null;
  isConnected: boolean;
  isHost: boolean;
  joinRoom: (name: string, avatar?: string) => void;
  addItem: (item: Omit<GroupOrderItem, "id" | "createdAt" | "participantId" | "participantName">) => void;
  removeItem: (itemId: string) => void;
  setStatus: (status: GroupOrderStatus) => void;
  leaveRoom: () => void;
}

export function useGroupOrderWs(roomId: string): UseGroupOrderWsReturn {
  const [room, setRoom] = React.useState<GroupOrderRoom | null>(null);
  const [currentParticipant, setCurrentParticipant] = React.useState<GroupParticipant | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const socketRef = React.useRef<WebSocket | null>(null);

  // Check stored hostToken or participantId from localStorage
  const getStoredHostToken = React.useCallback(() => {
    if (typeof window === "undefined") return undefined;
    return localStorage.getItem(`host-token-${roomId}`) || undefined;
  }, [roomId]);

  const getStoredParticipant = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(`participant-${roomId}`);
    if (raw) {
      try {
        return JSON.parse(raw) as GroupParticipant;
      } catch {
        return null;
      }
    }
    return null;
  }, [roomId]);

  React.useEffect(() => {
    const savedP = getStoredParticipant();
    if (savedP) {
      setCurrentParticipant(savedP);
    }
  }, [getStoredParticipant]);

  React.useEffect(() => {
    if (!roomId) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // API port 3001
    const wsHost = process.env.NEXT_PUBLIC_API_WS_URL || `${wsProtocol}//${window.location.hostname}:3001`;
    const wsUrl = `${wsHost}/ws/group-orders/${roomId}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      const savedP = getStoredParticipant();
      if (savedP) {
        // Auto rejoin
        ws.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            roomId,
            payload: { participantName: savedP.name, avatar: savedP.avatar },
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as GroupWsMessage;
        if (msg.type === "ROOM_SYNC") {
          const payload = msg.payload as {
            room?: GroupOrderRoom;
            yourParticipant?: GroupParticipant;
            joinedParticipant?: GroupParticipant;
          };
          if (payload?.room) {
            setRoom(payload.room);
          }
          if (payload?.yourParticipant) {
            setCurrentParticipant(payload.yourParticipant);
            localStorage.setItem(`participant-${roomId}`, JSON.stringify(payload.yourParticipant));
          }
        }
      } catch (err) {
        console.warn("WebSocket parse error:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomId, getStoredParticipant]);

  const isHost = React.useMemo(() => {
    if (!room || !currentParticipant) return false;
    const hostToken = getStoredHostToken();
    return currentParticipant.isHost || (!!hostToken && hostToken === room.hostToken);
  }, [room, currentParticipant, getStoredHostToken]);

  const joinRoom = (name: string, avatar?: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(
      JSON.stringify({
        type: "JOIN_ROOM",
        roomId,
        payload: { participantName: name, avatar },
      })
    );
  };

  const addItem = (
    item: Omit<GroupOrderItem, "id" | "createdAt" | "participantId" | "participantName">
  ) => {
    if (!socketRef.current || !currentParticipant) return;
    socketRef.current.send(
      JSON.stringify({
        type: "ADD_ITEM",
        roomId,
        payload: {
          ...item,
          participantId: currentParticipant.id,
          participantName: currentParticipant.name,
        },
      })
    );
  };

  const removeItem = (itemId: string) => {
    if (!socketRef.current) return;
    const hostToken = getStoredHostToken();
    socketRef.current.send(
      JSON.stringify({
        type: "REMOVE_ITEM",
        roomId,
        payload: {
          itemId,
          participantId: currentParticipant?.id,
          hostToken,
        },
      })
    );
  };

  const setStatus = (status: GroupOrderStatus) => {
    if (!socketRef.current) return;
    const hostToken = getStoredHostToken();
    socketRef.current.send(
      JSON.stringify({
        type: "SET_STATUS",
        roomId,
        payload: {
          status,
          hostToken,
        },
      })
    );
  };

  const leaveRoom = () => {
    if (!socketRef.current || !currentParticipant) return;
    socketRef.current.send(
      JSON.stringify({
        type: "LEAVE_ROOM",
        roomId,
        payload: { participantId: currentParticipant.id },
      })
    );
    localStorage.removeItem(`participant-${roomId}`);
    setCurrentParticipant(null);
  };

  return {
    room,
    currentParticipant,
    isConnected,
    isHost,
    joinRoom,
    addItem,
    removeItem,
    setStatus,
    leaveRoom,
  };
}
