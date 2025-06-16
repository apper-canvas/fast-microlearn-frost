import userProgressData from '@/services/mockData/userProgress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.userProgress = { ...userProgressData };
  }

  async getProgress() {
    await delay(250);
    return { ...this.userProgress };
  }

  async updateStreak() {
    await delay(200);
    const today = new Date().toDateString();
    const lastActivity = new Date(this.userProgress.lastActivity).toDateString();
    
    if (today !== lastActivity) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastActivity === yesterdayStr) {
        // Continue streak
        this.userProgress.streak += 1;
      } else {
        // Reset streak
        this.userProgress.streak = 1;
      }
      
      this.userProgress.lastActivity = new Date().toISOString();
    }
    
    return { ...this.userProgress };
  }

  async incrementLessonsCompleted() {
    await delay(200);
    this.userProgress.totalLessons += 1;
    this.userProgress.lastActivity = new Date().toISOString();
    return { ...this.userProgress };
  }

  async updateCategoryScore(category, score) {
    await delay(200);
    if (!this.userProgress.categoryScores) {
      this.userProgress.categoryScores = {};
    }
    
    const currentScores = this.userProgress.categoryScores[category] || [];
    currentScores.push(score);
    
    // Keep only last 10 scores for average calculation
    if (currentScores.length > 10) {
      currentScores.shift();
    }
    
    this.userProgress.categoryScores[category] = currentScores;
    return { ...this.userProgress };
  }

  async adjustDifficulty(performance) {
    await delay(200);
    // Simple algorithm: if performance > 80%, increase difficulty; if < 60%, decrease
    if (performance > 80 && this.userProgress.preferredDifficulty < 5) {
      this.userProgress.preferredDifficulty += 0.5;
    } else if (performance < 60 && this.userProgress.preferredDifficulty > 1) {
      this.userProgress.preferredDifficulty -= 0.5;
    }
return { ...this.userProgress };
  }

  async getWeeklyStats() {
    await delay(300);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate weekly lessons completed (simulated based on recent activity)
    const weeklyLessons = Math.min(this.userProgress.totalLessons, 5);
    
    // Calculate weekly quiz average from category scores
    const allScores = Object.values(this.userProgress.categoryScores || {}).flat();
    const recentScores = allScores.slice(-6); // Last 6 quizzes as weekly sample
    const weeklyQuizAverage = recentScores.length > 0 
      ? Math.round(recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length)
      : 0;
    
    // Topics mastered (categories with average > 85%)
    const topicsMastered = Object.entries(this.userProgress.categoryScores || {})
      .filter(([category, scores]) => {
        const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return avg >= 85;
      }).length;
    
    return {
      weeklyLessonsCompleted: weeklyLessons,
      weeklyQuizAverage,
      topicsMastered,
      currentStreak: this.userProgress.streak,
      weeklyGoalProgress: Math.min((weeklyLessons / 7) * 100, 100),
      totalLessons: this.userProgress.totalLessons
    };
  }
}

export default new UserProgressService();