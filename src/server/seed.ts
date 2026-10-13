import { supabase } from "@/lib/supabase/client";

export const REFERENCE_TOPICS = [
  // Java (12 core curriculum topics)
  { subject: "Java", name: "Variables & data types", position: 1 },
  { subject: "Java", name: "Operators & control flow", position: 2 },
  { subject: "Java", name: "Methods & recursion", position: 3 },
  { subject: "Java", name: "Arrays & Strings", position: 4 },
  { subject: "Java", name: "Classes & objects", position: 5 },
  { subject: "Java", name: "Inheritance & polymorphism", position: 6 },
  { subject: "Java", name: "Abstraction & interfaces", position: 7 },
  { subject: "Java", name: "Exception handling", position: 8 },
  { subject: "Java", name: "Collections framework", position: 9 },
  { subject: "Java", name: "Generics", position: 10 },
  { subject: "Java", name: "Streams & lambdas", position: 11 },
  { subject: "Java", name: "Multithreading basics", position: 12 },

  // DBMS (5 core topics)
  { subject: "DBMS", name: "ER model", position: 1 },
  { subject: "DBMS", name: "Normalization", position: 2 },
  { subject: "DBMS", name: "SQL queries & joins", position: 3 },
  { subject: "DBMS", name: "Transactions & ACID", position: 4 },
  { subject: "DBMS", name: "Indexing", position: 5 },

  // Operating Systems (5 core topics)
  { subject: "OS", name: "Processes & threads", position: 1 },
  { subject: "OS", name: "CPU scheduling", position: 2 },
  { subject: "OS", name: "Deadlocks", position: 3 },
  { subject: "OS", name: "Memory management & paging", position: 4 },
  { subject: "OS", name: "Synchronization", position: 5 },

  // Computer Networks (4 core topics)
  { subject: "Networks", name: "OSI & TCP/IP models", position: 1 },
  { subject: "Networks", name: "TCP vs UDP", position: 2 },
  { subject: "Networks", name: "HTTP/HTTPS & DNS", position: 3 },
  { subject: "Networks", name: "IP addressing & subnetting", position: 4 },

  // System Design & OOP (3 core topics)
  { subject: "OOP", name: "Four pillars of OOP", position: 1 },
  { subject: "OOP", name: "SOLID principles", position: 2 },
  { subject: "OOP", name: "Common design patterns", position: 3 },
];

/**
 * Seeds reference CS Core topics into Supabase learning_topics table.
 */
export async function seedLearningTopics() {
  const { data: existing, error: checkError } = await supabase
    .from("learning_topics")
    .select("id")
    .limit(1);

  if (checkError) {
    console.error("Error checking learning_topics:", checkError);
    return { success: false, error: checkError.message };
  }

  if (existing && existing.length > 0) {
    return { success: true, message: "learning_topics already seeded." };
  }

  const { error: insertError } = await supabase
    .from("learning_topics")
    .insert(REFERENCE_TOPICS);

  if (insertError) {
    console.error("Failed to seed learning_topics:", insertError);
    return { success: false, error: insertError.message };
  }

  return { success: true, count: REFERENCE_TOPICS.length };
}
