export interface DefaultWeekData {
  weekNumber: number;
  title: string;
  focus: string;
  milestone: string;
}

export const CURRICULUM_36_WEEKS: DefaultWeekData[] = [
  { weekNumber: 1, title: "Java basics & syntax", focus: "Primitives, operators, input/output", milestone: "Write 10 basic algorithms" },
  { weekNumber: 2, title: "Control flow & methods", focus: "Loops, conditionals, method signatures", milestone: "Solve pattern printing problems" },
  { weekNumber: 3, title: "Arrays & strings", focus: "1D/2D arrays, string manipulation, StringBuilder", milestone: "Solve 15 array & string problems" },
  { weekNumber: 4, title: "OOP I: classes, objects", focus: "Constructors, access modifiers, encapsulation", milestone: "Build a bank account modeling project" },
  { weekNumber: 5, title: "OOP II: inheritance, polymorphism", focus: "Method overriding/overloading, interfaces, abstract classes", milestone: "Implement vehicle hierarchy simulator" },
  { weekNumber: 6, title: "Collections framework", focus: "ArrayList, LinkedList, HashMap, HashSet, Iterators", milestone: "Re-implement core collection operations" },
  { weekNumber: 7, title: "Exceptions & file I/O", focus: "Checked vs unchecked, custom exceptions, file streams", milestone: "Build a log file parser" },
  { weekNumber: 8, title: "Recursion", focus: "Base cases, call stack, recursive backtracking", milestone: "Solve Tower of Hanoi & subsets" },
  { weekNumber: 9, title: "Searching & sorting", focus: "Binary search, merge sort, quick sort", milestone: "Implement all elementary sorting algorithms" },
  { weekNumber: 10, title: "Linked lists", focus: "Singly, doubly, cycle detection, reversing", milestone: "Solve 12 LeetCode linked list problems" },
  { weekNumber: 11, title: "Stacks & queues", focus: "Monotonic stack, queue using stacks, sliding window", milestone: "Implement balanced parentheses and next greater element" },
  { weekNumber: 12, title: "Hashing", focus: "Hash collisions, frequency maps, prefix sum with hash", milestone: "Solve two-sum variations and longest subarray" },
  { weekNumber: 13, title: "Trees I: binary trees", focus: "Traversals (In, Pre, Post, Level-order), height, diameter", milestone: "Solve 15 tree traversal problems" },
  { weekNumber: 14, title: "Trees II: BST", focus: "Binary search tree validate, insert, delete, LCA", milestone: "Implement BST operations & range sum" },
  { weekNumber: 15, title: "Heaps & priority queues", focus: "Min/max heap, top K elements, median in stream", milestone: "Solve K closest points & merge K lists" },
  { weekNumber: 16, title: "Graphs I: BFS & DFS", focus: "Adjacency matrix/list, connected components, cycle detection", milestone: "Solve number of islands & clone graph" },
  { weekNumber: 17, title: "Graphs II: shortest paths", focus: "Dijkstra, topological sort, minimum spanning tree", milestone: "Solve course schedule & network delay" },
  { weekNumber: 18, title: "Greedy algorithms", focus: "Activity selection, fractional knapsack, interval scheduling", milestone: "Solve 10 greedy optimization tasks" },
  { weekNumber: 19, title: "Dynamic programming I", focus: "1D DP, memoization vs tabulation, knapsack 0/1", milestone: "Solve climbing stairs & coin change" },
  { weekNumber: 20, title: "Dynamic programming II", focus: "2D DP, longest common subsequence, edit distance", milestone: "Solve 10 classic DP problems" },
  { weekNumber: 21, title: "DBMS & SQL", focus: "ER diagrams, normalization 1NF-3NF, ACID, indexing, complex joins", milestone: "Complete 20 LeetCode SQL queries" },
  { weekNumber: 22, title: "Operating systems", focus: "Process vs threads, scheduling, deadlocks, paging, virtual memory", milestone: "Review 50 top OS interview questions" },
  { weekNumber: 23, title: "Computer networks", focus: "OSI 7 layers, TCP vs UDP, HTTP/HTTPS, DNS, subnetting", milestone: "Diagram full web request lifecycle" },
  { weekNumber: 24, title: "OOP & design interview prep", focus: "SOLID principles, factory & singleton patterns, UML", milestone: "Design a parking lot & elevator system" },
  { weekNumber: 25, title: "Project 1 build", focus: "Full-stack application architecture, REST API, authentication", milestone: "Complete working backend & database schema" },
  { weekNumber: 26, title: "Project 1 polish & deploy", focus: "Frontend UI polish, responsive design, cloud deployment", milestone: "Live demo on Vercel with GitHub README" },
  { weekNumber: 27, title: "Project 2 build", focus: "Advanced domain (AI-integrated, real-time, or system design)", milestone: "Implement core core features & API integrations" },
  { weekNumber: 28, title: "Project 2 polish & deploy", focus: "End-to-end testing, error handling, Docker/cloud deploy", milestone: "Live public URL with recorded video demo" },
  { weekNumber: 29, title: "Resume & LinkedIn", focus: "ATS resume optimization, GitHub showcase, portfolio updates", milestone: "Review resume with mentor and get ATS score > 85" },
  { weekNumber: 30, title: "Aptitude: quantitative", focus: "Percentages, time & work, speed/distance, profit & loss", milestone: "Timed 50-question mock test (>75% accuracy)" },
  { weekNumber: 31, title: "Aptitude: logical & verbal", focus: "Syllogisms, blood relations, reading comprehension", milestone: "Timed 50-question reasoning test" },
  { weekNumber: 32, title: "Mock tests: service companies", focus: "Infosys, TCS, Cognizant, Wipro pattern speed drills", milestone: "Complete 3 full-length company pattern mock tests" },
  { weekNumber: 33, title: "Mock tests: product companies", focus: "Amazon, Zoho, Swiggy, startup coding rounds (OA)", milestone: "Solve 5 recent OA company coding problems" },
  { weekNumber: 34, title: "Mock interviews", focus: "Technical rounds, system design discussion, HR behavior (STAR)", milestone: "Complete 2 peer mock interviews with feedback" },
  { weekNumber: 35, title: "Revision sprint", focus: "Weak topic review, high-yield formula cheatsheets", milestone: "Revise all top 75 DSA problems" },
  { weekNumber: 36, title: "Placement readiness check", focus: "Final readiness score audit, company drive checklist", milestone: "CareerPilot preparation score > 85/100" },
];

/**
 * Calculates current week number (1 to 36) from the student's roadmap start date.
 */
export function calculateCurrentWeek(startDate: string | Date, now = new Date()): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const current = new Date(now);
  current.setHours(0, 0, 0, 0);

  const diffMs = current.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;

  return Math.min(36, Math.max(1, week));
}

/**
 * Calculates roadmap completion progress percentage.
 */
export function calculateRoadmapProgress(completedWeeksCount: number, totalWeeks = 36): number {
  if (totalWeeks <= 0) return 0;
  return Math.min(100, Math.round((completedWeeksCount / totalWeeks) * 100));
}
