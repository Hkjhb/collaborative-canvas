export function CanvasWorkspace() {
  return (
    <section className="canvas-stage-shell">
      <div className="canvas-header">
        <div>
          <p className="eyebrow">Editor Workspace</p>
          <h2 className="canvas-title">Canvas Area</h2>
          <p className="canvas-subtitle">
            This bootstrap branch prepares the editor shell. React Konva canvas
            rendering and interactions will land in the next branches.
          </p>
        </div>
      </div>

      <div className="canvas-viewport">
        <div className="canvas-placeholder">
          <p className="eyebrow">Fixed Canvas Viewport</p>
          <h3 className="panel-title">Ready for shape rendering</h3>
          <p className="empty-state">
            The stage, selection system, and toolbar actions will connect to the
            shared workspace store in the upcoming feature branches.
          </p>

          <div className="canvas-placeholder-grid">
            <article className="placeholder-card accent" />
            <article className="placeholder-card" />
            <article className="placeholder-card" />
          </div>
        </div>
      </div>
    </section>
  );
}
