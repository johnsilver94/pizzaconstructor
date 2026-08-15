import * as React from "react";
import type {
  PizzaSizeId,
  DoughTypeId,
  SelectedTopping,
  PortionPlacement,
} from "@pizzaconstructor/shared";

export interface PizzaCanvasProps {
  size?: PizzaSizeId;
  dough?: DoughTypeId;
  sauces?: SelectedTopping[];
  toppings?: SelectedTopping[];
  showSlices?: boolean;
  sliceCount?: 6 | 8;
  className?: string;
  onSliceClick?: (sliceIndex: number) => void;
}

// Preset scatter coordinates for 24 distinct positions across the pizza surface
const TOPPING_POSITIONS: { x: number; y: number; rot: number; scale: number }[] = [
  { x: 250, y: 140, rot: 15, scale: 1.0 },
  { x: 320, y: 170, rot: -25, scale: 0.95 },
  { x: 360, y: 250, rot: 45, scale: 1.05 },
  { x: 330, y: 330, rot: -10, scale: 0.9 },
  { x: 250, y: 360, rot: 30, scale: 1.0 },
  { x: 170, y: 330, rot: -40, scale: 0.95 },
  { x: 140, y: 250, rot: 20, scale: 1.05 },
  { x: 180, y: 170, rot: -15, scale: 0.9 },
  { x: 250, y: 200, rot: 50, scale: 1.0 },
  { x: 290, y: 240, rot: -35, scale: 0.95 },
  { x: 270, y: 300, rot: 10, scale: 1.0 },
  { x: 210, y: 270, rot: -20, scale: 0.9 },
  { x: 210, y: 210, rot: 35, scale: 1.05 },
  { x: 250, y: 250, rot: 0, scale: 1.1 },
  { x: 280, y: 140, rot: -60, scale: 0.9 },
  { x: 350, y: 210, rot: 75, scale: 0.95 },
  { x: 290, y: 360, rot: -45, scale: 1.0 },
  { x: 210, y: 360, rot: 25, scale: 0.95 },
  { x: 150, y: 300, rot: -80, scale: 1.0 },
  { x: 150, y: 190, rot: 60, scale: 0.9 },
  { x: 220, y: 150, rot: -10, scale: 1.0 },
  { x: 340, y: 290, rot: 30, scale: 0.95 },
  { x: 170, y: 250, rot: -50, scale: 1.0 },
  { x: 250, y: 310, rot: 15, scale: 0.9 },
];

function filterByPortion(
  positions: typeof TOPPING_POSITIONS,
  portion: PortionPlacement
): typeof TOPPING_POSITIONS {
  if (portion === "left") {
    return positions.filter((p) => p.x <= 250);
  }
  if (portion === "right") {
    return positions.filter((p) => p.x >= 250);
  }
  if (portion === "double") {
    return positions; // Full density
  }
  // Standard full (alternate every other spot for balanced density)
  return positions.filter((_, i) => i % 2 === 0);
}

