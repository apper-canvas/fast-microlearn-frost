import quizzesData from '@/services/mockData/quizzes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData];
  }

  async getAll() {
    await delay(300);
    return [...this.quizzes];
  }

  async getById(id) {
    await delay(250);
    const quiz = this.quizzes.find(quiz => quiz.Id === parseInt(id, 10));
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return { ...quiz };
  }

  async getByLessonId(lessonId) {
    await delay(300);
    const quiz = this.quizzes.find(quiz => quiz.lessonId === parseInt(lessonId, 10));
    if (!quiz) {
      throw new Error('Quiz not found for this lesson');
    }
    return { ...quiz };
  }

  async submitQuiz(id, answers) {
    await delay(400);
    const quizIndex = this.quizzes.findIndex(quiz => quiz.Id === parseInt(id, 10));
    if (quizIndex === -1) {
      throw new Error('Quiz not found');
    }

    const quiz = this.quizzes[quizIndex];
    let correctAnswers = 0;
    
    // Calculate score based on correct answers
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    // Update quiz with score and completion date
    this.quizzes[quizIndex] = {
      ...quiz,
      score,
      completedAt: new Date().toISOString(),
      userAnswers: answers
    };

    return {
      quiz: { ...this.quizzes[quizIndex] },
      correctAnswers,
      totalQuestions: quiz.questions.length,
      score
    };
  }

  async getUserQuizResults() {
    await delay(300);
const completed = this.quizzes.filter(quiz => quiz.completedAt);
    return [...completed];
  }

  async getWeeklyQuizResults() {
    await delay(300);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyCompleted = this.quizzes.filter(quiz => {
      if (!quiz.completedAt) return false;
      const completedDate = new Date(quiz.completedAt);
      return completedDate >= weekAgo && completedDate <= now;
    });
    
    return [...weeklyCompleted];
  }
}

export default new QuizService();