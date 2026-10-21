import ModelPreviewClient from "@/components/ModelPreviewClient";

export const metadata = { title: "Model preview", robots: { index: false } };

export default async function ModelPreview({
  searchParams,
}: {
  searchParams: Promise<{ src?: string }>;
}) {
  const { src } = await searchParams;
  const valid = typeof src === "string" && /^\/models\/[\w.-]+\.glb$/.test(src);
  return (
    <main className="h-screen w-full">
      {valid ? (
        <ModelPreviewClient src={src} />
      ) : (
        <p className="p-6 text-sm opacity-70">Add ?src=/models/name.glb to preview a model.</p>
      )}
    </main>
  );
}
