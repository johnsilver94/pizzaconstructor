export * from "./colors";
export * from "./typography";

/**
 * CSS custom properties / variables generator
 */
export function generateCssVariables(): Record<string, string> {
  return {
    "--color-primary": "#f39c12",
    "--color-primary-hover": "#e67e22",
    "--color-primary-active": "#d35400",
    "--color-primary-light": "#fef5e7",
    "--color-slate-darker": "#0f171e",
    "--color-slate-dark": "#1a252f",
    "--color-slate": "#2c3e50",
    "--color-slate-light": "#34495e",
    "--color-slate-muted": "#95a5a6",
    "--color-surface": "#ecf0f1",
    "--color-background": "#f8f9fa",
  };
}
