"use client";

import * as React from "react";
import { Disc, Droplets, Sparkles, Drumstick, Salad, CheckCircle2 } from "lucide-react";

export interface WizardStep {
  step: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WIZARD_STEPS: WizardStep[] = [
  { step: 1, label: "Size & Crust", shortLabel: "Crust", icon: Disc },
  { step: 2, label: "Signature Sauces", shortLabel: "Sauces", icon: Droplets },
  { step: 3, label: "Artisan Cheeses", shortLabel: "Cheeses", icon: Sparkles },
  { step: 4, label: "Meats & Proteins", shortLabel: "Meats", icon: Drumstick },
  { step: 5, label: "Vegetables & Extras", shortLabel: "Veggies", icon: Salad },
  { step: 6, label: "Recipe Review", shortLabel: "Review", icon: CheckCircle2 },
];

interface StepWizardNavProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const StepWizardNav: React.FC<StepWizardNavProps> = ({
  currentStep,
  onSelectStep,
}) => {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="w-full bg-[#1a252f] h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-[#f39c12] to-[#e67e22] h-full transition-all duration-500"
          style={{ width: `${(currentStep / WIZARD_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1">
        {WIZARD_STEPS.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.step;
          const isCompleted = currentStep > s.step;

          return (
            <button
              key={s.step}
              onClick={() => onSelectStep(s.step)}
              className={`flex-1 min-w-[70px] sm:min-w-[90px] py-2 sm:py-2.5 px-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                isActive
                  ? "bg-[#f39c12]/15 border-[#f39c12] text-[#f39c12] shadow-sm shadow-[#f39c12]/20 font-bold"
                  : isCompleted
                  ? "bg-[#1a252f] border-[#27ae60]/50 text-[#27ae60] hover:border-[#f39c12]/40"
                  : "bg-[#1a252f]/60 border-[#34495e]/60 text-[#7f8c8d] hover:text-[#ecf0f1] hover:bg-[#1a252f]"
              }`}
            >
              <div className="flex items-center space-x-1 mb-1">
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-extrabold uppercase">
                  {s.step}
                </span>
              </div>
              <span className="text-xs truncate max-w-full font-medium">
                {s.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
