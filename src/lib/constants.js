export const SCENARIOS = [
  {
    key: 'free',
    label: 'Free Chat',
    icon: '💬',
    desc: 'Open-ended conversation on any topic',
    color: 'violet',
  },
  {
    key: 'devops',
    label: 'Full-Stack & DevOps',
    icon: '💻',
    desc: 'Docker, Kubernetes, CI/CD, React, Node.js',
    color: 'sky',
  },
  {
    key: 'interview',
    label: 'Job Interview',
    icon: '💼',
    desc: 'Practice answering interview questions',
    color: 'amber',
  },
  {
    key: 'business',
    label: 'Business Meeting',
    icon: '📈',
    desc: 'Team meetings, strategy, and presentations',
    color: 'emerald',
  },
  {
    key: 'travel',
    label: 'Travel & Hotel',
    icon: '✈️',
    desc: 'Navigate hotels, airports, and sightseeing',
    color: 'sky',
  },
  {
    key: 'cafe',
    label: 'Café & Social',
    icon: '☕',
    desc: 'Small talk, ordering food, casual banter',
    color: 'amber',
  },
  {
    key: 'ielts',
    label: 'IELTS Speaking',
    icon: '🎓',
    desc: 'Structured IELTS-style exam practice',
    color: 'rose',
  },
]

export const VOICES = [
  { key: 'Aoede', label: 'Aoede', desc: 'Female — Warm', icon: '👩' },
  { key: 'Kore', label: 'Kore', desc: 'Female — Clear', icon: '👩' },
  { key: 'Puck', label: 'Puck', desc: 'Male — Friendly', icon: '👨' },
  { key: 'Fenrir', label: 'Fenrir', desc: 'Male — Deep', icon: '👨' },
]

export const SPEEDS = [
  { key: '0.85', label: '0.85x', desc: 'Beginner' },
  { key: '1.0', label: '1.0x', desc: 'Normal' },
  { key: '1.15', label: '1.15x', desc: 'Native' },
]

export const NOISE_FILTERS = [
  { key: '12', label: 'Quiet Room', icon: '🔈' },
  { key: '22', label: 'Fan / AC Suppress', icon: '💨' },
  { key: '35', label: 'Heavy Noise', icon: '🔊' },
]

export const CEFR_COLORS = {
  A1: '#FB7185',
  A2: '#FBBF24',
  B1: '#38BDF8',
  B2: '#34D399',
  C1: '#7C6BF0',
  C2: '#A29BFE',
}

export const ORB_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  THINKING: 'thinking',
  SPEAKING: 'speaking',
  ERROR: 'error',
}

export const WS_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
