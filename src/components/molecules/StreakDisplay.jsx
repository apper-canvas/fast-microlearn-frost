import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StreakDisplay = ({ streak = 0, className = '' }) => {
  const getFlameIntensity = (streakCount) => {
    if (streakCount === 0) return 'text-gray-300'
    if (streakCount < 3) return 'text-orange-400'
    if (streakCount < 7) return 'text-orange-500'
    if (streakCount < 14) return 'text-red-500'
    return 'text-red-600'
  }

  const getFlameSize = (streakCount) => {
    if (streakCount === 0) return 24
    if (streakCount < 7) return 28
    if (streakCount < 14) return 32
    return 36
  }

  return (
    <div className={`flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 ${className}`}>
      <motion.div
        animate={streak > 0 ? {
          scale: [1, 1.1, 1],
          rotate: [-2, 2, -2]
        } : {}}
        transition={{
          duration: 2,
          repeat: streak > 0 ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <ApperIcon
          name="Flame"
          size={getFlameSize(streak)}
          className={`${getFlameIntensity(streak)} transition-colors duration-300`}
        />
      </motion.div>
      
      <div className="flex flex-col">
        <span className="text-lg font-bold text-gray-900">
          {streak}
        </span>
        <span className="text-xs text-gray-500 -mt-1">
          day{streak !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="text-xs text-gray-600">
        streak
      </div>
    </div>
  )
}

export default StreakDisplay