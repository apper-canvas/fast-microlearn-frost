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
}

export default new UserProgressService();