export const PizzaCanvas: React.FC<PizzaCanvasProps> = ({
  size = "medium",
  dough = "traditional",
  sauces = [],
  toppings = [],
  showSlices = false,
  sliceCount = 8,
  className = "",
  onSliceClick: _onSliceClick,
}) => {
  const radiusScale = size === "small" ? 0.88 : size === "large" ? 1.12 : 1.0;
  const crustRadius = 215 * radiusScale;
  const sauceRadius = 190 * radiusScale;
  const cheeseRadius = 180 * radiusScale;

  // Determine sauce background gradient
  const activeSauce = sauces.length > 0 && sauces[0] ? sauces[0].ingredient.id : "sauce-tomato";
  const sauceColor =
    activeSauce === "sauce-creamy-garlic"
      ? "#f8f9fa"
      : activeSauce === "sauce-pesto"
      ? "#27ae60"
      : activeSauce === "sauce-bbq"
      ? "#78281f"
      : "#c0392b"; // default tomato

  const hasCheeseCrust = dough === "cheese_crust";
  const isThinCrust = dough === "thin";

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ aspectRatio: "1/1", maxWidth: "100%" }}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        aria-label="Custom Pizza Canvas"
      >
        <defs>
          {/* Pizza Pan Shadow */}
          <filter id="canvas-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          {/* Crust Gradients */}
          <radialGradient id="crust-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#d38936" />
            <stop offset="88%" stopColor="#b36923" />
            <stop offset="96%" stopColor="#8d4b11" />
            <stop offset="100%" stopColor="#633207" />
          </radialGradient>

          <radialGradient id="stuffed-crust-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor="#e89d48" />
            <stop offset="88%" stopColor="#f5c762" />
            <stop offset="95%" stopColor="#d38936" />
            <stop offset="100%" stopColor="#7a3e0b" />
          </radialGradient>

          {/* Sauce Gradients */}
          <radialGradient id="sauce-gradient" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor={sauceColor} stopOpacity="0.95" />
            <stop offset="85%" stopColor={sauceColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#4a1515" stopOpacity="0.8" />
          </radialGradient>

          {/* Cheese Melt Texture Pattern */}
          <radialGradient id="cheese-melt" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8e7" />
            <stop offset="50%" stopColor="#fdebd0" />
            <stop offset="85%" stopColor="#f9e79f" />
            <stop offset="96%" stopColor="#eb984e" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d35400" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* --- LAYER 1: BASE CRUST --- */}
        <circle
          cx="250"
          cy="250"
          r={crustRadius}
          fill={hasCheeseCrust ? "url(#stuffed-crust-gradient)" : "url(#crust-gradient)"}
          stroke="#5c2e0b"
          strokeWidth={isThinCrust ? "2" : "4"}
          filter="url(#canvas-shadow)"
        />

        {/* Charred baked bubble spots on crust */}
        <g opacity="0.65">
          <ellipse cx="250" cy={250 - crustRadius + 14} rx="9" ry="5" fill="#422108" transform="rotate(-15 250 250)" />
          <ellipse cx="250" cy={250 + crustRadius - 14} rx="12" ry="6" fill="#361a06" transform="rotate(35 250 250)" />
          <ellipse cx={250 - crustRadius + 15} cy="250" rx="8" ry="5" fill="#422108" transform="rotate(20 250 250)" />
          <ellipse cx={250 + crustRadius - 16} cy="250" rx="10" ry="6" fill="#3a1c05" transform="rotate(-40 250 250)" />
        </g>

        {/* --- LAYER 2: SAUCE SPREAD --- */}
        {sauces.length > 0 && (
          <circle
            cx="250"
            cy="250"
            r={sauceRadius}
            fill="url(#sauce-gradient)"
            opacity="0.95"
          />
        )}

        {/* --- LAYER 3: MELTED CHEESE BASE --- */}
        <circle
          cx="250"
          cy="250"
          r={cheeseRadius}
          fill="url(#cheese-melt)"
          opacity="0.9"
        />

        {/* Toasted cheese spots */}
        <g opacity="0.5">
          <circle cx="210" cy="220" r="16" fill="#d35400" opacity="0.4" filter="blur(2px)" />
          <circle cx="290" cy="270" r="14" fill="#e67e22" opacity="0.45" filter="blur(2px)" />
          <circle cx="270" cy="190" r="12" fill="#d35400" opacity="0.35" filter="blur(2px)" />
          <circle cx="200" cy="300" r="15" fill="#e67e22" opacity="0.4" filter="blur(2px)" />
        </g>

        {/* --- LAYER 4: SCATTERED TOPPING SPRITES --- */}
        {toppings.map((topping) => {
          const positions = filterByPortion(TOPPING_POSITIONS, topping.portion);
          const ingredientId = topping.ingredient.id;

          return (
            <g key={ingredientId} id={`layer-${ingredientId}`} className="transition-all duration-300">
              {positions.map((pos, idx) => {
                const posX = 250 + (pos.x - 250) * radiusScale;
                const posY = 250 + (pos.y - 250) * radiusScale;

                return (
                  <g
                    key={`${ingredientId}-${idx}`}
                    transform={`translate(${posX}, ${posY}) rotate(${pos.rot}) scale(${pos.scale * radiusScale})`}
                  >
                    {/* 1. Pepperoni */}
                    {ingredientId === "meat-pepperoni" && (
                      <g>
                        <circle cx="0" cy="0" r="18" fill="#b03a2e" stroke="#78281f" strokeWidth="1.5" />
                        <circle cx="-5" cy="-6" r="2.5" fill="#641e16" />
                        <circle cx="4" cy="4" r="2.2" fill="#641e16" />
                        <circle cx="6" cy="-4" r="2.0" fill="#641e16" />
                        <circle cx="-3" cy="7" r="1.8" fill="#e67e22" opacity="0.7" />
                        <circle cx="0" cy="0" r="15" fill="none" stroke="#e74c3c" strokeWidth="0.8" opacity="0.5" />
                      </g>
                    )}

                    {/* 2. Mushrooms */}
                    {ingredientId === "veg-mushrooms" && (
                      <g>
                        <path d="M -14 0 Q 0 -18 14 0 Z" fill="#d5dbdb" stroke="#7f8c8d" strokeWidth="1.2" />
                        <rect x="-3.5" y="0" width="7" height="9" rx="2" fill="#eaecee" stroke="#95a5a6" strokeWidth="1" />
                        <path d="M -11 0 Q 0 -6 11 0" fill="none" stroke="#a6acaf" strokeWidth="1" />
                      </g>
                    )}

                    {/* 3. Black Olives */}
                    {ingredientId === "veg-olives" && (
                      <g>
                        <circle cx="0" cy="0" r="11" fill="#1c2833" stroke="#0e171e" strokeWidth="1.5" />
                        <circle cx="0" cy="0" r="5" fill="#fdebd0" />
                        <circle cx="2" cy="-2" r="2" fill="#566573" opacity="0.6" />
                      </g>
                    )}

                    {/* 4. Bell Peppers */}
                    {ingredientId === "veg-peppers" && (
                      <g>
                        <path
                          d="M -14 -6 C -8 -14 8 -14 14 -6 C 8 -2 -8 -2 -14 -6 Z"
                          fill="#e67e22"
                          stroke="#ba4a00"
                          strokeWidth="1.5"
                        />
                      </g>
                    )}

                    {/* 5. Prosciutto */}
                    {ingredientId === "meat-prosciutto" && (
                      <g>
                        <path
                          d="M -16 -4 C -6 -12 6 2 16 -6 C 10 10 -4 4 -16 -4 Z"
                          fill="#ec7063"
                          stroke="#c0392b"
                          strokeWidth="1.2"
                        />
                        <path d="M -10 -3 C 0 -1 6 5 12 -2" fill="none" stroke="#fdedec" strokeWidth="1.2" opacity="0.8" />
                      </g>
                    )}

                    {/* 6. Chicken */}
                    {ingredientId === "meat-chicken" && (
                      <g>
                        <path
                          d="M -12 -5 Q 0 -12 12 -4 Q 8 8 -8 6 Z"
                          fill="#f8c471"
                          stroke="#b7950b"
                          strokeWidth="1.2"
                        />
                        <circle cx="2" cy="0" r="1.5" fill="#7d6608" opacity="0.7" />
                        <circle cx="-4" cy="-2" r="1.2" fill="#7d6608" opacity="0.7" />
                      </g>
                    )}

                    {/* 7. Bacon */}
                    {ingredientId === "meat-bacon" && (
                      <g>
                        <path
                          d="M -14 -3 Q -7 3 0 -3 Q 7 3 14 -3 L 13 4 Q 6 -1 -1 4 Q -8 -1 -13 4 Z"
                          fill="#922b21"
                          stroke="#641e16"
                          strokeWidth="1.2"
                        />
                        <path d="M -12 0 Q -6 5 0 0 Q 6 5 12 0" fill="none" stroke="#f2d7d5" strokeWidth="1.2" />
                      </g>
                    )}

                    {/* 8. Red Onions */}
                    {ingredientId === "veg-onions" && (
                      <g>
                        <path
                          d="M -16 -8 C -4 -18 12 -12 16 0 C 10 -6 0 -10 -16 -8 Z"
                          fill="#884ea0"
                          stroke="#5b2c6f"
                          strokeWidth="1.5"
                        />
                      </g>
                    )}

                    {/* 9. Spinach / Basil */}
                    {(ingredientId === "veg-spinach" || ingredientId === "herb-basil") && (
                      <g>
                        <path
                          d="M 0 -16 C 12 -10 14 6 0 16 C -14 6 -12 -10 0 -16 Z"
                          fill="#229954"
                          stroke="#196f3d"
                          strokeWidth="1.2"
                        />
                        <line x1="0" y1="-12" x2="0" y2="12" stroke="#52be80" strokeWidth="0.8" />
                      </g>
                    )}

                    {/* 10. Artichokes */}
                    {ingredientId === "veg-artichokes" && (
                      <g>
                        <path
                          d="M -12 6 C -8 -8 8 -8 12 6 C 4 10 -4 10 -12 6 Z"
                          fill="#a9dfbf"
                          stroke="#52be80"
                          strokeWidth="1.2"
                        />
                      </g>
                    )}

                    {/* 11. Cheese crumbles (Gorgonzola / Parmesan / Vegan) */}
                    {(ingredientId.startsWith("cheese-") || ingredientId === "cheese-gorgonzola") && (
                      <g>
                        <circle cx="-4" cy="-3" r="4" fill="#aed6f1" opacity="0.85" />
                        <circle cx="5" cy="2" r="3.5" fill="#85c1e9" opacity="0.85" />
                        <circle cx="0" cy="5" r="2.8" fill="#5dade2" opacity="0.75" />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* --- LAYER 5: SLICE CUT GUIDELINES (OPTIONAL) --- */}
        {showSlices && (
          <g stroke="#f39c12" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.65">
            {Array.from({ length: sliceCount / 2 }).map((_, i) => {
              const angle = (i * 360) / sliceCount;
              return (
                <line
                  key={i}
                  x1={250 - Math.cos((angle * Math.PI) / 180) * crustRadius}
                  y1={250 - Math.sin((angle * Math.PI) / 180) * crustRadius}
                  x2={250 + Math.cos((angle * Math.PI) / 180) * crustRadius}
                  y2={250 + Math.sin((angle * Math.PI) / 180) * crustRadius}
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};
