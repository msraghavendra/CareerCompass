export const TECHNICAL_SUBJECTS = [
  "Data Structures & Algorithms",
  "DBMS & SQL",
  "Operating Systems",
  "Computer Networks",
  "System Design",
  "Object Oriented Programming (OOPs)",
  "Full Stack Web Development"
];

export const TECHNICAL_QUESTIONS = [
  // DSA
  {
    id: "tq-1",
    subject: "Data Structures & Algorithms",
    difficulty: "Medium",
    question: "How do you detect a cycle in a Linked List? Explain Floyd's Cycle Detection (Tortoise and Hare Algorithm).",
    answer: "Use two pointers, slow and fast. Move slow pointer by 1 step and fast pointer by 2 steps. If fast pointer hits null, no cycle exists. If slow and fast meet at the same node, a cycle exists. Time Complexity is O(N) and Space Complexity is O(1).",
    codeSnippet: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    keyConcepts: ["Two Pointers", "Linked List", "Time & Space Optimization"]
  },
  {
    id: "tq-2",
    subject: "Data Structures & Algorithms",
    difficulty: "Hard",
    question: "Explain the difference between Quick Sort and Merge Sort. When would you prefer Merge Sort over Quick Sort?",
    answer: "Merge Sort has guaranteed O(N log N) time complexity in all cases, is stable, but requires O(N) auxiliary space. Quick Sort has average O(N log N) time complexity, worst-case O(N^2), operates in-place O(log N aux space for recursion stack), but is unstable. Merge Sort is preferred for Linked Lists or when stability & predictable timing are mandatory.",
    keyConcepts: ["Sorting", "Divide and Conquer", "Stability", "Space Complexity"]
  },
  {
    id: "tq-3",
    subject: "Data Structures & Algorithms",
    difficulty: "Medium",
    question: "What is a Hash Collision? How do Separate Chaining and Open Addressing solve it?",
    answer: "A collision occurs when two distinct keys map to the same hash table index. Separate Chaining stores colliding elements in a linked list or balanced tree at that index bucket. Open Addressing searches for another open slot in the table using Linear Probing, Quadratic Probing, or Double Hashing.",
    keyConcepts: ["Hashing", "Separate Chaining", "Open Addressing", "Amortized O(1)"]
  },

  // DBMS
  {
    id: "tq-4",
    subject: "DBMS & SQL",
    difficulty: "Medium",
    question: "Explain ACID Properties in DBMS with a real-world banking transaction example.",
    answer: "A - Atomicity: Either all steps of a transaction succeed or all rollback (e.g. money deducted must be credited or restored).\nC - Consistency: Database transitions from one valid state to another respecting constraints.\nI - Isolation: Concurrent transactions do not interfere with each other (ACID isolation levels).\nD - Durability: Once committed, data persists even in power failure.",
    keyConcepts: ["Atomicity", "Consistency", "Isolation", "Durability", "Transactions"]
  },
  {
    id: "tq-5",
    subject: "DBMS & SQL",
    difficulty: "Hard",
    question: "What is Database Indexing? Compare B-Tree Index vs Hash Index.",
    answer: "Indexing creates a lookup data structure to accelerate data retrieval without scanning every row. B-Tree indexes support equality (=) and range queries (<, >, BETWEEN, ORDER BY) with O(log N) lookup. Hash Indexes support fast O(1) equality lookups but CANNOT handle range queries or sorting.",
    keyConcepts: ["B-Tree", "Hash Index", "Index Range Scan", "Query Optimization"]
  },

  // OS
  {
    id: "tq-6",
    subject: "Operating Systems",
    difficulty: "Medium",
    question: "What is a Deadlock? List the 4 Coffman conditions required for a deadlock to occur.",
    answer: "Deadlock is a state where a set of processes are blocked because each holds a resource and waits for another resource held by another process. 4 Coffman conditions: 1) Mutual Exclusion, 2) Hold and Wait, 3) No Preemption, 4) Circular Wait.",
    keyConcepts: ["Deadlock", "Coffman Conditions", "Banker's Algorithm", "Mutex"]
  },
  {
    id: "tq-7",
    subject: "Operating Systems",
    difficulty: "Medium",
    question: "Compare Process vs Thread. What is Virtual Memory and Paging?",
    answer: "A process is an independent executing program with its own isolated address space. Threads are light-weight execution units within a process sharing heap/memory. Virtual memory provides an illusion of large continuous memory by paging chunks between RAM and secondary disk storage (swap space).",
    keyConcepts: ["Process vs Thread", "Paging", "Page Fault", "Virtual Address Space"]
  },

  // Computer Networks
  {
    id: "tq-8",
    subject: "Computer Networks",
    difficulty: "Medium",
    question: "Explain the TCP 3-Way Handshake and 4-Way Teardown process.",
    answer: "Handshake (Establish Connection):\n1. Client -> Server: SYN (Synchronize)\n2. Server -> Client: SYN + ACK\n3. Client -> Server: ACK\nTeardown (Close Connection):\n1. Client -> Server: FIN\n2. Server -> Client: ACK\n3. Server -> Client: FIN\n4. Client -> Server: ACK",
    keyConcepts: ["TCP/IP", "3-Way Handshake", "SYN", "ACK", "FIN", "Reliable Transport"]
  },

  // System Design
  {
    id: "tq-9",
    subject: "System Design",
    difficulty: "Hard",
    question: "How do you design a Scalable URL Shortener (like Bitly)? What DB and caching strategy will you use?",
    answer: "1) API: POST /api/shorten (longUrl -> shortUrl), GET /{shortUrl} (302 Redirect).\n2) Base62 encoding on auto-incrementing ID or Redis distributed ID counter.\n3) Database: NoSQL (MongoDB/DynamoDB) or PostgreSQL for fast key-value lookup.\n4) Cache: Redis cache in front of DB using LRU policy to handle 80/20 read traffic load.",
    keyConcepts: ["Base62", "Redis Cache", "Database Sharding", "Scalability", "Consistent Hashing"]
  }
];

