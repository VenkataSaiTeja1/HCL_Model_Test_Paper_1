/**
 * HCL Campus Drive — Model Test Paper 1
 * --------------------------------------------------------------------------
 * A self-contained React component (no external UI libraries) for final-year
 * B.Tech students (CSE, CSM, CAI, CSD, IT, ECE, EEE).
 *
 * Tabs
  *   1. Question Bank – Paper 1: 30 MCQs (A1 Quant 10 · A2 Reasoning 8 · A3 Computer Fundamentals 12)
 *                      + the Section B coding problem, with section chips, filters, search, sort
 *   2. Mock Test     – timed test: full Section A (30 Qs · 60 min) or one section
 *   3. Coding Round  – Section B: Transaction Audit Windows (Prefix sums + hashing), Java + Python solutions, extra tests
 *
 * Content
 *   • Questions, options, answers and working are exactly those of the Word paper
 *     HCL_Model_Test_Paper_1.docx and its answer key (unchanged).
 *   • Topic and difficulty tags were added for filtering only.
 *
 * Usage: drop into any React 18+ project (Vite/CRA/Next client component) and
 * render <HCLModelTestPaper1 />. Progress is kept in component state and, where
 * the browser allows it, mirrored to localStorage (safe no-op otherwise).
 */
import { useEffect, useMemo, useRef, useState } from "react";

