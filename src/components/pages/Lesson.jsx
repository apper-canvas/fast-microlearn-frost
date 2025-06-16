import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { lessonService, quizService, userProgressService } from '@/services'
import Timer from '@/components/atoms/Timer'
import Button from '@/components/atoms/Button'
import QuizInterface from '@/components/organisms/QuizInterface'
import ApperIcon from '@/components/ApperIcon'

const Lesson = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [lesson, setLesson] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [currentStep, setCurrentStep] = useState('reading') // 'reading' | 'quiz' | 'results'
  const [timerActive, setTimerActive] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [quizResults, setQuizResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLesson()
  }, [id])

  useEffect(() => {
    // Simulate reading progress
    if (currentStep === 'reading' && timerActive) {
      const interval = setInterval(() => {
        setReadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + (100 / 180) // 100% over 180 seconds (3 minutes)
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [currentStep, timerActive])

  const loadLesson = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const lessonData = await lessonService.getById(parseInt(id, 10))
      setLesson(lessonData)
      
      // Load associated quiz
      const quizData = await quizService.getByLessonId(parseInt(id, 10))
      setQuiz(quizData)
    } catch (err) {
      setError(err.message || 'Failed to load lesson')
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleTimerComplete = () => {
    setReadingProgress(100)
    toast.success('Great job! Time to test your knowledge 🧠')
  }

  const handleTimerToggle = (isActive) => {
    setTimerActive(isActive)
  }

  const handleStartQuiz = () => {
    if (readingProgress < 100) {
      toast.warning('Please complete the lesson reading first')
      return
    }
    setCurrentStep('quiz')
  }

  const handleQuizComplete = async (results) => {
    try {
      // Submit quiz results
      const quizResult = await quizService.submitQuiz(quiz.Id, results.answers)
      
      // Update user progress
      await Promise.all([
        userProgressService.incrementLessonsCompleted(),
        userProgressService.updateCategoryScore(lesson.category, results.score),
        userProgressService.adjustDifficulty(results.score),
        userProgressService.updateStreak(),
        lessonService.markCompleted(lesson.Id)
      ])
      
      setQuizResults({
        ...results,
        ...quizResult
      })
      setCurrentStep('results')
      
      toast.success(`Quiz completed! You scored ${results.score}%`)
    } catch (err) {
      toast.error('Failed to save quiz results')
      console.error(err)
    }
  }

  const handleContinueLearning = () => {
    navigate('/')
  }

  const handleReturnHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="w-24 h-10 bg-gray-200 rounded-lg" />
            </div>
            
            {/* Timer skeleton */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-20 bg-gray-200 rounded-lg" />
            </div>
            
            {/* Content skeleton */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6" />
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={loadLesson}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Try Again
            </button>
            <button
              onClick={handleReturnHome}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="BookOpen" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lesson not found
          </h3>
          <p className="text-gray-600 mb-4">
            The lesson you're looking for doesn't exist.
          </p>
          <button
            onClick={handleReturnHome}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  const categoryColors = {
    'Psychology': 'from-purple-400 to-purple-600',
    'Technology': 'from-blue-400 to-blue-600',
    'Productivity': 'from-green-400 to-green-600'
  }

  const categoryIcons = {
    'Psychology': 'Brain',
    'Technology': 'Code',
    'Productivity': 'Zap'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReturnHome}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            >
              <ApperIcon name="ArrowLeft" size={20} className="text-gray-600" />
            </motion.button>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${categoryColors[lesson.category]} flex items-center justify-center`}>
                  <ApperIcon
                    name={categoryIcons[lesson.category]}
                    size={12}
                    className="text-white"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {lesson.category}
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {lesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                Step {currentStep === 'reading' ? '1' : currentStep === 'quiz' ? '2' : '3'} of 3
              </div>
              <div className="text-xs text-gray-500">
                {currentStep === 'reading' ? 'Reading' : currentStep === 'quiz' ? 'Quiz' : 'Results'}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 'reading' && (
            <motion.div
              key="reading"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Timer and Progress */}
              <div className="flex flex-col items-center space-y-6">
                <Timer
                  duration={180}
                  onComplete={handleTimerComplete}
                  isActive={timerActive}
                  onToggle={handleTimerToggle}
                />
                
                {/* Reading Progress */}
                <div className="w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Reading Progress
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(readingProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${readingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="prose max-w-none">
                  {lesson.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Button
                  size="large"
                  onClick={handleStartQuiz}
                  disabled={readingProgress < 100}
                  className="px-8"
                >
                  {readingProgress < 100 ? 'Complete Reading First' : 'Take Quiz'}
                  <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 'quiz' && quiz && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuizInterface
                quiz={quiz}
                onComplete={handleQuizComplete}
              />
            </motion.div>
          )}

          {currentStep === 'results' && quizResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-8"
            >
              {/* Results Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-6"
                >
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    quizResults.score >= 70 ? 'bg-success' : 'bg-warning'
                  }`}>
                    <ApperIcon 
                      name={quizResults.score >= 70 ? "Trophy" : "Target"} 
                      size={40} 
                      className="text-white" 
                    />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {quizResults.score >= 70 ? 'Excellent Work! 🎉' : 'Good Effort! 💪'}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {quizResults.score >= 70 
                      ? 'You\'ve mastered this lesson content!'
                      : 'You\'re making progress! Consider reviewing the lesson.'
                    }
                  </p>
                </motion.div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {quizResults.score}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Final Score
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-1">
                      {quizResults.correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">
                      Correct Answers
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-700 mb-1">
                      {quizResults.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Questions
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleContinueLearning}
                    className="px-8"
                  >
                    Continue Learning
                    <ApperIcon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                  
                  {quizResults.score < 70 && (
                    <Button
                      variant="outline"
                      size="large"
                      onClick={() => {
                        setCurrentStep('reading')
                        setReadingProgress(0)
                        setTimerActive(false)
                        setQuizResults(null)
                      }}
                      className="px-8"
                    >
                      <ApperIcon name="RotateCcw" size={20} className="mr-2" />
                      Review Lesson
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Lesson