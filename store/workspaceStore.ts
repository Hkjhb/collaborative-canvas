import { create } from "zustand";

export type CanvasElementType = "rectangle" | "circle" | "text";

export type CanvasElement = {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
  locked: boolean;
  text?: string;
};

type WorkspaceState = {
  selectedElementId: string | null;
  elements: CanvasElement[];
  setSelectedElementId: (elementId: string | null) => void;
  setElements: (elements: CanvasElement[]) => void;
};

const starterElements: CanvasElement[] = [
  {
    id: "hero-rect",
    type: "rectangle",
    x: 80,
    y: 80,
    width: 240,
    height: 140,
    rotation: 0,
    visible: true,
    locked: false
  },
  {
    id: "welcome-copy",
    type: "text",
    x: 380,
    y: 120,
    width: 240,
    height: 64,
    rotation: 0,
    visible: true,
    locked: false,
    text: "Bootstrap branch ready"
  }
];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedElementId: null,
  elements: starterElements,
  setSelectedElementId: (selectedElementId) => set({ selectedElementId }),
  setElements: (elements) => set({ elements })
}));
