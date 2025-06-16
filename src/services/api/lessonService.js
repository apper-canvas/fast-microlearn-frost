import lessonsData from '@/services/mockData/lessons.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LessonService {
  constructor() {
    this.lessons = [...lessonsData];
  }

  async getAll() {
    await delay(300);
    return [...this.lessons];
  }

  async getById(id) {
    await delay(250);
    const lesson = this.lessons.find(lesson => lesson.Id === parseInt(id, 10));
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    return { ...lesson };
  }

  async getByCategory(category) {
    await delay(300);
    const filtered = this.lessons.filter(lesson => 
      lesson.category.toLowerCase() === category.toLowerCase()
    );
    return [...filtered];
  }

  async getTodaysLessons() {
    await delay(250);
    // Simulate getting recommended lessons for today
    const recommended = this.lessons.slice(0, 3);
    return [...recommended];
  }

  async markCompleted(id) {
    await delay(200);
    const lessonIndex = this.lessons.findIndex(lesson => lesson.Id === parseInt(id, 10));
    if (lessonIndex === -1) {
      throw new Error('Lesson not found');
    }
    
    this.lessons[lessonIndex] = {
      ...this.lessons[lessonIndex],
      completedAt: new Date().toISOString()
    };
    
    return { ...this.lessons[lessonIndex] };
  }

  async getCompletedLessons() {
    await delay(300);
    const completed = this.lessons.filter(lesson => lesson.completedAt);
    return [...completed];
  }

  async searchLessons(query) {
    await delay(400);
    const searchTerm = query.toLowerCase();
    const filtered = this.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm) ||
      lesson.content.toLowerCase().includes(searchTerm) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm))
);
    return [...filtered];
  }

  async getWeeklyCompletedLessons() {
    await delay(300);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyCompleted = this.lessons.filter(lesson => {
      if (!lesson.completedAt) return false;
      const completedDate = new Date(lesson.completedAt);
      return completedDate >= weekAgo && completedDate <= now;
    });
    
    return [...weeklyCompleted];
  }
}

export default new LessonService();