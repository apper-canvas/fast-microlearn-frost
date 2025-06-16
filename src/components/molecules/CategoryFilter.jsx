import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  className = '' 
}) => {
  const categoryConfig = {
    'All': {
      icon: 'Grid3X3',
      gradient: 'from-gray-400 to-gray-600'
    },
    'Psychology': {
      icon: 'Brain',
      gradient: 'from-purple-400 to-purple-600'
    },
    'Technology': {
      icon: 'Code',
      gradient: 'from-blue-400 to-blue-600'
    },
    'Productivity': {
      icon: 'Zap',
      gradient: 'from-green-400 to-green-600'
    }
  }

  return (
    <div className={`flex space-x-3 overflow-x-auto pb-2 ${className}`}>
      {categories.map((category) => {
        const config = categoryConfig[category] || categoryConfig['All']
        const isSelected = selectedCategory === category

        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(category)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
              ${isSelected 
                ? 'bg-white shadow-md border-2 border-primary' 
                : 'bg-white/70 border-2 border-transparent hover:bg-white hover:shadow-sm'
              }
            `}
          >
            <div className={`
              w-6 h-6 rounded-md bg-gradient-to-r ${config.gradient} 
              flex items-center justify-center flex-shrink-0
            `}>
              <ApperIcon
                name={config.icon}
                size={14}
                className="text-white"
              />
            </div>
            <span className={`
              text-sm font-medium
              ${isSelected ? 'text-primary' : 'text-gray-700'}
            `}>
              {category}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default CategoryFilter