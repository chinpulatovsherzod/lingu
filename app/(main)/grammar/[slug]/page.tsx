import { notFound } from "next/navigation";
import { getGrammarTestBySlug } from "@/lib/grammar";
import { GrammarTestPlayer } from "@/components/grammar/grammar-test-player";

export default function GrammarTestPage({ params }: { params: { slug: string } }) {
  const topic = getGrammarTestBySlug(params.slug);
  if (!topic) notFound();

  return <GrammarTestPlayer topic={topic} />;
}
