import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const QuizQuestion = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false,
  questionNumber,
  totalQuestions 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question text */}
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {question.question}
      </h3>

      {/* Answer options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === question.correctAnswer
          const showCorrectAnswer = showResult && isCorrect
          const showIncorrectAnswer = showResult && isSelected && !isCorrect

          return (
            <motion.button
              key={index}
              whileHover={!showResult ? { scale: 1.01 } : {}}
              whileTap={!showResult ? { scale: 0.99 } : {}}
              onClick={() => !showResult && onAnswerSelect(index)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                ${!showResult && isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${showCorrectAnswer 
                  ? 'border-success bg-success/5' 
                  : ''
                }
                ${showIncorrectAnswer 
                  ? 'border-error bg-error/5' 
                  : ''
                }
                ${showResult ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">
                  {option}
                </span>
                
                {showResult && (
                  <div className="flex-shrink-0 ml-3">
                    {isCorrect && (
                      <ApperIcon
                        name="CheckCircle"
                        size={20}
                        className="text-success"
                      />
                    )}
                    {showIncorrectAnswer && (
                      <ApperIcon
                        name="XCircle"
                        size={20}
                        className="text-error"
                      />
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-start space-x-2">
            <ApperIcon
              name="Info"
              size={16}
              className="text-info mt-0.5 flex-shrink-0"
            />
            <div>
              <h4 className="font-medium text-info mb-1">Explanation</h4>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default QuizQuestion