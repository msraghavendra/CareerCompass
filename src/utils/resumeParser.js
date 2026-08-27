const ACTION_VERBS = [
  "built", "developed", "architected", "engineered", "implemented", "optimized",
  "reduced", "increased", "designed", "created", "led", "automated", "refactored",
  "deployed", "scaled", "spearheaded", "integrated", "benchmarked"
];

const SKILL_KEYWORDS_MAP = {
  "Software Development Engineer (SDE 1)": [
    "c++", "java", "python", "data structures", "algorithms", "system design",
    "dbms", "sql", "operating systems", "computer networks", "git", "dsa",
    "object oriented", "multithreading", "oops"
  ],
  "Full Stack Web Developer (React + Node)": [
    "react", "node.js", "express", "javascript", "typescript", "html", "css",
    "tailwind", "mongodb", "postgresql", "rest api", "git", "docker", "redux", "next.js"
  ],
  "Data Analyst & Business Intelligence": [
    "python", "sql", "pandas", "numpy", "tableau", "power bi", "excel",
    "data visualization", "statistics", "machine learning", "r", "etl", "bigquery"
  ]
};

export function parseAndAnalyzeResume(resumeText, targetRole = "Software Development Engineer (SDE 1)") {
  const text = (resumeText || "").toLowerCase();
  const rawText = resumeText || "";

  // 1. Keyword & Skill Analysis
  const targetKeywords = SKILL_KEYWORDS_MAP[targetRole] || SKILL_KEYWORDS_MAP["Software Development Engineer (SDE 1)"];
  const detectedSkills = [];
  const missingSkills = [];

  targetKeywords.forEach(kw => {
    if (text.includes(kw)) {
      detectedSkills.push(kw.toUpperCase());
    } else {
      missingSkills.push(kw.toUpperCase());
    }
  });

  const keywordMatchPercent = Math.round((detectedSkills.length / targetKeywords.length) * 100);

  // 2. Action Verbs Audit
  const usedActionVerbs = [];
  ACTION_VERBS.forEach(verb => {
    if (text.includes(verb)) {
      usedActionVerbs.push(verb);
    }
  });

  // 3. Section Completeness Check
  const sectionsCheck = [
    { name: "Contact Info & Email/LinkedIn", found: /email|phone|linkedin|github/i.test(rawText), weight: 10 },
    { name: "Professional Summary / Objective", found: /summary|objective|about/i.test(rawText), weight: 10 },
    { name: "Education & CGPA", found: /education|degree|b\.tech|cgpa|university/i.test(rawText), weight: 20 },
    { name: "Technical Skills", found: /skills|languages|technologies|tools/i.test(rawText), weight: 20 },
    { name: "Projects & Impact", found: /projects|built|developed|application/i.test(rawText), weight: 25 },
    { name: "Experience / Internships", found: /experience|internship|work/i.test(rawText), weight: 15 }
  ];

  const sectionScore = sectionsCheck.reduce((sum, sec) => sum + (sec.found ? sec.weight : 0), 0);

  // 4. Formatting & Quality Flags
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const formattingIssues = [];
  const weakSections = [];
  const aiRecommendations = [];

  if (wordCount < 150) {
    formattingIssues.push("Resume is too short (< 150 words). Add project details, achievements, and responsibilities.");
  } else if (wordCount > 800) {
    formattingIssues.push("Resume is overly verbose (> 800 words). Concise 1-page resumes yield 40% higher shortlist rates.");
  }

  if (usedActionVerbs.length < 3) {
    formattingIssues.push("Low use of strong Action Verbs. Replace passive descriptions (e.g. 'worked on') with impactful metrics ('engineered', 'optimized', 'scaled').");
  }

  sectionsCheck.forEach(sec => {
    if (!sec.found) {
      weakSections.push(`Missing Section: ${sec.name}`);
      aiRecommendations.push(`Add a distinct '${sec.name}' header to improve ATS scan accuracy.`);
    }
  });

  if (missingSkills.length > 0) {
    weakSections.push(`Missing High-Impact Skills for ${targetRole}`);
    aiRecommendations.push(`Incorporate key industry terms: ${missingSkills.slice(0, 4).join(", ")} into project descriptions.`);
  }

  if (!/\d+%|\d+x|\$\d+|\d+\s*ms/i.test(rawText)) {
    formattingIssues.push("Lack of quantifiable metrics (e.g. 'Improved performance by 35%', 'Reduced API response time from 400ms to 120ms').");
    aiRecommendations.push("Quantify achievements with metrics (%, numbers, scale, user count, or speed improvements).");
  }

  // 5. Final Resume Score Calculation
  let overallScore = Math.round(
    sectionScore * 0.4 + keywordMatchPercent * 0.4 + Math.min(usedActionVerbs.length * 5, 20)
  );
  overallScore = Math.max(25, Math.min(98, overallScore));

  return {
    overallScore,
    keywordMatchPercent,
    wordCount,
    detectedSkills,
    missingSkills,
    usedActionVerbs,
    sectionsCheck,
    formattingIssues,
    weakSections,
    aiRecommendations,
    analyzedAt: new Date().toISOString()
  };
}