// ─── QUESTION BANK (Paper 1: 30 MCQs + 1 coding problem) ─────────────────
// MCQ fields: id, paper, no (question number in the paper), cat (quant|reasoning|technical), topic, diff,
//             time (sec), q, code?, lang?, opts[], ans (index), sol
// Coding item (type: "coding", id P1-B) instead carries: pattern, statement, input, output, constraints,
//             samples[{in,out,note}], tests[{in,out}], approach, complexity, marking, java, python
const BANK = [
  {"id": "P1-Q01", "paper": 1, "no": 1, "cat": "quant", "topic": "Profit & Loss", "diff": "Medium", "time": 60, "q": "An article is marked at ₹1,200. After a 15% discount the shopkeeper still earns a 2% profit. The cost price is:", "opts": ["₹950", "₹1,000", "₹1,050", "₹980"], "ans": 1, "sol": "SP = 0.85 × 1,200 = 1,020; CP = 1,020 / 1.02 = 1,000"},
  {"id": "P1-Q02", "paper": 1, "no": 2, "cat": "quant", "topic": "Time & Work", "diff": "Medium", "time": 60, "q": "A can finish a job in 20 days and B in 30 days. They work together for 6 days, then A leaves. B finishes the remaining work in:", "opts": ["12 days", "18 days", "15 days", "10 days"], "ans": 2, "sol": "6 × (1/20 + 1/30) = 1/2 done; 1/2 ÷ 1/30 = 15 days"},
  {"id": "P1-Q03", "paper": 1, "no": 3, "cat": "quant", "topic": "Speed & Distance", "diff": "Easy", "time": 45, "q": "A 300 m long train crosses a 250 m long platform in 25 seconds. Its speed is:", "opts": ["72 km/h", "66 km/h", "81 km/h", "79.2 km/h"], "ans": 3, "sol": "(300 + 250) / 25 = 22 m/s × 18/5 = 79.2 km/h"},
  {"id": "P1-Q04", "paper": 1, "no": 4, "cat": "quant", "topic": "Averages", "diff": "Medium", "time": 60, "q": "The average weight of 8 people rises by 2.5 kg when a new person replaces one who weighs 65 kg. The new person's weight is:", "opts": ["85 kg", "80 kg", "75 kg", "90 kg"], "ans": 0, "sol": "Increase in total = 8 × 2.5 = 20; 65 + 20 = 85"},
  {"id": "P1-Q05", "paper": 1, "no": 5, "cat": "quant", "topic": "Interest", "diff": "Easy", "time": 45, "q": "The compound interest on ₹15,000 at 10% per annum for 2 years, compounded annually, is:", "opts": ["₹3,000", "₹3,300", "₹3,150", "₹3,465"], "ans": 2, "sol": "15,000 × (1.21 − 1) = 3,150"},
  {"id": "P1-Q06", "paper": 1, "no": 6, "cat": "quant", "topic": "Ratio & Proportion", "diff": "Medium", "time": 60, "q": "₹7,800 is divided among A, B and C in the ratio 1/2 : 1/3 : 1/4. A's share is:", "opts": ["₹3,900", "₹3,200", "₹3,600", "₹2,400"], "ans": 2, "sol": "Ratio = 6 : 4 : 3 (×12); A = 6/13 × 7,800 = 3,600"},
  {"id": "P1-Q07", "paper": 1, "no": 7, "cat": "quant", "topic": "Probability", "diff": "Easy", "time": 45, "q": "Two fair dice are thrown. The probability that the sum is 7 is:", "opts": ["1/6", "5/36", "7/36", "1/9"], "ans": 0, "sol": "6 favourable pairs out of 36"},
  {"id": "P1-Q08", "paper": 1, "no": 8, "cat": "quant", "topic": "Percentages", "diff": "Easy", "time": 45, "q": "If 20% of A equals 30% of B, then A : B is:", "opts": ["2 : 3", "4 : 3", "3 : 4", "3 : 2"], "ans": 3, "sol": "0.2A = 0.3B → A/B = 3/2"},
  {"id": "P1-Q09", "paper": 1, "no": 9, "cat": "quant", "topic": "Number System", "diff": "Medium", "time": 60, "q": "The largest 4-digit number exactly divisible by 12, 15 and 18 is:", "opts": ["9720", "9900", "9960", "9990"], "ans": 1, "sol": "LCM = 180; 9999 ÷ 180 = 55 rem 99 → 55 × 180 = 9,900"},
  {"id": "P1-Q10", "paper": 1, "no": 10, "cat": "quant", "topic": "Profit & Loss", "diff": "Medium", "time": 60, "q": "A dishonest shopkeeper sells at cost price but uses a 900 g weight for 1 kg. His gain percentage is:", "opts": ["10%", "9.09%", "11.11%", "12.5%"], "ans": 2, "sol": "Gain 100 g on 900 g = 100/900 = 11.11%"},
  {"id": "P1-Q11", "paper": 1, "no": 11, "cat": "reasoning", "topic": "Number Series", "diff": "Easy", "time": 45, "q": "Find the next number: 7, 10, 16, 28, 52, ?", "opts": ["96", "104", "88", "100"], "ans": 3, "sol": "Differences 3, 6, 12, 24, 48 → 52 + 48 = 100"},
  {"id": "P1-Q12", "paper": 1, "no": 12, "cat": "reasoning", "topic": "Analogy", "diff": "Medium", "time": 60, "q": "ZYX : CBA :: WVU : ?", "opts": ["FED", "DEF", "EFD", "GFE"], "ans": 0, "sol": "Each letter becomes its mirror (A↔Z) and the order is reversed: W→D, V→E, U→F → FED"},
  {"id": "P1-Q13", "paper": 1, "no": 13, "cat": "reasoning", "topic": "Coding–Decoding", "diff": "Easy", "time": 45, "q": "If RED = 27 (sum of letter positions), then BLUE = ?", "opts": ["38", "42", "41", "40"], "ans": 3, "sol": "B2 + L12 + U21 + E5 = 40"},
  {"id": "P1-Q14", "paper": 1, "no": 14, "cat": "reasoning", "topic": "Blood Relations", "diff": "Easy", "time": 45, "q": "M is the son of N. N is the sister of O. O is the father of P. How is M related to P?", "opts": ["Brother", "Cousin", "Nephew", "Uncle"], "ans": 1, "sol": "N and O are siblings; their children M and P are cousins"},
  {"id": "P1-Q15", "paper": 1, "no": 15, "cat": "reasoning", "topic": "Directions", "diff": "Medium", "time": 60, "q": "Asha walks 6 km east, turns left and walks 8 km, then turns left again and walks 12 km. How far and in which direction is she from the start?", "opts": ["10 km North-East", "10 km North-West", "14 km North-West", "8 km North"], "ans": 1, "sol": "Net 6 km west and 8 km north → √(36 + 64) = 10 km NW"},
  {"id": "P1-Q16", "paper": 1, "no": 16, "cat": "reasoning", "topic": "Seating & Ranking", "diff": "Medium", "time": 60, "q": "Six friends A–F sit in a row facing north. F is at the left end. B is third from the left. D is to the immediate right of B. A is second from the right. C is not at an end. Who sits at the right end?", "opts": ["A", "C", "E", "D"], "ans": 2, "sol": "Order: F C B D A E"},
  {"id": "P1-Q17", "paper": 1, "no": 17, "cat": "reasoning", "topic": "Syllogisms", "diff": "Medium", "time": 60, "q": "Statements: All engineers are graduates. Some graduates are managers.\nConclusions: I. Some engineers are managers. II. All managers are graduates.", "opts": ["Only I follows", "Only II follows", "Both follow", "Neither follows"], "ans": 3, "sol": "Neither is certain: the graduates who are managers need not be engineers, and only some managers are known to be graduates"},
  {"id": "P1-Q18", "paper": 1, "no": 18, "cat": "reasoning", "topic": "Data Sufficiency", "diff": "Medium", "time": 60, "q": "How old is Ravi?\nStatement I: Ravi is 4 years older than Sita.\nStatement II: Sita's age is half of Ravi's age.", "opts": ["Statement I alone is sufficient", "Statement II alone is sufficient", "Either statement alone is sufficient", "Both statements together are needed"], "ans": 3, "sol": "R = S + 4 and S = R/2 → R = 8; both needed"},
  {"id": "P1-Q19", "paper": 1, "no": 19, "cat": "technical", "topic": "Operating Systems", "diff": "Medium", "time": 60, "q": "External fragmentation is mainly a problem in:", "opts": ["Contiguous variable-size memory allocation", "Paging", "Demand paging with fixed frames", "Register allocation"], "ans": 0, "sol": "Variable partitions leave scattered free holes; paging uses fixed frames"},
  {"id": "P1-Q20", "paper": 1, "no": 20, "cat": "technical", "topic": "Operating Systems", "diff": "Easy", "time": 45, "q": "Which page replacement algorithm replaces the page that has not been used for the longest time?", "opts": ["FIFO", "Optimal", "LRU", "MRU"], "ans": 2, "sol": "Least Recently Used"},
  {"id": "P1-Q21", "paper": 1, "no": 21, "cat": "technical", "topic": "Computer Networks", "diff": "Easy", "time": 45, "q": "Which OSI layer provides end-to-end delivery, segmentation and flow control?", "opts": ["Transport", "Network", "Data Link", "Session"], "ans": 0, "sol": "TCP/UDP live at the Transport layer"},
  {"id": "P1-Q22", "paper": 1, "no": 22, "cat": "technical", "topic": "Computer Networks", "diff": "Easy", "time": 45, "q": "Which of the following is a loopback address?", "opts": ["192.168.0.1", "127.0.0.1", "10.0.0.1", "255.255.255.255"], "ans": 1, "sol": "127.0.0.0/8 is reserved for loopback"},
  {"id": "P1-Q23", "paper": 1, "no": 23, "cat": "technical", "topic": "DBMS & SQL", "diff": "Easy", "time": 45, "q": "Which SQL constraint makes sure every value in a column satisfies a condition such as age >= 18?", "opts": ["CHECK", "UNIQUE", "DEFAULT", "INDEX"], "ans": 0, "sol": "CHECK enforces a Boolean condition"},
  {"id": "P1-Q24", "paper": 1, "no": 24, "cat": "technical", "topic": "DBMS & SQL", "diff": "Medium", "time": 60, "q": "Table emp has dept values HR, IT, IT, NULL, Sales. What does SELECT COUNT(DISTINCT dept) FROM emp; return?", "opts": ["4", "3", "5", "2"], "ans": 1, "sol": "Distinct non-NULL values: HR, IT, Sales"},
  {"id": "P1-Q25", "paper": 1, "no": 25, "cat": "technical", "topic": "Data Structures", "diff": "Easy", "time": 45, "q": "Which data structure is best suited for implementing a priority queue?", "opts": ["Stack", "Binary heap", "Queue", "Hash table"], "ans": 1, "sol": "Heap gives O(log n) insert and extract-min/max"},
  {"id": "P1-Q26", "paper": 1, "no": 26, "cat": "technical", "topic": "Data Structures", "diff": "Easy", "time": 45, "q": "A tree with n nodes has exactly how many edges?", "opts": ["n", "n + 1", "n − 1", "2n − 1"], "ans": 2, "sol": "Every node except the root has one parent edge"},
  {"id": "P1-Q27", "paper": 1, "no": 27, "cat": "technical", "topic": "Data Structures", "diff": "Easy", "time": 45, "q": "The worst-case time to search a key in a balanced binary search tree is:", "opts": ["O(log n)", "O(n)", "O(1)", "O(n log n)"], "ans": 0, "sol": "Height of a balanced BST is O(log n)"},
  {"id": "P1-Q28", "paper": 1, "no": 28, "cat": "technical", "topic": "OOP & Java", "diff": "Easy", "time": 45, "q": "In Java, which access modifier makes a member visible only within its own class?", "opts": ["private", "protected", "public", "default (package-private)"], "ans": 0, "sol": "private restricts access to the declaring class"},
  {"id": "P1-Q29", "paper": 1, "no": 29, "cat": "technical", "topic": "Output Prediction", "diff": "Medium", "time": 60, "q": "What is the output of the following C code?", "code": "int x = 5;\nint y = x++ * 2;\nprintf(\"%d %d\", x, y);", "lang": "c", "opts": ["5 10", "6 10", "6 12", "5 12"], "ans": 1, "sol": "y = 5 × 2 = 10 (post-increment uses old value), then x becomes 6"},
  {"id": "P1-Q30", "paper": 1, "no": 30, "cat": "technical", "topic": "Output Prediction", "diff": "Medium", "time": 60, "q": "What is the output of the following Python code?", "code": "s = \"placement\"\nprint(s[::-1][:3])", "lang": "python", "opts": ["pla", "ent", "tnem", "tne"], "ans": 3, "sol": "s[::-1] = 'tnemecalp'; first three characters 'tne'"},
  {"id": "P1-B", "paper": 1, "no": 31, "cat": "coding", "type": "coding", "topic": "Coding: Prefix sums + hashing", "diff": "Medium", "time": 2700, "q": "Transaction Audit Windows", "pattern": "Prefix sums + hashing", "statement": "A bank's audit tool scans a day's transactions in order. Deposits are positive amounts and refunds are negative. Auditors want to know how many contiguous runs of transactions add up to exactly K rupees, because such runs often hide split payments.\n\nPrint the number of contiguous subarrays whose sum is exactly K.", "input": "Line 1: two integers N and K.\nLine 2: N space-separated integers, the transaction amounts.", "output": "A single integer: the number of subarrays with sum exactly K.", "constraints": "1 ≤ N ≤ 10^5\n−10^4 ≤ amount ≤ 10^4\n−10^9 ≤ K ≤ 10^9\nExpected time complexity: O(N); an O(N²) solution will time out", "samples": [{"in": "5 5\n1 4 0 -2 7\n", "out": "4\n", "note": ""}, {"in": "6 0\n3 -3 2 -2 1 -1\n", "out": "6\n", "note": ""}, {"in": "3 10\n1 2 3\n", "out": "0\n", "note": "No contiguous run sums to 10."}], "tests": [{"in": "1 0\n0\n", "out": "1\n"}, {"in": "4 3\n1 1 1 1\n", "out": "2\n"}, {"in": "5 -2\n-1 -1 -1 1 -2\n", "out": "5\n"}], "approach": "Keep a running prefix sum and a hash map that counts how often each prefix value has appeared (start with prefix 0 seen once). A subarray ending at the current position sums to K exactly when some earlier prefix equals prefix − K, so add that count. Use 64-bit integers for the sums and the answer. Time O(N), space O(N).", "complexity": "O(N) time, O(N) space", "marking": "Common mistake: a sliding window does not work because amounts can be negative. A correct O(N²) double loop passes only small tests — award at most 6 of the 12 correctness marks and 0 efficiency marks.", "java": "import java.util.*;\nimport java.io.*;\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = new StringTokenizer(br.readLine());\n        int n = Integer.parseInt(st.nextToken());\n        long k = Long.parseLong(st.nextToken());\n        st = new StringTokenizer(br.readLine());\n        Map<Long, Integer> seen = new HashMap<>();\n        seen.put(0L, 1);\n        long prefix = 0, count = 0;\n        for (int i = 0; i < n; i++) {\n            prefix += Long.parseLong(st.nextToken());\n            count += seen.getOrDefault(prefix - k, 0);\n            seen.merge(prefix, 1, Integer::sum);\n        }\n        System.out.println(count);\n    }\n}", "python": "from collections import defaultdict\nn, k = map(int, input().split())\na = list(map(int, input().split()))\nseen = defaultdict(int); seen[0] = 1\nprefix = count = 0\nfor x in a:\n    prefix += x\n    count += seen[prefix - k]\n    seen[prefix] += 1\nprint(count)"}
];

