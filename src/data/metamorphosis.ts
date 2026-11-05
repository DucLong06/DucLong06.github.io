/**
 * metamorphosis.ts (data) — content for the Metamorphosis canvas story.
 * Edit THIS file, never the drawing code (see metamorphosis/HANDOFF.md).
 * Layer/system/repo names stay in their original form in both locales;
 * only labels, captions and HUD strings are translated.
 */
import type { MMData } from '../scripts/metamorphosis';

const name = 'Hoàng Đức Long';

const NET = {
  layers: [
    ['Python', 'C++', 'C#/.NET', 'TypeScript', 'JavaScript', 'Go', 'SQL'],
    ['PyTorch', 'OpenCV', 'OpenVINO', 'LangChain', 'Vertex AI', 'Django', 'FastAPI', 'Vue 3', 'Kubernetes'],
    ['AX-OCR engine', 'Legal QA (LLM)', 'GitLab review bot', 'RAG chatbot', 'Blacklist bot', 'TechHub', 'Face detection'],
    ['98% OCR accuracy', '1st prize ALQAC', '6,000 MRs / month', '75.5% RAG accuracy', '90% security acc.', '5,000+ users', 'Sao Khuê 2022'],
  ],
  edges: [
    [0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 0, 3], [0, 0, 4], [0, 0, 5], [0, 0, 6], [0, 1, 1], [0, 1, 2], [0, 1, 0], [0, 2, 1], [0, 3, 7], [0, 3, 8], [0, 4, 7], [0, 5, 8], [0, 6, 5], [0, 6, 6],
    [1, 0, 0], [1, 0, 1], [1, 0, 6], [1, 1, 0], [1, 1, 6], [1, 2, 0], [1, 3, 1], [1, 3, 2], [1, 3, 3], [1, 4, 2], [1, 4, 3], [1, 5, 5], [1, 5, 4], [1, 5, 0], [1, 6, 2], [1, 6, 6], [1, 7, 5], [1, 8, 6], [1, 8, 2], [1, 8, 3],
    [2, 0, 0], [2, 0, 6], [2, 1, 1], [2, 2, 2], [2, 2, 4], [2, 3, 3], [2, 4, 4], [2, 5, 5], [2, 6, 2],
  ] as [number, number, number][],
};

const CHIPS = ['Python', 'C++', 'OpenCV', 'PyTorch', 'TensorFlow', 'OpenVINO', 'LangChain', 'Vertex AI', 'Django', 'FastAPI', 'Vue 3', 'React', 'Kubernetes', 'Docker', 'GCP', 'PostgreSQL', 'YOLOv11', 'Figma', 'TypeScript', 'GitLab CI'];

