import { DailyLog, Skill, Goal, ReminderItem, Quote, AchievementBadge, FormulaDefinition, NoteItem } from '../types/tracker';

export const INITIAL_SKILLS: Skill[] = [
  { id: 'sql', name: 'SQL', category: 'Core Data Science', targetWeeklyHours: 6, color: '#3B82F6' },
  { id: 'python', name: 'Python', category: 'Core Data Science', targetWeeklyHours: 8, color: '#10B981' },
  { id: 'dsa', name: 'DSA', category: 'Technical / Dev', targetWeeklyHours: 7, color: '#F59E0B' },
  { id: 'ml', name: 'Machine Learning', category: 'Core Data Science', targetWeeklyHours: 8, color: '#8B5CF6' },
  { id: 'ds', name: 'Data Science', category: 'Core Data Science', targetWeeklyHours: 6, color: '#EC4899' },
  { id: 'comm', name: 'Communication Skills', category: 'Soft Skills', targetWeeklyHours: 4, color: '#06B6D4' },
  { id: 'eng', name: 'English Speaking', category: 'Soft Skills', targetWeeklyHours: 3, color: '#14B8A6' },
  { id: 'fullstack', name: 'Full Stack', category: 'Technical / Dev', targetWeeklyHours: 5, color: '#6366F1' },
  { id: 'projects', name: 'Projects', category: 'Technical / Dev', targetWeeklyHours: 6, color: '#F43F5E' },
  { id: 'reading', name: 'Reading', category: 'Personal Development', targetWeeklyHours: 3, color: '#84CC16' },
  { id: 'exercise', name: 'Exercise', category: 'Personal Development', targetWeeklyHours: 4, color: '#EAB308' },
  { id: 'powerbi', name: 'Power BI', category: 'Core Data Science', targetWeeklyHours: 3, color: '#22C55E' },
  { id: 'cloud', name: 'Cloud & MLOps', category: 'Technical / Dev', targetWeeklyHours: 4, color: '#A855F7' },
];

