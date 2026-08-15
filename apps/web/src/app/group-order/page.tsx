"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Button } from "@pizzaconstructor/ui";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface GroupRoomSummary {
  id: string;
  title: string;
  hostName: string;
  status: string;
  deadlineIso?: string;
  participantsCount: number;
  itemsCount: number;
  totalPrice: number;
  createdAt: string;
}

export default function GroupOrdersDirectoryPage() {
  const [rooms, setRooms] = React.useState<GroupRoomSummary[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${API_BASE}/api/group-orders`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rooms) {
          setRooms(data.rooms);
        }
      })
      .catch((err) => {
        console.warn("Could not load group order rooms:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1a252f] via-[#2c3e50] to-[#1a252f] border border-[#34495e]/80 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f39c12]/20 border border-[#f39c12]/30 text-[#f39c12] text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Ordering Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#ecf0f1] font-display tracking-tight leading-tight">
            Order Pizza <span className="text-[#f39c12]">Together</span> with Your Team
          </h1>

          <p className="text-sm sm:text-base text-[#bdc3c7] leading-relaxed">
            No more messy group chats or calculating who owes what. Create a collaborative room, share the link, watch the cart update live, and place one combined order.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/group-order/create">
              <Button variant="primary" size="lg" className="font-extrabold shadow-xl shadow-[#f39c12]/20 text-sm">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Create Group Room</span>
              </Button>
            </Link>
            <Link href="/constructor">
              <Button variant="outline" size="lg" className="text-xs">
                <Sparkles className="w-4 h-4 mr-1.5 text-[#f39c12]" />
                <span>Build Pizza First</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Public Rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#34495e]/60 pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#ecf0f1] font-display">
              Active Group Order Sessions
            </h2>
            <p className="text-xs text-[#95a5a6]">
              Join an open room or start your own custom session.
            </p>
          </div>
          <Link href="/group-order/create">
            <Button variant="outline" size="sm" className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>New Room</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-[#95a5a6]">
            Loading active sessions...
          </div>
        ) : rooms.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-[#1a252f]/40 border border-[#34495e]/40 p-8 space-y-3">
            <Layers className="w-12 h-12 text-[#7f8c8d] mx-auto" />
            <h3 className="text-base font-bold text-[#ecf0f1]">No active public rooms</h3>
            <p className="text-xs text-[#95a5a6]">Be the first to start a group pizza party today!</p>
            <Link href="/group-order/create">
              <Button variant="primary" size="sm" className="font-bold text-xs">
                Launch Room
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-[#1a252f] border border-[#34495e]/70 hover:border-[#f39c12]/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#27ae60]/15 text-[#27ae60] border border-[#27ae60]/30">
                      {room.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#f39c12]">
                      ${room.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#ecf0f1] font-display mt-2 group-hover:text-[#f39c12] transition-colors">
                    {room.title}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs text-[#7f8c8d] mt-1.5">
                    <span>Host: <strong className="text-[#ecf0f1]">{room.hostName}</strong></span>
                    <span>•</span>
                    <span>{room.participantsCount} participants</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#34495e]/50 flex items-center justify-between">
                  <div className="text-xs text-[#95a5a6]">
                    {room.itemsCount} items in cart
                  </div>

                  <Link href={`/group-order/${room.id}`}>
                    <Button variant="primary" size="sm" className="text-xs font-bold">
                      <span>Join Room</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works 3-Step Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-[#1a252f]/60 border border-[#34495e]/60 rounded-3xl p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#f39c12]/15 border border-[#f39c12]/30 flex items-center justify-center text-[#f39c12] mx-auto mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#ecf0f1]">1. Set Deadline Timer</h3>
          <p className="text-xs text-[#95a5a6] leading-relaxed">
            Choose how long your room stays open. Sessions automatically lock when the countdown expires.
          </p>
        </div>

        <div className="bg-[#1a252f]/60 border border-[#34495e]/60 rounded-3xl p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#3498db]/15 border border-[#3498db]/30 flex items-center justify-center text-[#3498db] mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#ecf0f1]">2. Invite with 1-Click</h3>
          <p className="text-xs text-[#95a5a6] leading-relaxed">
            Copy the invite link and drop it into Slack, Teams, or WhatsApp. Everyone adds their own items.
          </p>
        </div>

        <div className="bg-[#1a252f]/60 border border-[#34495e]/60 rounded-3xl p-6 space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#27ae60]/15 border border-[#27ae60]/30 flex items-center justify-center text-[#27ae60] mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#ecf0f1]">3. Unified Kitchen Delivery</h3>
          <p className="text-xs text-[#95a5a6] leading-relaxed">
            The host places one unified order. All pizzas arrive freshly baked together with free group delivery.
          </p>
        </div>
      </div>
    </main>
  );
}
