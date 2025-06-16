import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import QuizQuestion from '@/components/molecules/QuizQuestion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const QuizInterface = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }))
  }

  const handleNext = () => {
    if (selectedAnswer === undefined) {
      toast.warning('Please select an answer before continuing')
      return
    }

    if (!showResult) {
      // Show result for current question
      setShowResult(true)
    } else {
      // Move to next question or complete quiz
      if (isLastQuestion) {
        completeQuiz()
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
        setShowResult(false)
      }
    }
  }

  const completeQuiz = () => {
    setQuizCompleted(true)
    
    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    
    // Show completion animation
    setTimeout(() => {
      onComplete?.({
        answers: Object.values(answers),
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length
      })
    }, 2000)
  }

  if (quizCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-6"
        >
          <ApperIcon name="CheckCircle" size={40} className="text-white" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz Completed! 🎉
        </h3>
        <p className="text-gray-600">
          Calculating your results...
        </p>
        
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mt-4" />
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            Knowledge Check
          </h2>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
        </div>
        
        {/* Overall progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / quiz.questions.length) * 100}%` 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <QuizQuestion
          key={currentQuestionIndex}
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          showResult={showResult}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
        />
      </AnimatePresence>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="ghost"
          disabled={currentQuestionIndex === 0}
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(prev => prev - 1)
              setShowResult(false)
            }
          }}
        >
          <ApperIcon name="ChevronLeft" size={16} className="mr-1" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
        >
          {showResult ? (
            isLastQuestion ? 'Complete Quiz' : 'Next Question'
          ) : (
            'Check Answer'
          )}
          {!showResult && (
            <ApperIcon name="CheckCircle" size={16} className="ml-1" />
          )}
          {showResult && !isLastQuestion && (
            <ApperIcon name="ChevronRight" size={16} className="ml-1" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default QuizInterface