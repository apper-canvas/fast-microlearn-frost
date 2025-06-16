import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { lessonService, userProgressService } from '@/services'
import Header from '@/components/organisms/Header'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import LessonCard from '@/components/molecules/LessonCard'
import ApperIcon from '@/components/ApperIcon'

const Home = () => {
  const [todaysLessons, setTodaysLessons] = useState([])
  const [allLessons, setAllLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [userProgress, setUserProgress] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['All', 'Psychology', 'Technology', 'Productivity']

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredLessons(allLessons)
    } else {
      const filtered = allLessons.filter(lesson => lesson.category === selectedCategory)
      setFilteredLessons(filtered)
    }
  }, [selectedCategory, allLessons])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [todaysData, allData, progressData] = await Promise.all([
        lessonService.getTodaysLessons(),
        lessonService.getAll(),
        userProgressService.getProgress()
      ])
      
      setTodaysLessons(todaysData)
      setAllLessons(allData)
      setFilteredLessons(allData)
      setUserProgress(progressData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-white border-b border-gray-100 px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-56" />
                </div>
                <div className="h-12 bg-gray-200 rounded-lg w-32" />
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex space-x-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg w-24" />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
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
            onClick={loadData}
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
      <Header streak={userProgress?.streak || 0} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Today's Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Star" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Today's Picks
                </h2>
                <p className="text-sm text-gray-600">
                  Personalized lessons just for you
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todaysLessons.map((lesson, index) => (
                <LessonCard key={lesson.Id} lesson={lesson} index={index} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </motion.div>

        {/* All Lessons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Lessons' : `${selectedCategory} Lessons`}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="BookOpen" size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No lessons found
              </h3>
              <p className="text-gray-600">
                Try selecting a different category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLessons.map((lesson, index) => (
                <LessonCard key={lesson.Id} lesson={lesson} index={index} />
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  )
}

export default Home