export const HR_QUESTIONS = [
  {
    id: "hr-1",
    category: "Introduction & Motivation",
    question: "Tell me about yourself.",
    starTip: "Keep it under 2 minutes. Focus on: Present (current degree & major projects), Past (key achievements, internships, hackathons), and Future (why this specific company/role excites you).",
    sampleAnswer: "I am a final-year Computer Science student passionate about full-stack software development and problem solving. During my academic projects, I built an AI-powered logistics app and led a 4-person team in a 36-hour hackathon. I have solved 350+ coding problems across DSA and completed a React/Node internship. I am drawn to your company because of your engineering culture and large-scale cloud applications."
  },
  {
    id: "hr-2",
    category: "Behavioral & Conflict",
    question: "Describe a situation where you had a conflict in a team project and how you resolved it.",
    starTip: "Use STAR method: S (Situation), T (Task), A (Action), R (Result). Emphasize empathy, active listening, data-driven decisions, and positive outcome.",
    sampleAnswer: "S: During our final year capstone project, two team members disagreed on whether to use SQL vs MongoDB.\nT: My goal was to avoid project delay and reach consensus.\nA: I scheduled a benchmark test comparing both DBs for our exact data access patterns, presented the latency data, and agreed to use PostgreSQL for relational consistency.\nR: The team united, delivered the project 3 days before deadline, and received top grades."
  },
  {
    id: "hr-3",
    category: "Weakness & Growth",
    question: "What is your biggest weakness and how are you working to overcome it?",
    starTip: "Pick a genuine professional weakness (not a humblebrag like 'I work too hard'). Show self-awareness and active steps you take to improve.",
    sampleAnswer: "Earlier, I had a tendency to jump directly into writing code before spending sufficient time planning the software architecture. Recently, I adopted a habit of writing architectural design documents, flowcharting system flows, and reviewing tech specs before coding, which reduced my debugging time by half."
  }
];
