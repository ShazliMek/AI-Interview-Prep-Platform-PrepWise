import { type Interview } from '@/types';

export interface PresetInterview extends Interview {
  description: string;
  company: string;
  companyLogo: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  tags?: string[];
}

export const presetInterviews: PresetInterview[] = [
  {
    id: 'frontend-react-meta',
    role: 'Frontend Developer',
    level: 'Mid-level',
    type: 'Technical',
    techstack: ['React', 'JavaScript', 'TypeScript', 'CSS'],
    description: 'Frontend interview focusing on React fundamentals, component lifecycle, hooks, and state management.',
    company: 'Meta',
    companyLogo: '/covers/facebook.png',
    difficulty: 'Intermediate',
    duration: 45,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Frontend', 'React', 'Web Development'],
    questions: [
      'Explain the virtual DOM in React and how it improves performance.',
      'What are React hooks? Explain useState and useEffect.',
      'How would you optimize a React application for performance?',
      'Explain the difference between state and props in React.',
      'How do you handle side effects in React components?'
    ]
  },
  {
    id: 'backend-node-amazon',
    role: 'Backend Engineer',
    level: 'Senior',
    type: 'Technical',
    techstack: ['Node.js', 'Express', 'MongoDB', 'AWS'],
    description: 'Backend development interview with a focus on Node.js, API design, database management, and AWS services.',
    company: 'Amazon',
    companyLogo: '/covers/amazon.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Backend', 'Node.js', 'Cloud', 'Databases'],
    questions: [
      'How do you design a scalable REST API using Node.js and Express?',
      'Explain the event loop in Node.js and how it handles asynchronous operations.',
      'How would you implement authentication and authorization in a Node.js application?',
      'Describe your experience with AWS services for backend infrastructure.',
      'How do you ensure data consistency in a distributed system?'
    ]
  },
  {
    id: 'fullstack-engineer-spotify',
    role: 'Full Stack Engineer',
    level: 'Mid-level',
    type: 'Mixed',
    techstack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    description: 'Comprehensive full stack interview covering both frontend and backend technologies with real-world scenarios.',
    company: 'Spotify',
    companyLogo: '/covers/spotify.png',
    difficulty: 'Intermediate',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Full Stack', 'React', 'Node.js', 'Database'],
    questions: [
      'How do you handle state management in a complex React application?',
      'Explain your approach to designing and implementing RESTful APIs.',
      'How would you optimize database queries for performance?',
      'Describe your experience with TypeScript and its benefits in a full stack application.',
      'How do you implement CI/CD pipelines for a full stack application?'
    ]
  },
  {
    id: 'product-manager-pinterest',
    role: 'Product Manager',
    level: 'Senior',
    type: 'Behavioral',
    techstack: [],
    description: 'Product management interview focusing on product strategy, user research, and cross-functional collaboration.',
    company: 'Pinterest',
    companyLogo: '/covers/pinterest.png',
    difficulty: 'Advanced',
    duration: 45,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Product Management', 'Strategy', 'Leadership'],
    questions: [
      'Tell me about a product you launched from concept to completion.',
      'How do you prioritize features in a product roadmap?',
      'Describe how you work with engineering and design teams.',
      'How do you measure the success of a product?',
      'Give an example of a time when you had to make a difficult product decision based on data.'
    ]
  },
  {
    id: 'data-science-adobe',
    role: 'Data Scientist',
    level: 'Mid-level',
    type: 'Technical',
    techstack: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
    description: 'Data science interview covering statistical methods, machine learning models, and practical problem-solving.',
    company: 'Adobe',
    companyLogo: '/covers/adobe.png',
    difficulty: 'Intermediate',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Data Science', 'Machine Learning', 'Python', 'Analytics'],
    questions: [
      'Explain the difference between supervised and unsupervised learning with examples.',
      'How do you handle missing data in a dataset?',
      'Describe a challenging data science project you worked on and how you approached it.',
      'How would you explain a complex machine learning model to non-technical stakeholders?',
      'What metrics would you use to evaluate a classification model?'
    ]
  }
];

// Function to get a preset interview by ID
export function getPresetInterviewById(id: string): PresetInterview | undefined {
  return presetInterviews.find(interview => interview.id === id);
}

// Function to get all preset interviews
export function getAllPresetInterviews(): PresetInterview[] {
  return presetInterviews;
}
