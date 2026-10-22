import {
  buildStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

export function StructuredData({ path }: { path: string }) {
  const data = buildStructuredData(path);
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
