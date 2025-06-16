import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import StreakDisplay from '@/components/molecules/StreakDisplay'

const Header = ({ streak = 0, userName = 'Learner' }) => {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-heading">
                MicroLearn
              </h1>
              <p className="text-sm text-gray-500">
                3-minute daily lessons
              </p>
            </div>
          </div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="Settings" size={20} className="text-gray-600" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between">
          {/* Greeting */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {getGreeting()}, {userName}!
            </h2>
            <p className="text-sm text-gray-600">
              Ready for today's learning session?
            </p>
          </div>

          {/* Streak display */}
          <StreakDisplay streak={streak} />
        </div>
      </div>
    </header>
  )
}

export default Header