
export enum Category {
  NEWS = 'أخبار الكلية',
  ARTICLES = 'مقالات أكاديمية',
  INTERVIEWS = 'مقابلات',
  CULTURE = 'قسم ثقافي',
  ANNOUNCEMENTS = 'إعلانات'
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  date: string;
  image: string;
  tags: string[];
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'urgent' | 'normal';
}
