import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { userProgressService, quizService, lessonService } from '@/services'
import ProgressRing from '@/components/atoms/ProgressRing'
import StreakDisplay from '@/components/molecules/StreakDisplay'
import WeeklyReportCard from '@/components/molecules/WeeklyReportCard'
import ApperIcon from '@/components/ApperIcon'

const Progress = () => {
const [userProgress, setUserProgress] = useState(null)
  const [quizResults, setQuizResults] = useState([])
  const [completedLessons, setCompletedLessons] = useState([])
  const [weeklyStats, setWeeklyStats] = useState(null)
  const [weeklyQuizResults, setWeeklyQuizResults] = useState([])
  const [weeklyLessons, setWeeklyLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = async () => {
    setLoading(true)
    setError(null)
    
try {
      const [
        progressData, 
        quizData, 
        lessonsData, 
        weeklyStatsData, 
        weeklyQuizData, 
        weeklyLessonsData
      ] = await Promise.all([
        userProgressService.getProgress(),
        quizService.getUserQuizResults(),
        lessonService.getCompletedLessons(),
        userProgressService.getWeeklyStats(),
        quizService.getWeeklyQuizResults(),
        lessonService.getWeeklyCompletedLessons()
      ])
      
      setUserProgress(progressData)
      setQuizResults(quizData)
setQuizResults(quizData)
      setCompletedLessons(lessonsData)
      setWeeklyStats(weeklyStatsData)
      setWeeklyQuizResults(weeklyQuizData)
      setWeeklyLessons(weeklyLessonsData)
    } catch (err) {
      setError(err.message || 'Failed to load progress data')
      toast.error('Failed to load progress data')
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageScore = (category) => {
    const scores = userProgress?.categoryScores?.[category] || []
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const getOverallAverage = () => {
    if (!userProgress?.categoryScores) return 0
    
    const allScores = Object.values(userProgress.categoryScores).flat()
    if (allScores.length === 0) return 0
    
    return Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
  }

  const getWeeklyGoalProgress = () => {
    // Assuming goal is 7 lessons per week (1 per day)
    const weeklyGoal = 7
    const lessonsThisWeek = completedLessons.filter(lesson => {
      const completedDate = new Date(lesson.completedAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return completedDate >= weekAgo
    }).length
    
    return Math.min((lessonsThisWeek / weeklyGoal) * 100, 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-72" />
            </div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
            
            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
                <div className="h-32 bg-gray-200 rounded" />
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
          <button
            onClick={loadProgressData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Progress
          </h1>
          <p className="text-gray-600">
            Track your learning journey and celebrate your achievements
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Streak */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="Flame" size={24} className="text-white" />
              </div>
              <StreakDisplay streak={userProgress?.streak || 0} className="border-0 bg-transparent shadow-none p-0" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Current Streak
            </h3>
            <p className="text-sm text-gray-600">
              Keep it going! 🔥
            </p>
          </div>

          {/* Total Lessons */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" size={24} className="text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {userProgress?.totalLessons || 0}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Lessons Completed
            </h3>
            <p className="text-sm text-gray-600">
              Total knowledge gained
            </p>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Trophy" size={24} className="text-white" />
              </div>
              <ProgressRing
                progress={getOverallAverage()}
                size={50}
                strokeWidth={4}
                color="#10B981"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Average Score
            </h3>
            <p className="text-sm text-gray-600">
              Quiz performance
            </p>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-orange-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Target" size={24} className="text-white" />
              </div>
              <ProgressRing
                progress={getWeeklyGoalProgress()}
                size={50}
                strokeWidth={4}
                color="#F97316"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Weekly Goal
            </h3>
            <p className="text-sm text-gray-600">
              7 lessons per week
            </p>
          </div>
</motion.div>

        {/* Weekly Report Card */}
        <WeeklyReportCard 
          weeklyStats={weeklyStats}
          weeklyQuizResults={weeklyQuizResults}
          weeklyLessons={weeklyLessons}
          className="mb-8"
        />

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Performance by Category
            </h3>
            
            <div className="space-y-6">
              {['Psychology', 'Technology', 'Productivity'].map((category) => {
                const averageScore = calculateAverageScore(category)
                const categoryColors = {
                  'Psychology': '#8B7FF5',
                  'Technology': '#3B82F6',
                  'Productivity': '#10B981'
                }
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: categoryColors[category] }} />
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className="text-sm text-gray-500">
                        ({userProgress?.categoryScores?.[category]?.length || 0} quizzes)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: categoryColors[category] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${averageScore}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900 w-10 text-right">
                        {averageScore}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Activity
            </h3>
            
            {completedLessons.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No completed lessons yet</p>
                <p className="text-sm text-gray-500">Start learning to see your activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedLessons.slice(0, 5).map((lesson) => (
                  <div key={lesson.Id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {lesson.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lesson.category} • {new Date(lesson.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ApperIcon name="CheckCircle" size={16} className="text-success" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Progress