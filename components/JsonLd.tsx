/** Renders a JSON-LD structured-data script tag. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, first-party content built from site config,
      // but hand-authored copy can contain < or &. Escaping them as JSON unicode
      // escapes keeps the parsed JSON-LD identical while making it impossible for
      // a stray "</script>" to break every entity on the page.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
          .replace(/</g, "\\u003c")
          .replace(/>/g, "\\u003e")
          .replace(/&/g, "\\u0026"),
      }}
    />
  );
}
