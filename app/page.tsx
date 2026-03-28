import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="landing-card">
        <p className="eyebrow">Assignment Workspace</p>
        <h1>Collaborative Canvas Editor</h1>
        <p className="landing-copy">
          The project is bootstrapped and ready for Harsh&apos;s frontend canvas
          implementation branch work.
        </p>
        <Link href="/editor" className="primary-link">
          Open Editor Workspace
        </Link>
      </section>
    </main>
  );
}
