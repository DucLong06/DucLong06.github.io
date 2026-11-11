/**
 * guardrail-story.ts (data) — every word shown in the Guardrail Story, EN + VI.
 * Edit THIS file, never the drawing code (src/scripts/guardrail-story/).
 *
 * Facts come from src/content/**: experience/*.md (systems, stacks, results),
 * skills/main.yaml (language years — looked up by name at build time),
 * projects/*.md + the repo-meta cache (stars) and the GitHub stats cache
 * (repo / star totals, top languages). Placeholders `{repos}` / `{stars}` are
 * filled by GuardrailStory.astro. Product, company and repo names are not
 * translated.
 */
import type { Lang } from '../lib/i18n-helpers';

export interface StoryCheck { label: string; verdict: string }
export interface StoryMatrixRow { system: string; company: string; stack: [string, string, string]; result: string }
export interface StoryModule {
  slug: string;            // project slug in src/content/projects — used for stars + link
  name: string;            // repo name as shown
  meta: string;            // grey descriptor
  accent?: string | 'stars'; // yellow suffix; 'stars' = "★ N" from the repo-meta cache
}

export interface GuardrailStoryText {
  name: string;
  words: string[];
  tokenLabels: string[];
  role: string;
  request: string;
  checks: StoryCheck[];
  allow: string;
  tagline: string;
  sceneLabels: string[];
  hud: { auto: string; paused: string; play: string; pause: string; prev: string; next: string };
  aria: string;
  matrix: { title: string; heads: [string, string, string]; rows: StoryMatrixRow[] };
  network: { title: string; heads: [string, string, string]; languages: string[]; build: string[]; ship: string[]; output: string };
  chip: { title: string; left: StoryModule[]; right: StoryModule[]; handle: string; reposLine: string };
}

const name = 'Hoàng Đức Long';
const words = ['Hoàng', 'Đức', 'Long'];

// Language nodes — names must match src/content/skills/main.yaml exactly.
const languages = ['Python', 'C++', 'C#/.NET', 'TypeScript'];

const modulesLeft = (meta: [string, string, string], accent: [string, string, string]): StoryModule[] => [
  { slug: 'face-detection-ml-system', name: 'face-detection-ml-system', meta: meta[0], accent: accent[0] },
  { slug: 'legal-prompts', name: 'Legal-Prompts', meta: meta[1], accent: accent[1] },
  { slug: 'alqac-2023', name: 'ALQAC2023', meta: meta[2], accent: accent[2] },
];
const modulesRight = (meta: [string, string, string]): StoryModule[] => [
  { slug: 'techleague', name: 'techleague', meta: meta[0] },
  { slug: 'booking-duongcam-art', name: 'booking-duongcam-art', meta: meta[1] },
  { slug: 'text2sql-vietnamese', name: 'Text2SQL-Vietnamese', meta: meta[2] },
];

