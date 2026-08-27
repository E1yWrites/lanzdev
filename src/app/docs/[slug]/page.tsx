import { getDocBySlug, getAllDocSlugs } from "@/data/docs";
import { notFound } from "next/navigation";
import { DocPageClient } from "./DocPageClient";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props) {
  const doc = getDocBySlug(params.slug);
  if (!doc) return { title: "Page Not Found" };
  return {
    title: doc.title,
  };
}

export default function DocPage({ params }: Props) {
  const doc = getDocBySlug(params.slug);
  if (!doc) notFound();
  return <DocPageClient doc={doc} />;
}
