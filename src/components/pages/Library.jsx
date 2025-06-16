import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { lessonService } from '@/services'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import LessonCard from '@/components/molecules/LessonCard'
import ApperIcon from '@/components/ApperIcon'

const Library = () => {
  const [completedLessons, setCompletedLessons] = useState([])
  const [allLessons, setAllLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('completed') // 'completed' | 'bookmarked' | 'all'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['All', 'Psychology', 'Technology', 'Productivity']

  useEffect(() => {
    loadLibraryData()
  }, [])

  useEffect(() => {
    filterLessons()
  }, [selectedCategory, viewMode, completedLessons, allLessons])

  const loadLibraryData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [completed, all] = await Promise.all([
        lessonService.getCompletedLessons(),
        lessonService.getAll()
      ])
      
      setCompletedLessons(completed)
      setAllLessons(all)
    } catch (err) {
      setError(err.message || 'Failed to load library data')
      toast.error('Failed to load library')
    } finally {
      setLoading(false)
    }
  }

  const filterLessons = () => {
    let lessonsToFilter = []
    
    switch (viewMode) {
      case 'completed':
        lessonsToFilter = completedLessons
        break
      case 'all':
        lessonsToFilter = allLessons
        break
      default:
        lessonsToFilter = completedLessons
    }

    let filtered = lessonsToFilter

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory)
    }

    setFilteredLessons(filtered)
  }

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'completed':
        return 'Completed Lessons'
      case 'all':
        return 'All Lessons'
      default:
        return 'Completed Lessons'
    }
  }

  const getViewModeDescription = () => {
    switch (viewMode) {
      case 'completed':
        return 'Lessons you\'ve successfully completed'
      case 'all':
        return 'Your complete lesson collection'
      default:
        return 'Lessons you\'ve successfully completed'
    }
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
            
            {/* Tabs skeleton */}
            <div className="flex space-x-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg w-32" />
              ))}
            </div>
            
            {/* Categories skeleton */}
            <div className="flex space-x-3 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg w-24" />
              ))}
            </div>
            
            {/* Lessons skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="h-8 bg-gray-200 rounded w-20" />
                </div>
              ))}
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
            onClick={loadLibraryData}
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
            Your Library
          </h1>
          <p className="text-gray-600">
            Review your completed lessons and track your learning journey
          </p>
        </motion.div>

        {/* View Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'completed', label: 'Completed', icon: 'CheckCircle' },
              { key: 'all', label: 'All Lessons', icon: 'Library' }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode(tab.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 flex-1
                  ${viewMode === tab.key 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  {tab.key === 'completed' ? completedLessons.length : allLessons.length}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {getViewModeLabel()}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            {getViewModeDescription()}
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </span>
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredLessons.length === 0 ? (
            <div className="text-center py-16">
              <ApperIcon 
                name={viewMode === 'completed' ? "BookOpen" : "Library"} 
                size={64} 
                className="text-gray-300 mx-auto mb-6" 
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {viewMode === 'completed' ? 'No completed lessons yet' : 'No lessons found'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                {viewMode === 'completed' 
                  ? 'Start learning to build your library of completed lessons.'
                  : selectedCategory !== 'All'
                    ? `No lessons found in the ${selectedCategory} category.`
                    : 'No lessons available in your library.'
                }
              </p>
              {viewMode === 'completed' && (
                <button
                  onClick={() => setViewMode('all')}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Browse All Lessons
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLessons.map((lesson, index) => (
                <LessonCard key={lesson.Id} lesson={lesson} index={index} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary Stats */}
        {completedLessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Learning Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {completedLessons.length}
                </div>
                <div className="text-sm text-gray-600">
                  Lessons Completed
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {Math.round(completedLessons.reduce((sum, lesson) => sum + lesson.duration, 0) / 60)}
                </div>
                <div className="text-sm text-gray-600">
                  Minutes Learned
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {[...new Set(completedLessons.map(lesson => lesson.category))].length}
                </div>
                <div className="text-sm text-gray-600">
                  Categories Explored
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Library