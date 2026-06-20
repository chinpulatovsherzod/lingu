"use client";



import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { useI18n } from "@/components/i18n/locale-provider";



type UserWord = {

  id: string;

  word: { word: string; definition: string; exampleSentence: string };

};



export default function FlashcardsPage() {

  const { t } = useI18n();

  const [deck, setDeck] = useState<UserWord[]>([]);

  const [index, setIndex] = useState(0);

  const [flipped, setFlipped] = useState(false);



  useEffect(() => {

    fetch("/api/vocabulary")

      .then((r) => r.json())

      .then(setDeck);

  }, []);



  const current = deck[index];



  async function rate(rating: string) {

    if (!current) return;

    await fetch("/api/vocabulary/review", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ userWordId: current.id, rating }),

    });

    setFlipped(false);

    setIndex((i) => (i + 1) % Math.max(deck.length, 1));

  }



  if (!current) {

    return <p className="text-center text-muted-foreground">{t.vocabulary.flashcardsEmpty}</p>;

  }



  return (

    <div className="mx-auto max-w-lg space-y-4">

      <h1 className="text-center font-heading text-2xl font-bold">{t.vocabulary.flashcards}</h1>

      <p className="text-center text-sm text-muted-foreground">

        {index + 1} / {deck.length}

      </p>

      <motion.div onClick={() => setFlipped(!flipped)} className="cursor-pointer">

        <Card>

          <CardContent className="flex min-h-[200px] items-center justify-center p-8 text-center">

            {!flipped ? (

              <p className="font-heading text-3xl">{current.word.word}</p>

            ) : (

              <div>

                <p className="mb-2">{current.word.definition}</p>

                <p className="text-sm italic text-muted-foreground">{current.word.exampleSentence}</p>

              </div>

            )}

          </CardContent>

        </Card>

      </motion.div>

      {flipped && (

        <div className="grid grid-cols-2 gap-2">

          <Button variant="outline" onClick={() => rate("again")}>

            {t.vocabulary.again}

          </Button>

          <Button variant="outline" onClick={() => rate("hard")}>

            {t.vocabulary.hard}

          </Button>

          <Button onClick={() => rate("good")}>{t.vocabulary.good}</Button>

          <Button variant="accent" onClick={() => rate("easy")}>

            {t.vocabulary.easy}

          </Button>

        </div>

      )}

      {!flipped && (

        <Button className="w-full" onClick={() => setFlipped(true)}>

          {t.vocabulary.showAnswer}

        </Button>

      )}

    </div>

  );

}