// ─── STATIC CONTENT ─────────────────────────────────────────────────────────
const CATS = [
  { id: "quant", name: "Quantitative Aptitude", short: "Quant", icon: "∑", color: "#2563EB", section: "A1" },
  { id: "reasoning", name: "Logical Reasoning", short: "Reasoning", icon: "◇", color: "#7C3AED", section: "A2" },
  { id: "technical", name: "Computer Fundamentals", short: "Technical", icon: "</>", color: "#EA580C", section: "A3" },
  { id: "coding", name: "Coding (Section B)", short: "Coding", icon: "{ }", color: "#0D9488", section: "B" },
];
const CAT_BY_ID = Object.fromEntries(CATS.map((c) => [c.id, c]));
const COUNT = Object.fromEntries(CATS.map((c) => [c.id, BANK.filter((q) => q.cat === c.id).length]));
const MCQ_TOTAL = BANK.filter((q) => q.type !== "coding").length;
const CODING_ITEMS = BANK.filter((q) => q.type === "coding");
const PAPERS = [...new Set(BANK.map((q) => q.paper))];
const SINGLE = PAPERS.length === 1;
const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
const DIFF_META = {
  Easy: { fg: "#166534", bg: "#DCFCE7" },
  Medium: { fg: "#9A3412", bg: "#FFEDD5" },
  Hard: { fg: "#991B1B", bg: "#FEE2E2" },
};

