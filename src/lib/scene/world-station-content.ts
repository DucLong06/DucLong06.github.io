/**
 * world-station-content.ts — Curated bilingual copy for the Quantum World HUD.
 *
 * Direct port of the prototype's `PANELS` + `ASIDE` tables (world-ui.js). This
 * is the authored narrative for each station — already accurate & bilingual.
 * `build-world-stations.ts` overlays genuinely-dynamic values (GitHub stats,
 * papers, profile channels) on top of these baselines so content stays single-
 * source where a content collection / data cache actually owns the value.
 *
 * Data-only module (no logic) — intentionally long; it is a content table.
 */
import type { Lang, Panel, Aside, ChromeStrings, WorldStationId } from './world-data-types';

/** Tour order — drives nav pills + card numbering. */
export const STATION_ORDER: WorldStationId[] = [
  'identity', 'telemetry', 'expertise', 'quantum', 'ledger', 'dockyard', 'signal',
];

/** Scene accent color per station (matches scene palette PAL). */
export const STATION_COLOR: Record<WorldStationId, number> = {
  identity: 0x38e1ff,
  telemetry: 0xa06bff,
  expertise: 0xf5b449,
  quantum: 0x38e1ff,
  ledger: 0xf5b449,
  dockyard: 0x38e1ff,
  signal: 0xa06bff,
};

/** Localized chrome strings (tour labels, hint, classic-view link, boot splash). */
export const CHROME: Record<Lang, ChromeStrings> = {
  en: { touring: 'Touring', paused: 'Paused', classic: 'Classic view',
    hint: 'drag to look · scroll to zoom · click a node', igniting: 'IGNITING QUANTUM CORE…' },
  vi: { touring: 'Đang đi', paused: 'Tạm dừng', classic: 'Bản cổ điển',
    hint: 'kéo để xoay · cuộn để zoom · chạm một node', igniting: 'ĐANG KHỞI ĐỘNG LÕI LƯỢNG TỬ…' },
};

/* =====================================================================
   REPRESENTATIVE chart numbers — illustrative, NOT sourced from content.
   Flagged per Open Question #1. bloch / circuit / k8s are decorative.
   ===================================================================== */
export const REPRESENTATIVE = {
  // capability vector — axis labels from skill clusters, values illustrative
  skillsRadar: [
    { label: 'ML', val: 8 }, { label: 'Backend', val: 8 }, { label: 'C++', val: 7 },
    { label: 'DevOps', val: 6.5 }, { label: 'Frontend', val: 6 }, { label: 'Research', val: 7 },
  ],
  // merge requests reviewed / month (trend shape)
  mrsLine: [2.1, 2.6, 3.0, 3.8, 4.2, 4.9, 5.3, 5.8, 6.0, 5.6, 6.1, 6.4],
  // throughput by deployed system
  throughputBars: [
    { label: 'GitLab', val: 6000 }, { label: 'RAG', val: 2400 },
    { label: 'Crawl', val: 4200 }, { label: 'Hub', val: 5000 },
  ],
  // contribution heatmap span (weeks)
  ghHeatWeeks: 26,
  // radar max
  radarMax: 9,
};

