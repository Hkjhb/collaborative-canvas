"use client";

import { getWorkspaceExport, useWorkspaceStore } from "@/store/workspaceStore";

function downloadWorkspaceExport() {
  const blob = new Blob([getWorkspaceExport()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "workspace-export.json";
  anchor.click();

  URL.revokeObjectURL(url);
}

export function Toolbar() {
  const selectedElementId = useWorkspaceStore((state) => state.selectedElementId);
  const snapshotCount = useWorkspaceStore((state) => state.snapshots.length);
  const addElement = useWorkspaceStore((state) => state.addElement);
  const duplicateSelectedElement = useWorkspaceStore((state) => state.duplicateSelectedElement);
  const deleteSelectedElement = useWorkspaceStore((state) => state.deleteSelectedElement);
  const saveSnapshot = useWorkspaceStore((state) => state.saveSnapshot);

  return (
    <>
      <div className="toolbar">
        <button type="button" className="toolbar-button" onClick={() => addElement("rectangle")}>
          Add Rectangle
        </button>
        <button type="button" className="toolbar-button" onClick={() => addElement("circle")}>
          Add Circle
        </button>
        <button type="button" className="toolbar-button" onClick={() => addElement("text")}>
          Add Text
        </button>
        <button
          type="button"
          className="toolbar-button"
          onClick={duplicateSelectedElement}
          disabled={!selectedElementId}
        >
          Duplicate Selected
        </button>
        <button
          type="button"
          className="toolbar-button"
          onClick={deleteSelectedElement}
          disabled={!selectedElementId}
        >
          Delete Selected
        </button>
        <button type="button" className="toolbar-button" onClick={downloadWorkspaceExport}>
          Export JSON
        </button>
        <button type="button" className="toolbar-button accent-button" onClick={saveSnapshot}>
          Save Snapshot
        </button>
      </div>

      <p className="toolbar-copy">
        Shared workspace store is active. Selected element state, element list, and snapshots are
        now managed in Zustand. Snapshots saved: {snapshotCount}
      </p>
    </>
  );
}
