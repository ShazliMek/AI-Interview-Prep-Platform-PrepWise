module.exports = {

"[project]/constants/presets.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getAllPresetInterviews": (()=>getAllPresetInterviews),
    "getPresetInterviewById": (()=>getPresetInterviewById),
    "presetInterviews": (()=>presetInterviews)
});
const presetInterviews = [
    {
        id: 'frontend-react-meta',
        role: 'Frontend Developer',
        level: 'Mid-level',
        type: 'Technical',
        techstack: [
            'React',
            'JavaScript',
            'TypeScript',
            'CSS'
        ],
        description: 'Frontend interview focusing on React fundamentals, component lifecycle, hooks, and state management.',
        company: 'Meta',
        companyLogo: '/covers/facebook.png',
        difficulty: 'Intermediate',
        duration: 45,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Frontend',
            'React',
            'Web Development'
        ],
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
        techstack: [
            'Node.js',
            'Express',
            'MongoDB',
            'AWS'
        ],
        description: 'Backend development interview with a focus on Node.js, API design, database management, and AWS services.',
        company: 'Amazon',
        companyLogo: '/covers/amazon.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Backend',
            'Node.js',
            'Cloud',
            'Databases'
        ],
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
        techstack: [
            'React',
            'Node.js',
            'TypeScript',
            'PostgreSQL'
        ],
        description: 'Comprehensive full stack interview covering both frontend and backend technologies with real-world scenarios.',
        company: 'Spotify',
        companyLogo: '/covers/spotify.png',
        difficulty: 'Intermediate',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Full Stack',
            'React',
            'Node.js',
            'Database'
        ],
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
        techstack: [
            'Python',
            'SQL',
            'Machine Learning',
            'Statistics'
        ],
        description: 'Data science interview covering statistical methods, machine learning models, and practical problem-solving.',
        company: 'Adobe',
        companyLogo: '/covers/adobe.png',
        difficulty: 'Intermediate',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Data Science',
            'Machine Learning',
            'Python',
            'Analytics'
        ],
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
        techstack: [
            'Python',
            'TensorFlow',
            'PyTorch',
            'MLOps'
        ],
        description: 'Machine learning engineer interview focusing on model development, deployment, and optimization.',
        company: 'hostinger',
        companyLogo: '/covers/hostinger.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Machine Learning',
            'AI',
            'MLOps',
            'Python'
        ],
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
        techstack: [
            'Swift',
            'UIKit',
            'SwiftUI',
            'Core Data'
        ],
        description: 'iOS development interview focusing on Swift, UIKit/SwiftUI, and Apple platform development.',
        company: 'reddit',
        companyLogo: '/covers/reddit.png',
        difficulty: 'Intermediate',
        duration: 45,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'iOS',
            'Swift',
            'Mobile Development',
            'Apple'
        ],
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
        techstack: [
            'Docker',
            'Kubernetes',
            'Terraform',
            'CI/CD'
        ],
        description: 'DevOps engineering interview focusing on containerization, infrastructure as code, and CI/CD pipelines.',
        company: 'skype',
        companyLogo: '/covers/skype.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'DevOps',
            'Cloud',
            'Infrastructure',
            'Automation'
        ],
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
        techstack: [
            'Figma',
            'Adobe XD',
            'User Research',
            'Prototyping'
        ],
        description: 'UX design interview focusing on user research, wireframing, prototyping, and design systems.',
        company: 'telegram',
        companyLogo: '/covers/telegram.png',
        difficulty: 'Intermediate',
        duration: 45,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'UX Design',
            'User Research',
            'Prototyping',
            'Design'
        ],
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
        techstack: [
            'Network Security',
            'Penetration Testing',
            'Security Auditing',
            'Threat Analysis'
        ],
        description: 'Cybersecurity interview focusing on threat detection, vulnerability assessment, and security protocols.',
        company: 'tiktok',
        companyLogo: '/covers/tiktok.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Cybersecurity',
            'Security',
            'Network',
            'Compliance'
        ],
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
        techstack: [
            'Kotlin',
            'Java',
            'Android SDK',
            'Jetpack Compose'
        ],
        description: 'Android development interview focusing on Kotlin, Android architecture components, and app optimization.',
        company: 'yahoo',
        companyLogo: '/covers/yahoo.png',
        difficulty: 'Intermediate',
        duration: 45,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Android',
            'Mobile Development',
            'Kotlin',
            'Java'
        ],
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
        tags: [
            'Product Management',
            'Strategy',
            'Leadership'
        ],
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
        techstack: [
            'Python',
            'Spark',
            'Hadoop',
            'SQL',
            'ETL'
        ],
        description: 'Data engineering interview focusing on data pipelines, ETL processes, and distributed data processing.',
        company: 'Linkedin',
        companyLogo: '/covers/linkedin.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Data Engineering',
            'Big Data',
            'ETL',
            'Pipelines'
        ],
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
        techstack: [
            'AWS',
            'Azure',
            'GCP',
            'Terraform',
            'Microservices'
        ],
        description: 'Cloud architecture interview focusing on multi-cloud strategies, scalability, and cost optimization.',
        company: 'Oracle',
        companyLogo: '/covers/oracle.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Cloud',
            'Architecture',
            'Infrastructure',
            'Design'
        ],
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
        techstack: [
            'Solidity',
            'Ethereum',
            'Smart Contracts',
            'Web3'
        ],
        description: 'Blockchain development interview focusing on smart contracts, decentralized applications, and Web3.',
        company: 'Coinbase',
        companyLogo: '/covers/coinbase.png',
        difficulty: 'Advanced',
        duration: 60,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'Blockchain',
            'Ethereum',
            'Web3',
            'Smart Contracts'
        ],
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
        techstack: [
            'Selenium',
            'Jest',
            'Cypress',
            'JUnit',
            'TestNG'
        ],
        description: 'Quality assurance interview focusing on automation testing, test strategies, and quality control.',
        company: 'Salesforce',
        companyLogo: '/covers/salesforce.png',
        difficulty: 'Intermediate',
        duration: 45,
        createdAt: new Date().toISOString(),
        userId: 'system',
        finalized: true,
        isPreset: true,
        tags: [
            'QA',
            'Testing',
            'Automation',
            'Quality'
        ],
        questions: [
            'Explain your approach to test planning and test case development.',
            'How do you decide what tests to automate versus manual testing?',
            'Describe your experience with different testing frameworks and tools.',
            'How would you test a complex feature with multiple integration points?',
            'What metrics do you use to measure the effectiveness of QA processes?'
        ]
    }
];
function getPresetInterviewById(id) {
    return presetInterviews.find((interview)=>interview.id === id);
}
function getAllPresetInterviews() {
    return presetInterviews;
}
}}),
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Card": (()=>Card),
    "CardAction": (()=>CardAction),
    "CardContent": (()=>CardContent),
    "CardDescription": (()=>CardDescription),
    "CardFooter": (()=>CardFooter),
    "CardHeader": (()=>CardHeader),
    "CardTitle": (()=>CardTitle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, this));
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 27,
        columnNumber: 3
    }, this));
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, this));
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, this));
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 72,
        columnNumber: 3
    }, this));
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 82,
        columnNumber: 3
    }, this));
