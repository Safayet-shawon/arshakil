import Section from "./Section";

/** Shown under a page's title when nothing has been uploaded for it yet. */
export default function Empty({ what }: { what: string }) {
  return (
    <Section>
      <p className="label text-g500">No {what} yet. Please check back soon.</p>
    </Section>
  );
}
