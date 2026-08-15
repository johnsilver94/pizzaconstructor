import { Elysia, t } from "elysia";
import { groupOrderManager } from "../services/groupOrderManager";
import type {
  GroupWsMessage,
  GroupOrderItem,
  GroupOrderStatus,
} from "@pizzaconstructor/shared";

export const groupOrderWsRoutes = new Elysia().ws("/ws/group-orders/:roomId", {
  params: t.Object({
    roomId: t.String(),
  }),
  open(ws) {
    const roomId = ws.data.params.roomId;
    const topic = `group-room:${roomId}`;
    ws.subscribe(topic);

    const room = groupOrderManager.getRoom(roomId);
    if (room) {
      ws.send({
        type: "ROOM_SYNC",
        roomId,
        payload: { room },
      });
    } else {
      ws.send({
        type: "ERROR",
        roomId,
        payload: { message: "Room not found" },
      });
    }
  },
  message(ws, message: unknown) {
    const roomId = ws.data.params.roomId;
    const topic = `group-room:${roomId}`;

    try {
      const msg = (typeof message === "string" ? JSON.parse(message) : message) as GroupWsMessage;

      switch (msg.type) {
        case "JOIN_ROOM": {
          const { participantName, avatar } = (msg.payload || {}) as {
            participantName: string;
            avatar?: string;
          };
          if (!participantName) {
            ws.send({ type: "ERROR", payload: { message: "Participant name required" } });
            return;
          }
          const res = groupOrderManager.joinRoom(roomId, participantName, avatar);
          if (res) {
            // Broadcast full updated room state to all connected room peers
            ws.publish(topic, {
              type: "ROOM_SYNC",
              roomId,
              payload: { room: res.room, joinedParticipant: res.participant },
            });
            ws.send({
              type: "ROOM_SYNC",
              roomId,
              payload: { room: res.room, yourParticipant: res.participant },
            });
          }
          break;
        }

        case "ADD_ITEM": {
          const itemInput = (msg.payload || {}) as Omit<GroupOrderItem, "id" | "createdAt">;
          const res = groupOrderManager.addItem(roomId, itemInput);
          if (res) {
            ws.publish(topic, {
              type: "ROOM_SYNC",
              roomId,
              payload: { room: res.room, addedItem: res.item },
            });
            ws.send({
              type: "ROOM_SYNC",
              roomId,
              payload: { room: res.room, addedItem: res.item },
            });
          }
          break;
        }

        case "REMOVE_ITEM": {
          const { itemId, participantId, hostToken } = (msg.payload || {}) as {
            itemId: string;
            participantId?: string;
            hostToken?: string;
          };
          const updatedRoom = groupOrderManager.removeItem(roomId, itemId, participantId, hostToken);
          if (updatedRoom) {
            ws.publish(topic, {
              type: "ROOM_SYNC",
              roomId,
              payload: { room: updatedRoom, removedItemId: itemId },
            });
            ws.send({
              type: "ROOM_SYNC",
              roomId,
              payload: { room: updatedRoom, removedItemId: itemId },
            });
          }
          break;
        }

        case "SET_STATUS": {
          const { status, hostToken } = (msg.payload || {}) as {
            status: GroupOrderStatus;
            hostToken?: string;
          };
          const updatedRoom = groupOrderManager.setStatus(roomId, status, hostToken);
          if (updatedRoom) {
            ws.publish(topic, {
              type: "ROOM_SYNC",
              roomId,
              payload: { room: updatedRoom },
            });
            ws.send({
              type: "ROOM_SYNC",
              roomId,
              payload: { room: updatedRoom },
            });
          }
          break;
        }

        case "LEAVE_ROOM": {
          const { participantId } = (msg.payload || {}) as { participantId: string };
          const updatedRoom = groupOrderManager.leaveRoom(roomId, participantId);
          if (updatedRoom) {
            ws.publish(topic, {
              type: "ROOM_SYNC",
              roomId,
              payload: { room: updatedRoom },
            });
          }
          break;
        }

        case "ROOM_SYNC":
        default: {
          const room = groupOrderManager.getRoom(roomId);
          if (room) {
            ws.send({
              type: "ROOM_SYNC",
              roomId,
              payload: { room },
            });
          }
          break;
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      ws.send({
        type: "ERROR",
        roomId,
        payload: { message: errMsg },
      });
    }
  },
  close(ws) {
    const roomId = ws.data.params.roomId;
    ws.unsubscribe(`group-room:${roomId}`);
  },
});
