import { auth } from "@/lib/auth";
import { getVocabularyForUser } from "@/lib/data";
import { VocabularyWorkspace, type VocabWord } from "@/components/vocabulary/vocabulary-workspace";

export default async function VocabularyPage() {
  const session = await auth();
  const raw = await getVocabularyForUser(session!.user!.id);

  const words: VocabWord[] = raw.map((uw) => ({
    id: uw.id,
    masteryStatus: String(uw.masteryStatus),
    word: {
      word: uw.word.word,
      partOfSpeech: uw.word.partOfSpeech,
      definition: uw.word.definition,
      exampleSentence: uw.word.exampleSentence,
      cefrLevel: uw.word.cefrLevel,
    },
  }));

  return <VocabularyWorkspace initialWords={words} />;
}