CardFooter.displayName = "CardFooter";
const CardAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("ml-auto flex items-center space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
CardAction.displayName = "CardAction";
;
}}),
"[project]/components/DisplayTechIcons.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const DisplayTechIcons = ({ techStack })=>{
    const [techIcons, setTechIcons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadTechIcons = async ()=>{
            try {
                const icons = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getTechLogos"])(techStack);
                setTechIcons(icons);
            } catch (error) {
                console.error('Failed to load tech icons:', error);
                // Fallback to default tech icon
                setTechIcons(techStack.map((tech)=>({
                        tech,
                        url: '/tech.svg'
                    })));
            } finally{
                setLoading(false);
            }
        };
        loadTechIcons();
    }, [
        techStack
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-row",
            children: [
                1,
                2,
                3,
                4
            ].map((index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative group bg-dark-300 rounded-full p-2 flex-center', index >= 1 && '-ml-3'),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "size-5 bg-gray-400 rounded animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayTechIcons.tsx",
                        lineNumber: 35,
                        columnNumber: 13
                    }, this)
                }, index, false, {
                    fileName: "[project]/components/DisplayTechIcons.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/DisplayTechIcons.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-row",
        children: techIcons.slice(0, 4).map(({ tech, url }, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative group bg-dark-300 rounded-full p-2 flex-center', index >= 1 && '-ml-3'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "tech-tooltip",
                        children: tech
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayTechIcons.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: url,
                        alt: tech,
                        width: 100,
                        height: 100,
                        className: "size-5"
                    }, void 0, false, {
                        fileName: "[project]/components/DisplayTechIcons.tsx",
                        lineNumber: 47,
                        columnNumber: 11
                    }, this)
                ]
            }, tech, true, {
                fileName: "[project]/components/DisplayTechIcons.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/DisplayTechIcons.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = DisplayTechIcons;
}}),
"[project]/components/PresetInterviewCard.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DisplayTechIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DisplayTechIcons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const PresetInterviewCard = ({ interview })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "w-full max-w-sm rounded-xl border-2 border-gray-800 bg-gray-900 text-white shadow-lg transition-all hover:border-blue-500/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                className: "flex flex-col items-center justify-center p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            src: interview.companyLogo,
                            alt: `${interview.company} logo`,
                            width: 50,
                            height: 50,
                            className: "rounded-full",
                            onError: (e)=>{
                                const imgElement = e.currentTarget;
                                imgElement.src = '/default-avatar.png';
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/PresetInterviewCard.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-gray-400",
                            children: interview.company
                        }, void 0, false, {
                            fileName: "[project]/components/PresetInterviewCard.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PresetInterviewCard.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/PresetInterviewCard.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "mb-2 text-xl font-bold",
                        children: [
                            interview.role,
                            " Interview"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PresetInterviewCard.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 text-sm text-gray-400 line-clamp-2",
                        children: interview.description
                    }, void 0, false, {
                        fileName: "[project]/components/PresetInterviewCard.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-xs text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/calendar.svg",
                                        alt: "date",
                                        width: 16,
                                        height: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/PresetInterviewCard.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: new Date(interview.createdAt).toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/components/PresetInterviewCard.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PresetInterviewCard.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/star.svg",
                                        alt: "score",
                                        width: 16,
                                        height: 16
                                    }, void 0, false, {
                                        fileName: "[project]/components/PresetInterviewCard.tsx",
                                        lineNumber: 40,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "---/100"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PresetInterviewCard.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PresetInterviewCard.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PresetInterviewCard.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PresetInterviewCard.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardFooter"], {
                className: "flex justify-between p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DisplayTechIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        techStack: interview.techstack
                    }, void 0, false, {
                        fileName: "[project]/components/PresetInterviewCard.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/interview?presetId=${interview.id}`,
                        passHref: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            className: "bg-blue-600 text-white hover:bg-blue-700",
                            children: "Start Interview"
                        }, void 0, false, {
                            fileName: "[project]/components/PresetInterviewCard.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/PresetInterviewCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PresetInterviewCard.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PresetInterviewCard.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = PresetInterviewCard;
}}),
"[project]/lib/utils/companyLogos.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Map common company names to their logo paths
__turbopack_context__.s({
    "getCompanyLogo": (()=>getCompanyLogo)
});
const companyLogoMap = {
    // Tech companies
    'meta': '/covers/facebook.png',
    'facebook': '/covers/facebook.png',
    'fb': '/covers/facebook.png',
    'google': '/covers/google.png',
    'alphabet': '/covers/google.png',
    'microsoft': '/covers/microsoft.png',
    'msft': '/covers/microsoft.png',
    'apple': '/covers/apple.png',
    'amazon': '/covers/amazon.png',
    'aws': '/covers/amazon.png',
    'netflix': '/covers/netflix.png',
    'adobe': '/covers/adobe.png',
    'spotify': '/covers/spotify.png',
    'twitter': '/covers/twitter.png',
    'x': '/covers/twitter.png',
    'reddit': '/covers/reddit.png',
    'tiktok': '/covers/tiktok.png',
    'bytedance': '/covers/tiktok.png',
    'quora': '/covers/quora.png',
    'yahoo': '/covers/yahoo.png',
    'skype': '/covers/skype.png',
    'telegram': '/covers/telegram.png',
    'linkedin': '/covers/linkedin.png',
    'github': '/covers/github.png',
    'pinterest': '/covers/pinterest.png',
    'uber': '/covers/uber.png',
    'airbnb': '/covers/airbnb.png',
    'stripe': '/covers/stripe.png',
    'dropbox': '/covers/dropbox.png',
    // Default for unknown companies
    'default': '/default-avatar.png'
};
function getCompanyLogo(companyName) {
    if (!companyName) return companyLogoMap.default;
    // Normalize company name for matching
    const normalizedCompany = companyName.trim().toLowerCase();
    // STEP 1: Exact match check - highest priority
    if (companyLogoMap[normalizedCompany]) {
        console.log(`[Logo] Exact match for "${companyName}": ${companyLogoMap[normalizedCompany]}`);
        return companyLogoMap[normalizedCompany];
    }
    // STEP 2: Special case for Meta/Facebook
    if (normalizedCompany === 'meta' || normalizedCompany === 'meta platforms') {
        console.log(`[Logo] Meta special case for "${companyName}": ${companyLogoMap['facebook']}`);
        return companyLogoMap['facebook'];
    }
    // STEP 3: Word boundary match - check if company name starts with a known company
    // This prevents "adobe metadata" from matching with "meta"
    const companyWords = normalizedCompany.split(/\s+/);
    for (const word of companyWords){
        if (companyLogoMap[word]) {
            console.log(`[Logo] Word match for "${companyName}" -> "${word}": ${companyLogoMap[word]}`);
            return companyLogoMap[word];
        }
    }
    // STEP 4: First-word match (often the most important part of company name)
    if (companyWords.length > 0 && companyLogoMap[companyWords[0]]) {
        console.log(`[Logo] First word match for "${companyName}" -> "${companyWords[0]}": ${companyLogoMap[companyWords[0]]}`);
        return companyLogoMap[companyWords[0]];
    }
    // STEP 5: Check for word prefix matches
    // Sort by length in descending order to match the most specific company name first
    const companies = Object.keys(companyLogoMap).filter((company)=>company !== 'default').sort((a, b)=>b.length - a.length);
    for (const word of companyWords){
        for (const company of companies){
            // Check if a word starts with a company name (like "google" in "googleplex")
            if (word.startsWith(company) && company.length > 2) {
                console.log(`[Logo] Word prefix match for "${companyName}" -> "${company}": ${companyLogoMap[company]}`);
                return companyLogoMap[company];
            }
        }
    }
    // STEP 6: Substring match (lowest priority, most prone to false matches)
    // Only check for substantial company names (length > 3) to avoid matching common short strings
    for (const company of companies){
        if (company.length > 3 && normalizedCompany.includes(company)) {
            console.log(`[Logo] Substring match for "${companyName}" -> "${company}": ${companyLogoMap[company]}`);
            return companyLogoMap[company];
        }
    }
    // If no match found, return default
    console.log(`[Logo] No match for "${companyName}", using default`);
    return companyLogoMap.default;
}
}}),
"[project]/components/CompletedInterviews.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>CompletedInterviews)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DisplayTechIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DisplayTechIcons.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$companyLogos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/companyLogos.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function CompletedInterviews() {
    const [interviews, setInterviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function fetchCompletedInterviews() {
            try {
                const response = await fetch('/api/get-completed-interviews');
                if (!response.ok) {
                    throw new Error('Failed to fetch completed interviews');
                }
                const data = await response.json();
                if (data.success && data.interviews) {
                    // Sort by created date to get most recent first
                    const sortedInterviews = [
                        ...data.interviews
                    ].sort((a, b)=>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setInterviews(sortedInterviews);
                } else {
                    setInterviews([]);
                }
            } catch (error) {
                console.error('Error fetching completed interviews:', error);
                setError('Failed to load your interviews');
            } finally{
                setLoading(false);
            }
        }
        fetchCompletedInterviews();
    }, []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-4 text-center",
            children: "Loading your interviews..."
        }, void 0, false, {
            fileName: "[project]/components/CompletedInterviews.tsx",
            lineNumber: 58,
            columnNumber: 12
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-4 text-center text-red-500",
            children: error
        }, void 0, false, {
            fileName: "[project]/components/CompletedInterviews.tsx",
            lineNumber: 62,
            columnNumber: 12
        }, this);
    }
    if (interviews.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "py-4 text-center text-gray-500",
            children: "You have not completed any interviews yet. Start an interview to see it here!"
        }, void 0, false, {
            fileName: "[project]/components/CompletedInterviews.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "interview-scroll-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "interview-scroll-wrapper",
            children: interviews.filter((interview, index, self)=>index === self.findIndex((i)=>i.company === interview.company && i.role === interview.role && i.level === interview.level)).map((interview)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "interview-card-container",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        className: "w-full max-w-sm rounded-xl border-2 border-gray-800 bg-gray-900 text-white shadow-lg transition-all hover:border-blue-500/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                className: "flex flex-col items-center justify-center p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: interview.company?.toLowerCase() === 'meta' ? '/covers/facebook.png' : interview.companyLogo || (interview.company ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$companyLogos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCompanyLogo"])(interview.company) : '/default-avatar.png'),
                                            alt: `${interview.company} logo`,
                                            width: 50,
                                            height: 50,
                                            className: "rounded-full",
                                            onError: (e)=>{
                                                const imgElement = e.currentTarget;
                                                imgElement.src = '/default-avatar.png';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/CompletedInterviews.tsx",
                                            lineNumber: 90,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-400",
                                            children: interview.company
                                        }, void 0, false, {
                                            fileName: "[project]/components/CompletedInterviews.tsx",
                                            lineNumber: 103,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CompletedInterviews.tsx",
                                    lineNumber: 89,
                                    columnNumber: 9
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/CompletedInterviews.tsx",
                                lineNumber: 88,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "mb-2 text-xl font-bold",
                                        children: [
                                            interview.role,
                                            " Interview"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                        lineNumber: 107,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mb-4 text-sm text-gray-400 line-clamp-2",
                                        children: interview.description
                                    }, void 0, false, {
                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                        lineNumber: 108,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between text-xs text-gray-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: "/calendar.svg",
                                                        alt: "date",
                                                        width: 16,
                                                        height: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                                        lineNumber: 111,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: new Date(interview.createdAt).toLocaleDateString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                                        lineNumber: 112,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CompletedInterviews.tsx",
                                                lineNumber: 110,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: "/star.svg",
                                                        alt: "score",
                                                        width: 16,
                                                        height: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "---/100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CompletedInterviews.tsx",
                                                lineNumber: 114,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                        lineNumber: 109,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CompletedInterviews.tsx",
                                lineNumber: 106,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardFooter"], {
                                className: "flex justify-between p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DisplayTechIcons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        techStack: interview.techstack
                                    }, void 0, false, {
                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                        lineNumber: 121,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/interview?presetId=${interview.id}`,
                                        passHref: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            className: "bg-blue-600 text-white hover:bg-blue-700",
                                            children: "Start Interview"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CompletedInterviews.tsx",
                                            lineNumber: 123,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/CompletedInterviews.tsx",
                                        lineNumber: 122,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CompletedInterviews.tsx",
                                lineNumber: 120,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CompletedInterviews.tsx",
                        lineNumber: 87,
                        columnNumber: 15
                    }, this)
                }, interview.id, false, {
                    fileName: "[project]/components/CompletedInterviews.tsx",
                    lineNumber: 86,
                    columnNumber: 13
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/CompletedInterviews.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/CompletedInterviews.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
}}),
"[project]/app/(root)/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/presets.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PresetInterviewCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PresetInterviewCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CompletedInterviews$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CompletedInterviews.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const page = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "card-cta",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-6 max-w-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Get Interview Ready with AI-Powered Practice & Feedback"
                            }, void 0, false, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 17,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg",
                                children: "Practice on real interview questions & get instant feedback"
                            }, void 0, false, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 18,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2 md:flex-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        asChild: true,
                                        className: "btn-primary max-sm:full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/interview",
                                            children: "Start an Interview"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(root)/page.tsx",
                                            lineNumber: 23,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(root)/page.tsx",
                                        lineNumber: 22,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        asChild: true,
                                        variant: "outline",
                                        className: "max-sm:full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/my-interviews",
                                            children: "My Interviews"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(root)/page.tsx",
                                            lineNumber: 30,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(root)/page.tsx",
                                        lineNumber: 25,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 21,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(root)/page.tsx",
                        lineNumber: 16,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: "/robot.png",
                        alt: "robo_dude",
                        width: 400,
                        height: 400,
                        className: "max-sm:hidden"
                    }, void 0, false, {
                        fileName: "[project]/app/(root)/page.tsx",
                        lineNumber: 34,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(root)/page.tsx",
                lineNumber: 15,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex flex-col gap-6 mt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Your Interviews"
                            }, void 0, false, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 38,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                variant: "outline",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/my-interviews",
                                    children: "View All My Interviews"
                                }, void 0, false, {
                                    fileName: "[project]/app/(root)/page.tsx",
                                    lineNumber: 40,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 39,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(root)/page.tsx",
                        lineNumber: 37,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CompletedInterviews$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/(root)/page.tsx",
                        lineNumber: 43,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(root)/page.tsx",
                lineNumber: 36,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "flex flex-col gap-6 mt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Take an interview"
                            }, void 0, false, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                variant: "outline",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/preset-interviews",
                                    children: "View All Preset Interviews"
                                }, void 0, false, {
                                    fileName: "[project]/app/(root)/page.tsx",
                                    lineNumber: 50,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(root)/page.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(root)/page.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "interview-scroll-container",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "interview-scroll-wrapper",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$presets$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["presetInterviews"].slice(0, 8).map((interview)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "interview-card-container",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PresetInterviewCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        interview: interview
                                    }, void 0, false, {
                                        fileName: "[project]/app/(root)/page.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this)
                                }, interview.id, false, {
                                    fileName: "[project]/app/(root)/page.tsx",
                                    lineNumber: 56,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(root)/page.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(root)/page.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(root)/page.tsx",
                lineNumber: 46,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = page;
}}),
"[project]/node_modules/next/dist/shared/lib/image-external.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getImageProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    getImageProps: function() {
        return getImageProps;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _getimgprops = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/get-img-props.js [app-ssr] (ecmascript)");
const _imagecomponent = __turbopack_context__.r("[project]/node_modules/next/dist/client/image-component.js [app-ssr] (ecmascript)");
const _imageloader = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/image-loader.js [app-ssr] (ecmascript)"));
function getImageProps(imgProps) {
    const { props } = (0, _getimgprops.getImgProps)(imgProps, {
        defaultLoader: _imageloader.default,
        // This is replaced by webpack define plugin
        imgConf: ("TURBOPACK compile-time value", JSON.parse('{"deviceSizes":[640,750,828,1080,1200,1920,2048,3840],"imageSizes":[16,32,48,64,96,128,256,384],"path":"/_next/image","loader":"default","dangerouslyAllowSVG":false,"unoptimized":false,"domains":[],"remotePatterns":[]}'))
    });
    // Normally we don't care about undefined props because we pass to JSX,
    // but this exported function could be used by the end user for anything
    // so we delete undefined props to clean it up a little.
    for (const [key, value] of Object.entries(props)){
        if (value === undefined) {
            delete props[key];
        }
    }
    return {
        props
    };
}
const _default = _imagecomponent.Image; //# sourceMappingURL=image-external.js.map
}}),
"[project]/node_modules/next/image.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/image-external.js [app-ssr] (ecmascript)");
}}),

};

//# sourceMappingURL=_2b4542f0._.js.map