export function RightSidebar() {
  return (
    <aside className="editor-panel">
      <p className="eyebrow">Future Modules</p>
      <h2 className="panel-title">Inspector + Presence</h2>
      <p>
        The inspector panel, collaborator presence, and layer tools can plug
        into this scaffold without changing the main editor layout.
      </p>
      <button type="button" className="panel-button">
        Connect Supabase
      </button>
    </aside>
  );
}
