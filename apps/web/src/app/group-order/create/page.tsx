"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@pizzaconstructor/ui";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CreateGroupOrderPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [hostName, setHostName] = React.useState("");
  const [durationMinutes, setDurationMinutes] = React.useState<number>(60); // default 1 hr
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [maxParticipants, setMaxParticipants] = React.useState<number>(20);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hostName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const deadlineIso =
      durationMinutes > 0
        ? new Date(Date.now() + durationMinutes * 60 * 1000).toISOString()
        : undefined;

    try {
      const res = await fetch(`${API_BASE}/api/group-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          hostName: hostName.trim(),
          deadlineIso,
          deliveryAddress: deliveryAddress.trim() || undefined,
          maxParticipants,
        }),
      });

      const data = await res.json();
      if (data.success && data.roomId) {
        // Save host token and host participant
        if (data.hostToken) {
          localStorage.setItem(`host-token-${data.roomId}`, data.hostToken);
        }
        if (data.room?.participants?.[0]) {
          localStorage.setItem(
            `participant-${data.roomId}`,
            JSON.stringify(data.room.participants[0])
          );
        }

        router.push(`/group-order/${data.roomId}`);
      } else {
        setErrorMsg(data.error || "Failed to create group order room");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error creating room";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3498db]/15 border border-[#3498db]/30 text-[#3498db] text-xs font-bold uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Collaborative Session</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ecf0f1] font-display tracking-tight">
          Create a <span className="text-[#f39c12]">Group Order</span>
        </h1>
        <p className="text-sm text-[#95a5a6] max-w-lg mx-auto">
          Start a shared order room, share the invitation link with colleagues or friends, aggregate carts, and place one combined order.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a252f] border border-[#34495e]/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#e74c3c]/15 border border-[#e74c3c]/30 text-xs text-[#e74c3c] font-medium">
            {errorMsg}
          </div>
        )}

        {/* Room Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider flex items-center space-x-1">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>Group Order Name *</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Friday Office Pizza Feast 🍕"
            className="w-full px-4 py-3 rounded-xl bg-[#0f171e] border border-[#34495e] text-sm font-semibold text-[#ecf0f1] focus:outline-none focus:border-[#f39c12] transition-colors"
          />
        </div>

        {/* Host Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>Your Name (Host) *</span>
          </label>
          <input
            type="text"
            required
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="John Silver"
            className="w-full px-4 py-3 rounded-xl bg-[#0f171e] border border-[#34495e] text-sm font-semibold text-[#ecf0f1] focus:outline-none focus:border-[#f39c12] transition-colors"
          />
        </div>

        {/* Deadline Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>Order Deadline Duration</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { mins: 30, label: "30 Mins" },
              { mins: 60, label: "1 Hour" },
              { mins: 120, label: "2 Hours" },
              { mins: 0, label: "No Timer" },
            ].map((opt) => {
              const isSelected = durationMinutes === opt.mins;
              return (
                <button
                  key={opt.mins}
                  type="button"
                  onClick={() => setDurationMinutes(opt.mins)}
                  className={`py-2.5 px-2 rounded-xl border text-center text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#f39c12]/20 border-[#f39c12] text-[#f39c12] shadow-sm"
                      : "bg-[#0f171e] border-[#34495e] text-[#95a5a6] hover:text-[#ecf0f1]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Delivery Address & Max Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Delivery Destination (Optional)</span>
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Building A, 5th Floor Lounge"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-medium text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-[#f39c12]" />
              <span>Max Participants</span>
            </label>
            <input
              type="number"
              min={2}
              max={100}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 20)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0f171e] border border-[#34495e] text-xs font-medium text-[#ecf0f1] focus:outline-none focus:border-[#f39c12]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center font-extrabold text-sm shadow-xl shadow-[#f39c12]/20"
          >
            {isSubmitting ? (
              <span>Initializing Room...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2 text-[#0f171e]" />
                <span>Launch Group Order Room</span>
                <ArrowRight className="w-4 h-4 ml-2 text-[#0f171e]" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center space-x-2 text-[11px] text-[#7f8c8d]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#27ae60]" />
            <span>Host credentials will be saved securely to this browser</span>
          </div>
        </div>
      </form>
    </main>
  );
}
