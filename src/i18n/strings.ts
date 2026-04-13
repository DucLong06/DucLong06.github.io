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
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type StringKey = keyof typeof STRINGS.en;
