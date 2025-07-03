"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw } from "lucide-react";
import { getRandomWords } from "./wpm-random-text";
import WPMStats from "./wpm-stats";
import TypingArea from "./wpm-typing";

export type Language = "en" | "id";
export type TestDuration = 15 | 30 | 60 | 120;

export interface WPMStats {
  wpm: number;
  accuracy: number;
  errors: number;
  correct: number;
  timeElapsed: number;
}

export default function WPMTest() {
  const [language, setLanguage] = useState<Language>("en");
  const [duration, setDuration] = useState<TestDuration>(60);
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [stats, setStats] = useState<WPMStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correct: 0,
    timeElapsed: 0
  });
  const [testCompleted, setTestCompleted] = useState(false);
  const [incorrectChars, setIncorrectChars] = useState<Set<string>>(new Set());
  const [completedWords, setCompletedWords] = useState<boolean[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateWords = useCallback(() => {
    const newWords = getRandomWords(language, 200);
    setWords(newWords);
    setCompletedWords(new Array(newWords.length).fill(false));
  }, [language]);

  useEffect(() => {
    generateWords();
  }, [generateWords]);

  useEffect(() => {
    setTimeLeft(duration);
    resetTest();
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startTest = () => {
    if (!isActive && !testCompleted) {
      setIsActive(true);
      inputRef.current?.focus();
    }
  };

  const endTest = () => {
    setIsActive(false);
    setTestCompleted(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetTest = () => {
    setIsActive(false);
    setTestCompleted(false);
    setUserInput("");
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTimeLeft(duration);
    setIncorrectChars(new Set());
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correct: 0,
      timeElapsed: 0
    });
    setCompletedWords(new Array(words.length).fill(false));
  };

  const handleInputChange = (value: string) => {
    if (!isActive && !testCompleted) {
      startTest();
    }

    if (!isActive) return;

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    // Handle space (word completion)
    if (value.endsWith(" ")) {
      const typedWord = value.slice(0, -1);
      const newCompletedWords = [...completedWords];
      newCompletedWords[currentWordIndex] = true;
      setCompletedWords(newCompletedWords);

      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
      setUserInput("");

      // Calculate stats
      calculateStats(typedWord, currentWord);
      return;
    }

    setUserInput(value);
    setCurrentCharIndex(value.length);

    // Track incorrect characters
    const newIncorrectChars = new Set<string>();
    for (let i = 0; i < value.length; i++) {
      const key = `${currentWordIndex}-${i}`;
      if (i < currentWord.length && value[i] !== currentWord[i]) {
        newIncorrectChars.add(key);
      }
    }
    setIncorrectChars(newIncorrectChars);
  };

  const calculateStats = (typedWord: string, targetWord: string) => {
    const timeElapsed = duration - timeLeft;
    const wordsTyped = currentWordIndex + 1;
    const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < Math.max(typedWord.length, targetWord.length); i++) {
      if (i < typedWord.length && i < targetWord.length) {
        if (typedWord[i] === targetWord[i]) {
          correct++;
        } else {
          errors++;
        }
      } else {
        errors++;
      }
    }

    const totalChars = correct + errors;
    const accuracy = totalChars > 0 ? Math.round((correct / totalChars) * 100) : 100;

    setStats(prev => ({
      wpm,
      accuracy,
      errors: prev.errors + errors,
      correct: prev.correct + correct,
      timeElapsed
    }));
  };

  const getCharClass = (wordIndex: number, charIndex: number, char: string) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isCurrentChar = isCurrentWord && charIndex === currentCharIndex;
    const isCompleted = completedWords[wordIndex];
    const key = `${wordIndex}-${charIndex}`;

    let className = "transition-all duration-75";

    if (isCompleted) {
      className += " text-green-500";
    } else if (isCurrentWord && charIndex < userInput.length) {
      if (incorrectChars.has(key)) {
        className += " text-red-500 bg-red-500/20";
      } else {
        className += " text-green-500";
      }
    } else if (isCurrentChar) {
      className += " text-foreground bg-primary/20 animated-pulse";
    } else {
      className += " text-muted-foreground";
    }

    return className;
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      {/* Settings Bar */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          {[15, 30, 60, 120].map((time) => (
            <Button
              key={time}
              variant={duration === time ? "default" : "ghost"}
              size="sm"
              onClick={() => setDuration(time as TestDuration)}
              disabled={isActive}
            >
              {time}s
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={language === "en" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("en")}
            disabled={isActive}
          >
            EN
          </Button>
          <Button
            variant={language === "id" ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage("id")}
            disabled={isActive}
          >
            ID
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            generateWords();
            resetTest();
          }}
          disabled={isActive}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetTest}
          disabled={!isActive && !testCompleted}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      {(isActive || testCompleted) && (
        <WPMStats stats={stats} timeLeft={timeLeft} />
      )}

      {/* Test Area */}
      <div className="space-y-6">
        {/* Words Display */}
        <div className="bg-card rounded-lg p-6 min-h-[200px] flex items-center">
          <div className="text-2xl leading-relaxed font-mono w-full">
            {words.slice(0, 50).map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-3 mb-2">
                {word.split("").map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className={getCharClass(wordIndex, charIndex, char)}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <TypingArea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          disabled={testCompleted}
          placeholder={isActive ? "Type here..." : "Click to start typing..."}
          onFocus={startTest}
        />

        {testCompleted && (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">Test Complete!</div>
            <div className="flex justify-center gap-4">
              <Button onClick={resetTest}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => {
                generateWords();
                resetTest();
              }}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}