/** Left InfoCard copy per station, per language (port of PANELS). */
export const PANELS: Record<WorldStationId, Record<Lang, Panel>> = {
  identity: {
    en: {
      kicker: 'IDENTITY', title: 'Hoàng Đức Long',
      role: 'Full-stack AI engineer shipping production ML at telecom scale.',
      body: [
        `Five years between machine learning and backend engineering, based in <strong>Hà Nội, Vietnam</strong>. Started at <strong>FSI</strong> on Intel OpenVINO edge AI; three years at <strong>Cyber Eye</strong> on <strong>AX-OCR</strong> — Vietnam's leading OCR engine.`,
        `Now at <strong>FPT Telecom</strong> building AI at national scale. I live in the gap between a research prototype and a reliable production system — closed with observability, disciplined iteration, and code your future self won't regret.`,
      ],
      loc: 'Hà Nội, Việt Nam', badges: ['Python · 7y', 'C++ · 5y', 'Sao Khuê 2022'],
    },
    vi: {
      kicker: 'DANH TÍNH', title: 'Hoàng Đức Long',
      role: 'Kỹ sư AI full-stack, triển khai ML ở quy mô viễn thông.',
      body: [
        `Năm năm giữa machine learning và backend, sống tại <strong>Hà Nội, Việt Nam</strong>. Khởi đầu ở <strong>FSI</strong> với Intel OpenVINO cho edge AI; ba năm ở <strong>Cyber Eye</strong> với <strong>AX-OCR</strong> — engine OCR hàng đầu Việt Nam.`,
        `Hiện ở <strong>FPT Telecom</strong>, xây dựng AI quy mô quốc gia. Tôi sống ở khoảng cách giữa một prototype nghiên cứu và một hệ thống production đáng tin cậy — lấp đầy bằng observability, lặp lại có kỷ luật và code mà bạn của tương lai sẽ cảm ơn.`,
      ],
      loc: 'Hà Nội, Việt Nam', badges: ['Python · 7 năm', 'C++ · 5 năm', 'Sao Khuê 2022'],
    },
  },
  telemetry: {
    en: {
      kicker: 'PRODUCTION TELEMETRY', title: 'Systems in production',
      role: 'FPT Telecom · Software Engineer · 2023 — now. Live signals from four deployed systems.',
      body: [
        `<strong>GitLab Bot</strong> — AI code review across <strong>200+ repos</strong>, up to <strong>6,000 MRs/month</strong>. SAST, secret scanning, fix suggestions with codebase impact analysis.`,
        `<strong>RAG Chatbot</strong> on Vertex AI + ChromaDB · <strong>Blacklist Bot</strong> blocking malicious domains network-wide · <strong>TechHub</strong>, a knowledge platform with <strong>5,000+ users</strong>.`,
      ],
      badges: ['6,000 MRs/mo', '90% security acc.', '5,000+ users'],
    },
    vi: {
      kicker: 'TELEMETRY SẢN XUẤT', title: 'Hệ thống đang chạy',
      role: 'FPT Telecom · Kỹ sư phần mềm · 2023 — nay. Tín hiệu trực tiếp từ bốn hệ thống đã triển khai.',
      body: [
        `<strong>GitLab Bot</strong> — review code bằng AI trên <strong>200+ repo</strong>, tới <strong>6,000 MR/tháng</strong>. SAST, quét secret, gợi ý fix kèm phân tích tác động.`,
        `<strong>RAG Chatbot</strong> trên Vertex AI + ChromaDB · <strong>Blacklist Bot</strong> chặn tên miền độc hại toàn mạng · <strong>TechHub</strong>, nền tảng tri thức <strong>5,000+ người dùng</strong>.`,
      ],
      badges: ['6,000 MR/tháng', '90% bảo mật', '5,000+ users'],
    },
  },
  expertise: {
    en: {
      kicker: 'ARSENAL', title: 'Tools I reach for',
      role: 'Six clusters — languages, AI/ML, backend, frontend, DevOps, security.',
      body: [
        `<strong>Languages</strong> — Python, C++, C#/.NET, TypeScript, Go, SQL. <strong>AI/ML</strong> — PyTorch, TensorFlow, OpenCV, LangChain, ChromaDB, Vertex AI, OpenVINO, YOLOv11.`,
        `<strong>Backend</strong> — Django, FastAPI, gRPC, PostgreSQL, Redis. <strong>Frontend</strong> — Vue 3, React, Tailwind, Figma. <strong>DevOps</strong> — Docker, Kubernetes, GKE/GCP, GitLab CI.`,
      ],
      badges: ['PyTorch', 'Kubernetes', 'Vertex AI'],
    },
    vi: {
      kicker: 'KHO VŨ KHÍ', title: 'Công cụ tôi dùng',
      role: 'Sáu cụm — ngôn ngữ, AI/ML, backend, frontend, DevOps, bảo mật.',
      body: [
        `<strong>Ngôn ngữ</strong> — Python, C++, C#/.NET, TypeScript, Go, SQL. <strong>AI/ML</strong> — PyTorch, TensorFlow, OpenCV, LangChain, ChromaDB, Vertex AI, OpenVINO, YOLOv11.`,
        `<strong>Backend</strong> — Django, FastAPI, gRPC, PostgreSQL, Redis. <strong>Frontend</strong> — Vue 3, React, Tailwind, Figma. <strong>DevOps</strong> — Docker, Kubernetes, GKE/GCP, GitLab CI.`,
      ],
      badges: ['PyTorch', 'Kubernetes', 'Vertex AI'],
    },
  },
  quantum: {
    en: {
      kicker: 'QUANTUM BENCH', title: 'Thinking in superposition',
      role: 'Where research meets production — modelled as a live qubit system.',
      body: [
        `Every skill a state, every project an entanglement. The core you're looking at is a Bloch-sphere reactor: a state vector precessing through superposition, measured in real time.`,
        `Research that shipped: a <strong>first-author IEEE paper</strong> at JAIST (Nguyen Lab) and a <strong>1st-prize ALQAC 2023</strong> run on Vietnamese legal QA.`,
      ],
      badges: ['IEEE · 1st author', 'ALQAC 2023', 'JAIST exchange'],
    },
    vi: {
      kicker: 'BÀN THÍ NGHIỆM LƯỢNG TỬ', title: 'Tư duy trong chồng chập',
      role: 'Nơi nghiên cứu gặp production — mô hình hoá như một hệ qubit sống.',
      body: [
        `Mỗi kỹ năng là một trạng thái, mỗi dự án là một liên đới. Lõi bạn đang nhìn là một lò phản ứng Bloch-sphere: vector trạng thái tiến động qua chồng chập, đo theo thời gian thực.`,
        `Nghiên cứu đã thành sản phẩm: một <strong>bài báo IEEE tác giả chính</strong> tại JAIST (Nguyen Lab) và <strong>giải Nhất ALQAC 2023</strong> về hỏi đáp pháp luật tiếng Việt.`,
      ],
      badges: ['IEEE · tác giả chính', 'ALQAC 2023', 'Trao đổi JAIST'],
    },
  },
  ledger: {
    en: {
      kicker: 'CREDENTIAL LEDGER', title: 'Papers & awards, on-chain',
      role: 'An immutable record — each achievement a block, hashed and linked.',
      body: [`Three blocks, validated: the Sao Khuê Award, a 1st-prize ALQAC finish, and a first-author IEEE paper. Tap a block to inspect its hash.`],
      badges: ['3 blocks · valid'],
    },
    vi: {
      kicker: 'SỔ CÁI THÀNH TỰU', title: 'Bài báo & giải thưởng, on-chain',
      role: 'Một bản ghi bất biến — mỗi thành tựu là một block, được hash và liên kết.',
      body: [`Ba block, đã xác thực: giải Sao Khuê, giải Nhất ALQAC, và bài báo IEEE tác giả chính. Chạm vào một block để xem hash.`],
      badges: ['3 block · hợp lệ'],
    },
  },
  dockyard: {
    en: {
      kicker: 'DOCKYARD', title: 'Open-source activity',
      role: '@DucLong06 · public repos · five top languages.',
      body: [`A heatmap of commits and a language distribution. C++ and Python lead, with Jupyter notebooks from the research years close behind.`],
      badges: [],
    },
    vi: {
      kicker: 'XƯỞNG TÀU', title: 'Hoạt động mã nguồn mở',
      role: '@DucLong06 · repo công khai · năm ngôn ngữ chính.',
      body: [`Bản đồ nhiệt commit và phân bố ngôn ngữ. C++ và Python dẫn đầu, theo sau là Jupyter notebook từ những năm nghiên cứu.`],
      badges: [],
    },
  },
  signal: {
    en: {
      kicker: 'SIGNAL', title: 'Open a channel',
      role: '◇ Currently open to opportunities.',
      body: [`Tap to email me, or find me on GitHub and LinkedIn. The dish is always listening.`],
      badges: [], links: true,
    },
    vi: {
      kicker: 'TÍN HIỆU', title: 'Mở một kênh',
      role: '◇ Đang sẵn sàng cho cơ hội mới.',
      body: [`Chạm để gửi email, hoặc tìm tôi trên GitHub và LinkedIn. Chảo vệ tinh luôn lắng nghe.`],
      badges: [], links: true,
    },
  },
};