export const GUARDRAIL_STORY: Record<Lang, GuardrailStoryText> = {
  en: {
    name,
    words,
    tokenLabels: ['token 0 · family name', 'token 1 · middle name', 'token 2 · given name'],
    role: 'FULL-STACK AI ENGINEER · HÀ NỘI',
    request: 'POST /v1/identity · inspecting request',
    checks: [
      { label: 'prompt injection', verdict: 'pass' },
      { label: 'PII leak', verdict: 'pass' },
      { label: 'jailbreak', verdict: 'pass' },
      { label: 'policy', verdict: 'pass' },
    ],
    allow: '200 · ALLOW',
    tagline: 'Seven years of machine learning, told by one picture that keeps changing.',
    sceneLabels: ['0 · guardrail', '1 · x · W = ŷ', '2 · network', '3 · chip'],
    hud: { auto: 'auto · pause to read', paused: 'paused · play to resume', play: 'play', pause: 'pause', prev: 'Previous section', next: 'Next section' },
    aria: "Animated story of Hoàng Đức Long's career: the name is inspected like an API request, then work history becomes a matrix product, expertise a neural network and open-source repositories modules around a chip",
    matrix: {
      title: "Where I've shipped things",
      heads: ['systems', 'stack', 'results'],
      rows: [
        { system: 'GitLab review bot', company: 'FPT Telecom', stack: ['Langchain', 'SAST', 'FastAPI'], result: '6,000 MRs / month' },
        { system: 'RAG chatbot', company: 'FPT Telecom', stack: ['Vertex AI', 'ChromaDB', 'GCS'], result: '75.5% accuracy' },
        { system: 'Blacklist bot', company: 'FPT Telecom', stack: ['Selenium', 'BS4', 'web-check'], result: '90% security acc.' },
        { system: 'TechHub', company: 'FPT Telecom', stack: ['Django', 'Vue 3', 'Figma'], result: '5,000+ users' },
        { system: 'AX-OCR engine', company: 'Cyber Eye', stack: ['C++', 'OpenCV', 'PyTorch'], result: '98% · Sao Khuê 2022' },
      ],
    },
    network: {
      title: 'Tools I reach for',
      heads: ['languages', 'build', 'ship'],
      languages,
      build: ['Computer vision', 'LLM · RAG', 'Edge AI', 'Backend', 'Frontend'],
      ship: ['MLOps', 'CI/CD', 'Security', 'Cloud', 'Data pipelines'],
      output: 'full-stack AI engineer',
    },
    chip: {
      title: "Things I've built",
      left: modulesLeft(['YOLOv11 · GKE', 'prompt toolkit', 'legal QA'], ['stars', 'stars', '1st prize']),
      right: modulesRight(['TypeScript · live', 'Vue 3 · Django · live', 'Python · LLM']),
      handle: 'DucLong06',
      reposLine: '{repos} repos · {stars} stars',
    },
  },
  vi: {
    name,
    words,
    tokenLabels: ['token 0 · họ', 'token 1 · tên đệm', 'token 2 · tên'],
    role: 'KỸ SƯ AI FULL-STACK · HÀ NỘI',
    request: 'POST /v1/identity · đang kiểm tra request',
    checks: [
      { label: 'prompt injection', verdict: 'đạt' },
      { label: 'rò rỉ PII', verdict: 'đạt' },
      { label: 'jailbreak', verdict: 'đạt' },
      { label: 'chính sách', verdict: 'đạt' },
    ],
    allow: '200 · ALLOW',
    tagline: 'Bảy năm machine learning, kể bằng một bức tranh không ngừng biến hình.',
    sceneLabels: ['0 · guardrail', '1 · x · W = ŷ', '2 · mạng lưới', '3 · chip'],
    hud: { auto: 'tự động · dừng để đọc', paused: 'đã dừng · phát để tiếp tục', play: 'phát', pause: 'dừng', prev: 'Phần trước', next: 'Phần sau' },
    aria: 'Câu chuyện sự nghiệp của Hoàng Đức Long: tên được kiểm tra như một request API, rồi lịch sử làm việc thành một phép nhân ma trận, chuyên môn thành mạng nơ-ron và các repository mã nguồn mở thành module quanh một con chip',
    matrix: {
      title: 'Nơi tôi đã đóng góp',
      heads: ['hệ thống', 'công nghệ', 'kết quả'],
      rows: [
        { system: 'GitLab review bot', company: 'FPT Telecom', stack: ['Langchain', 'SAST', 'FastAPI'], result: '6.000 MR / tháng' },
        { system: 'RAG chatbot', company: 'FPT Telecom', stack: ['Vertex AI', 'ChromaDB', 'GCS'], result: 'độ chính xác 75,5%' },
        { system: 'Blacklist bot', company: 'FPT Telecom', stack: ['Selenium', 'BS4', 'web-check'], result: 'độ chính xác bảo mật 90%' },
        { system: 'TechHub', company: 'FPT Telecom', stack: ['Django', 'Vue 3', 'Figma'], result: '5.000+ người dùng' },
        { system: 'AX-OCR engine', company: 'Cyber Eye', stack: ['C++', 'OpenCV', 'PyTorch'], result: '98% · Sao Khuê 2022' },
      ],
    },
    network: {
      title: 'Công cụ tôi sử dụng',
      heads: ['ngôn ngữ', 'xây dựng', 'vận hành'],
      languages,
      build: ['Thị giác máy tính', 'LLM · RAG', 'AI biên', 'Backend', 'Frontend'],
      ship: ['MLOps', 'CI/CD', 'Bảo mật', 'Cloud', 'Data pipeline'],
      output: 'kỹ sư AI full-stack',
    },
    chip: {
      title: 'Những gì tôi đã xây dựng',
      left: modulesLeft(['YOLOv11 · GKE', 'bộ công cụ prompt', 'hỏi đáp pháp luật'], ['stars', 'stars', 'Giải Nhất']),
      right: modulesRight(['TypeScript · đang chạy', 'Vue 3 · Django · đang chạy', 'Python · LLM']),
      handle: 'DucLong06',
      reposLine: '{repos} repo · {stars} sao',
    },
  },
};
