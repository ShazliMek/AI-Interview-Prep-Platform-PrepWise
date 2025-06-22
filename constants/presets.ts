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
    companyLogo: '/covers/facebook.png', // Meta uses Facebook logo
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
  },
  {
    id: 'ml-engineer-google',
    role: 'ML Engineer',
    level: 'Senior',
    type: 'Technical',
    techstack: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
    description: 'Machine learning engineer interview focusing on model development, deployment, and optimization.',
    company: 'hostinger',
    companyLogo: '/covers/hostinger.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Machine Learning', 'AI', 'MLOps', 'Python'],
    questions: [
      'Explain the difference between CNN and RNN architectures and their applications.',
      'How do you deploy machine learning models to production?',
      'Describe your approach to hyperparameter tuning and model optimization.',
      'How would you handle class imbalance in a classification problem?',
      'Explain the concept of attention mechanisms in deep learning.'
    ]
  },
  {
    id: 'ios-developer-apple',
    role: 'iOS Developer',
    level: 'Mid-level',
    type: 'Technical',
    techstack: ['Swift', 'UIKit', 'SwiftUI', 'Core Data'],
    description: 'iOS development interview focusing on Swift, UIKit/SwiftUI, and Apple platform development.',
    company: 'reddit',
    companyLogo: '/covers/reddit.png',
    difficulty: 'Intermediate',
    duration: 45,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['iOS', 'Swift', 'Mobile Development', 'Apple'],
    questions: [
      'Explain the differences between structs and classes in Swift.',
      'How do you handle memory management in iOS applications?',
      'Describe your experience with SwiftUI and how it differs from UIKit.',
      'How would you implement offline data persistence in an iOS app?',
      'Explain how you would design a scalable iOS architecture.'
    ]
  },
  {
    id: 'devops-engineer-netflix',
    role: 'DevOps Engineer',
    level: 'Senior',
    type: 'Technical',
    techstack: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    description: 'DevOps engineering interview focusing on containerization, infrastructure as code, and CI/CD pipelines.',
    company: 'skype',
    companyLogo: '/covers/skype.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['DevOps', 'Cloud', 'Infrastructure', 'Automation'],
    questions: [
      'Explain your experience with Kubernetes and how you have used it in production.',
      'How would you design a CI/CD pipeline for a microservices architecture?',
      'Describe your approach to infrastructure as code and the tools you prefer.',
      'How do you handle secrets management in a cloud environment?',
      'What strategies do you use for monitoring and alerting in production systems?'
    ]
  },
  {
    id: 'ux-designer-airbnb',
    role: 'UX Designer',
    level: 'Mid-level',
    type: 'Mixed',
    techstack: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    description: 'UX design interview focusing on user research, wireframing, prototyping, and design systems.',
    company: 'telegram',
    companyLogo: '/covers/telegram.png',
    difficulty: 'Intermediate',
    duration: 45,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['UX Design', 'User Research', 'Prototyping', 'Design'],
    questions: [
      'Walk me through your design process from research to final delivery.',
      'How do you incorporate user feedback into your design decisions?',
      'Describe a challenging design problem you solved and your approach.',
      'How do you collaborate with developers to ensure design implementation?',
      'What methods do you use to test the usability of your designs?'
    ]
  },
  {
    id: 'cybersecurity-analyst-microsoft',
    role: 'Cybersecurity Analyst',
    level: 'Senior',
    type: 'Technical',
    techstack: ['Network Security', 'Penetration Testing', 'Security Auditing', 'Threat Analysis'],
    description: 'Cybersecurity interview focusing on threat detection, vulnerability assessment, and security protocols.',
    company: 'tiktok',
    companyLogo: '/covers/tiktok.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Cybersecurity', 'Security', 'Network', 'Compliance'],
    questions: [
      'How would you respond to a detected security breach in a production environment?',
      'Explain your approach to vulnerability assessment and penetration testing.',
      'What security measures would you implement for a cloud-based application?',
      'How do you stay updated on the latest security threats and vulnerabilities?',
      'Describe your experience with security compliance frameworks such as GDPR or SOC 2.'
    ]
  },
  {
    id: 'android-developer-uber',
    role: 'Android Developer',
    level: 'Mid-level',
    type: 'Technical',
    techstack: ['Kotlin', 'Java', 'Android SDK', 'Jetpack Compose'],
    description: 'Android development interview focusing on Kotlin, Android architecture components, and app optimization.',
    company: 'yahoo',
    companyLogo: '/covers/yahoo.png',
    difficulty: 'Intermediate',
    duration: 45,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Android', 'Mobile Development', 'Kotlin', 'Java'],
    questions: [
      'Compare and contrast Kotlin and Java for Android development.',
      'Explain the Android application lifecycle and how you handle configuration changes.',
      'How do you implement background processing in Android applications?',
      'Describe your experience with Jetpack Compose and MVVM architecture.',
      'How do you optimize Android app performance and battery usage?'
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
    id: 'data-engineer-linkedin',
    role: 'Data Engineer',
    level: 'Senior',
    type: 'Technical',
    techstack: ['Python', 'Spark', 'Hadoop', 'SQL', 'ETL'],
    description: 'Data engineering interview focusing on data pipelines, ETL processes, and distributed data processing.',
    company: 'Linkedin',
    companyLogo: '/covers/linkedin.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Data Engineering', 'Big Data', 'ETL', 'Pipelines'],
    questions: [
      'How would you design a data pipeline for processing large volumes of real-time data?',
      'Explain your experience with Apache Spark and how you have used it in production.',
      'How do you approach data modeling for a data warehouse?',
      'Describe strategies for optimizing SQL queries for performance.',
      'How would you handle data quality issues in a data pipeline?'
    ]
  },
  {
    id: 'cloud-architect-oracle',
    role: 'Cloud Architect',
    level: 'Senior',
    type: 'Technical',
    techstack: ['AWS', 'Azure', 'GCP', 'Terraform', 'Microservices'],
    description: 'Cloud architecture interview focusing on multi-cloud strategies, scalability, and cost optimization.',
    company: 'Oracle',
    companyLogo: '/covers/oracle.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Cloud', 'Architecture', 'Infrastructure', 'Design'],
    questions: [
      'How would you design a highly available and fault-tolerant system on a cloud platform?',
      'Compare and contrast different cloud service models (IaaS, PaaS, SaaS) and when to use each.',
      'Explain your approach to cost optimization in cloud environments.',
      'How would you implement security best practices in a cloud architecture?',
      'Describe your experience with multi-cloud strategies and their advantages.'
    ]
  },
  {
    id: 'blockchain-developer-coinbase',
    role: 'Blockchain Developer',
    level: 'Mid-level',
    type: 'Technical',
    techstack: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3'],
    description: 'Blockchain development interview focusing on smart contracts, decentralized applications, and Web3.',
    company: 'Coinbase',
    companyLogo: '/covers/coinbase.png',
    difficulty: 'Advanced',
    duration: 60,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['Blockchain', 'Ethereum', 'Web3', 'Smart Contracts'],
    questions: [
      'Explain how smart contracts work and potential security vulnerabilities.',
      'How would you test and deploy a smart contract to the Ethereum network?',
      'Describe your experience with decentralized application (dApp) development.',
      'What strategies do you use to optimize gas costs in Ethereum transactions?',
      'How would you implement authentication in a Web3 application?'
    ]
  },
  {
    id: 'qa-engineer-salesforce',
    role: 'QA Engineer',
    level: 'Mid-level',
    type: 'Technical',
    techstack: ['Selenium', 'Jest', 'Cypress', 'JUnit', 'TestNG'],
    description: 'Quality assurance interview focusing on automation testing, test strategies, and quality control.',
    company: 'Salesforce',
    companyLogo: '/covers/salesforce.png',
    difficulty: 'Intermediate',
    duration: 45,
    createdAt: new Date().toISOString(),
    userId: 'system',
    finalized: true,
    isPreset: true,
    tags: ['QA', 'Testing', 'Automation', 'Quality'],
    questions: [
      'Explain your approach to test planning and test case development.',
      'How do you decide what tests to automate versus manual testing?',
      'Describe your experience with different testing frameworks and tools.',
      'How would you test a complex feature with multiple integration points?',
      'What metrics do you use to measure the effectiveness of QA processes?'
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
