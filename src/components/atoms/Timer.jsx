import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Timer = ({ 
  duration = 180, // 3 minutes in seconds
  onComplete,
  isActive = false,
  onToggle,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    setTimeLeft(duration)
    setIsRunning(isActive)
  }, [duration, isActive])

  useEffect(() => {
    let interval = null
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false)
            onComplete?.()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, onComplete])

  const progress = ((duration - timeLeft) / duration) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const handleToggle = () => {
    setIsRunning(!isRunning)
    onToggle?.(!isRunning)
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Timer Ring */}
      <div className="relative">
        <svg width="80" height="80" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r="34"
            stroke="#E5E7EB"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Progress circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="34"
            stroke="#5B4FE9"
            strokeWidth="6"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
            animate={{ 
              strokeDashoffset: 2 * Math.PI * 34 * (1 - progress / 100)
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900 font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Play/Pause button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200"
      >
        <ApperIcon
          name={isRunning ? 'Pause' : 'Play'}
          size={20}
        />
      </motion.button>
    </div>
  )
}

export default Timer