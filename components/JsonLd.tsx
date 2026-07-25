/** Renders a JSON-LD structured-data script tag. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, first-party content built from site config.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
