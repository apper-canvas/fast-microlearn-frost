import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { lessonService } from '@/services'
import CategoryFilter from '@/components/molecules/CategoryFilter'
import LessonCard from '@/components/molecules/LessonCard'
import ApperIcon from '@/components/ApperIcon'

const Learn = () => {
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = ['All', 'Psychology', 'Technology', 'Productivity']

  useEffect(() => {
    loadLessons()
  }, [])

  useEffect(() => {
    filterLessons()
  }, [selectedCategory, searchQuery, lessons])

  const loadLessons = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await lessonService.getAll()
      setLessons(data)
      setFilteredLessons(data)
    } catch (err) {
      setError(err.message || 'Failed to load lessons')
      toast.error('Failed to load lessons')
    } finally {
      setLoading(false)
    }
  }

  const filterLessons = () => {
    let filtered = lessons

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(query) ||
        lesson.content.toLowerCase().includes(query) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredLessons(filtered)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-96" />
            </div>
            
            {/* Search skeleton */}
            <div className="h-12 bg-gray-200 rounded-lg mb-6" />
            
            {/* Categories skeleton */}
            <div className="flex space-x-3 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg w-24" />
              ))}
            </div>
            
            {/* Lessons skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
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
            onClick={loadLessons}
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
            Explore Lessons
          </h1>
          <p className="text-gray-600">
            Discover bite-sized lessons across psychology, technology, and productivity
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search lessons by title, content, or tags..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <ApperIcon name="X" size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
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

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedCategory === 'All' 
                  ? 'All Lessons' 
                  : `${selectedCategory} Lessons`
              }
            </h2>
            <p className="text-sm text-gray-600">
              {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Sort options could go here in the future */}
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
                name={searchQuery ? "Search" : "BookOpen"} 
                size={64} 
                className="text-gray-300 mx-auto mb-6" 
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No results found' : 'No lessons available'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                {searchQuery 
                  ? `Try adjusting your search terms or browse a different category.`
                  : `No lessons found in the ${selectedCategory} category.`
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Clear Search
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
      </div>
    </div>
  )
}

export default Learn