export const MM: Record<'en' | 'vi', MMData> = {
  en: {
    name,
    names: [name, '1 · network', '2 · matrix', '3 · expertise', '4 · evidence', 'ŷ · output'],
    caps: [
      null,
      ['The network', 'skills → tools → systems → results · every bright line is a real dependency'],
      ['The matrix', 'companies × domains, multiplied into outcomes'],
      ['Expertise', 'ten domains, one engineer'],
      ['Evidence', 'awards above · open source below'],
      null,
    ],
    netLabels: ['skills', 'tools', 'systems', 'results'],
    hero: {
      role: 'FULL-STACK AI ENGINEER · HÀ NỘI',
      tagline: 'Seven years of machine learning, told by one picture that keeps changing.',
    },
    outLine: 'argmax ŷ  →  open to opportunities',
    githubLine: 'github.com/DucLong06 · 79 public repos · 60 stars · C++ 29% · Python 29%',
    matNote: { w: 'W', mid: 'companies × domains', out: '= outcomes' },
    hud: { auto: 'auto · scroll to take over', manual: 'scroll · ▶ to resume' },
    NET,
    MAT: {
      rows: ['FSI Technology', 'Cyber Eye', 'JAIST · Nguyen Lab', 'FPT Telecom'],
      years: ['2019 – 20', '2020 – 23', '2023', '2023 – now'],
      cols: ['Computer vision', 'LLM · RAG', 'Backend', 'MLOps · CI/CD', 'Security', 'Frontend'],
      icons: ['cv', 'llm', 'backend', 'cicd', 'security', 'frontend'],
      cells: [
        ['OpenVINO', '', '', 'edge CPU', '', ''],
        ['AX-OCR', '', 'API marketplace', 'C++ inference', '', 'React UI'],
        ['', 'Legal QA', '', '', '', ''],
        ['Face detection', 'RAG chatbot', 'TechHub', 'GKE · pipelines', 'Blacklist bot', 'Vue 3 UI'],
      ],
      out: ['OpenVINO research', 'Sao Khuê 2022 · 98%', 'IEEE KSE · ALQAC 1st', '6,000 MRs/mo · 5,000 users'],
    },
    DOM: [
      { k: 'cv', t: 'Computer vision', s: 'OpenCV · YOLOv11 · OCR' },
      { k: 'llm', t: 'LLM · RAG', s: 'LangChain · Vertex AI' },
      { k: 'edge', t: 'Edge AI', s: 'OpenVINO · C++ · CPU' },
      { k: 'backend', t: 'Backend', s: 'Django · FastAPI · gRPC' },
      { k: 'frontend', t: 'Frontend', s: 'Vue 3 · React · Figma' },
      { k: 'mlops', t: 'MLOps', s: 'Prometheus · Grafana · GKE' },
      { k: 'cicd', t: 'CI/CD', s: 'GitLab CI · Docker · k8s' },
      { k: 'security', t: 'Security', s: 'SAST · threat intel' },
      { k: 'cloud', t: 'Cloud', s: 'GCP · GKE · GCS' },
      { k: 'data', t: 'Data pipelines', s: 'Selenium · BS4 · PostgreSQL' },
    ],
    AWARDS: [
      { t: '1st prize', s: 'ALQAC 2023 · IEEE KSE', k: 'trophy' },
      { t: 'Sao Khuê 2022', s: 'VINASA · AX-OCR', k: 'medal' },
      { t: '3rd prize', s: 'TDS Vietnam 2021', k: 'medal' },
      { t: 'IEEE paper', s: 'first author · KSE 2023', k: 'cert' },
    ],
    PROJ: [
      { t: 'face-detection-ml-system', s: 'YOLOv11 face detection on GKE with full MLOps observability.', l: 'Python', c: '#3572A5', st: 42 },
      { t: 'Legal-Prompts', s: 'Prompt engineering toolkit behind the 1st-prize ALQAC 2023 run.', l: 'Python', c: '#3572A5', st: 10 },
      { t: 'ALQAC2023', s: '1st-prize Vietnamese legal question-answering system.', l: 'Jupyter', c: '#DA5B0B', st: null },
      { t: 'techleague', s: 'Tournament platform · live at techleague.net.', l: 'TypeScript', c: '#3178C6', st: null },
      { t: 'booking-duongcam-art', s: 'Theatre ticketing with 9Pay payments · live, real revenue.', l: 'Vue', c: '#41B883', st: null },
      { t: 'Text2SQL-Vietnamese', s: 'Natural language → SQL for Vietnamese.', l: 'Python', c: '#3572A5', st: null },
    ],
    CHIPS,
  },
  vi: {
    name,
    names: [name, '1 · mạng lưới', '2 · ma trận', '3 · chuyên môn', '4 · bằng chứng', 'ŷ · đầu ra'],
    caps: [
      null,
      ['Mạng lưới', 'kỹ năng → công cụ → hệ thống → kết quả · mỗi đường sáng là một phụ thuộc thật'],
      ['Ma trận', 'công ty × lĩnh vực, nhân lên thành kết quả'],
      ['Chuyên môn', 'mười lĩnh vực, một kỹ sư'],
      ['Bằng chứng', 'giải thưởng phía trên · open source phía dưới'],
      null,
    ],
    netLabels: ['kỹ năng', 'công cụ', 'hệ thống', 'kết quả'],
    hero: {
      role: 'FULL-STACK AI ENGINEER · HÀ NỘI',
      tagline: 'Bảy năm machine learning, kể bằng một bức tranh không ngừng biến hình.',
    },
    outLine: 'argmax ŷ  →  sẵn sàng cho cơ hội mới',
    githubLine: 'github.com/DucLong06 · 79 repo public · 60 sao · C++ 29% · Python 29%',
    matNote: { w: 'W', mid: 'công ty × lĩnh vực', out: '= kết quả' },
    hud: { auto: 'tự động · cuộn để điều khiển', manual: 'cuộn · ▶ để tiếp tục' },
    NET,
    MAT: {
      rows: ['FSI Technology', 'Cyber Eye', 'JAIST · Nguyen Lab', 'FPT Telecom'],
      years: ['2019 – 20', '2020 – 23', '2023', '2023 – nay'],
      cols: ['Thị giác máy tính', 'LLM · RAG', 'Backend', 'MLOps · CI/CD', 'Bảo mật', 'Frontend'],
      icons: ['cv', 'llm', 'backend', 'cicd', 'security', 'frontend'],
      cells: [
        ['OpenVINO', '', '', 'CPU biên', '', ''],
        ['AX-OCR', '', 'API marketplace', 'suy luận C++', '', 'UI React'],
        ['', 'Legal QA', '', '', '', ''],
        ['Face detection', 'RAG chatbot', 'TechHub', 'GKE · pipelines', 'Blacklist bot', 'UI Vue 3'],
      ],
      out: ['Nghiên cứu OpenVINO', 'Sao Khuê 2022 · 98%', 'IEEE KSE · ALQAC Giải Nhất', '6.000 MRs/tháng · 5.000 người dùng'],
    },
    DOM: [
      { k: 'cv', t: 'Thị giác máy tính', s: 'OpenCV · YOLOv11 · OCR' },
      { k: 'llm', t: 'LLM · RAG', s: 'LangChain · Vertex AI' },
      { k: 'edge', t: 'AI biên', s: 'OpenVINO · C++ · CPU' },
      { k: 'backend', t: 'Backend', s: 'Django · FastAPI · gRPC' },
      { k: 'frontend', t: 'Frontend', s: 'Vue 3 · React · Figma' },
      { k: 'mlops', t: 'MLOps', s: 'Prometheus · Grafana · GKE' },
      { k: 'cicd', t: 'CI/CD', s: 'GitLab CI · Docker · k8s' },
      { k: 'security', t: 'Bảo mật', s: 'SAST · threat intel' },
      { k: 'cloud', t: 'Cloud', s: 'GCP · GKE · GCS' },
      { k: 'data', t: 'Data pipeline', s: 'Selenium · BS4 · PostgreSQL' },
    ],
    AWARDS: [
      { t: 'Giải Nhất', s: 'ALQAC 2023 · IEEE KSE', k: 'trophy' },
      { t: 'Sao Khuê 2022', s: 'VINASA · AX-OCR', k: 'medal' },
      { t: 'Giải Ba', s: 'TDS Vietnam 2021', k: 'medal' },
      { t: 'Bài báo IEEE', s: 'tác giả chính · KSE 2023', k: 'cert' },
    ],
    PROJ: [
      { t: 'face-detection-ml-system', s: 'Phát hiện khuôn mặt YOLOv11 trên GKE, đầy đủ observability MLOps.', l: 'Python', c: '#3572A5', st: 42 },
      { t: 'Legal-Prompts', s: 'Bộ công cụ prompt engineering phía sau giải Nhất ALQAC 2023.', l: 'Python', c: '#3572A5', st: 10 },
      { t: 'ALQAC2023', s: 'Hệ thống hỏi đáp pháp luật tiếng Việt giải Nhất.', l: 'Jupyter', c: '#DA5B0B', st: null },
      { t: 'techleague', s: 'Nền tảng giải đấu · live tại techleague.net.', l: 'TypeScript', c: '#3178C6', st: null },
      { t: 'booking-duongcam-art', s: 'Bán vé nhà hát, thanh toán 9Pay · live, doanh thu thật.', l: 'Vue', c: '#41B883', st: null },
      { t: 'Text2SQL-Vietnamese', s: 'Ngôn ngữ tự nhiên → SQL cho tiếng Việt.', l: 'Python', c: '#3572A5', st: null },
    ],
    CHIPS,
  },
};
