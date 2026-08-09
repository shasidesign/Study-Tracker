import { GoogleGenAI } from '@google/genai';
import { DailyLog, Skill, Goal } from '../types/tracker';

export async function generateAIExecutiveSummary(
  logs: DailyLog[],
  skills: Skill[],
  goals: Goal[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
  
  // Calculate basic metrics for prompt context
  const totalHours = logs.reduce((acc, l) => acc + l.totalHours, 0);
  const avgHours = logs.length ? (totalHours / logs.length).toFixed(1) : '0';
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  
  // Aggregated skill hours
  const skillTotals: Record<string, number> = {};
  logs.forEach(log => {
    Object.entries(log.skillsHours).forEach(([sId, hrs]) => {
      skillTotals[sId] = (skillTotals[sId] || 0) + hrs;
    });
  });

  const sortedSkills = Object.entries(skillTotals)
    .map(([sId, hrs]) => {
      const sObj = skills.find(s => s.id === sId);
      return { name: sObj?.name || sId, hours: Number(hrs.toFixed(1)) };
    })
    .sort((a, b) => b.hours - a.hours);

  const topSkill = sortedSkills[0]?.name || 'Python';
  const weakSkill = sortedSkills[sortedSkills.length - 1]?.name || 'DSA';

  if (!apiKey) {
    // Elegant deterministic fallback executive report when Gemini API key is not configured
    return `### Executive Productivity Summary (Data Analysis Engine)

**Core Performance Metrics:**
- **Total Investment:** ${totalHours.toFixed(1)} study hours across ${logs.length} tracked days (Avg: ${avgHours} hrs/day).
- **Primary Technical Focus:** Strongest momentum in **${topSkill}** (${sortedSkills[0]?.hours || 0} hrs logged).
- **Area for Optimization:** **${weakSkill}** is currently under-indexed compared to target velocity.
- **Goal Completion Rate:** ${completedGoals}/${goals.length} target goals achieved.

**Strategic B.Tech Data Science Recommendations:**
1. **LeetCode & DSA Cadence:** Allocate at least 1.5 dedicated hours daily to Data Structures & Algorithms (Trees, DP, Graphs) to pass technical screening rounds.
2. **Project Portfolio Velocity:** Ensure Machine Learning model pipelines are paired with crisp SQL data transformations and a deployed React/FastAPI demo.
3. **Soft Skills & Communication:** Maintain 30 minutes of daily spoken English & technical interview pitch practice. Record mock sessions weekly.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Act as an Executive Tech Lead and Data Science Mentor for a B.Tech Data Science student.
Review the following student tracking data:
- Total Study Hours: ${totalHours.toFixed(1)} hrs over ${logs.length} days
- Daily Average: ${avgHours} hrs/day
- Top Skill Invested: ${topSkill} (${sortedSkills[0]?.hours || 0} hrs)
- Least Focused Skill: ${weakSkill} (${sortedSkills[sortedSkills.length - 1]?.hours || 0} hrs)
- Total Goals: ${goals.length} (Completed: ${completedGoals})

Generate a concise, professional 3-paragraph Executive Report with actionable recommendations specifically for B.Tech Data Science career preparation (DSA, SQL, Machine Learning, Communication, Projects).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Unable to generate summary at this moment.';
  } catch (error) {
    console.warn('Gemini API execution skipped or failed:', error);
    return `### Executive Productivity Summary (Fallback Mode)

**Core Performance Metrics:**
- **Total Investment:** ${totalHours.toFixed(1)} study hours across ${logs.length} tracked days.
- **Primary Technical Focus:** Strongest momentum in **${topSkill}**.
- **Area for Acceleration:** **${weakSkill}** needs structured scheduling next week.
- **Goal Completion Rate:** ${completedGoals}/${goals.length} target goals achieved.`;
  }
}
