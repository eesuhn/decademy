import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { HelpCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import quizQuestions from '@/app/module-content/quizQuestions.json';

export function QuizComponent({ onComplete }: { onComplete: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };
  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/80 shadow-md border-gray-150 px-6 py-4">
      <CardHeader className="space-y-4">
        <CardTitle className="text-center mt-8">
          <div className="mt-14 absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-green-500 rounded-2xl rotate-45 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-white -rotate-45" />
          </div>
          <h2 className="mt-16 text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Time to Test Your Knowledge
          </h2>
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Challenge yourself with these questions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            {quizQuestions[currentQuestion].question}
          </h2>
          <div className="space-y-3">
            {quizQuestions[currentQuestion].options.map((option) => (
              <button
                key={option.id}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  isAnimating && selectedAnswer === option.id
                    ? 'scale-98'
                    : 'scale-100'
                } ${
                  selectedAnswer === option.id
                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-500 shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-semibold mr-3">
                    {option.id}
                  </span>
                  {option.text}
                </div>
              </button>
            ))}
          </div>
          {isCorrect === null && (
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300"
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
            >
              Check Answer
            </Button>
          )}
          {isCorrect === false && (
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="font-bold text-red-700">Not Quite Right</p>
                <p className="text-red-600">Give it another try!</p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                onClick={handleTryAgain}
              >
                Try Again
              </Button>
            </div>
          )}
          {isCorrect === true && (
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-green-600 mr-2" />
                  <p className="font-bold text-green-700">Excellent Work!</p>
                </div>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                onClick={handleNextQuestion}
              >
                {currentQuestion < quizQuestions.length - 1
                  ? 'Next Question'
                  : 'Complete Module'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
