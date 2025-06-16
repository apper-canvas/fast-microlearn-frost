import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'

const WeeklyReportCard = ({ 
  weeklyStats, 
  weeklyQuizResults, 
  weeklyLessons, 
  className = '' 
}) => {
  if (!weeklyStats) {
    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getStreakStatus = (streak) => {
    if (streak >= 7) return { status: 'Excellent', color: 'text-green-600', icon: 'Trophy' }
    if (streak >= 3) return { status: 'Good', color: 'text-blue-600', icon: 'TrendingUp' }
    if (streak >= 1) return { status: 'Getting Started', color: 'text-orange-600', icon: 'Play' }
    return { status: 'Start Learning', color: 'text-gray-600', icon: 'Book' }
  }

  const getQuizPerformance = (average) => {
    if (average >= 90) return { status: 'Excellent', color: 'text-green-600' }
    if (average >= 80) return { status: 'Good', color: 'text-blue-600' }
    if (average >= 70) return { status: 'Fair', color: 'text-orange-600' }
    return { status: 'Needs Improvement', color: 'text-red-600' }
  }

  const streakInfo = getStreakStatus(weeklyStats.currentStreak)
  const quizInfo = getQuizPerformance(weeklyStats.weeklyQuizAverage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 shadow-sm border border-primary/10 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Weekly Report Card
          </h3>
          <p className="text-sm text-gray-600">
            Your learning progress this week
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
          <ApperIcon name="BarChart3" size={24} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Lessons Completed */}
        <div className="bg-white/80 rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" size={16} className="text-primary" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {weeklyStats.weeklyLessonsCompleted}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Lessons Completed
          </p>
          <p className="text-xs text-gray-600">
            This week
          </p>
        </div>

        {/* Average Quiz Score */}
        <div className="bg-white/80 rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" size={16} className="text-success" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {weeklyStats.weeklyQuizAverage}%
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Average Quiz Score
          </p>
          <p className={`text-xs font-medium ${quizInfo.color}`}>
            {quizInfo.status}
          </p>
        </div>

        {/* Topics Mastered */}
        <div className="bg-white/80 rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={16} className="text-accent" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              {weeklyStats.topicsMastered}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Topics Mastered
          </p>
          <p className="text-xs text-gray-600">
            85%+ average
          </p>
        </div>

        {/* Streak Achievement */}
        <div className="bg-white/80 rounded-lg p-4 border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name={streakInfo.icon} size={16} className="text-orange-600" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {weeklyStats.currentStreak}
              </span>
              <ApperIcon name="Flame" size={16} className="text-orange-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Current Streak
          </p>
          <p className={`text-xs font-medium ${streakInfo.color}`}>
            {streakInfo.status}
          </p>
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="bg-white/80 rounded-lg p-4 border border-white/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Weekly Goal Progress
              </p>
              <p className="text-xs text-gray-600">
                {weeklyStats.weeklyLessonsCompleted} of 7 lessons
              </p>
            </div>
          </div>
          <ProgressRing
            progress={weeklyStats.weeklyGoalProgress}
            size={40}
            strokeWidth={3}
            color="#6366f1"
          />
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${weeklyStats.weeklyGoalProgress}%` }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-600">
            {weeklyStats.weeklyGoalProgress >= 100 ? 'Goal Achieved! 🎉' : 
             `${Math.round(7 - weeklyStats.weeklyLessonsCompleted)} lessons to go`}
          </span>
          <span className="text-xs font-medium text-primary">
            {Math.round(weeklyStats.weeklyGoalProgress)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default WeeklyReportCard