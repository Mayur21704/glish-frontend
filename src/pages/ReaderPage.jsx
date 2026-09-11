import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  Volume2,
  Square,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Gauge,
  BookMarked,
  Terminal,
  Database,
  Code2,
  Cloud,
  Shield,
  Server,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import TiltCard from '@/components/ui/TiltCard'
import useSpeechRecognition from '@/hooks/useSpeechRecognition'
import { cn } from '@/lib/utils'

const PRESET_CHIPS = [
  { id: 'systemdesign', label: 'System Design Interview', author: 'Alex Xu', icon: Server, color: 'text-indigo-700' },
  { id: 'linux', label: 'Linux Command Line', author: 'William Shotts', icon: Terminal, color: 'text-[#E06D53]' },
  { id: 'ddia', label: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', icon: Database, color: 'text-cyan-700' },
  { id: 'cleancode', label: 'Clean Code', author: 'Robert C. Martin', icon: Code2, color: 'text-[#D97706]' },
  { id: 'aws', label: 'AWS Well-Architected', author: 'Amazon Web Services', icon: Cloud, color: 'text-amber-600' },
  { id: 'sre', label: 'Google SRE Book', author: 'Google Engineering', icon: Shield, color: 'text-[#4A7C59]' },
]

const CLIENT_PRESET_LIBRARY = {
  systemdesign: {
    bookTitle: "System Design Interview: An Insider's Guide",
    author: "Alex Xu",
    topic: "System Design & Distributed Scalability",
    pages: [
      {
        pageNumber: 1,
        page: "Page 18",
        chapter: "Chapter 1: Scale from Zero to Millions of Users",
        passage: "Vertical scaling means adding more processing power and memory to a single server, whereas horizontal scaling allows scaling by adding more servers into your resource pool. When traffic grows, a load balancer distributes incoming network requests evenly across healthy web servers, eliminating single points of failure and dramatically improving system availability.",
        keyTerms: ["vertical scaling", "horizontal scaling", "load balancer", "availability", "resource pool"],
      },
      {
        pageNumber: 2,
        page: "Page 42",
        chapter: "Chapter 2: Caching Strategy and Eviction Policies",
        passage: "A cache is a temporary storage area that stores the results of expensive database queries in memory so that subsequent requests are served much faster. Employing an in-memory datastore like Redis reduces the primary database load significantly. However, cache invalidation and eviction policies such as Least Recently Used must be carefully configured to prevent serving stale data.",
        keyTerms: ["in-memory datastore", "cache invalidation", "eviction policies", "stale data", "subsequent"],
      },
      {
        pageNumber: 3,
        page: "Page 85",
        chapter: "Chapter 5: Consistent Hashing for Distributed Nodes",
        passage: "In a distributed system, consistent hashing maps both data keys and server nodes onto a virtual logical ring. When a new cache server is added or an existing node crashes, only a small fraction of keys need to be remapped to different servers. Virtual nodes help distribute data uniformly across physical servers, mitigating hot spot bottlenecks.",
        keyTerms: ["consistent hashing", "virtual ring", "remapped", "virtual nodes", "hot spot bottlenecks"],
      },
      {
        pageNumber: 4,
        page: "Page 114",
        chapter: "Chapter 7: Asynchronous Message Queues",
        passage: "Message queues provide asynchronous decoupling between components in a distributed architecture. Web servers publish tasks into Kafka or RabbitMQ topics, and background worker consumers process them at their own pace. If traffic spikes unpredictably, the queue safely buffers incoming requests, preventing downstream database saturation and cascading service failures.",
        keyTerms: ["asynchronous decoupling", "publish tasks", "consumers", "buffers", "cascading failures"],
      },
      {
        pageNumber: 5,
        page: "Page 168",
        chapter: "Chapter 11: Rate Limiting and Fault Tolerance",
        passage: "A rate limiter controls the rate of traffic sent by a client or service, shielding downstream APIs from abuse, denial of service attacks, and resource starvation. Using the Token Bucket algorithm, incoming requests consume tokens from a finite bucket refreshed at a fixed rate. When the bucket is empty, requests are dropped with HTTP status code 429 Too Many Requests.",
        keyTerms: ["rate limiter", "Token Bucket", "starvation", "HTTP 429", "downstream APIs"],
      },
    ],
  },
  linux: {
    bookTitle: "The Linux Command Line: A Complete Introduction",
    author: "William Shotts",
    topic: "Linux CLI, Shell & Systems",
    pages: [
      {
        pageNumber: 1,
        page: "Page 74",
        chapter: "Chapter 6: Redirection, Pipelines, and Standard Streams",
        passage: "The pipeline is perhaps the most powerful feature of the Linux command line. Using the pipe operator, standard output from one command can be redirected directly into the standard input of another. This allows us to combine simple, single-purpose utilities like grep, sort, and uniq into sophisticated data processing workflows without creating temporary files on the filesystem.",
        keyTerms: ["pipeline", "standard output", "redirection", "single-purpose", "workflows"],
      },
      {
        pageNumber: 2,
        page: "Page 108",
        chapter: "Chapter 10: Process Management and System Signals",
        passage: "Every program running on a Linux system is represented as a process with a unique process identifier. When a command runs in the background using an ampersand, the shell immediately returns a command prompt. Signals like SIGTERM and SIGKILL allow the operating system and administrators to request graceful shutdowns or forcibly terminate unresponsive processes.",
        keyTerms: ["process identifier", "background execution", "SIGTERM", "graceful shutdown", "unresponsive"],
      },
      {
        pageNumber: 3,
        page: "Page 142",
        chapter: "Chapter 13: File Permissions and Access Control",
        passage: "The Linux security model is fundamentally anchored in file permissions divided into read, write, and execute bits across owner, group, and world. The chmod command modifies these permissions using octal notation or symbolic modes, ensuring that sensitive configuration files and private cryptographic keys remain inaccessible to unauthorized system users.",
        keyTerms: ["file permissions", "read write execute", "octal notation", "cryptographic keys", "unauthorized"],
      },
      {
        pageNumber: 4,
        page: "Page 210",
        chapter: "Chapter 18: Archiving, Compression, and Remote Transfer",
        passage: "The tar utility bundles directory trees into a continuous archive stream, while gzip and bzip2 apply compression algorithms to minimize disk consumption and network bandwidth. Combined with secure shell utilities like scp and rsync, system administrators can synchronize production code and database backups efficiently across remote geographic clusters.",
        keyTerms: ["archive stream", "compression algorithms", "bandwidth", "synchronize", "remote clusters"],
      },
      {
        pageNumber: 5,
        page: "Page 288",
        chapter: "Chapter 24: Shell Scripting and Automation Best Practices",
        passage: "Writing robust shell scripts requires strict error handling from the outset. Using set -euo pipefail ensures that scripts immediately terminate if an unbound variable is referenced or if any piped command encounters an error. Defensive scripting practices prevent unintended data corruption and make automated deployment workflows predictable and maintainable.",
        keyTerms: ["shell scripts", "pipefail", "unbound variable", "defensive scripting", "predictable"],
      },
    ],
  },
  ddia: {
    bookTitle: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    topic: "Distributed Systems & Data Architecture",
    pages: [
      {
        pageNumber: 1,
        page: "Page 152",
        chapter: "Chapter 5: Leaders, Followers, and Replication Strategies",
        passage: "In a leader-based replication system, every write to the database must be processed by the leader before being propagated to followers. When network partitions occur, determining whether a node has failed or is merely unreachable presents a fundamental challenge. Asynchronous replication provides high write availability and low latency, but sacrifices strong consistency during failover scenarios.",
        keyTerms: ["replication", "partitions", "unreachable", "asynchronous", "consistency"],
      },
      {
        pageNumber: 2,
        page: "Page 198",
        chapter: "Chapter 6: Partitioning and Secondary Indexes",
        passage: "Partitioning divides a huge dataset into smaller subsets to scale read and write throughput across multiple independent machines. However, secondary indexes complicate partitioning because a single query might need to scatter across all partitions and gather results. Designing partition keys that evenly balance queries is essential to prevent hot spot nodes.",
        keyTerms: ["partitioning", "throughput", "secondary indexes", "scatter gather", "balance queries"],
      },
      {
        pageNumber: 3,
        page: "Page 224",
        chapter: "Chapter 7: Transactions and Isolation Levels",
        passage: "ACID transactions provide safety guarantees that allow application code to treat a sequence of database operations as an indivisible atomic unit. Weaker isolation levels like Read Committed protect against dirty reads, but Snapshot Isolation is required to eliminate non-repeatable read anomalies in high-concurrency banking and inventory databases.",
        keyTerms: ["atomic unit", "Read Committed", "dirty reads", "Snapshot Isolation", "concurrency"],
      },
      {
        pageNumber: 4,
        page: "Page 348",
        chapter: "Chapter 9: Consistency and Consensus in Raft",
        passage: "Reaching consensus among distributed nodes is one of the most celebrated problems in computer science. Algorithms like Raft and Paxos ensure that even in the presence of node crashes and unreliable network delays, a cluster of machines can agree on an ordered sequence of state machine transitions without creating split-brain divergence.",
        keyTerms: ["consensus", "Raft Paxos", "unreliable delays", "state machine", "split-brain"],
      },
      {
        pageNumber: 5,
        page: "Page 412",
        chapter: "Chapter 11: Stream Processing and Event Sourcing",
        passage: "In event-driven architectures, state is not stored as a static snapshot, but as an append-only log of immutable historical facts. Stream processing frameworks ingest these event streams in real time, computing continuous aggregations, detecting anomalous transactions, and materializing read-optimized views with sub-second latency.",
        keyTerms: ["append-only log", "immutable facts", "stream processing", "aggregations", "materializing"],
      },
    ],
  },
  cleancode: {
    bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    topic: "Software Craftsmanship & Refactoring",
    pages: [
      {
        pageNumber: 1,
        page: "Page 34",
        chapter: "Chapter 3: Functions and the Single Responsibility Principle",
        passage: "Functions should do one thing. They should do it well, and they should do it only. When a function attempts to mix business logic with input validation and database persistence, it becomes brittle and difficult to test. By extracting smaller, descriptive helper functions with singular responsibilities, the code reads naturally like a well-crafted prose narrative.",
        keyTerms: ["responsibility", "persistence", "brittle", "extracting", "narrative"],
      },
      {
        pageNumber: 2,
        page: "Page 56",
        chapter: "Chapter 4: Meaningful Names and Ubiquitous Language",
        passage: "The name of a variable, function, or class should answer all the big questions. It should tell you why it exists, what it does, and how it is used. If a name requires a comment to explain its purpose, then the name has failed. Choosing clear, intention-revealing names saves countless hours of debugging for future teammates.",
        keyTerms: ["intention-revealing", "ubiquitous language", "refactoring", "clarity", "teammates"],
      },
      {
        pageNumber: 3,
        page: "Page 88",
        chapter: "Chapter 6: Objects and Data Structures",
        passage: "Objects hide their data behind abstractions and expose functions that operate on that data. Data structures, conversely, expose their raw data and have no meaningful functions. Conflating the two creates awkward hybrid designs that are difficult to modify. Good object-oriented design adheres strictly to the Law of Demeter.",
        keyTerms: ["abstractions", "data structures", "hybrid designs", "Law of Demeter", "object-oriented"],
      },
      {
        pageNumber: 4,
        page: "Page 104",
        chapter: "Chapter 7: Robust Error Handling and Exceptions",
        passage: "Error handling is important, but if it obscures logic, it is wrong. Clean code isolates error checking from happy-path business logic by using structured exceptions rather than return codes. Never return or pass null values across public API boundaries, as defensive null checks clutter every layer of the codebase.",
        keyTerms: ["happy-path", "structured exceptions", "null checks", "defensive", "clutter"],
      },
      {
        pageNumber: 5,
        page: "Page 122",
        chapter: "Chapter 9: Unit Tests and the Three Laws of TDD",
        passage: "Clean unit tests must be readable, fast, independent, repeatable, and timely. Test code is just as important as production code; it requires the same care, clean naming, and refactoring discipline. Well-written automated tests give engineers the courage and safety net to continuously refactor architecture without fear of regression.",
        keyTerms: ["unit tests", "refactoring discipline", "safety net", "courage", "regression"],
      },
    ],
  },
  aws: {
    bookTitle: "AWS Well-Architected Framework: Reliability Pillar",
    author: "Amazon Web Services",
    topic: "Cloud Architecture & Event-Driven Systems",
    pages: [
      {
        pageNumber: 1,
        page: "Page 28",
        chapter: "Section 4: Fault Tolerance and Event-Driven Microservices",
        passage: "Building resilient cloud architectures requires designing for failure as a constant rather than an exception. In an event-driven architecture using Amazon SQS and Lambda, decoupling producers from consumers allows asynchronous processing and automatic retry mechanisms with exponential backoff. Idempotent request handling ensures that duplicate message deliveries do not corrupt the underlying datastore.",
        keyTerms: ["resilient", "decoupling", "asynchronous", "exponential", "idempotent"],
      },
      {
        pageNumber: 2,
        page: "Page 54",
        chapter: "Section 6: Multi-AZ Redundancy and Self-Healing",
        passage: "Deploying applications across multiple Availability Zones protects workloads against isolated data center outages. Amazon Aurora automatically replicates database storage across three zones, performing transparent sub-minute failover if the primary instance degrades. Health checks allow application load balancers to divert traffic automatically away from unhealthy container instances.",
        keyTerms: ["Availability Zones", "Aurora", "sub-minute failover", "health checks", "divert traffic"],
      },
      {
        pageNumber: 3,
        page: "Page 76",
        chapter: "Section 8: Elasticity and Auto Scaling Policies",
        passage: "Elasticity is the ability to acquire resources as you need them and release them when you do not. Modern architectures employ target tracking scaling policies that adjust container tasks based on real-time request counts and CPU utilization. This dynamic provisioning minimizes infrastructure costs during off-peak hours while guaranteeing burst capacity.",
        keyTerms: ["elasticity", "target tracking", "provisioning", "off-peak", "burst capacity"],
      },
      {
        pageNumber: 4,
        page: "Page 98",
        chapter: "Section 10: Security and Principle of Least Privilege",
        passage: "Security in the cloud begins with identity and access management. Granting only the minimum permissions necessary to perform a task prevents accidental data exposure and lateral privilege escalation. IAM roles with temporary credentials replace long-lived access keys, while KMS customer master keys encrypt sensitive data at rest.",
        keyTerms: ["least privilege", "lateral escalation", "temporary credentials", "KMS encryption", "data at rest"],
      },
      {
        pageNumber: 5,
        page: "Page 130",
        chapter: "Section 12: Disaster Recovery Strategies",
        passage: "Disaster recovery planning balances business recovery objectives against financial expenditure. Strategies range from low-cost Backup and Restore to Pilot Light, Warm Standby, and multi-region Active-Active configurations. Continuous automated disaster simulations validate that failover routing mechanisms execute reliably when catastrophic regional failures occur.",
        keyTerms: ["recovery objectives", "Warm Standby", "Active-Active", "disaster simulations", "catastrophic"],
      },
    ],
  },
  sre: {
    bookTitle: "Site Reliability Engineering: How Google Runs Production Systems",
    author: "Betsy Beyer, Chris Jones, Jennifer Petoff & Niall Richard Murphy",
    topic: "Site Reliability & Production Engineering",
    pages: [
      {
        pageNumber: 1,
        page: "Page 41",
        chapter: "Chapter 4: Service Level Objectives and Error Budgets",
        passage: "Hope is not a strategy in production operations. By establishing rigorous Service Level Indicators and Service Level Objectives, engineering teams create a quantifiable boundary between system reliability and feature velocity. The error budget acts as a shared metric that aligns the incentives of product developers with the operational demands of system availability.",
        keyTerms: ["reliability", "quantifiable", "velocity", "incentives", "operational"],
      },
      {
        pageNumber: 2,
        page: "Page 72",
        chapter: "Chapter 5: Eliminating Toil with Software Engineering",
        passage: "Toil is the kind of work tied to running a production service that tends to be manual, repetitive, and devoid of enduring value. SRE teams deliberately cap operational toil at fifty percent of their time, dedicating the remaining engineering effort to automating deployments, building self-healing infrastructure, and addressing root systemic problems.",
        keyTerms: ["toil", "repetitive", "enduring value", "self-healing", "systemic"],
      },
      {
        pageNumber: 3,
        page: "Page 110",
        chapter: "Chapter 6: The Four Golden Signals of Monitoring",
        passage: "Effective production telemetry focuses on latency, traffic, errors, and saturation. Latency measures the time it takes to service a request, distinguishing between successful responses and failed requests. Saturation provides a preview of impending performance degradation by measuring memory and CPU capacity constrained by resource limits.",
        keyTerms: ["telemetry", "golden signals", "latency", "saturation", "degradation"],
      },
      {
        pageNumber: 4,
        page: "Page 180",
        chapter: "Chapter 15: Blameless Postmortems and Incident Culture",
        passage: "When production outages inevitably occur, conducting a blameless postmortem assumes that everyone involved had good intentions and acted on the best information available at the time. Shifting the focus from human blame to architectural resilience and systemic safeguards fosters psychological safety and transparent institutional learning.",
        keyTerms: ["postmortem", "blameless", "intentions", "systemic safeguards", "psychological safety"],
      },
      {
        pageNumber: 5,
        page: "Page 246",
        chapter: "Chapter 21: Handling Cascading Failures and Overload",
        passage: "A cascading failure is a failure that enlarges over time as a result of positive feedback loops. When one service instance fails, remaining instances receive higher traffic, triggering resource exhaustion and widespread outage. Implementing client-side rate limits, deadline propagation, and aggressive circuit breakers shields core services under severe overload.",
        keyTerms: ["cascading failure", "feedback loops", "resource exhaustion", "deadline propagation", "circuit breakers"],
      },
    ],
  },
}

// Levenshtein edit distance for accent and phonetic tolerance
function levenshteinDistance(s1, s2) {
  if (s1 === s2) return 0
  if (!s1.length) return s2.length
  if (!s2.length) return s1.length
  const matrix = []
  for (let i = 0; i <= s2.length; i++) matrix[i] = [i]
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = j
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[s2.length][s1.length]
}

function isWordMatch(targetWord, spokenWord) {
  if (!targetWord || !spokenWord) return false
  if (targetWord === spokenWord) return true
  // Stem match (plurals, ing, ed)
  if (targetWord.length >= 4 && (targetWord.startsWith(spokenWord) || spokenWord.startsWith(targetWord))) return true
  // Fuzzy distance tolerance for accents
  const dist = levenshteinDistance(targetWord, spokenWord)
  if (targetWord.length <= 4) return dist <= 1
  if (targetWord.length <= 8) return dist <= 2
  return dist <= 3
}

export default function ReaderPage() {
  const [query, setQuery] = useState('')
  const [activePreset, setActivePreset] = useState('systemdesign')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Current page data
  const initialBook = CLIENT_PRESET_LIBRARY.systemdesign
  const [bookData, setBookData] = useState({
    bookTitle: initialBook.bookTitle,
    author: initialBook.author,
    topic: initialBook.topic,
    chapter: initialBook.pages[0].chapter,
    page: initialBook.pages[0].page,
    passage: initialBook.pages[0].passage,
    keyTerms: initialBook.pages[0].keyTerms,
    currentPage: 1,
    totalPages: 5,
  })

  // Audio Demo State
  const [isPlayingDemo, setIsPlayingDemo] = useState(false)

  // Live Reading / Karaoke Tracking State
  const [matchedWordIndex, setMatchedWordIndex] = useState(-1)
  const [readingStartTime, setReadingStartTime] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const passageWords = useMemo(() => {
    return (bookData?.passage || '').split(/\s+/).filter(Boolean)
  }, [bookData?.passage])

  const cleanPassageWords = useMemo(() => {
    return passageWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
  }, [passageWords])

  useEffect(() => {
    let interval = null
    if (readingStartTime && !isCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - readingStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [readingStartTime, isCompleted])

  // Fetch book passage from backend API with 5-Page navigation & instant fallback
  const fetchPassage = async (targetQuery = '', presetKey = activePreset, pageNum = 1) => {
    setIsLoading(true)
    handleStopReading()
    handleStopDemo()

    // Local instant resolution for 0ms latency
    if (presetKey && CLIENT_PRESET_LIBRARY[presetKey]) {
      const b = CLIENT_PRESET_LIBRARY[presetKey]
      const pIdx = Math.max(0, Math.min(b.pages.length - 1, pageNum - 1))
      const p = b.pages[pIdx]
      setBookData({
        bookTitle: b.bookTitle,
        author: b.author,
        topic: b.topic,
        chapter: p.chapter,
        page: p.page,
        passage: p.passage,
        keyTerms: p.keyTerms,
        currentPage: pageNum,
        totalPages: b.pages.length,
      })
      setCurrentPage(pageNum)
      setMatchedWordIndex(-1)
      setIsCompleted(false)
    }

    try {
      const res = await fetch('/api/book-passage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: targetQuery, preset: presetKey, page: pageNum }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data && data.passage) {
          setBookData(data)
          setCurrentPage(data.currentPage || pageNum)
          setMatchedWordIndex(-1)
          setIsCompleted(false)
        }
      }
    } catch (err) {
      console.warn('Backend book passage error, using local fallback:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > 5) return
    setCurrentPage(newPage)
    fetchPassage(query, activePreset, newPage)
  }

  // Accent-tolerant speech matching
  const handleSpeechInput = (spokenText) => {
    if (!spokenText || isCompleted) return

    const spokenTokens = spokenText
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ''))
      .filter(Boolean)

    if (spokenTokens.length === 0) return

    let currentMatch = matchedWordIndex
    for (const spoken of spokenTokens) {
      for (let offset = 1; offset <= 3; offset++) {
        const nextIdx = currentMatch + offset
        if (nextIdx < cleanPassageWords.length) {
          const target = cleanPassageWords[nextIdx]
          if (isWordMatch(target, spoken)) {
            currentMatch = nextIdx
            break
          }
        }
      }
    }

    if (currentMatch > matchedWordIndex) {
      setMatchedWordIndex(currentMatch)
      if (currentMatch >= cleanPassageWords.length - 1) {
        setIsCompleted(true)
        speechRec.stopListening()
      }
    }
  }

  const speechRec = useSpeechRecognition({
    onInterimTranscript: handleSpeechInput,
    onFinalTranscript: handleSpeechInput,
    isAiSpeaking: isPlayingDemo,
  })

  const handleStartReading = () => {
    handleStopDemo()
    setMatchedWordIndex(-1)
    setIsCompleted(false)
    setReadingStartTime(Date.now())
    setElapsedSeconds(0)
    speechRec.startListening()
  }

  const handleStopReading = () => {
    speechRec.stopListening()
    setReadingStartTime(null)
  }

  const handleResetReading = () => {
    handleStopReading()
    setMatchedWordIndex(-1)
    setIsCompleted(false)
    setElapsedSeconds(0)
  }

  const handlePlayDemo = () => {
    handleStopReading()
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(bookData.passage)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    ) || voices.find((v) => v.lang.startsWith('en'))

    if (englishVoice) utterance.voice = englishVoice

    utterance.onstart = () => setIsPlayingDemo(true)
    utterance.onend = () => setIsPlayingDemo(false)
    utterance.onerror = () => setIsPlayingDemo(false)

    window.speechSynthesis.speak(utterance)
  }

  const handleStopDemo = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlayingDemo(false)
  }

  const wordsReadCount = Math.max(0, matchedWordIndex + 1)
  const totalWordsCount = passageWords.length
  const progressPercent = totalWordsCount > 0 ? Math.round((wordsReadCount / totalWordsCount) * 100) : 0
  const currentWpm = elapsedSeconds > 2 ? Math.round((wordsReadCount / (elapsedSeconds / 60))) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-16 w-full">
      {/* 1. Header Section */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F4EFEA] border border-[#EAE5DE] text-xs font-semibold text-[#E06D53]">
          <BookMarked size={13} />
          <span>Technical Book Teleprompter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1A17] tracking-tight">
          Read Aloud Engineering Literature
        </h1>
        <p className="text-xs sm:text-sm text-[#6B645C] max-w-2xl leading-relaxed">
          Master spoken technical English by reading authentic excerpts from famous books. Follow along with real-time speech karaoke tracking featuring accent and pronunciation tolerance.
        </p>
      </div>

      {/* 2. Topic Search & Discovery Bar */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(28,26,23,0.04)] space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (query.trim()) fetchPassage(query.trim(), activePreset, 1)
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B645C]" />
            <input
              type="text"
              placeholder='Search any tech topic (e.g. "Kafka message queues", "Consistent hashing", "Redis caching")...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE] text-xs sm:text-sm text-[#1C1A17] placeholder-[#6B645C]/60 focus:border-[#E06D53] focus:outline-none shadow-xs font-sans transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn-terracotta w-full sm:w-auto py-3 px-6 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Sparkles size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Searching...' : 'Find Excerpt'}</span>
          </button>
        </form>

        {/* 1-Click Popular Engineering Presets */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#6B645C] font-semibold">
            <span>Curated Software Literature</span>
            <span>1-Click Presets</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_CHIPS.map((p) => {
              const Icon = p.icon
              const isSelected = activePreset === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePreset(p.id)
                    setCurrentPage(1)
                    fetchPassage('', p.id, 1)
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border',
                    isSelected
                      ? 'bg-[#F4EFEA] border-[#E06D53] text-[#1C1A17] font-semibold shadow-xs'
                      : 'bg-[#FBF9F5] border-[#EAE5DE] text-[#6B645C] hover:border-[#DFD8CE] hover:text-[#1C1A17]'
                  )}
                >
                  <Icon size={13} className={p.color} />
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. 5-Page Multi-Page Navigation Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F4EFEA] hover:bg-[#EDE6DE] text-[#1C1A17] border border-[#EAE5DE] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Prev Page</span>
        </button>

        {/* Page Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={cn(
                'w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border flex items-center justify-center',
                currentPage === pageNum
                  ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                  : 'bg-[#FBF9F5] text-[#6B645C] border-[#EAE5DE] hover:text-[#1C1A17] hover:bg-[#F4EFEA]'
              )}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= 5 || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F4EFEA] hover:bg-[#EDE6DE] text-[#1C1A17] border border-[#EAE5DE] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <span>Next Page</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 4. Book Metadata Citation Card (Warm TiltCard) */}
      <TiltCard intensity={5} spotlightColor="rgba(224, 109, 83, 0.08)" className="space-y-3 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE5DE] pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#E06D53]" />
              <h2 className="text-base sm:text-lg font-bold text-[#1C1A17] tracking-tight">
                {bookData.bookTitle}
              </h2>
            </div>
            <div className="text-xs text-[#6B645C]">
              Author: <span className="text-[#1C1A17] font-medium">{bookData.author}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E06D53]/10 text-[#E06D53] border border-[#E06D53]/25">
              Section {currentPage} of 5 • {bookData.page}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[#6B645C] font-mono text-[11px] font-semibold">
            {bookData.chapter}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#6B645C] mr-1 font-semibold">Key Lexicon:</span>
            {bookData.keyTerms?.map((term, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#F4EFEA] text-[#1C1A17] border border-[#EAE5DE]"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </TiltCard>

      {/* 5. The Interactive Teleprompter Reading Arena */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-7 sm:p-9 shadow-[0_4px_24px_rgba(28,26,23,0.04)] space-y-6">
        {/* Top Control Deck: Listen Demo + Start Reading */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE5DE] pb-4">
          <div className="flex items-center gap-2.5">
            {/* Audio Listen Demo Button */}
            {!isPlayingDemo ? (
              <button
                onClick={handlePlayDemo}
                className="btn-sand py-2 px-4 text-xs font-medium cursor-pointer"
                title="Listen to native pronunciation demo"
              >
                <Volume2 size={14} className="text-[#E06D53]" />
                <span>Listen to Tutor</span>
              </button>
            ) : (
              <button
                onClick={handleStopDemo}
                className="btn-sand py-2 px-4 text-xs font-medium cursor-pointer text-amber-700 border-amber-300 bg-amber-50"
              >
                <Square size={13} className="fill-amber-600 text-amber-600" />
                <span>Stop Demo Audio</span>
              </button>
            )}

            {/* Start / Stop Reading with Mic */}
            {!speechRec.isListening ? (
              <button
                onClick={handleStartReading}
                className="btn-terracotta py-2 px-5 text-xs font-semibold cursor-pointer shadow-sm"
              >
                <Mic size={14} />
                <span>Start Reading Aloud</span>
              </button>
            ) : (
              <button
                onClick={handleStopReading}
                className="flex items-center gap-1.5 py-2 px-4 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <MicOff size={14} />
                <span>Pause Recording</span>
              </button>
            )}

            {/* Reset Progress */}
            {wordsReadCount > 0 && (
              <button
                onClick={handleResetReading}
                className="p-2 rounded-full bg-[#F4EFEA] hover:bg-[#EDE6DE] text-[#6B645C] hover:text-[#1C1A17] transition-colors cursor-pointer border border-[#EAE5DE]"
                title="Reset Reading Progress"
              >
                <RotateCcw size={13} />
              </button>
            )}
          </div>

          {/* Real-Time Telemetry Pills */}
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE]">
              <Gauge size={13} className="text-[#D97706]" />
              <span className="text-[#1C1A17] font-bold">{currentWpm}</span>
              <span className="text-[#6B645C]">WPM</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4EFEA] border border-[#EAE5DE]">
              <span className="text-[#E06D53] font-bold">{progressPercent}%</span>
              <span className="text-[#6B645C]">Read</span>
            </div>
          </div>
        </div>

        {/* Interactive Word-by-Word Karaoke Display Stage (Paper Style) */}
        <div className="relative min-h-[140px] p-6 sm:p-8 rounded-2xl bg-[#FBF9F5] border border-[#EAE5DE] font-serif text-lg sm:text-xl lg:text-2xl leading-relaxed sm:leading-loose text-[#1C1A17]">
          {passageWords.map((word, index) => {
            const isSpoken = index <= matchedWordIndex
            const isCurrentTarget = index === matchedWordIndex + 1 && speechRec.isListening

            return (
              <span
                key={index}
                className={cn(
                  'inline-block px-1.5 py-0.5 mx-0.5 rounded-lg transition-all duration-150',
                  isSpoken
                    ? 'bg-[#E06D53]/15 text-[#E06D53] font-semibold border border-[#E06D53]/30'
                    : isCurrentTarget
                    ? 'bg-amber-100 text-[#1C1A17] font-bold ring-2 ring-[#E06D53] animate-pulse'
                    : 'text-[#1C1A17]/85 hover:text-[#1C1A17]'
                )}
              >
                {word}
              </span>
            )
          })}
        </div>

        {/* Live Status Banner & Completion Card */}
        <AnimatePresence>
          {isCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#F4EFEA] to-white border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4A7C59] text-white shadow-xs">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1C1A17]">
                    Page {currentPage} Complete! Outstanding Cadence.
                  </div>
                  <div className="text-xs text-[#6B645C] font-mono">
                    Completed {totalWordsCount} words in {elapsedSeconds}s ({currentWpm} WPM average)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentPage < 5 && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="btn-terracotta py-2 px-5 text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    <span>Read Page {currentPage + 1}</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                <Link
                  to="/practice"
                  className="btn-sand py-2 px-4 text-xs font-semibold no-underline"
                >
                  <Mic size={13} />
                  <span>Discuss in Studio</span>
                </Link>
              </div>
            </motion.div>
          ) : speechRec.isListening ? (
            <div className="flex items-center justify-between px-2 text-xs font-mono text-[#6B645C]">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#E06D53] animate-ping" />
                <span className="text-[#E06D53] font-semibold">Speech Teleprompter Active</span>
                <span className="text-[#DFD8CE]">•</span>
                <span>Read the highlighted words into your microphone</span>
              </span>
              <span>{wordsReadCount} / {totalWordsCount} words</span>
            </div>
          ) : (
            <div className="flex items-center justify-between px-2 text-xs text-[#6B645C]">
              <span>💡 Tip: Click "Listen to Tutor" to hear the rhythm first, then press "Start Reading Aloud".</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Studio Jump Deck */}
      <div className="relative overflow-hidden rounded-3xl border border-[#EAE5DE] bg-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-[#1C1A17]">
            Ready to debate this architecture?
          </h3>
          <p className="text-xs text-[#6B645C] max-w-lg">
            Transition directly to the Voice Studio to practice explaining these technical tradeoffs, system design choices, and command pipelines with the AI tutor.
          </p>
        </div>

        <Link
          to="/practice"
          className="btn-terracotta shrink-0 py-2.5 px-6 text-xs font-semibold no-underline"
        >
          <Mic size={14} />
          <span>Launch Studio Debate</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  )
}
