export const TARGET_ROLES = [
  {
    id: "role-sde",
    name: "Software Development Engineer (SDE 1)",
    description: "Focuses on core Data Structures, Algorithms, OOPs, System Design, and Clean Code in C++/Java/Python.",
    benchmarkSkills: {
      "Data Structures & Algorithms": 90,
      "System Design & Architecture": 70,
      "DBMS & SQL": 80,
      "Operating Systems & Networks": 75,
      "Version Control (Git)": 85,
      "Problem Solving & Logic": 95
    },
    learningRoadmap: [
      {
        skill: "Data Structures & Algorithms",
        priority: "High",
        status: "Action Needed",
        target: 90,
        resources: [
          { title: "Striver's A2Z DSA Sheet", platform: "takeUforward / YouTube", type: "Free Course" },
          { title: "LeetCode Top 150 Interview Questions", platform: "LeetCode", type: "Practice Platform" }
        ],
        projectIdea: "Build a Custom In-Memory Key-Value Store with LRU Eviction Policy in C++/Java."
      },
      {
        skill: "System Design & Architecture",
        priority: "High",
        status: "Recommended",
        target: 70,
        resources: [
          { title: "Grokking Modern System Design", platform: "Educative / YouTube", type: "Tutorial" },
          { title: "ByteByteGo System Design Primer", platform: "YouTube", type: "Video Series" }
        ],
        projectIdea: "Design a Scalable Distributed URL Shortener with Redis Caching and Rate Limiting."
      }
    ]
  },
  {
    id: "role-fullstack",
    name: "Full Stack Web Developer (React + Node)",
    description: "Builds modern responsive web applications, REST APIs, Microservices, and Cloud deployments.",
    benchmarkSkills: {
      "React & Frontend Tech": 90,
      "Node.js & Backend APIs": 85,
      "DBMS & SQL / NoSQL": 80,
      "Cloud & DevOps Basics": 70,
      "Version Control (Git)": 85,
      "Data Structures & Algorithms": 70
    },
    learningRoadmap: [
      {
        skill: "React & Frontend Tech",
        priority: "High",
        status: "Strong",
        target: 90,
        resources: [
          { title: "Complete React & Next.js Masterclass", platform: "YouTube / FreeCodeCamp", type: "Course" }
        ],
        projectIdea: "Real-time Collaborative Whiteboard / Code Editor using React, WebSockets, and Tailwind."
      },
      {
        skill: "Cloud & DevOps Basics",
        priority: "Medium",
        status: "Gap Detected",
        target: 70,
        resources: [
          { title: "Docker & Kubernetes for Beginners", platform: "Coursera / YouTube", type: "Free Course" },
          { title: "AWS Certified Cloud Practitioner", platform: "AWS Skill Builder", type: "Certification" }
        ],
        projectIdea: "Deploy full stack app to AWS EC2 using Docker containers and GitHub Actions CI/CD."
      }
    ]
  },
  {
    id: "role-data",
    name: "Data Analyst & Business Intelligence",
    description: "Extracts business insights using Python, SQL, Tableau/PowerBI, and statistical modeling.",
    benchmarkSkills: {
      "SQL & Complex Queries": 95,
      "Python Data Science (Pandas/NumPy)": 90,
      "Data Visualization (Tableau/PowerBI)": 85,
      "Statistics & Probability": 80,
      "Problem Solving & Logic": 75,
      "System Design & Architecture": 40
    },
    learningRoadmap: [
      {
        skill: "SQL & Complex Queries",
        priority: "High",
        status: "Action Needed",
        target: 95,
        resources: [
          { title: "Advanced SQL for Data Analytics", platform: "SQLZoo / Mode Analytics", type: "Interactive Practice" }
        ],
        projectIdea: "Analyze 1M E-commerce Orders to build Customer Churn & Cohort Analytics Dashboard."
      }
    ]
  }
];
