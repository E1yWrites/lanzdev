// The macropad's keys — plain data, no three.js, so the page can import it without
// pulling the 3D bundle into first load.

export type Finish = "accent" | "solar" | "white" | "grey";

export interface PadKey {
  id: string;
  index: string;
  label: string;
  finish: Finish;
  href: string;
  /** Two lines for the OLED while this key is hovered. */
  screen: [string, string];
}

export const PAD_KEYS: PadKey[] = [
  { id: "parada", index: "01", label: "parada", finish: "accent", href: "/projects/parada", screen: ["01 PARADA", "SMART PARKING · 14/16 DONE"] },
  { id: "tala", index: "02", label: "tala", finish: "solar", href: "/projects/tala", screen: ["02 TALA", "NOTES · v1.1.0 · WINDOWS"] },
  { id: "about", index: "03", label: "about", finish: "white", href: "/about", screen: ["03 ABOUT", "BSIT · LPU-BATANGAS · 3RD YR"] },
  { id: "contact", index: "04", label: "say hi", finish: "grey", href: "/contact", screen: ["04 SAY HI", "OPEN TO AN INTERNSHIP"] },
];