const TEST_SCOPES = [
  { id: "full", name: "Full paper (Section A)", cats: ["quant", "reasoning", "technical"], minutes: 60 },
  { id: "quant", name: "A1 · Quant", cats: ["quant"], minutes: 20 },
  { id: "reasoning", name: "A2 · Reasoning", cats: ["reasoning"], minutes: 15 },
  { id: "technical", name: "A3 · Computer Fundamentals", cats: ["technical"], minutes: 25 },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const LS_KEY = "hcl-model-paper-1-progress-v1";
function loadProgress() {
  try { return JSON.parse(window.localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) {
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* storage unavailable: keep in memory */ }
}
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// ─── SMALL UI PIECES ────────────────────────────────────────────────────────
function Pill({ fg, bg, children, title }) {
  return <span className="pill" style={{ color: fg, background: bg }} title={title}>{children}</span>;
}
function CodeBlock({ code, lang }) {
  return (
    <div className="code">
      {lang && <span className="code-lang">{lang.toUpperCase()}</span>}
      <pre><code>{code}</code></pre>
    </div>
  );
}

/** A single MCQ card: answer by clicking an option, or reveal the solution. */
function QuestionCard({ q, index, record, onAnswer, showMeta = true, lockReveal = false }) {
  const [open, setOpen] = useState(false);
  const chosen = record?.choice;
  const answered = chosen !== undefined;
  const reveal = !lockReveal && (answered || open);
  const cat = CAT_BY_ID[q.cat];
  return (
    <article className="qcard" style={{ borderLeftColor: cat.color }}>
      <header className="qhead">
        <span className="qid" style={{ color: cat.color }}>Paper {q.paper} · Q{q.no}</span>
        <span className="qtopic">{q.topic}</span>
        <span className="spacer" />
        <Pill {...DIFF_META[q.diff]}>{q.diff}</Pill>
        <span className="qtime" title="Recommended time">⏱ {q.time}s</span>
      </header>
      <p className="qtext">{index !== undefined && <b>{index + 1}. </b>}{q.q}</p>
      {q.code && <CodeBlock code={q.code} lang={q.lang} />}
      <ol className="opts">
        {q.opts.map((o, i) => {
          let cls = "opt";
          if (reveal && i === q.ans) cls += " correct";
          else if (answered && i === chosen && chosen !== q.ans && !lockReveal) cls += " wrong";
          else if (answered && i === chosen) cls += " picked";
          return (
            <li key={i}>
              <button className={cls} onClick={() => onAnswer && onAnswer(q, i)} disabled={!onAnswer || (answered && !lockReveal)}>
                <span className="optkey">{String.fromCharCode(65 + i)}</span>
                <span>{o}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {!lockReveal && (
        <div className="qfoot">
          <button className="link" onClick={() => setOpen((v) => !v)}>{reveal ? "Hide solution" : "Show solution"}</button>
        </div>
      )}
      {reveal && (
        <div className="sol">
          <div><b>Answer: {String.fromCharCode(65 + q.ans)}</b> — {q.opts[q.ans]}</div>
          <p>{q.sol}</p>
        </div>
      )}
      {showMeta && (
        <footer className="qmeta">
          <Pill fg="#1E40AF" bg="#DBEAFE">Model Test Paper {q.paper}</Pill>
          <span className="ref">Section {cat.section} — {cat.name}</span>
        </footer>
      )}
    </article>
  );
}

/** A coding problem: statement, I/O spec, samples, then approach / Java / Python / test cases on demand. */
function CodingCard({ q, solved, onToggle }) {
  const [view, setView] = useState(null); // null | "approach" | "java" | "python" | "tests"
  const cat = CAT_BY_ID[q.cat];
  const toggle = (v) => setView((cur) => (cur === v ? null : v));
  return (
    <article className="qcard coding" style={{ borderLeftColor: cat.color }}>
      <header className="qhead">
        <span className="qid" style={{ color: cat.color }}>Paper {q.paper} · Section B</span>
        <span className="qtopic">{q.topic}</span>
        <span className="spacer" />
        <Pill {...DIFF_META[q.diff]}>{q.diff}</Pill>
        <span className="qtime" title="Recommended time">⏱ {Math.round(q.time / 60)} min</span>
      </header>
      <h4 className="ctitle">{q.q}</h4>
      <p className="qtext">{q.statement}</p>
      <dl className="io">
        <dt>Input</dt><dd>{q.input}</dd>
        <dt>Output</dt><dd>{q.output}</dd>
        <dt>Constraints</dt><dd>{q.constraints}</dd>
      </dl>
      {q.samples.map((s, i) => (
        <div key={i} className="sample">
          <div><div className="sample-h">Sample input {q.samples.length > 1 ? i + 1 : ""}</div><pre>{s.in.replace(/\n$/, "")}</pre></div>
          <div><div className="sample-h">Sample output</div><pre>{s.out.replace(/\n$/, "")}</pre></div>
          {s.note && <div className="sample-note">{s.note}</div>}
        </div>
      ))}
      <div className="ctabs">
        <button className={view === "approach" ? "on" : ""} onClick={() => toggle("approach")}>Approach</button>
        <button className={view === "java" ? "on" : ""} onClick={() => toggle("java")}>Java solution</button>
        <button className={view === "python" ? "on" : ""} onClick={() => toggle("python")}>Python solution</button>
        <button className={view === "tests" ? "on" : ""} onClick={() => toggle("tests")}>Extra test cases</button>
        <span className="spacer" />
        <label className="solved"><input type="checkbox" checked={solved} onChange={() => onToggle(q)} /> Solved</label>
      </div>
      {view === "approach" && <div className="sol"><p>{q.approach}</p><p><b>Complexity:</b> {q.complexity}</p><p className="muted">{q.marking}</p></div>}
      {view === "java" && <CodeBlock code={q.java} lang="java" />}
      {view === "python" && <CodeBlock code={q.python} lang="python" />}
      {view === "tests" && q.tests.map((s, i) => (
        <div key={i} className="sample">
          <div><div className="sample-h">Test input {i + 1}</div><pre>{s.in.replace(/\n$/, "")}</pre></div>
          <div><div className="sample-h">Expected output</div><pre>{s.out.replace(/\n$/, "")}</pre></div>
        </div>
      ))}
      <footer className="qmeta">
        <Pill fg="#1E40AF" bg="#DBEAFE">Model Test Paper {q.paper}</Pill>
        <span className="ref">Pattern tested: {q.pattern}</span>
      </footer>
    </article>
  );
}

// ─── TABS ───────────────────────────────────────────────────────────────────

/** Labelled <select> used by the Question Bank filters. */
function Sel({ label, value, set, options }) {
  return (
    <label className="sel"><span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  );
}

function Bank({ progress, cat = "all", setCat, paper = "all", setPaper, onAnswer, onSolved, onReset }) {
  const [diff, setDiff] = useState("all");
  const [topic, setTopic] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("id");
  const [query, setQuery] = useState("");

  const topics = useMemo(() => [...new Set(BANK.filter((q) => cat === "all" || q.cat === cat).map((q) => q.topic))].sort(), [cat]);
  useEffect(() => { setTopic("all"); }, [cat]);

  const list = useMemo(() => {
    const s = query.trim().toLowerCase();
    const r = BANK.filter((q) =>
      (cat === "all" || q.cat === cat) && (paper === "all" || q.paper === Number(paper)) &&
      (diff === "all" || q.diff === diff) && (topic === "all" || q.topic === topic) &&
      (status === "all" || (status === "todo" && !progress[q.id]) || (status === "wrong" && progress[q.id] && !progress[q.id].correct) || (status === "right" && progress[q.id]?.correct)) &&
      (!s || [q.q, q.topic, q.id, q.code || "", q.statement || "", (q.opts || []).join(" ")].join(" ").toLowerCase().includes(s))
    );
    const by = {
      id: (a, b) => BANK.indexOf(a) - BANK.indexOf(b),
      diff: (a, b) => DIFF_ORDER[a.diff] - DIFF_ORDER[b.diff] || BANK.indexOf(a) - BANK.indexOf(b),
      diffDesc: (a, b) => DIFF_ORDER[b.diff] - DIFF_ORDER[a.diff] || BANK.indexOf(a) - BANK.indexOf(b),
      time: (a, b) => a.time - b.time || BANK.indexOf(a) - BANK.indexOf(b),
      topic: (a, b) => a.topic.localeCompare(b.topic) || BANK.indexOf(a) - BANK.indexOf(b),
    }[sort];
    return [...r].sort(by);
  }, [cat, paper, diff, topic, status, sort, query, progress]);

  return (
    <div className="stack">
      {!SINGLE && <div className="chips">
        <button className={`chip ${paper === "all" ? "on" : ""}`} onClick={() => setPaper("all")}>All papers</button>
        {PAPERS.map((p) => <button key={p} className={`chip ${String(paper) === String(p) ? "on" : ""}`} onClick={() => setPaper(String(p))}>Paper {p}</button>)}
      </div>}
      <div className="chips">
        <button className={`chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>All sections ({BANK.length})</button>
        {CATS.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? "on" : ""}`} style={cat === c.id ? { background: c.color, borderColor: c.color } : {}} onClick={() => setCat(c.id)}>{c.section} · {c.short} ({COUNT[c.id]})</button>
        ))}
      </div>
      <div className="filters">
        <input className="search" placeholder="Search questions, topics, code…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
        <Sel label="Topic" value={topic} set={setTopic} options={[["all", "All topics"], ...topics.map((t) => [t, t])]} />
        <Sel label="Difficulty" value={diff} set={setDiff} options={[["all", "All"], ["Easy", "Easy"], ["Medium", "Medium"], ["Hard", "Hard"]]} />
        <Sel label="Status" value={status} set={setStatus} options={[["all", "All"], ["todo", "Not attempted"], ["wrong", "Got wrong"], ["right", "Got right"]]} />
        <Sel label="Sort" value={sort} set={setSort} options={[["id", "Paper order"], ["diff", "Easy → Hard"], ["diffDesc", "Hard → Easy"], ["time", "Shortest time"], ["topic", "Topic A–Z"]]} />
      </div>
      <div className="row">
        <span className="muted">{list.length} item{list.length === 1 ? "" : "s"} · est. {Math.round(list.reduce((a, q) => a + q.time, 0) / 60)} min</span>
        <span className="spacer" />
        <button className="link" onClick={onReset}>Reset progress</button>
      </div>
      {list.length === 0 && <div className="card muted">No questions match these filters.</div>}
      {list.map((q) => q.type === "coding"
        ? <CodingCard key={q.id} q={q} solved={!!progress[q.id]} onToggle={onSolved} />
        : <QuestionCard key={q.id} q={q} record={progress[q.id]} onAnswer={onAnswer} />)}
    </div>
  );
}

/** Timed test: a whole paper's Section A (30 questions, 60 min) or one section, in paper order. */
function MockTest() {
  const [paper, setPaper] = useState(PAPERS[0]);
  const [scopeId, setScopeId] = useState("full");
  const [test, setTest] = useState(null); // { qs, answers, start, submitted, paper, scope }
  const [now, setNow] = useState(Date.now());
  const timer = useRef(null);
  const scope = TEST_SCOPES.find((s) => s.id === (test ? test.scope : scopeId));
  const LIMIT = scope.minutes * 60;

  useEffect(() => {
    if (test && !test.submitted) { timer.current = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer.current); }
  }, [test]);
  const left = test ? Math.max(0, LIMIT - Math.floor((now - test.start) / 1000)) : LIMIT;
  useEffect(() => { if (test && !test.submitted && left === 0) setTest((t) => ({ ...t, submitted: true })); }, [left, test]);

  const start = () => {
    const qs = BANK.filter((q) => q.paper === paper && q.type !== "coding" && scope.cats.includes(q.cat));
    setTest({ qs, answers: {}, start: Date.now(), submitted: false, paper, scope: scopeId });
    setNow(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const score = test ? test.qs.filter((q) => test.answers[q.id] === q.ans).length : 0;
  const answeredCount = test ? Object.keys(test.answers).length : 0;

  if (!test) {
    return (
      <div className="stack">
        <section className="card">
          <h3>Timed paper test</h3>
          <p>{SINGLE ? `Take Paper ${PAPERS[0]}'s Section A under exam timing:` : "Take a model paper's Section A under exam timing:"}{" the full 30 questions in 60 minutes, or one section on its own. Questions appear"} in the same order as the printed paper. There is no negative marking, so answer every question. The test submits itself when time runs out.</p>
          {!SINGLE && <>
          <div className="row" style={{ marginTop: 10 }}><b>Paper</b></div>
          <div className="chips">
            {PAPERS.map((p) => <button key={p} className={`chip ${paper === p ? "on" : ""}`} onClick={() => setPaper(p)}>Paper {p}</button>)}
          </div>
          </>}
          <div className="row" style={{ marginTop: 10 }}><b>Scope</b></div>
          <div className="chips">
            {TEST_SCOPES.map((s) => <button key={s.id} className={`chip ${scopeId === s.id ? "on" : ""}`} onClick={() => setScopeId(s.id)}>{s.name} · {s.minutes} min</button>)}
          </div>
          <button className="primary" onClick={start}>Start {TEST_SCOPES.find((s) => s.id === scopeId).minutes}-minute test</button>
        </section>
        <section className="card muted small">Section B (coding, 45 min) is practised in the Coding Round tab.</section>
      </div>
    );
  }
  const bySection = scope.cats.map((cid) => {
    const qs = test.qs.filter((q) => q.cat === cid);
    return { c: CAT_BY_ID[cid], total: qs.length, right: qs.filter((q) => test.answers[q.id] === q.ans).length };
  });
  return (
    <div className="stack">
      <div className="testbar">
        <b>Paper {test.paper} · {scope.name}</b>
        <span className="muted small">{answeredCount}/{test.qs.length} answered</span>
        <span className="spacer" />
        {!test.submitted ? <span className={`clock ${left < 120 ? "low" : ""}`}>⏱ {fmtTime(left)}</span> : <span className={`score ${score / test.qs.length >= 0.7 ? "pass" : "fail"}`}>Score {score}/{test.qs.length} ({Math.round((score / test.qs.length) * 100)}%)</span>}
        {!test.submitted ? <button className="primary" onClick={() => setTest((t) => ({ ...t, submitted: true }))}>Submit</button> : <button className="primary" onClick={() => setTest(null)}>New test</button>}
      </div>
      {test.submitted && (
        <section className="grid4">
          {bySection.map(({ c, total, right }) => (
            <div key={c.id} className="statcard" style={{ borderTopColor: c.color }}>
              <div className="stat-name">{c.section} · {c.name}</div>
              <div className="stat-num">{right}<span>/{total} correct</span></div>
              <div className="bar"><div style={{ width: `${(right / total) * 100}%`, background: c.color }} /></div>
            </div>
          ))}
        </section>
      )}
      {test.qs.map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i} showMeta={test.submitted}
          record={test.answers[q.id] !== undefined ? { choice: test.answers[q.id] } : undefined}
          lockReveal={!test.submitted}
          onAnswer={test.submitted ? null : (qq, c) => setTest((t) => ({ ...t, answers: { ...t.answers, [qq.id]: c } }))} />
      ))}
    </div>
  );
}

function Coding({ progress, onSolved }) {
  return (
    <div className="stack">
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Paper</th><th>Problem</th><th>Pattern</th><th>Difficulty</th><th>Status</th></tr></thead>
            <tbody>{CODING_ITEMS.map((p) => (
              <tr key={p.id}><td>{p.paper}</td><td>{p.q}</td><td>{p.pattern}</td><td><Pill {...DIFF_META[p.diff]}>{p.diff}</Pill></td><td>{progress[p.id] ? "Solved" : "—"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <h3>{SINGLE ? "Section B problem with solutions" : `All ${CODING_ITEMS.length} Section B problems with solutions`}</h3>
        <p className="muted small">{SINGLE ? "This is the paper's Section B question." : "Each problem is the Section B question of its model paper."} Every Java and Python solution was tested on the samples and extra test cases shown, and cross-checked against a brute-force reference on 300 random inputs. Allow 45 minutes per problem.</p>
      </section>
      {CODING_ITEMS.map((q) => <CodingCard key={q.id} q={q} solved={!!progress[q.id]} onToggle={onSolved} />)}
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────
const TABS = [["bank", "Question Bank"], ["mock", "Mock Test"], ["coding", "Coding Round"]];

export default function HCLModelTestPaper1() {
  const [tab, setTab] = useState("bank");
  const [bankCat, setBankCat] = useState("all");
  const [bankPaper, setBankPaper] = useState("all");
  const [progress, setProgress] = useState(loadProgress);
  useEffect(() => saveProgress(progress), [progress]);

  const onAnswer = (q, choice) => setProgress((p) => (p[q.id] ? p : { ...p, [q.id]: { choice, correct: choice === q.ans } }));
  const onSolved = (q) => setProgress((p) => { const n = { ...p }; if (n[q.id]) delete n[q.id]; else n[q.id] = { solved: true, correct: true }; return n; });
  const onReset = () => { if (window.confirm("Clear all attempted answers?")) setProgress({}); };

  const stats = useMemo(() => Object.fromEntries(CATS.map((c) => {
    const ids = BANK.filter((q) => q.cat === c.id).map((q) => q.id);
    return [c.id, { done: ids.filter((id) => progress[id]).length, correct: ids.filter((id) => progress[id]?.correct).length }];
  })), [progress]);
  const totalDone = Object.values(stats).reduce((a, s) => a + s.done, 0);

  return (
    <div className="hcl-root">
      <style>{CSS}</style>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">HCL Campus Drive · Final Year B.Tech</div>
          <h1>HCL Model Test Paper 1</h1>
          <p>{MCQ_TOTAL} MCQs across Quantitative Aptitude, Logical Reasoning and Computer Fundamentals, plus {SINGLE ? "a Section B coding problem" : `${CODING_ITEMS.length} Section B coding problems`} with Java and Python solutions.</p>
          <div className="progress"><div style={{ width: `${(totalDone / BANK.length) * 100}%` }} /></div>
          <div className="small">{totalDone}/{BANK.length} attempted</div>
        </div>
        <nav className="tabs" role="tablist">
          {TABS.map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t}</button>)}
        </nav>
      </header>
      <main className="main">
        {tab === "bank" && <Bank progress={progress} cat={bankCat} setCat={setBankCat} paper={bankPaper} setPaper={setBankPaper} onAnswer={onAnswer} onSolved={onSolved} onReset={onReset} />}
        {tab === "mock" && <MockTest />}
        {tab === "coding" && <Coding progress={progress} onSolved={onSolved} />}
      </main>
    </div>
  );
}

// ─── STYLES (scoped under .hcl-root) ────────────────────────────────────────
const CSS = `
.hcl-root{--ink:#0F172A;--muted:#64748B;--line:#E2E8F0;--bg:#F8FAFC;--card:#FFFFFF;--accent:#4F46E5;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;line-height:1.5}
.hcl-root *{box-sizing:border-box}
.hcl-root h1,.hcl-root h3{margin:0}
.hero{background:linear-gradient(135deg,#0B1220 0%,#1E1B4B 60%,#312E81 100%);color:#fff}
.hero-inner{max-width:960px;margin:0 auto;padding:28px 16px 16px}
.eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A5B4FC}
.hero h1{font-size:clamp(24px,4vw,32px);font-weight:800;margin:6px 0}
.hero p{color:#CBD5E1;margin:0 0 14px;max-width:640px;font-size:14px}
.progress{height:6px;background:rgba(255,255,255,.12);border-radius:9px;overflow:hidden;max-width:360px}
.progress>div{height:100%;background:linear-gradient(90deg,#818CF8,#22D3EE);transition:width .3s}
.small{font-size:12px}
.hero .small{color:#94A3B8;margin-top:4px}
.tabs{display:flex;gap:2px;max-width:960px;margin:0 auto;padding:0 8px;overflow-x:auto;scrollbar-width:none}
.tabs button{flex:0 0 auto;background:none;border:0;color:#94A3B8;padding:12px 14px;font-weight:600;font-size:14px;cursor:pointer;border-bottom:2px solid transparent}
.tabs button.on{color:#fff;border-bottom-color:#818CF8}
.main{max-width:960px;margin:0 auto;padding:18px 16px 48px}
.stack{display:flex;flex-direction:column;gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.card h3{font-size:16px;margin-bottom:8px}
.card p{margin:0 0 8px;font-size:14px}
.card ul{margin:0;padding-left:20px;font-size:14px}
.card li{margin:4px 0}
.card.warn{background:#FFFBEB;border-color:#FDE68A}
.note{background:#FEF2F2;border-radius:8px;padding:8px 10px;color:#991B1B;font-size:13px}
.muted{color:var(--muted)}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:560px}
th,td{text-align:left;padding:8px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.fact{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}
.fact-k{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
.fact-v{font-weight:700;margin:2px 0 6px}
.fact-why{font-size:12px;color:var(--muted)}
.legend{display:flex;flex-direction:column;gap:6px;font-size:13px;margin-bottom:10px}
.statcard{background:var(--card);border:1px solid var(--line);border-top:3px solid;border-radius:12px;padding:12px}
.stat-icon{font-weight:800;font-size:18px}
.stat-name{font-size:13px;font-weight:600}
.stat-num{font-size:22px;font-weight:800}
.stat-num span{font-size:12px;font-weight:500;color:var(--muted);margin-left:2px}
.bar{height:5px;background:var(--line);border-radius:9px;overflow:hidden;margin:6px 0}
.bar>div{height:100%}
.sources{font-size:13px}
.sources a{color:var(--accent)}
.pill{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--ink)}
.chip.on{background:var(--accent);border-color:var(--accent);color:#fff}
.filters{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}
.search{grid-column:1/-1;border:1px solid var(--line);border-radius:8px;padding:9px 12px;font-size:14px;width:100%}
.sel{display:flex;flex-direction:column;font-size:11px;color:var(--muted);gap:2px;min-width:0}
.sel select{border:1px solid var(--line);border-radius:8px;padding:7px 8px;font-size:13px;background:#fff;color:var(--ink);width:100%}
.row{display:flex;align-items:center;gap:8px;font-size:13px}
.spacer{flex:1}
.link{background:none;border:0;color:var(--accent);font-weight:600;cursor:pointer;font-size:13px;padding:0}
.primary{background:var(--accent);color:#fff;border:0;border-radius:8px;padding:9px 16px;font-weight:700;cursor:pointer;margin-top:10px}
.testbar .primary{margin-top:0}
.qcard{background:var(--card);border:1px solid var(--line);border-left:4px solid;border-radius:12px;padding:14px 16px}
.qhead{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px}
.qid{font-weight:800}
.qtopic{color:var(--muted);font-weight:600}
.qtime{color:var(--muted)}
.qtext{white-space:pre-line;margin:10px 0;font-size:15px}
.passage{margin:10px 0;padding:10px 12px;background:#F1F5F9;border-left:3px solid #94A3B8;border-radius:6px;font-size:13.5px;color:#334155}
.code{position:relative;margin:8px 0}
.code pre{margin:0;background:#0F172A;color:#E2E8F0;border-radius:8px;padding:12px;overflow-x:auto;font-size:12.5px;line-height:1.5}
.code code{font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.code-lang{position:absolute;top:6px;right:8px;font-size:10px;color:#94A3B8;font-weight:700}
.opts{list-style:none;padding:0;margin:0;display:grid;gap:6px}
.opt{width:100%;display:flex;gap:10px;align-items:flex-start;text-align:left;background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:14px;cursor:pointer;color:var(--ink)}
.opt:hover:not(:disabled){border-color:#A5B4FC;background:#EEF2FF}
.opt:disabled{cursor:default}
.optkey{font-weight:800;color:var(--muted);min-width:14px}
.opt.correct{background:#DCFCE7;border-color:#22C55E}
.opt.wrong{background:#FEE2E2;border-color:#EF4444}
.opt.picked{background:#EEF2FF;border-color:#6366F1}
.qfoot{margin-top:8px}
.sol{margin-top:8px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 12px;font-size:14px}
.sol p{margin:4px 0 0}
.qmeta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;padding-top:8px;border-top:1px dashed var(--line)}
.ref{font-size:11.5px;color:var(--muted)}
.testbar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;box-shadow:0 4px 12px rgba(15,23,42,.06)}
.clock{font-weight:800;font-variant-numeric:tabular-nums}
.clock.low{color:#DC2626}
.score{font-weight:800}
.score.pass{color:#16A34A}.score.fail{color:#DC2626}
.timeline{display:flex;flex-direction:column;gap:12px}
.tl-item{display:grid;grid-template-columns:110px 1fr;gap:12px}
.tl-when{font-weight:800;color:var(--accent);padding-top:16px;text-align:right}
.ctitle{margin:8px 0 0;font-size:16px}
.io{display:grid;grid-template-columns:max-content 1fr;gap:4px 12px;font-size:13px;margin:6px 0 10px;white-space:pre-line}
.io dt{font-weight:700;color:var(--muted)}.io dd{margin:0}
.sample{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.sample pre{margin:0;background:#F1F5F9;border:1px solid var(--line);border-radius:6px;padding:8px;font-size:12.5px;overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.sample-h{font-size:11px;font-weight:700;color:var(--muted);margin-bottom:2px}
.sample-note{grid-column:1/-1;font-size:12px;color:var(--muted)}
.ctabs{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px}
.ctabs button{border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 10px;font-size:13px;font-weight:600;cursor:pointer;color:var(--ink)}
.ctabs button.on{background:var(--accent);border-color:var(--accent);color:#fff}
.navlink{font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:6px;padding:4px 0;text-decoration:underline;text-underline-offset:3px;text-align:left}
.solved{font-size:13px;font-weight:600;display:flex;gap:6px;align-items:center;cursor:pointer}
@media (max-width:720px){
  .sample{grid-template-columns:1fr}
  .grid4{grid-template-columns:repeat(2,1fr)}
  .grid2{grid-template-columns:1fr}
  .filters{grid-template-columns:repeat(2,1fr)}
  .tl-item{grid-template-columns:1fr;gap:4px}
  .tl-when{text-align:left;padding-top:0}
}
`;
