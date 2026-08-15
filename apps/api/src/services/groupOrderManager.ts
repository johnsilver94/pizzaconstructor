import type {
  GroupOrderRoom,
  GroupParticipant,
  GroupOrderItem,
  GroupOrderStatus,
} from "@pizzaconstructor/shared";

class GroupOrderManager {
  private rooms: Map<string, GroupOrderRoom> = new Map();

  constructor() {
    // Seed an initial demo group room for testing
    this.createRoom({
      title: "Friday Pizza Party 🍕",
      hostName: "John (Host)",
      deadlineIso: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // 2 hours from now
      deliveryAddress: "Tech Hub, 5th Floor Lounge",
    });
  }

  public createRoom(options: {
    title: string;
    hostName: string;
    deadlineIso?: string;
    deliveryAddress?: string;
    maxParticipants?: number;
    customSlug?: string;
  }): { room: GroupOrderRoom; hostToken: string } {
    const slugBase = options.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 20) || "order";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const roomId = options.customSlug || `${slugBase}-${randomSuffix}`;

    const hostId = `host-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const hostToken = `token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

    const hostParticipant: GroupParticipant = {
      id: hostId,
      name: options.hostName,
      isHost: true,
      joinedAt: new Date().toISOString(),
    };

    const room: GroupOrderRoom = {
      id: roomId,
      title: options.title,
      hostId,
      hostName: options.hostName,
      hostToken,
      status: "open",
      deadlineIso: options.deadlineIso,
      deliveryAddress: options.deliveryAddress,
      maxParticipants: options.maxParticipants || 30,
      participants: [hostParticipant],
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.rooms.set(roomId, room);
    return { room, hostToken };
  }

  public getRoom(roomId: string): GroupOrderRoom | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // Check if expired and automatically lock
    if (room.status === "open" && room.deadlineIso) {
      const deadline = new Date(room.deadlineIso).getTime();
      if (Date.now() > deadline) {
        room.status = "locked";
        room.updatedAt = new Date().toISOString();
      }
    }

    return room;
  }

  public joinRoom(
    roomId: string,
    participantName: string,
    avatar?: string
  ): { room: GroupOrderRoom; participant: GroupParticipant } | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    // Check if participant already exists by name or create new
    const existing = room.participants.find(
      (p) => p.name.toLowerCase() === participantName.trim().toLowerCase()
    );
    if (existing) {
      return { room, participant: existing };
    }

    if (room.maxParticipants && room.participants.length >= room.maxParticipants) {
      throw new Error("Room has reached maximum participant capacity");
    }

    const participant: GroupParticipant = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: participantName.trim(),
      avatar,
      isHost: false,
      joinedAt: new Date().toISOString(),
    };

    room.participants.push(participant);
    room.updatedAt = new Date().toISOString();
    return { room, participant };
  }

  public leaveRoom(roomId: string, participantId: string): GroupOrderRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    room.participants = room.participants.filter((p) => p.id !== participantId);
    room.items = room.items.filter((i) => i.participantId !== participantId);
    room.updatedAt = new Date().toISOString();
    return room;
  }

  public addItem(
    roomId: string,
    itemInput: Omit<GroupOrderItem, "id" | "createdAt">
  ): { room: GroupOrderRoom; item: GroupOrderItem } | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    if (room.status !== "open") {
      throw new Error(`Cannot add items: Room is ${room.status}`);
    }

    const item: GroupOrderItem = {
      ...itemInput,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    room.items.push(item);
    room.updatedAt = new Date().toISOString();
    return { room, item };
  }

  public removeItem(
    roomId: string,
    itemId: string,
    requesterParticipantId?: string,
    hostToken?: string
  ): GroupOrderRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const itemIndex = room.items.findIndex((i) => i.id === itemId);
    const item = room.items[itemIndex];
    if (!item) return room;

    const isOwner = requesterParticipantId && item.participantId === requesterParticipantId;
    const isHost = hostToken && room.hostToken === hostToken;

    if (!isOwner && !isHost) {
      throw new Error("Unauthorized to remove this item");
    }

    room.items.splice(itemIndex, 1);
    room.updatedAt = new Date().toISOString();
    return room;
  }

  public setStatus(
    roomId: string,
    status: GroupOrderStatus,
    hostToken?: string
  ): GroupOrderRoom | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    if (hostToken && room.hostToken !== hostToken) {
      throw new Error("Invalid host token");
    }

    room.status = status;
    room.updatedAt = new Date().toISOString();
    return room;
  }

  public getAllRooms(): GroupOrderRoom[] {
    return Array.from(this.rooms.values());
  }
}

export const groupOrderManager = new GroupOrderManager();
