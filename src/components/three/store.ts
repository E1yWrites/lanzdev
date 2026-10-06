import { useSyncExternalStore } from "react";
import type { HouseRoom } from "@/data/house";
import { roomObject, type RoomId, type TapeId } from "@/three/roomObjects";

// Tiny external stores shared between the DOM and the WebGL scenes. R3F renders in its
// own React root, so plain module stores are the simplest way to talk across.

export interface Store<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set: (next) => {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Canvas pixel-ratio ceiling for every live scene. ModelStage steps it down on a slow
 *  device: 1.75 → 1 (same scene, fewer pixels) → 0 (posters only). */
export const renderScale = createStore(1.75);

/** Pointer over the hero, normalised to -1…1, and how far the hero has scrolled away (0…1). */
export const heroPointer = { x: 0, y: 0, scroll: 0 };

// ─── The hero room ────────────────────────────────────────────────────────────

/** The object under the pointer or keyboard focus: outlined in 3D, expanded on its pin. */
export const roomHover = createStore<RoomId | null>(null);
/** The picked object: the camera is on it and its card is open. Mirrors `?focus=<id>`. */
export const roomFocus = createStore<RoomId | null>(null);
/** The tape in the deck; the film overlay is open while one is in. */
export const roomTape = createStore<TapeId | null>(null);
/** The live room has drawn over its poster. */
export const roomLive = createStore(false);
/** Pin positions from the live camera, as fractions of the stage; null while the poster shows. */
export const roomPins = createStore<[number, number][] | null>(null);
/** A card's call to action: the live camera pushes in, then the page navigates. */
export const roomEnter = createStore<string | null>(null);

/** Opens an object's card, as a history entry so Back closes it. */
export function openRoom(id: RoomId) {
  if (roomFocus.get() === id) return;
  const url = `${location.pathname}?focus=${id}`;
  if (roomFocus.get()) history.replaceState({ roomFocus: id }, "", url);
  else history.pushState({ roomFocus: id }, "", url);
  roomFocus.set(id);
}

export function closeRoom() {
  if (!roomFocus.get()) return;
  // Opened here: step back off our own entry. Arrived by link: just drop the query.
  if (history.state?.roomFocus) history.back();
  else {
    history.replaceState(history.state, "", location.pathname);
    roomFocus.set(null);
  }
}

/** `?focus=<id>` → the open card (on load, and when Back or Forward lands on an entry). */
export function syncRoomFromUrl() {
  roomFocus.set(roomObject(new URLSearchParams(location.search).get("focus"))?.id ?? null);
}

// ─── The house ────────────────────────────────────────────────────────────────

/** The room under the pointer or keyboard focus in the house below the hero: its lamp turns up. */
export const houseHover = createStore<HouseRoom | null>(null);

/** A label for the cursor ring, set by things the DOM can't see (3D keys). */
export const cursorLabel = createStore<string | null>(null);
