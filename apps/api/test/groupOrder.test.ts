import { describe, expect, it } from "bun:test";
import { groupOrderManager } from "../src/services/groupOrderManager";
import { app } from "../src/index";

describe("Group Order Management & REST API", () => {
  it("creates a new collaborative group room with host participant", () => {
    const { room, hostToken } = groupOrderManager.createRoom({
      title: "Team Pizza Lunch",
      hostName: "Alice Host",
      deliveryAddress: "Building A, Room 302",
      maxParticipants: 10,
    });

    expect(room.id).toBeDefined();
    expect(room.title).toBe("Team Pizza Lunch");
    expect(room.status).toBe("open");
    expect(room.participants.length).toBe(1);
    expect(room.participants[0].name).toBe("Alice Host");
    expect(room.participants[0].isHost).toBe(true);
    expect(hostToken).toBeDefined();
  });

  it("allows other participants to join the group room", () => {
    const { room } = groupOrderManager.createRoom({
      title: "Design Team Dinner",
      hostName: "Bob Host",
    });

    const joinRes = groupOrderManager.joinRoom(room.id, "Charlie Guest");
    expect(joinRes).not.toBeNull();
    expect(joinRes?.participant.name).toBe("Charlie Guest");
    expect(joinRes?.participant.isHost).toBe(false);

    const updatedRoom = groupOrderManager.getRoom(room.id);
    expect(updatedRoom?.participants.length).toBe(2);
  });

  it("allows participants to add items to the group cart", () => {
    const { room } = groupOrderManager.createRoom({
      title: "Dev Team Gathering",
      hostName: "Dave",
    });

    const joinRes = groupOrderManager.joinRoom(room.id, "Eve");
    const eveId = joinRes?.participant.id || "";

    const addRes = groupOrderManager.addItem(room.id, {
      participantId: eveId,
      participantName: "Eve",
      name: "Pepperoni Passion",
      sizeLabel: "30cm",
      unitPrice: 16.5,
      quantity: 1,
      weightG: 650,
      allergens: ["Gluten"],
    });

    expect(addRes).not.toBeNull();
    expect(addRes?.room.items.length).toBe(1);
    expect(addRes?.item.name).toBe("Pepperoni Passion");
  });

  it("allows host to set room status to locked", () => {
    const { room, hostToken } = groupOrderManager.createRoom({
      title: "Sprint Review Feast",
      hostName: "Frank",
    });

    const lockedRoom = groupOrderManager.setStatus(room.id, "locked", hostToken);
    expect(lockedRoom?.status).toBe("locked");

    // Adding items when room is locked throws error
    expect(() => {
      groupOrderManager.addItem(room.id, {
        participantId: "any",
        participantName: "Guest",
        name: "Test",
        sizeLabel: "30cm",
        unitPrice: 10,
        quantity: 1,
        weightG: 500,
        allergens: [],
      });
    }).toThrow();
  });

  it("handles GET /api/group-orders via HTTP", async () => {
    const response = await app.handle(new Request("http://localhost/api/group-orders"));
    expect(response.status).toBe(200);

    const body = (await response.json()) as { success: boolean; rooms: unknown[] };
    expect(body.success).toBe(true);
    expect(Array.isArray(body.rooms)).toBe(true);
  });
});