export function generateSampleLogs(): DailyLog[] {
  const logs: DailyLog[] = [];
  const today = new Date();
  
  // Days of week array
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const moods: ('Great' | 'Focused' | 'Neutral' | 'Tired' | 'Stressed')[] = ['Focused', 'Great', 'Focused', 'Great', 'Neutral', 'Focused', 'Great'];
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    const dateStr = d.toISOString().split('T')[0];
    const dayStr = dayNames[d.getDay()];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    // Realistic hours for a high-performing student
    const sqlHrs = Number((0.5 + Math.random() * 1.5).toFixed(1));
    const pyHrs = Number((1.0 + Math.random() * 2.0).toFixed(1));
    const dsaHrs = Number((1.0 + Math.random() * 1.5).toFixed(1));
    const mlHrs = Number((1.0 + Math.random() * 2.0).toFixed(1));
    const dsHrs = Number((0.5 + Math.random() * 1.0).toFixed(1));
    const commHrs = Number((0.5 + Math.random() * 0.5).toFixed(1));
    const engHrs = Number((0.5 + Math.random() * 0.5).toFixed(1));
    const fsHrs = isWeekend ? Number((1.5 + Math.random() * 2.0).toFixed(1)) : Number((0.5 + Math.random() * 1.0).toFixed(1));
    const projHrs = isWeekend ? Number((2.0 + Math.random() * 2.0).toFixed(1)) : Number((1.0 + Math.random() * 1.0).toFixed(1));
    const readHrs = Number((0.5 + Math.random() * 0.5).toFixed(1));
    const exHrs = Number((0.5 + Math.random() * 0.5).toFixed(1));

    const total = Number((sqlHrs + pyHrs + dsaHrs + mlHrs + dsHrs + commHrs + engHrs + fsHrs + projHrs + readHrs + exHrs).toFixed(1));
    const mood = moods[i % moods.length];
    const energyLevel = Math.min(10, Math.max(6, Math.floor(7 + Math.random() * 3.5)));

    logs.push({
      id: `log-${dateStr}`,
      date: dateStr,
      day: dayStr,
      skillsHours: {
        sql: sqlHrs,
        python: pyHrs,
        dsa: dsaHrs,
        ml: mlHrs,
        ds: dsHrs,
        comm: commHrs,
        eng: engHrs,
        fullstack: fsHrs,
        projects: projHrs,
        reading: readHrs,
        exercise: exHrs,
      },
      totalHours: total,
      mood,
      energyLevel,
      remarks: isWeekend ? 'Deep work session on end-to-end ML project pipeline.' : 'Focused on DSA trees & PyTorch linear regression.',
      todayGoal: isWeekend ? 'Complete Feature Engineering module & 3 LeetCode Mediums' : 'Practice SQL Window Functions & LeetCode Linked Lists',
      goalCompleted: Math.random() > 0.15,
      learningReflection: 'Gained solid clarity on gradient descent optimization and SQL CTE queries.'
    });
  }

  return logs;
}

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    name: 'Solve 150 LeetCode Medium/Hard DSA Problems',
    category: 'Technical / Dev',
    timeframe: 'Monthly',
    priority: 'High',
    deadline: '2026-08-31',
    status: 'In Progress',
    progress: 72,
    notes: 'Focus on Graphs, Dynamic Programming, and Binary Search Trees.'
  },
  {
    id: 'g-2',
    name: 'Deploy End-to-End Customer Churn Prediction ML App',
    category: 'Core Data Science',
    timeframe: 'Quarterly',
    priority: 'High',
    deadline: '2026-09-15',
    status: 'In Progress',
    progress: 85,
    notes: 'Model trained with XGBoost, wrapping API in FastAPI + React UI.'
  },
  {
    id: 'g-3',
    name: 'Deliver Mock Technical Interview in English without hesitation',
    category: 'Soft Skills',
    timeframe: 'Weekly',
    priority: 'Medium',
    deadline: '2026-08-14',
    status: 'Completed',
    progress: 100,
    notes: 'Recorded session and analyzed tone, speech speed, and technical depth.'
  },
  {
    id: 'g-4',
    name: 'Master Advanced SQL (Window Functions & Indexing Optimization)',
    category: 'Core Data Science',
    timeframe: 'Monthly',
    priority: 'High',
    deadline: '2026-08-25',
    status: 'In Progress',
    progress: 90,
    notes: 'Practicing complex query optimizations on Postgres and BigQuery benchmarks.'
  },
  {
    id: 'g-5',
    name: 'Secure Tier 1 Data Science / ML Engineering Internship',
    category: 'Career Growth',
    timeframe: 'Yearly',
    priority: 'High',
    deadline: '2026-12-15',
    status: 'In Progress',
    progress: 60,
    notes: 'Tailoring resume, networking on LinkedIn, and completing 3 flagship projects.'
  },
  {
    id: 'g-6',
    name: 'Complete 30 Mins Daily Workout & Hydration Routine',
    category: 'Personal Development',
    timeframe: 'Daily',
    priority: 'Medium',
    deadline: '2026-08-09',
    status: 'In Progress',
    progress: 95,
    notes: 'Maintaining consistency in physical health to maximize mental stamina.'
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'r-1',
    task: 'Submit Machine Learning Final Semester Lab Assignment',
    category: 'Assignments',
    priority: 'High',
    dueDate: '2026-08-12',
    status: 'In Progress',
    notes: 'Includes Jupyter Notebook writeup on Random Forests & SVM hyperparameter tuning.'
  },
  {
    id: 'r-2',
    task: 'B.Tech 7th Sem End-Semester Data Science Examination',
    category: 'Exams',
    priority: 'High',
    dueDate: '2026-08-20',
    status: 'Upcoming',
    notes: 'Covers Neural Networks, NLP fundamentals, and Big Data Architecture.'
  },
  {
    id: 'r-3',
    task: 'National Level AI/GenAI Hackathon Submission',
    category: 'Hackathons',
    priority: 'High',
    dueDate: '2026-08-15',
    status: 'In Progress',
    notes: 'Building RAG-powered Smart Study Assistant app using Gemini API.'
  },
  {
    id: 'r-4',
    task: 'Google / Microsoft Summer Internship Portal Closes',
    category: 'Internship Applications',
    priority: 'High',
    dueDate: '2026-08-18',
    status: 'Upcoming',
    notes: 'Submit updated GitHub links, portfolio dashboard, and transcript.'
  },
  {
    id: 'r-5',
    task: 'AWS Certified Machine Learning Specialist Exam',
    category: 'Certifications',
    priority: 'Medium',
    dueDate: '2026-09-01',
    status: 'Upcoming',
    notes: 'Review SageMaker pipelines, feature store, and model monitoring.'
  },
  {
    id: 'r-6',
    task: 'Technical Mock Interview with Senior ML Engineer',
    category: 'Interviews',
    priority: 'High',
    dueDate: '2026-08-10',
    status: 'Upcoming',
    notes: 'Focus on System Design for ML systems and Coding Algorithms.'
  }
];

