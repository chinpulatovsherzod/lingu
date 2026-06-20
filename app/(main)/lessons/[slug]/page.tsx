import { notFound } from "next/navigation";
import { getTenseBySlug } from "@/lib/lessons/tenses";
import { TenseTopicView } from "@/components/lesson/tense-topic-view";

export default function LessonTopicPage({ params }: { params: { slug: string } }) {
  const topic = getTenseBySlug(params.slug);
  if (!topic) notFound();

  return <TenseTopicView topic={topic} />;
}
