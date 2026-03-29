"use client";

import { useEffect } from "react";
import { CanvasWorkspace } from "@/components/editor/canvas-workspace";
import { LeftSidebar } from "@/components/editor/left-sidebar";
import { RightSidebar } from "@/components/editor/right-sidebar";
import { Toolbar } from "@/components/editor/toolbar";
import { useWorkspaceStore } from "@/store/workspaceStore";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    target.isContentEditable
  );
}

export function EditorShell() {
  const selectedElementId = useWorkspaceStore((state) => state.selectedElementId);
  const duplicateSelectedElement = useWorkspaceStore((state) => state.duplicateSelectedElement);
  const deleteSelectedElement = useWorkspaceStore((state) => state.deleteSelectedElement);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();

        if (selectedElementId) {
          duplicateSelectedElement();
        }

        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && selectedElementId) {
        event.preventDefault();
        deleteSelectedElement();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedElement, duplicateSelectedElement, selectedElementId]);

  return (
    <main className="editor-page">
      <section className="editor-shell">
        <div className="editor-column">
          <LeftSidebar />
        </div>

        <div className="editor-column">
          <Toolbar />
          <CanvasWorkspace />
        </div>

        <div className="editor-column">
          <RightSidebar />
        </div>
      </section>
    </main>
  );
}
