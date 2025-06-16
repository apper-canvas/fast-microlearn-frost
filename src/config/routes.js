import Home from '@/components/pages/Home';
import Learn from '@/components/pages/Learn';
import Progress from '@/components/pages/Progress';
import Library from '@/components/pages/Library';
import Lesson from '@/components/pages/Lesson';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  learn: {
    id: 'learn',
    label: 'Learn',
    path: '/learn',
    icon: 'BookOpen',
    component: Learn
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  library: {
    id: 'library',
    label: 'Library',
    path: '/library',
    icon: 'Library',
    component: Library
  },
  lesson: {
    id: 'lesson',
    label: 'Lesson',
    path: '/lesson/:id',
    icon: 'BookOpen',
    component: Lesson,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;