export const QUOTES_DATABASE: Quote[] = [
  {
    id: 1,
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
    category: "Consistency & Focus"
  },
  {
    id: 2,
    quote: "Without data, you're just another person with an opinion.",
    author: "W. Edwards Deming",
    category: "Data Science & Logic"
  },
  {
    id: 3,
    quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
    author: "Dwayne Johnson",
    category: "Consistency & Focus"
  },
  {
    id: 4,
    quote: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    category: "Mindset & Growth"
  },
  {
    id: 5,
    quote: "In Data Science, 80% of time is spent understanding the problem and cleaning data. Mastering the basics builds elite intuition.",
    author: "Data Science Proverb",
    category: "Data Science & Logic"
  },
  {
    id: 6,
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "Consistency & Focus"
  },
  {
    id: 7,
    quote: "Do not judge me by my successes, judge me by how many times I fell down and got back up again.",
    author: "Nelson Mandela",
    category: "Success & Resilience"
  },
  {
    id: 8,
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    category: "Mindset & Growth"
  },
  {
    id: 9,
    quote: "Communication is a skill that you can learn. It's like riding a bicycle or typing. If you're willing to work at it, you can rapidly improve the quality of every part of your life.",
    author: "Brian Tracy",
    category: "Mindset & Growth"
  },
  {
    id: 10,
    quote: "The expert in anything was once a beginner. Keep debugging, keep solving.",
    author: "Helen Hayes",
    category: "Success & Resilience"
  },
  {
    id: 11,
    quote: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
    author: "Albert Einstein",
    category: "Consistency & Focus"
  },
  {
    id: 12,
    quote: "Machine Learning is not magic; it is linear algebra, calculus, probability, and rigorous engineering.",
    author: "Andrew Ng",
    category: "Data Science & Logic"
  },
  {
    id: 13,
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "Mindset & Growth"
  },
  {
    id: 14,
    quote: "Data is the new oil, but like crude oil, it's valuable only when refined and turned into intelligence.",
    author: "Clive Humby",
    category: "Data Science & Logic"
  },
  {
    id: 15,
    quote: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    category: "Success & Resilience"
  },
  {
    id: 16,
    quote: "Disciplined action carried out daily accumulates into extraordinary mastery.",
    author: "James Clear",
    category: "Consistency & Focus"
  },
  {
    id: 17,
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
    category: "Data Science & Logic"
  },
  {
    id: 18,
    quote: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
    category: "Mindset & Growth"
  },
  {
    id: 19,
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "Success & Resilience"
  },
  {
    id: 20,
    quote: "Artificial Intelligence is about amplifying human capability, not replacing human discipline.",
    author: "Satya Nadella",
    category: "Data Science & Logic"
  },
  {
    id: 21,
    quote: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "Consistency & Focus"
  },
  {
    id: 22,
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    category: "Data Science & Logic"
  },
  {
    id: 23,
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    category: "Consistency & Focus"
  },
  {
    id: 24,
    quote: "Failure is simply the opportunity to begin again, this time more intelligently.",
    author: "Henry Ford",
    category: "Success & Resilience"
  },
  {
    id: 25,
    quote: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    category: "Mindset & Growth"
  },
  {
    id: 26,
    quote: "In god we trust, all others must bring data.",
    author: "W. Edwards Deming",
    category: "Data Science & Logic"
  },
  {
    id: 27,
    quote: "Focus is a muscle. The more you shield yourself from distractions, the stronger your deep work capacity becomes.",
    author: "Cal Newport",
    category: "Consistency & Focus"
  },
  {
    id: 28,
    quote: "Great things are done by a series of small things brought together.",
    author: "Vincent Van Gogh",
    category: "Success & Resilience"
  },
  {
    id: 29,
    quote: "If you can't explain it simply, you don't understand it well enough.",
    author: "Richard Feynman",
    category: "Data Science & Logic"
  },
  {
    id: 30,
    quote: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine",
    category: "Mindset & Growth"
  },
  {
    id: 31,
    quote: "Energy flows where attention goes. Direct your focus to high-leverage skills.",
    author: "Tony Robbins",
    category: "Consistency & Focus"
  },
  {
    id: 32,
    quote: "Doubt kills more dreams than failure ever will.",
    author: "Suzy Kassem",
    category: "Success & Resilience"
  },
  {
    id: 33,
    quote: "Neural networks model complexity, but foundational mathematics guarantees precision.",
    author: "Yann LeCun",
    category: "Data Science & Logic"
  },
  {
    id: 34,
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Mindset & Growth"
  },
  {
    id: 35,
    quote: "Consistency is what transforms average effort into world-class performance.",
    author: "Robin Sharma",
    category: "Consistency & Focus"
  },
  {
    id: 36,
    quote: "The struggle you are in today is developing the strength you need for tomorrow.",
    author: "Robert Tew",
    category: "Success & Resilience"
  },
  {
    id: 37,
    quote: "Mathematics is the language with which the universe and machine intelligence are written.",
    author: "Galileo Galilei",
    category: "Data Science & Logic"
  },
  {
    id: 38,
    quote: "Learn as if you will live forever, live as if you will die tomorrow.",
    author: "Mahatma Gandhi",
    category: "Mindset & Growth"
  },
  {
    id: 39,
    quote: "Show up every day, do the reps, and trust the compounding curve.",
    author: "Naval Ravikant",
    category: "Consistency & Focus"
  },
  {
    id: 40,
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Success & Resilience"
  }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'badge-100h',
    title: '100 Hours Club',
    description: 'Logged over 100 total study hours across technical and personal skills.',
    icon: 'Award',
    unlocked: true,
    progress: 100,
    unlockedAt: '2026-07-25',
    category: 'Hours'
  },
  {
    id: 'badge-500h',
    title: '500 Hours Club',
    description: 'Logged 500 total study hours. Demonstrates high commitment.',
    icon: 'ShieldAlert',
    unlocked: false,
    progress: 45,
    category: 'Hours'
  },
  {
    id: 'badge-1000h',
    title: '1000 Hours Master',
    description: 'Logged 1000 study hours. True master in the making.',
    icon: 'Crown',
    unlocked: false,
    progress: 22,
    category: 'Hours'
  },
  {
    id: 'badge-streak7',
    title: '7-Day Streak Warrior',
    description: 'Maintained an unbroken study logging streak for 7 consecutive days.',
    icon: 'Flame',
    unlocked: true,
    progress: 100,
    unlockedAt: '2026-08-01',
    category: 'Streak'
  },
  {
    id: 'badge-streak30',
    title: '30-Day Streak Titan',
    description: 'Maintained a flawless 30-day continuous learning streak.',
    icon: 'Zap',
    unlocked: true,
    progress: 100,
    unlockedAt: '2026-08-08',
    category: 'Streak'
  },
  {
    id: 'badge-ds-specialist',
    title: 'DSA & ML Specialist',
    description: 'Accumulated over 50 hours in Machine Learning and Data Structures.',
    icon: 'Cpu',
    unlocked: true,
    progress: 100,
    unlockedAt: '2026-08-05',
    category: 'Skill'
  },
  {
    id: 'badge-polymath',
    title: 'Polymath Developer',
    description: 'Logged study hours in at least 6 different technical & soft skills in a single week.',
    icon: 'Layers',
    unlocked: true,
    progress: 100,
    unlockedAt: '2026-08-07',
    category: 'Skill'
  },
  {
    id: 'badge-goal-crusher',
    title: 'Goal Crusher',
    description: 'Successfully completed 10 or more target goals on schedule.',
    icon: 'Target',
    unlocked: false,
    progress: 70,
    category: 'Goal'
  }
];

