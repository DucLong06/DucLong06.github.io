/**
 * strings.ts — All static UI strings keyed by locale.
 * Usage: import { STRINGS } from '../i18n/strings';
 *        const s = STRINGS[lang];
 */

export type Lang = 'en' | 'vi';

export const STRINGS = {
  en: {
    // Accessibility
    skip_to_content: 'Skip to content',

    // Nav
    nav_about:   'About',
    nav_work:    'Work',
    nav_papers:  'Papers',
    nav_contact: 'Contact',
    nav_home_label: 'Hoàng Đức Long — home',

    // Hero
    hero_tech_stack:       'Python · C++ · .NET · TypeScript.',
    hero_meta:             'Currently at FPT Telecom. 1st author IEEE paper.',
    hero_award_alqac:      'ALQAC 2023',
    hero_award_saokhe:     'Sao Khuê 2022',
    hero_cta_work:         'View work',
    hero_cta_cv:           'Download CV',
    hero_cta_email:        'Email',
    hero_scroll_hint_label: 'Scroll down',

    // About section
    about_eyebrow: 'About me',
    about_title:   'Engineer by trade, researcher by curiosity.',
    stat_mrs_month:   'MRs / month',
    stat_users:       'Internal users',
    stat_security:    'Security accuracy',
    stat_rag:         'RAG accuracy',
    stat_repos:       'Repos automated',
    stat_ocr:         'OCR accuracy',
    stat_alqac:       'ALQAC 2023 prize',
    stat_saokhe:      'Award 2022',

    // Experience section
    experience_eyebrow: 'Work history',
    experience_title:   'Where I\'ve shipped things.',

    // Skills section
    skills_eyebrow: 'Expertise',
    skills_title:   'Tools I reach for.',

    // Projects section
    projects_eyebrow: 'Work',
    projects_title:   'Things I\'ve built.',

    // Papers section
    papers_eyebrow: 'Research',
    papers_title:   'Papers & Awards',

    // GitHub stats section
    github_eyebrow:          'Open Source',
    github_title:            'GitHub Activity',
    github_stat_repos:       'Public repos',
    github_stat_stars:       'Total stars',
    github_stat_languages:   'Top languages',
    github_stat_handle:      'GitHub handle',
    github_language_label:   'Language distribution (by repo size)',
    github_stats_footer:     'Stats fetched at build time · data as of',

    // Contact section
    contact_eyebrow:    'Get in touch',
    contact_title:      'Let\'s talk.',
    contact_open_badge: 'Currently open to opportunities',
    contact_email_label: 'Reach me directly',
    contact_download_cv: 'Download CV',

    // Quantum HUD panels (3D scene)
    panel_about_eyebrow:        'Identity',
    panel_exp_eyebrow:          'Experience',
    panel_exp_title:            '5 years shipping ML',
    panel_exp_subhead:          'Career timeline',
    panel_skills_eyebrow:       'Skills · Stack',
    panel_skills_title:         'Backend + AI, end to end',
    panel_skills_punch:         'LLM / RAG · Docker · Kubernetes',
    panel_skills_narrative:     'From research prototype to a system that survives production traffic — Python and C++ are my sharpest tools; TypeScript, Vue3, React and Django round out the full-stack side.',
    panel_skills_stat_accuracy: 'model accuracy',
    panel_skills_stat_uptime:   'pipeline uptime',
    panel_skills_levels:        'Skill levels',
    panel_proj_eyebrow:         'Projects',
    panel_proj_shipped:         'shipped systems',
    panel_proj_subhead:         'Selected work',
    panel_papers_eyebrow:       'Papers · Awards',
    panel_papers_title:         'Recognised research',
    panel_papers_punch:         'peer-reviewed venues',
    panel_papers_subhead:       'Peer-reviewed & awards',
    panel_contact_eyebrow:      'Contact · Comms',
    panel_contact_title:        'Let’s build',
    panel_contact_cv:           'Download CV',

    // Guided tour pill
    tour_touring:  'Touring…',
    tour_idle:     'Idle · re-arming…',
    tour_stopped:  'Tour stopped',
    tour_stop:     'Stop',

    // Scene chrome / dock
    scene_back:     '← Back to overview',
    scene_classic:  'Classic view',
    scene_sections: 'Sections',

    // Footer
    footer_rights:      'All rights reserved.',
    footer_built_with:  'Built with',
    footer_deployed_on: '& deployed on',

    // 404
    not_found_eyebrow:  'Error',
    not_found_message:  'Oops — this page doesn\'t exist or has been moved.',
    not_found_back:     'Back to home',

    // Project detail
    project_back_link:  'Back to work',
    project_stars_label: 'GitHub stars',
    project_source:     'Source code',
    project_demo:       'Live demo',
    project_readme_heading: 'From the README',
    project_readme_vi_note: 'Technical content in English',
    project_updated_label: 'Updated',
  },

  vi: {
    // Accessibility
    skip_to_content: 'Bỏ qua để đến nội dung',

    // Nav
    nav_about:   'Giới thiệu',
    nav_work:    'Dự án',
    nav_papers:  'Bài báo',
    nav_contact: 'Liên hệ',
    nav_home_label: 'Hoàng Đức Long — trang chủ',

    // Hero
    hero_tech_stack:       'Python · C++ · .NET · TypeScript.',
    hero_meta:             'Hiện công tác tại FPT Telecom. Tác giả đầu bài báo IEEE.',
    hero_award_alqac:      'ALQAC 2023',
    hero_award_saokhe:     'Sao Khuê 2022',
    hero_cta_work:         'Xem dự án',
    hero_cta_cv:           'Tải CV',
    hero_cta_email:        'Email',
    hero_scroll_hint_label: 'Cuộn xuống',

    // About section
    about_eyebrow: 'Về tôi',
    about_title:   'Kỹ sư lập trình, nhà nghiên cứu tò mò.',
    stat_mrs_month:   'MR / tháng',
    stat_users:       'Người dùng nội bộ',
    stat_security:    'Độ chính xác bảo mật',
    stat_rag:         'Độ chính xác RAG',
    stat_repos:       'Repo tự động hóa',
    stat_ocr:         'Độ chính xác OCR',
    stat_alqac:       'Giải thưởng ALQAC 2023',
    stat_saokhe:      'Giải thưởng 2022',

    // Experience section
    experience_eyebrow: 'Kinh nghiệm',
    experience_title:   'Nơi tôi đã đóng góp.',

    // Skills section
    skills_eyebrow: 'Chuyên môn',
    skills_title:   'Công cụ tôi sử dụng.',

    // Projects section
    projects_eyebrow: 'Dự án',
    projects_title:   'Những gì tôi đã xây dựng.',

    // Papers section
    papers_eyebrow: 'Nghiên cứu',
    papers_title:   'Bài báo & Giải thưởng',

    // GitHub stats section
    github_eyebrow:          'Mã nguồn mở',
    github_title:            'Hoạt động GitHub',
    github_stat_repos:       'Repo công khai',
    github_stat_stars:       'Tổng số sao',
    github_stat_languages:   'Ngôn ngữ hàng đầu',
    github_stat_handle:      'Tên GitHub',
    github_language_label:   'Phân bổ ngôn ngữ (theo kích thước repo)',
    github_stats_footer:     'Thống kê lấy lúc build · dữ liệu tính đến',

    // Contact section
    contact_eyebrow:    'Liên hệ',
    contact_title:      'Hãy nói chuyện.',
    contact_open_badge: 'Hiện đang mở cơ hội việc làm',
    contact_email_label: 'Liên hệ trực tiếp',
    contact_download_cv: 'Tải CV',

    // Quantum HUD panels (3D scene)
    panel_about_eyebrow:        'Hồ sơ',
    panel_exp_eyebrow:          'Kinh nghiệm',
    panel_exp_title:            '5 năm xây dựng hệ thống ML',
    panel_exp_subhead:          'Dòng thời gian sự nghiệp',
    panel_skills_eyebrow:       'Kỹ năng · Công nghệ',
    panel_skills_title:         'Backend + AI, từ đầu đến cuối',
    panel_skills_punch:         'LLM / RAG · Docker · Kubernetes',
    panel_skills_narrative:     'Từ nguyên mẫu nghiên cứu đến hệ thống chịu được tải production — Python và C++ là thế mạnh; TypeScript, Vue3, React và Django bổ trợ phần full-stack.',
    panel_skills_stat_accuracy: 'độ chính xác mô hình',
    panel_skills_stat_uptime:   'pipeline ổn định',
    panel_skills_levels:        'Mức độ kỹ năng',
    panel_proj_eyebrow:         'Dự án',
    panel_proj_shipped:         'hệ thống đã triển khai',
    panel_proj_subhead:         'Dự án tiêu biểu',
    panel_papers_eyebrow:       'Bài báo · Giải thưởng',
    panel_papers_title:         'Nghiên cứu được ghi nhận',
    panel_papers_punch:         'hội nghị bình duyệt',
    panel_papers_subhead:       'Bình duyệt & giải thưởng',
    panel_contact_eyebrow:      'Liên hệ',
    panel_contact_title:        'Cùng xây dựng',
    panel_contact_cv:           'Tải CV',

    // Guided tour pill
    tour_touring:  'Đang tham quan…',
    tour_idle:     'Chờ · sắp chạy lại…',
    tour_stopped:  'Đã dừng tham quan',
    tour_stop:     'Dừng',

    // Scene chrome / dock
    scene_back:     '← Về tổng quan',
    scene_classic:  'Xem bản cổ điển',
    scene_sections: 'Mục',

    // Footer
    footer_rights:      'Đã đăng ký bản quyền.',
    footer_built_with:  'Xây dựng với',
    footer_deployed_on: '& triển khai trên',

    // 404
    not_found_eyebrow:  'Lỗi',
    not_found_message:  'Ối — trang này không tồn tại hoặc đã được di chuyển.',
    not_found_back:     'Về trang chủ',

    // Project detail
    project_back_link:  'Quay lại dự án',
    project_stars_label: 'Sao GitHub',
    project_source:     'Mã nguồn',
    project_demo:       'Xem demo',
    project_readme_heading: 'Từ README',
    project_readme_vi_note: 'Nội dung kỹ thuật bằng tiếng Anh',
    project_updated_label: 'Cập nhật',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type StringKey = keyof typeof STRINGS.en;
