"use client";

import { CANVAS_DIMENSIONS } from "@/lib/constants";
import { type CanvasElement, useWorkspaceStore } from "@/store/workspaceStore";

function getElementClassName(element: CanvasElement, selectedElementId: string | null) {
  const stateClasses = [
    "workspace-node",
    `workspace-node-${element.type}`,
    selectedElementId === element.id ? "selected" : "",
    !element.visible ? "hidden" : "",
    element.locked ? "locked" : ""
  ];

  return stateClasses.filter(Boolean).join(" ");
}

export function CanvasWorkspace() {
  const elements = useWorkspaceStore((state) =>
    [...state.elements].sort((left, right) => left.layerOrder - right.layerOrder)
  );
  const selectedElementId = useWorkspaceStore((state) => state.selectedElementId);
  const selectElement = useWorkspaceStore((state) => state.selectElement);

  return (
    <section className="canvas-stage-shell">
      <div className="canvas-header">
        <div>
          <p className="eyebrow">Editor Workspace</p>
          <h2 className="canvas-title">Canvas Area</h2>
          <p className="canvas-subtitle">
            This branch wires the shared store into a fixed viewport so you can verify element
            creation, selection, layering, and snapshot readiness before the Konva branch.
          </p>
        </div>
        <div className="canvas-badge">
          <strong>{elements.length}</strong>
          <span>Active elements</span>
        </div>
      </div>

      <div className="canvas-viewport">
        <div
          className="canvas-surface"
          style={{
            width: `${CANVAS_DIMENSIONS.width / 1.6}px`,
            height: `${CANVAS_DIMENSIONS.height / 1.6}px`
          }}
          onClick={() => selectElement(null)}
          role="presentation"
        >
          {elements.map((element) => (
            <button
              key={element.id}
              type="button"
              className={getElementClassName(element, selectedElementId)}
              style={{
                left: `${element.x / 1.6}px`,
                top: `${element.y / 1.6}px`,
                width: `${element.width / 1.6}px`,
                height: `${element.height / 1.6}px`,
                opacity: element.style.opacity,
                zIndex: element.layerOrder + 1,
                backgroundColor:
                  element.type === "text" ? "transparent" : element.style.fill,
                borderColor: element.style.stroke,
                borderWidth: `${element.style.strokeWidth}px`,
                fontSize: `${Math.max(14, element.style.fontSize / 1.35)}px`
              }}
              onClick={(event) => {
                event.stopPropagation();
                selectElement(element.id);
              }}
            >
              <span className="node-label">{element.name}</span>
              {element.type === "text" ? <span>{element.text}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
