const toolbarItems = [
  "Add Rectangle",
  "Add Circle",
  "Add Text",
  "Export JSON",
  "Save Snapshot"
];

export function Toolbar() {
  return (
    <div className="toolbar">
      {toolbarItems.map((label) => (
        <button key={label} type="button" className="toolbar-button">
          {label}
        </button>
      ))}
    </div>
  );
}