/** Right DataSheet blocks per station, per language (port of ASIDE). */
export const ASIDES: Record<WorldStationId, Record<Lang, Aside>> = {
  identity: {
    en: { heading: 'CAREER PATH', blocks: [
      { kind: 'timeline', title: 'Trajectory', items: [
        { h: 'FSI Technology', s: 'Intel OpenVINO · edge-AI research' },
        { h: 'Cyber Eye · 3 yrs', s: 'AX-OCR core engineer — Sao Khuê 2022' },
        { h: 'FPT Telecom · 2023→', s: 'AI systems at national scale' },
        { h: 'JAIST · 2023', s: 'Research exchange, Nguyen Lab' },
      ] },
      { kind: 'rows', title: 'At a glance', items: [
        { k: 'Based', v: 'Hà Nội, VN' }, { k: 'Experience', v: '5 years' },
        { k: 'Focus', v: 'ML × Backend' }, { k: 'Design', v: 'Figma' },
      ] },
      { kind: 'tags', title: 'Sharpest tools', items: ['Python', 'C++', 'TypeScript', 'Django', 'Vue 3', 'Kubernetes'] },
    ] },
    vi: { heading: 'HÀNH TRÌNH', blocks: [
      { kind: 'timeline', title: 'Lộ trình', items: [
        { h: 'FSI Technology', s: 'Intel OpenVINO · nghiên cứu edge-AI' },
        { h: 'Cyber Eye · 3 năm', s: 'Kỹ sư lõi AX-OCR — Sao Khuê 2022' },
        { h: 'FPT Telecom · 2023→', s: 'Hệ thống AI quy mô quốc gia' },
        { h: 'JAIST · 2023', s: 'Trao đổi nghiên cứu, Nguyen Lab' },
      ] },
      { kind: 'rows', title: 'Tổng quan', items: [
        { k: 'Nơi ở', v: 'Hà Nội, VN' }, { k: 'Kinh nghiệm', v: '5 năm' },
        { k: 'Trọng tâm', v: 'ML × Backend' }, { k: 'Thiết kế', v: 'Figma' },
      ] },
      { kind: 'tags', title: 'Công cụ chính', items: ['Python', 'C++', 'TypeScript', 'Django', 'Vue 3', 'Kubernetes'] },
    ] },
  },
  telemetry: {
    en: { heading: 'DEPLOYED SYSTEMS', blocks: [
      { kind: 'list', title: 'Live systems', items: [
        { h: 'GitLab Bot · AI review', s: '6,000 MRs/mo · 200+ repos · 90% sec' },
        { h: 'RAG Chatbot · GCP', s: 'Vertex AI + ChromaDB · 75.5% acc' },
        { h: 'Blacklist Bot', s: 'Realtime domain blocking, network-wide' },
        { h: 'TechHub', s: 'Knowledge platform · 5,000+ users' },
      ] },
      { kind: 'rows', title: 'Stack', items: [
        { k: 'Cloud', v: 'GCP / GKE' }, { k: 'Data', v: 'PostgreSQL · Redis' }, { k: 'Serving', v: 'FastAPI · gRPC' },
      ] },
    ] },
    vi: { heading: 'HỆ THỐNG ĐÃ TRIỂN KHAI', blocks: [
      { kind: 'list', title: 'Hệ thống đang chạy', items: [
        { h: 'GitLab Bot · review AI', s: '6,000 MR/tháng · 200+ repo · 90% bảo mật' },
        { h: 'RAG Chatbot · GCP', s: 'Vertex AI + ChromaDB · 75.5% acc' },
        { h: 'Blacklist Bot', s: 'Chặn tên miền realtime, toàn mạng' },
        { h: 'TechHub', s: 'Nền tảng tri thức · 5,000+ người dùng' },
      ] },
      { kind: 'rows', title: 'Công nghệ', items: [
        { k: 'Cloud', v: 'GCP / GKE' }, { k: 'Dữ liệu', v: 'PostgreSQL · Redis' }, { k: 'Serving', v: 'FastAPI · gRPC' },
      ] },
    ] },
  },
  expertise: {
    en: { heading: 'FULL STACK', blocks: [{ kind: 'list', title: 'Six clusters', items: [
      { h: 'Languages', s: 'Python · C++ · C#/.NET · TypeScript · Go · SQL' },
      { h: 'AI / ML', s: 'PyTorch · TensorFlow · OpenCV · LangChain · Vertex AI · OpenVINO · YOLOv11' },
      { h: 'Backend', s: 'Django · FastAPI · gRPC · PostgreSQL · Redis' },
      { h: 'Frontend', s: 'Vue 3 · React · Tailwind · Figma' },
      { h: 'DevOps', s: 'Docker · Kubernetes · GKE/GCP · GitLab CI · Nginx' },
      { h: 'Security', s: 'SAST · Threat Intel · Web Crawling' },
    ] }] },
    vi: { heading: 'TOÀN STACK', blocks: [{ kind: 'list', title: 'Sáu cụm', items: [
      { h: 'Ngôn ngữ', s: 'Python · C++ · C#/.NET · TypeScript · Go · SQL' },
      { h: 'AI / ML', s: 'PyTorch · TensorFlow · OpenCV · LangChain · Vertex AI · OpenVINO · YOLOv11' },
      { h: 'Backend', s: 'Django · FastAPI · gRPC · PostgreSQL · Redis' },
      { h: 'Frontend', s: 'Vue 3 · React · Tailwind · Figma' },
      { h: 'DevOps', s: 'Docker · Kubernetes · GKE/GCP · GitLab CI · Nginx' },
      { h: 'Bảo mật', s: 'SAST · Threat Intel · Web Crawling' },
    ] }] },
  },
  quantum: {
    en: { heading: 'RESEARCH', blocks: [
      { kind: 'list', title: 'Published', items: [
        { h: 'IEEE Paper · 1st author', s: 'JAIST, Nguyen Lab · KSE 2023' },
        { h: 'ALQAC 2023 · 1st prize', s: 'Vietnamese legal QA' },
      ] },
      { kind: 'rows', title: 'Methods', items: [
        { k: 'Retrieval', v: 'RAG · IR' }, { k: 'Models', v: 'LLM · Transformers' }, { k: 'Edge', v: 'OpenVINO' },
      ] },
      { kind: 'tags', title: 'Curious about', items: ['Quantum ML', 'Superposition', 'Entanglement'] },
    ] },
    vi: { heading: 'NGHIÊN CỨU', blocks: [
      { kind: 'list', title: 'Công bố', items: [
        { h: 'Bài báo IEEE · tác giả chính', s: 'JAIST, Nguyen Lab · KSE 2023' },
        { h: 'ALQAC 2023 · giải Nhất', s: 'Hỏi đáp pháp luật tiếng Việt' },
      ] },
      { kind: 'rows', title: 'Phương pháp', items: [
        { k: 'Truy hồi', v: 'RAG · IR' }, { k: 'Mô hình', v: 'LLM · Transformers' }, { k: 'Edge', v: 'OpenVINO' },
      ] },
      { kind: 'tags', title: 'Đang tò mò', items: ['Quantum ML', 'Chồng chập', 'Liên đới'] },
    ] },
  },
  ledger: {
    en: { heading: 'AWARDS', blocks: [
      { kind: 'list', title: 'Verified blocks', items: [
        { h: 'Sao Khuê Award 2022', s: 'VINASA · AX-OCR engine' },
        { h: '1st Prize · ALQAC 2023', s: 'IEEE KSE · Legal QA' },
        { h: 'IEEE Paper · 2023', s: '1st author · JAIST' },
      ] },
      { kind: 'rows', title: 'On-chain', items: [
        { k: 'Blocks', v: '3 · valid' }, { k: 'Domain', v: 'OCR · Legal NLP' },
      ] },
    ] },
    vi: { heading: 'GIẢI THƯỞNG', blocks: [
      { kind: 'list', title: 'Block đã xác thực', items: [
        { h: 'Giải Sao Khuê 2022', s: 'VINASA · engine AX-OCR' },
        { h: 'Giải Nhất · ALQAC 2023', s: 'IEEE KSE · Hỏi đáp pháp luật' },
        { h: 'Bài báo IEEE · 2023', s: 'Tác giả chính · JAIST' },
      ] },
      { kind: 'rows', title: 'On-chain', items: [
        { k: 'Số block', v: '3 · hợp lệ' }, { k: 'Lĩnh vực', v: 'OCR · Legal NLP' },
      ] },
    ] },
  },
  dockyard: {
    en: { heading: 'OPEN SOURCE', blocks: [
      { kind: 'rows', title: 'GitHub @DucLong06', items: [
        { k: 'Repos', v: '72' }, { k: 'Stars', v: '57' }, { k: 'Top langs', v: 'C++ · Python' },
      ] },
      { kind: 'list', title: 'Notable repos', items: [
        { h: 'face-detection-ml-system ★38', s: 'YOLOv11 · GKE · MLOps' },
        { h: 'Legal-Prompts ★11', s: 'Vietnamese legal QA toolkit' },
        { h: 'ocr-api', s: 'AX-OCR wrapped in FastAPI' },
        { h: 'ALQAC2023', s: '1st-prize legal QA system' },
      ] },
    ] },
    vi: { heading: 'MÃ NGUỒN MỞ', blocks: [
      { kind: 'rows', title: 'GitHub @DucLong06', items: [
        { k: 'Repo', v: '72' }, { k: 'Sao', v: '57' }, { k: 'Top ngôn ngữ', v: 'C++ · Python' },
      ] },
      { kind: 'list', title: 'Repo nổi bật', items: [
        { h: 'face-detection-ml-system ★38', s: 'YOLOv11 · GKE · MLOps' },
        { h: 'Legal-Prompts ★11', s: 'Bộ công cụ QA pháp luật VN' },
        { h: 'ocr-api', s: 'AX-OCR đóng gói FastAPI' },
        { h: 'ALQAC2023', s: 'Hệ thống QA pháp luật giải Nhất' },
      ] },
    ] },
  },
  signal: {
    en: { heading: 'GET IN TOUCH', blocks: [
      { kind: 'rows', title: 'Status', items: [
        { k: 'Open to', v: 'Opportunities' }, { k: 'Based', v: 'Hà Nội, VN' }, { k: 'Mode', v: 'Remote-friendly' },
      ] },
      { kind: 'list', title: 'Channels', items: [
        { h: 'Email', s: 'hoangduclongg@gmail.com' },
        { h: 'GitHub', s: 'github.com/DucLong06' },
        { h: 'LinkedIn', s: 'linkedin.com/in/hoangduclong' },
      ] },
    ] },
    vi: { heading: 'LIÊN HỆ', blocks: [
      { kind: 'rows', title: 'Trạng thái', items: [
        { k: 'Sẵn sàng', v: 'Cơ hội mới' }, { k: 'Nơi ở', v: 'Hà Nội, VN' }, { k: 'Hình thức', v: 'Thân thiện remote' },
      ] },
      { kind: 'list', title: 'Kênh liên lạc', items: [
        { h: 'Email', s: 'hoangduclongg@gmail.com' },
        { h: 'GitHub', s: 'github.com/DucLong06' },
        { h: 'LinkedIn', s: 'linkedin.com/in/hoangduclong' },
      ] },
    ] },
  },
};
