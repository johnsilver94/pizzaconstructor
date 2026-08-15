import { Elysia, t } from "elysia";
import { groupOrderManager } from "../services/groupOrderManager";

export const groupOrderRoutes = new Elysia({ prefix: "/api/group-orders" })
  .get(
    "/",
    () => {
      const rooms = groupOrderManager.getAllRooms().map((r) => ({
        id: r.id,
        title: r.title,
        hostName: r.hostName,
        status: r.status,
        deadlineIso: r.deadlineIso,
        participantsCount: r.participants.length,
        itemsCount: r.items.length,
        totalPrice: r.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
        createdAt: r.createdAt,
      }));
      return { success: true, count: rooms.length, rooms };
    },
    {
      detail: {
        tags: ["Group Orders"],
        summary: "List all active group order sessions",
      },
    }
  )
  .post(
    "/",
    ({ body, set }) => {
      try {
        const { room, hostToken } = groupOrderManager.createRoom({
          title: body.title,
          hostName: body.hostName,
          deadlineIso: body.deadlineIso,
          deliveryAddress: body.deliveryAddress,
          maxParticipants: body.maxParticipants,
        });

        set.status = 201;
        return {
          success: true,
          roomId: room.id,
          hostToken,
          room,
        };
      } catch (err: unknown) {
        set.status = 400;
        const msg = err instanceof Error ? err.message : "Failed to create group order";
        return { success: false, error: msg };
      }
    },
    {
      body: t.Object({
        title: t.String({ minLength: 2, maxLength: 80 }),
        hostName: t.String({ minLength: 2, maxLength: 50 }),
        deadlineIso: t.Optional(t.String()),
        deliveryAddress: t.Optional(t.String()),
        maxParticipants: t.Optional(t.Number({ minimum: 2, maximum: 100 })),
      }),
      detail: {
        tags: ["Group Orders"],
        summary: "Create a new collaborative group order session",
      },
    }
  )
  .get(
    "/:id",
    ({ params, set }) => {
      const room = groupOrderManager.getRoom(params.id);
      if (!room) {
        set.status = 404;
        return { success: false, error: "Group order room not found" };
      }
      return { success: true, room };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Group Orders"],
        summary: "Get full real-time group order room details",
      },
    }
  );