export const FORMULA_GUIDE: FormulaDefinition[] = [
  {
    title: 'Productivity Score Formula',
    description: 'Calculates daily or weekly overall performance weighted by study intensity, goal achievement, and energy condition.',
    excelFormula: '=ROUND(MIN(100, (TOTAL_HOURS/TARGET_HOURS)*50 + (COMPLETED_GOALS/TOTAL_GOALS)*35 + (ENERGY_LEVEL/10)*15), 1)',
    googleSheetsFormula: '=ROUND(MIN(100, (SUM(C2:N2)/8)*50 + (IF(S2="Yes",1,0))*35 + (Q2/10)*15), 1)',
    explanation: 'Weights: 50% on study hours vs target (capped at 100%), 35% on daily main goal completion, 15% on physical/mental energy score.',
    category: 'Dashboard'
  },
  {
    title: 'Consistency Score Formula',
    description: 'Measures active study days over the selected timeframe.',
    excelFormula: '=ROUND((COUNTIF(O2:O31, ">0") / COUNTA(A2:A31)) * 100, 1)',
    googleSheetsFormula: '=ROUND((COUNTIF(Total_Hours_Range, ">0") / COUNTA(Date_Range)) * 100, 1)',
    explanation: 'Ratio of days where study hours > 0 divided by total calendar days evaluated.',
    category: 'Analytics'
  },
  {
    title: 'Current Streak Calculator',
    description: 'Calculates continuous uninterrupted days of active learning up to today.',
    excelFormula: '=MAX(FREQUENCY(IF(O2:O31>0, ROW(O2:O31)), IF(O2:O31=0, ROW(O2:O31))))',
    googleSheetsFormula: '=ARRAYFORMULA(MAX(LEN(SPLIT(CONCATENATE(IF(O2:O31>0, "1", " ")), " "))))',
    explanation: 'Evaluates continuous runs of non-zero study hour rows sequentially.',
    category: 'Dashboard'
  },
  {
    title: 'Overdue Task Reminder Flag',
    description: 'Automatically flags tasks as OVERDUE if the due date is in the past and status is incomplete.',
    excelFormula: '=IF(AND(Due_Date < TODAY(), Status <> "Completed", Status <> "Passed"), "OVERDUE", "ON TRACK")',
    googleSheetsFormula: '=IF(AND(C2 < TODAY(), D2 <> "Completed", D2 <> "Passed"), "OVERDUE", "ON TRACK")',
    explanation: 'Conditional logic checking if due date timestamp precedes current system date.',
    category: 'Conditional Formatting'
  },
  {
    title: 'Week-over-Week (WoW) Growth %',
    description: 'Computes growth percentage of current week study hours compared to previous week.',
    excelFormula: '=IF(PREV_WEEK_HOURS=0, 100, ROUND(((CURR_WEEK_HOURS - PREV_WEEK_HOURS) / PREV_WEEK_HOURS) * 100, 1))',
    googleSheetsFormula: '=IF(SUM(Prev_Week)=0, 100, ROUND(((SUM(Curr_Week) - SUM(Prev_Week)) / SUM(Prev_Week)) * 100, 1))',
    explanation: 'Standard percentage change calculation between two sequential 7-day intervals.',
    category: 'Analytics'
  },
  {
    title: 'Data Validation Setup Guide',
    description: 'Exact dropdown values for spreadsheet consistency.',
    excelFormula: 'Mood: Great, Focused, Neutral, Tired, Stressed | Goal Completed: Yes, No | Priority: High, Medium, Low',
    googleSheetsFormula: 'Select cell -> Data -> Data Validation -> List of items -> "Great, Focused, Neutral, Tired, Stressed"',
    explanation: 'Prevents typo errors in formulas like COUNTIF or SUMIFS.',
    category: 'Data Validation'
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Data Science & ML Interview Prep Strategy',
    content: 'Key topics to master: 1) Gradient Descent & Loss functions derivation. 2) SQL CTEs and Window Functions (RANK vs DENSE_RANK). 3) Bias-Variance Tradeoff in Decision Trees & Ensemble Methods. 4) Feature scaling normalization vs standardization.',
    remarks: 'Self-Remark: Revise SQL window functions twice a week before solving LeetCode Database problems.',
    category: 'Study Notes',
    tags: ['ML', 'SQL', 'Interview Prep', 'Data Science'],
    isPinned: true,
    createdAt: '2026-08-05 10:30',
    updatedAt: '2026-08-05 10:30',
    color: 'indigo'
  },
  {
    id: 'note-2',
    title: 'Weekly Personal Growth & Mindset Review',
    content: 'Maintained 8+ hours of daily deep work this week. Energy levels stayed high when taking a 10-minute walk after 2 hours of continuous coding. Reduced distraction triggers by silencing phone notifications during study blocks.',
    remarks: 'Self-Remark: Keep sleep schedule consistent around 11 PM to maximize memory consolidation.',
    category: 'Personal Reflection',
    tags: ['Mindset', 'Productivity', 'Self Tracking'],
    isPinned: true,
    createdAt: '2026-08-07 18:45',
    updatedAt: '2026-08-07 18:45',
    color: 'emerald'
  },
  {
    id: 'note-3',
    title: 'Cap-Stone ML Project Pipeline Notes',
    content: 'Completed XGBoost model training on customer churn dataset. Achieved 89.2% accuracy. Next step: deploy Flask / Fast API backend with Docker container and connect to Streamlit frontend dashboard.',
    remarks: 'Action Item: Test model latency under load test with 100 concurrent requests.',
    category: 'Idea & Brainstorm',
    tags: ['ML Project', 'Python', 'Docker', 'FastAPI'],
    isPinned: false,
    createdAt: '2026-08-08 14:15',
    updatedAt: '2026-08-08 14:15',
    color: 'purple'
  },
  {
    id: 'note-4',
    title: 'Self-Evaluation & Study Discipline Remarks',
    content: 'Evaluating focus areas for this month: 1) Don\'t skip DSA problem solving even on busy college project days. 2) Record English speaking practice clips 3 times a week. 3) Revise Power BI DAX formulas.',
    remarks: 'Remark: Track daily streak discipline rigorously using DS GrowthOS dashboard.',
    category: 'Self Remarks',
    tags: ['Discipline', 'Daily Goals', 'Tracker'],
    isPinned: false,
    createdAt: '2026-08-08 20:00',
    updatedAt: '2026-08-08 20:00',
    color: 'amber'
  }
];
