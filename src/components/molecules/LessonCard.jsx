import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const LessonCard = ({ lesson, index = 0 }) => {
  const navigate = useNavigate()
  
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

  const handleStartLesson = () => {
    navigate(`/lesson/${lesson.Id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Category header */}
      <div className={`h-3 bg-gradient-to-r ${categoryColors[lesson.category] || 'from-gray-400 to-gray-600'}`} />
      
      <div className="p-6">
        {/* Category and duration */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${categoryColors[lesson.category] || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
              <ApperIcon
                name={categoryIcons[lesson.category] || 'BookOpen'}
                size={16}
                className="text-white"
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {lesson.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <ApperIcon name="Clock" size={14} />
            <span>{Math.floor(lesson.duration / 60)} min</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {lesson.title}
        </h3>

        {/* Content preview */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {lesson.content.substring(0, 120)}...
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {lesson.completedAt && (
              <div className="flex items-center space-x-1 text-success">
                <ApperIcon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
            
            {/* Difficulty indicator */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < lesson.difficulty ? 'bg-accent' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            size="small"
            variant={lesson.completedAt ? 'outline' : 'primary'}
            onClick={handleStartLesson}
          >
            {lesson.completedAt ? 'Review' : 'Start'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default LessonCard