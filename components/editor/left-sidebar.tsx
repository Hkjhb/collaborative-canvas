"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";

export function LeftSidebar() {
  const workspaceName = useWorkspaceStore((state) => state.workspaceName);
  const elements = useWorkspaceStore((state) =>
    [...state.elements].sort((left, right) => right.layerOrder - left.layerOrder)
  );
  const selectedElementId = useWorkspaceStore((state) => state.selectedElementId);
  const selectElement = useWorkspaceStore((state) => state.selectElement);
  const reorderElement = useWorkspaceStore((state) => state.reorderElement);
  const toggleVisibility = useWorkspaceStore((state) => state.toggleVisibility);
  const toggleLock = useWorkspaceStore((state) => state.toggleLock);

  return (
    <aside className="editor-panel">
      <p className="eyebrow">Project Scope</p>
      <h2 className="panel-title">{workspaceName}</h2>
      <p>
        This branch owns the shared workspace store. Every visible layer below is reading from the
        same Zustand state the later canvas, inspector, and persistence branches will consume.
      </p>

      <div className="layer-stack">
        {elements.map((element) => {
          const isSelected = element.id === selectedElementId;

          return (
            <article key={element.id} className={`layer-card${isSelected ? " selected" : ""}`}>
              <button
                type="button"
                className="layer-main-button"
                onClick={() => selectElement(element.id)}
              >
                <strong>{element.name}</strong>
                <span>
                  {element.type} · layer {element.layerOrder + 1}
                </span>
              </button>

              <div className="layer-actions">
                <button type="button" className="mini-button" onClick={() => toggleVisibility(element.id)}>
                  {element.visible ? "Hide" : "Show"}
                </button>
                <button type="button" className="mini-button" onClick={() => toggleLock(element.id)}>
                  {element.locked ? "Unlock" : "Lock"}
                </button>
                <button
                  type="button"
                  className="mini-button"
                  onClick={() => reorderElement(element.id, "forward")}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="mini-button"
                  onClick={() => reorderElement(element.id, "backward")}
                >
                  Down
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </aside>
  );
}
