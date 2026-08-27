/**
 * Evaluates student eligibility for a specific company drive.
 * Returns { isEligible: boolean, score: number, reasons: Array<{ type: 'pass'|'fail', text: string }>, missingSkills: string[] }
 */
export function checkEligibility(student, company) {
  const reasons = [];
  const missingSkills = [];
  let failCount = 0;

  // 1. CGPA Check
  if (student.cgpa >= company.minCgpa) {
    reasons.push({
      type: "pass",
      text: `CGPA requirement satisfied (${student.cgpa} >= min ${company.minCgpa})`
    });
  } else {
    failCount++;
    reasons.push({
      type: "fail",
      text: `CGPA insufficient: Your CGPA is ${student.cgpa}, minimum required is ${company.minCgpa}`
    });
  }

  // 2. Backlogs / Arrears Check
  const studentArrears = Number(student.arrears) || 0;
  if (studentArrears <= company.maxArrears) {
    reasons.push({
      type: "pass",
      text: `Arrears limit satisfied (${studentArrears} active arrears <= max ${company.maxArrears} allowed)`
    });
  } else {
    failCount++;
    reasons.push({
      type: "fail",
      text: `Arrears exceeded: You have ${studentArrears} active arrears, maximum allowed is ${company.maxArrears}`
    });
  }

  // 3. Branch / Department Check
  const normalizedBranch = (student.branch || "").toUpperCase().trim();
  const isBranchAllowed = company.allowedBranches.some(
    b => b.toUpperCase() === normalizedBranch || b.toUpperCase() === "ALL"
  );

  if (isBranchAllowed) {
    reasons.push({
      type: "pass",
      text: `Branch eligible (${student.branch} is in allowed list: ${company.allowedBranches.join(", ")})`
    });
  } else {
    failCount++;
    reasons.push({
      type: "fail",
      text: `Branch restriction: ${student.branch} is not listed in allowed branches (${company.allowedBranches.join(", ")})`
    });
  }

  // 4. Skill Match Check
  const studentSkills = (student.skills || []).map(s => s.toLowerCase().trim());
  const companySkills = company.requiredSkills || [];
  
  companySkills.forEach(reqSkill => {
    const hasSkill = studentSkills.some(st => st.includes(reqSkill.toLowerCase().trim()) || reqSkill.toLowerCase().trim().includes(st));
    if (!hasSkill) {
      missingSkills.push(reqSkill);
    }
  });

  if (missingSkills.length === 0) {
    reasons.push({
      type: "pass",
      text: `All ${companySkills.length} required skills matched!`
    });
  } else {
    reasons.push({
      type: "warn",
      text: `Missing ${missingSkills.length} recommended skill(s): ${missingSkills.join(", ")}`
    });
  }

  const isEligible = failCount === 0;

  // Calculate Match Percentage
  let matchScore = 100;
  if (student.cgpa < company.minCgpa) matchScore -= 30;
  if (studentArrears > company.maxArrears) matchScore -= 30;
  if (!isBranchAllowed) matchScore -= 25;
  if (companySkills.length > 0) {
    const matchedCount = companySkills.length - missingSkills.length;
    const skillBonus = (matchedCount / companySkills.length) * 15;
    matchScore = Math.max(10, Math.min(100, Math.round(matchScore - (15 - skillBonus))));
  }

  return {
    isEligible,
    matchScore,
    reasons,
    missingSkills
  };
}
