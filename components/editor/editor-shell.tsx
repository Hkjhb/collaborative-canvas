import { CanvasWorkspace } from "@/components/editor/canvas-workspace";
import { LeftSidebar } from "@/components/editor/left-sidebar";
import { RightSidebar } from "@/components/editor/right-sidebar";
import { Toolbar } from "@/components/editor/toolbar";

export function EditorShell() {
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
