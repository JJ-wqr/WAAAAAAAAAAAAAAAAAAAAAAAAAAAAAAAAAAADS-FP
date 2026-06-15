"use client";

import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

type Props = {
  text: string;
  lang?: string;
};

export default function SpeechButton({ text, lang = "en-US" }: Props) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);

        // Extract language code (e.g., "ja" from "ja-JP")
        const langPrefix = lang.split('-')[0];

        // For Japanese, explicitly look for ja-JP voices first
        if (langPrefix === 'ja') {
          const jpVoice = availableVoices.find(v => v.lang.startsWith('ja-JP'));
          if (jpVoice) {
            setSelectedVoice(jpVoice);
            console.log("SpeechButton: Selected Japanese voice:", jpVoice.name);
            return;
          } else {
            console.warn("SpeechButton: No ja-JP voice found. Will use utterance lang fallback.");
            setSelectedVoice(null);
            return;
          }
        }

        // For other languages, find voice that matches the language prefix
        const voice = availableVoices.find(v => v.lang.startsWith(langPrefix));
        if (voice) {
          setSelectedVoice(voice);
          console.log("SpeechButton: Selected voice for", lang + ":", voice.name);
        } else {
          console.warn("SpeechButton: No voice found for language", lang + ". Using browser default.");
          setSelectedVoice(availableVoices[0] || null);
        }
      } else {
        console.warn("SpeechButton: No voices available yet.");
      }
    };

    loadVoices();

    speechSynthesis.onvoiceschanged = loadVoices;

    const timeoutId = setTimeout(loadVoices, 100);

    return () => {
      clearTimeout(timeoutId);
      speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  const speak = () => {
    if (!text) {
      console.warn("SpeechButton: No text to speak");
      return;
    }

    if (!speechSynthesis) {
      console.error("SpeechButton: Speech synthesis not supported in this browser");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1;
    utterance.pitch = 1;

    console.log("Speaking:", text, "in", lang, "with voice:", selectedVoice?.name || "default");
    speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition"
    >
      <Volume2 size={14} className="text-blue-500" />
    </button>
  );
}