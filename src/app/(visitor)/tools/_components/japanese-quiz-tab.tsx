"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, BookOpen, GraduationCap, Languages } from "lucide-react";
import { getJLPTVoca, getJLPTQuiz, getJLPTQuizVerify } from "@/services/visitor/japanese";
import type {
  JLPTLevel,
  JLPTWord,
  JLPTQuestion,
} from "@/commons/types/tools";

interface JapaneseQuizTabProps {
  initialLevels: JLPTLevel[];
}

type QuizMode = "vocabulary" | "quiz";

export function JapaneseQuizTab({ initialLevels }: JapaneseQuizTabProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>("N5");
  const [mode, setMode] = useState<QuizMode>("vocabulary");
  const [vocabulary, setVocabulary] = useState<JLPTWord[]>([]);
  const [questions, setQuestions] = useState<JLPTQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const loadVocabulary = async (level: string) => {
    setIsLoading(true);
    try {
      const response = await getJLPTVoca(level, 20);
      setVocabulary(response.words);
    } catch (error) {
      console.error("Failed to load vocabulary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuiz = async (level: string) => {
    setIsLoading(true);
    try {
      const response = await getJLPTQuiz(level, 10);
      setQuestions(response.questions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setAnsweredQuestions(new Set());
      setSelectedAnswer(null);
      setVerifyMessage("");
    } catch (error) {
      console.error("Failed to load quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "vocabulary") {
      loadVocabulary(selectedLevel);
    } else {
      loadQuiz(selectedLevel);
    }
  }, [selectedLevel, mode]);

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || answeredQuestions.has(currentQuestionIndex)) return;

    const currentQuestion = questions[currentQuestionIndex];

    try {
      const response = await getJLPTQuizVerify({
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        correct: currentQuestion.correct,
      });

      setVerifyMessage(response.message);

      if (response.isCorrect) {
        setScore(score + 1);
      }

      setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setVerifyMessage("");
        } else {
          setShowResult(true);
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to verify answer:", error);
    }
  };

  const resetQuiz = () => {
    loadQuiz(selectedLevel);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = answeredQuestions.has(currentQuestionIndex);

  return (
    <div className="space-y-6">
      {/* Level Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Select JLPT Level
          </CardTitle>
          <CardDescription>
            Choose your Japanese Language Proficiency Test level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {initialLevels.map((level) => (
              <Button
                key={level.code}
                variant={selectedLevel === level.code ? "default" : "outline"}
                onClick={() => setSelectedLevel(level.code)}
                className="flex flex-col items-start h-auto p-4"
              >
                <span className="font-bold text-lg">{level.code}</span>
                <span className="text-xs font-normal">{level.name}</span>
                <span className="text-xs font-normal opacity-70">
                  {level.description.split("(")[1]?.replace(")", "")}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Tabs value={mode} onValueChange={(value) => setMode(value as QuizMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vocabulary">
            <BookOpen className="w-4 h-4 mr-2" />
            Vocabulary List
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Languages className="w-4 h-4 mr-2" />
            Quiz Mode
          </TabsTrigger>
        </TabsList>

        {/* Vocabulary Mode */}
        <TabsContent value="vocabulary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedLevel} Vocabulary ({vocabulary.length} words)
              </CardTitle>
              <CardDescription>
                Study essential Japanese words for this level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vocabulary.map((word, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-2xl font-bold">{word.word}</h3>
                              <p className="text-sm text-muted-foreground">{word.reading}</p>
                            </div>
                            <Badge variant="secondary">{word.level}</Badge>
                          </div>
                          <p className="text-base font-medium">{word.meaning}</p>
                          <p className="text-xs text-muted-foreground italic">
                            {word.partOfSpeech}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Mode */}
        <TabsContent value="quiz" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </CardContent>
            </Card>
          ) : showResult ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Quiz Complete! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {score === questions.length
                      ? "Perfect Score! 完璧!"
                      : score >= questions.length * 0.7
                        ? "Great job! よくできました!"
                        : "Keep practicing! がんばって!"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Accuracy: {Math.round((score / questions.length) * 100)}%
                  </p>
                </div>
                <Button onClick={resetQuiz} className="w-full" size="lg">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : currentQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </CardTitle>
                  <Badge variant="outline">
                    Score: {score}/{questions.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                {/* Question */}
                <div className="text-center space-y-3 py-6">
                  <h2 className="text-5xl font-bold">{currentQuestion.word}</h2>
                  <p className="text-2xl text-muted-foreground">
                    {currentQuestion.reading}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    What does this word mean?
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentQuestion.correct;
                    const showCorrect = isAnswered && isCorrect;
                    const showWrong = isAnswered && isSelected && !isCorrect;

                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-start h-auto p-4 text-left ${showCorrect ? "border-green-500 bg-green-50 dark:bg-green-950" : ""
                          } ${showWrong ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}`}
                        onClick={() => !isAnswered && setSelectedAnswer(option)}
                        disabled={isAnswered}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                              }`}
                          >
                            {showCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : showWrong ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : (
                              <span>{String.fromCharCode(65 + index)}</span>
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Verify Message */}
                {verifyMessage && (
                  <Alert
                    className={
                      verifyMessage.includes("Correct")
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-red-500 bg-red-50 dark:bg-red-950"
                    }
                  >
                    <AlertDescription className="font-medium">
                      {verifyMessage}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer || isAnswered}
                  className="w-full"
                  size="lg"
                >
                  {isAnswered ? "Next Question..." : "Submit Answer"}
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
