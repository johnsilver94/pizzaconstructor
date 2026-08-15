"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Clock,
  Copy,
  Check,
  Lock,
  Unlock,
  Trash2,
  Plus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";
import { Button } from "@pizzaconstructor/ui";
import { useGroupOrderWs } from "@/hooks/useGroupOrderWs";

const QUICK_MENU_ITEMS = [
  { name: "Margherita Artisan", size: "30cm (650gr)", price: 12.99, weightG: 650, allergens: ["Gluten", "Lactose"] },
  { name: "Pepperoni Passion", size: "30cm (650gr)", price: 15.49, weightG: 680, allergens: ["Gluten", "Lactose"] },
  { name: "Quattro Formaggi", size: "30cm (650gr)", price: 16.99, weightG: 700, allergens: ["Gluten", "Lactose"] },
  { name: "Vegan Garden Fiesta", size: "30cm (650gr)", price: 14.50, weightG: 620, allergens: ["Gluten"] },
  { name: "Mediterranean Prosciutto", size: "35cm (800gr)", price: 18.99, weightG: 800, allergens: ["Gluten", "Lactose"] },
];

export default function GroupOrderRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = (params?.slug as string) || "";

  const {
    room,
    currentParticipant,
    isConnected,
    isHost,
    joinRoom,
    addItem,
    removeItem,
    setStatus,
  } = useGroupOrderWs(roomId);

  const [joinName, setJoinName] = React.useState("");
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<string>("");
  const [isUrgent, setIsUrgent] = React.useState<boolean>(false);

  // Live countdown timer calculation
  React.useEffect(() => {
    if (!room?.deadlineIso) {
      setTimeLeft("No Deadline");
      return;
    }

    const interval = setInterval(() => {
      const diff = new Date(room.deadlineIso!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired / Locked");
        setIsUrgent(true);
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs < 10 ? "0" : ""}${secs}s remaining`);
        setIsUrgent(mins < 5);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.deadlineIso]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim()) return;
    joinRoom(joinName.trim());
  };

  const handleQuickAdd = (item: (typeof QUICK_MENU_ITEMS)[0]) => {
    addItem({
      name: item.name,
      sizeLabel: item.size,
      unitPrice: item.price,
      quantity: 1,
      weightG: item.weightG,
      allergens: item.allergens,
    });
    setIsQuickAddOpen(false);
  };

  const totalGroupPrice = room?.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) || 0;
  const totalGroupCount = room?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;

  // Group items by participant
  const itemsByParticipant = React.useMemo(() => {
    if (!room) return {};
    const map: Record<string, typeof room.items> = {};
    for (const item of room.items) {
      const list = map[item.participantName] ?? [];
      list.push(item);
      map[item.participantName] = list;
    }
    return map;
  }, [room]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
      {/* Join Room Modal Overlay (if not joined yet) */}
      {!currentParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1a252f] border border-[#34495e] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f39c12]/20 border border-[#f39c12] flex items-center justify-center text-3xl mx-auto">
              🍕
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#ecf0f1] font-display">
                Join Group Order
              </h2>
              <p className="text-xs text-[#95a5a6] mt-1">
                You were invited to &ldquo;{room?.title || "Team Pizza Feast"}&rdquo;. Enter your name to add items to the group cart.
              </p>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Your Display Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="E.g., Alex"
                  className="w-full px-4 py-3 rounded-xl bg-[#0f171e] border border-[#34495e] text-sm font-semibold text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-extrabold text-sm shadow-xl shadow-[#f39c12]/20"
              >
                <span>Enter Room & Start Ordering</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Top Banner: Title, Status, Timer & Shareable Link */}
      <div className="bg-[#1a252f] border border-[#34495e]/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#34495e]/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  room?.status === "open"
                    ? "bg-[#27ae60]/15 text-[#27ae60] border-[#27ae60]/30"
                    : "bg-[#e74c3c]/15 text-[#e74c3c] border-[#e74c3c]/30"
                }`}
              >
                {room?.status || "Connecting"}
              </span>

              <span className="text-xs text-[#7f8c8d]">
                Host: <strong className="text-[#ecf0f1]">{room?.hostName || "Loading..."}</strong>
              </span>

              {isHost && (
                <span className="px-2 py-0.5 rounded bg-[#f39c12] text-[#0f171e] text-[10px] font-black uppercase">
                  You are Host
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ecf0f1] font-display">
              {room?.title || "Collaborative Group Room"}
            </h1>
            {room?.deliveryAddress && (
              <p className="text-xs text-[#95a5a6]">
                📍 Delivery to: {room.deliveryAddress}
              </p>
            )}
          </div>

          {/* Countdown Timer & Copy Link */}
          <div className="flex flex-wrap items-center gap-3">
            {room?.deadlineIso && (
              <div
                className={`px-3.5 py-2 rounded-2xl border flex items-center space-x-2 text-xs font-bold ${
                  isUrgent
                    ? "bg-[#e74c3c]/15 border-[#e74c3c]/40 text-[#e74c3c] animate-pulse"
                    : "bg-[#0f171e] border-[#34495e] text-[#f39c12]"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{timeLeft}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={handleCopyLink}
              className="text-xs flex items-center space-x-1.5 border-[#34495e]"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#27ae60]" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#f39c12]" />
                  <span>Invite Friends</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Participants Roster Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#f39c12]" />
            <span className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">
              Participants ({room?.participants.length || 0}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {room?.participants.map((p) => (
                <span
                  key={p.id}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center space-x-1.5 ${
                    p.id === currentParticipant?.id
                      ? "bg-[#f39c12]/20 border-[#f39c12] text-[#f39c12]"
                      : "bg-[#0f171e] border-[#34495e] text-[#ecf0f1]"
                  }`}
                >
                  <span>{p.name}</span>
                  {p.isHost && (
                    <span className="text-[9px] px-1 rounded bg-[#f39c12] text-[#0f171e] font-extrabold">
                      Host
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-[#7f8c8d]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-[#27ae60] shadow-[0_0_6px_#27ae60]" : "bg-[#e74c3c]"
              }`}
            />
            <span>{isConnected ? "Real-time Live Sync" : "Reconnecting..."}</span>
          </div>
        </div>
      </div>

      {/* Main Order Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Collaborative Carts Stream */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#ecf0f1] font-display">
              Group Order Items ({totalGroupCount})
            </h2>

            {room?.status === "open" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsQuickAddOpen(true)}
                  className="text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  <span>Add Quick Pizza</span>
                </Button>
                <Link href="/constructor">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-[#f39c12]" />
                    <span>Custom Builder</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Add Modal */}
          {isQuickAddOpen && (
            <div className="bg-[#1a252f] border-2 border-[#f39c12] rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-[#34495e]/60 pb-2">
                <h3 className="text-sm font-bold text-[#ecf0f1]">
                  Select Pizza to Add to Your Share
                </h3>
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="text-xs text-[#7f8c8d] hover:text-[#ecf0f1]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_MENU_ITEMS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className="p-3 rounded-xl bg-[#0f171e] border border-[#34495e] hover:border-[#f39c12] text-left flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#ecf0f1] group-hover:text-[#f39c12]">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#7f8c8d]">{item.size}</div>
                    </div>
                    <span className="text-xs font-extrabold text-[#f39c12] font-mono">
                      ${item.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Items by Participant */}
          {Object.keys(itemsByParticipant).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-[#1a252f]/40 border border-[#34495e]/40 p-8 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#7f8c8d]" />
              <h3 className="text-base font-bold text-[#ecf0f1]">
                No items added to the group order yet
              </h3>
              <p className="text-xs text-[#95a5a6] max-w-sm">
                Click &ldquo;Add Quick Pizza&rdquo; or create a custom recipe in the Pizza Constructor to add items under your name.
              </p>
            </div>
          ) : (
            Object.entries(itemsByParticipant).map(([name, participantItems]) => {
              const subtotal = participantItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

              return (
                <div
                  key={name}
                  className="bg-[#1a252f] border border-[#34495e]/70 rounded-3xl p-5 shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#34495e]/50 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-[#f39c12]/20 border border-[#f39c12]/50 flex items-center justify-center text-xs font-black text-[#f39c12]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-[#ecf0f1] font-display">
                        {name}&rsquo;s Selection
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-[#f39c12] font-mono">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="divide-y divide-[#34495e]/40">
                    {participantItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#ecf0f1]">
                            {item.quantity}x {item.name}
                          </div>
                          <div className="text-[10px] text-[#7f8c8d]">
                            {item.sizeLabel} • {item.weightG}g
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="font-mono font-bold text-[#f39c12]">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>

                          {(name === currentParticipant?.name || isHost) && room?.status === "open" && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-[#7f8c8d] hover:text-[#e74c3c] transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Host Moderation & Summary Checkout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1a252f] border border-[#34495e]/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-[#ecf0f1] font-display border-b border-[#34495e]/60 pb-3">
              Group Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#95a5a6]">
                <span>Total Items</span>
                <span className="font-mono text-[#ecf0f1]">{totalGroupCount} pizzas/items</span>
              </div>
              <div className="flex items-center justify-between text-[#95a5a6]">
                <span>Total Participants</span>
                <span className="font-mono text-[#ecf0f1]">{room?.participants.length || 0}</span>
              </div>
              <div className="flex items-center justify-between text-[#95a5a6]">
                <span>Delivery</span>
                <span className="text-[#27ae60] font-bold">FREE (Group Order)</span>
              </div>

              <div className="pt-3 border-t border-[#34495e]/60 flex items-center justify-between font-bold text-sm">
                <span className="text-[#ecf0f1]">Aggregated Total</span>
                <span className="text-2xl font-extrabold text-[#f39c12] font-display">
                  ${totalGroupPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Host Controls */}
            {isHost && (
              <div className="pt-3 border-t border-[#34495e]/60 space-y-2.5">
                <span className="text-[10px] uppercase font-extrabold text-[#f39c12] tracking-wider block">
                  Host Moderation Panel
                </span>

                {room?.status === "open" ? (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setStatus("locked")}
                    className="w-full flex items-center justify-center text-xs font-bold border border-[#f39c12]/40"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-[#f39c12]" />
                    <span>Lock Session (Stop Edits)</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setStatus("open")}
                    className="w-full flex items-center justify-center text-xs font-bold text-[#27ae60] border-[#27ae60]/40"
                  >
                    <Unlock className="w-3.5 h-3.5 mr-1.5 text-[#27ae60]" />
                    <span>Re-Open Session</span>
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  disabled={totalGroupCount === 0}
                  onClick={() => {
                    setStatus("submitted");
                    router.push("/cart");
                  }}
                  className="w-full flex items-center justify-center font-extrabold text-sm shadow-xl shadow-[#f39c12]/20"
                >
                  <span>Place Final Group Checkout (${totalGroupPrice.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}

            {!isHost && (
              <div className="p-3 rounded-xl bg-[#0f171e] border border-[#34495e] text-center">
                <span className="text-xs text-[#95a5a6]">
                  {room?.status === "open"
                    ? "Add your pizzas! The host will checkout once the timer expires."
                    : "Room is locked. Waiting for host to finalize order."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
