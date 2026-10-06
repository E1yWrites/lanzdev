import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// The house's furniture: Kenney's Furniture Kit (CC0), public/models/furniture/*.glb.
// Flat-colour low-poly pieces, so they sit beside the hand-built rounded boxes. They load
// outside the canvas (like the portrait and the film) and come in through context; until
// then the rooms simply have no furniture, and the poster covers for it.

export const FURNITURE = [
  "bedDouble", "bookcaseOpen", "cabinetTelevision", "cardboardBoxClosed", "cardboardBoxOpen", "chair", "chairDesk",
  "coatRackStanding", "computerKeyboard", "desk", "lampRoundFloor", "lampRoundTable", "loungeChair",
  "loungeSofa", "radio", "rugDoormat", "rugRectangle", "rugRound", "sideTable", "sideTableDrawers", "speaker", "table",
  "tableCoffee", "trashcan",
] as const;

export type FurnitureName = (typeof FURNITURE)[number];
export type Furniture = Partial<Record<FurnitureName, THREE.Object3D>>;

/** Fetches every piece. `url` maps a name to where its .glb is served (the site and the art renders differ). */
export async function loadFurniture(url: (name: FurnitureName) => string): Promise<Furniture> {
  const loader = new GLTFLoader();
  const loaded = await Promise.all(FURNITURE.map((name) => loader.loadAsync(url(name)).then((g) => [name, g.scene] as const)));
  return Object.fromEntries(loaded);
}

/** The site's copy: loaded once, on demand, shared by every House mount. */
let site: Promise<Furniture> | null = null;
export function useFurniture() {
  const [set, setSet] = useState<Furniture | null>(null);
  useEffect(() => {
    site ??= loadFurniture((n) => `/models/furniture/${n}.glb`);
    let live = true;
    // a failed download leaves the rooms bare; it must not take the scene down
    site.then((s) => live && setSet(s)).catch(() => (site = null));
    return () => {
      live = false;
    };
  }, []);
  return set;
}

/** The kit's colours are bright; the house is at night. Each of its named materials is repainted in the house's palette. */
const PAINT: Record<string, string> = {
  carpetWhite: "#aeb4c2",
  wood: "#7a5c42",
  woodDark: "#5a4636",
  metal: "#5b6478",
  metalMedium: "#3c4354",
  metalDark: "#262b38",
  carpet: "#3d4a6b",
  carpetDarker: "#2c3452",
  plant: "#4f7d3c",
  lamp: "#c9a46a",
  _defaultMat: "#b9bfcc",
};
/** Rug colourways: the field and its border. */
export const RUG = {
  plum: { carpet: "#3a2f4d", carpetDarker: "#2a2238" },
  navy: { carpet: "#22305a", carpetDarker: "#1a2447" },
  warm: { carpet: "#5a3a2c", carpetDarker: "#46302a" },
  slate: { carpet: "#4a5266", carpetDarker: "#3a4156" },
};

const paints = new Map<string, THREE.Material>();
/** A clay-finish copy of one of the kit's materials, in `hex`; shared by every piece that asks for it. */
function repaint(m: THREE.Material, over?: Record<string, string>) {
  const hex = over?.[m.name] ?? PAINT[m.name] ?? PAINT._defaultMat;
  const key = `${m.name}|${hex}`;
  let out = paints.get(key);
  if (!out) {
    out = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.8, metalness: 0, emissive: m.name === "lamp" ? hex : "#000", emissiveIntensity: 0.22 });
    paints.set(key, out);
  }
  return out;
}

export const FurnitureContext = createContext<Furniture | null>(null);

interface PieceProps {
  name: FurnitureName;
  /** Where its footprint is centred, on the floor plan: x, z. */
  at: [number, number];
  /** Height off the floor (a lamp on a table). */
  y?: number;
  /** Turn about the vertical axis. Pieces face +z; ±π/2 faces ±x, π faces -z. */
  ry?: number;
  /** Real-world size: the piece is scaled to this height (or this width), kit scales differ per piece. */
  h?: number;
  w?: number;
  /** Repaint some of its materials (a rug's colourway). */
  paint?: Record<string, string>;
}

/** One piece of furniture, sized in metres, standing on the floor at `at`. */
export function Piece({ name, at, y = 0, ry = 0, h, w, paint }: PieceProps) {
  const src = useContext(FurnitureContext)?.[name];
  const obj = useMemo(() => {
    if (!src) return null;
    const inner = src.clone(true);
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3());
    // centre the footprint on the origin and stand the piece on y = 0, before scaling
    inner.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    inner.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.castShadow = o.receiveShadow = true;
      o.material = Array.isArray(o.material) ? o.material.map((m) => repaint(m, paint)) : repaint(o.material, paint);
    });
    const group = new THREE.Group();
    group.add(inner);
    group.scale.setScalar(h ? h / size.y : w ? w / size.x : 1);
    return group;
  }, [src, h, w, paint]);
  return obj && <primitive object={obj} position={[at[0], y, at[1]]} rotation={[0, ry, 0]} />;
}
