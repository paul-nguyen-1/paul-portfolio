export interface PaulProfile {
  name: string;
  role: string;
  location: string;
  contact: { email: string; linkedin: string; github: string; phone?: string };
  education: Array<{
    degree: string;
    school: string;
    location?: string;
    gpa?: string;
    graduation: string;
  }>;
  affiliations: string[];
  skills: {
    languages: string[];
    frameworks_libraries: string[];
    databases: string[];
    cloud_devops: string[];
    testing: string[];
    other: string[];
  };
  experience: Array<{
    company: string;
    title: string;
    when: string;
    location?: string;
    highlights: string[];
    tech: string[];
  }>;
  projects: Array<{ name: string; summary: string; stack: string[] }>;
  hobbies: string[];
  sharing_preferences: {
    share_email_by_default: boolean;
    share_phone_by_default: boolean;
  };
}

export const PAUL_PROFILE: PaulProfile = {
  name: 'Paul Nguyen',
  role: 'Graduate student & software engineer',
  location: 'Houston, Texas',
  contact: {
    email: 'paul.nguyen.swe@gmail.com',
    linkedin: 'https://linkedin.com/in/paul-nguyen--',
    github: 'https://github.com/paul-nguyen-1',
    phone: '281-673-0521',
  },
  education: [
    {
      degree: 'MS, Computer Science',
      school: 'University of Illinois Urbana–Champaign',
      location: 'Champaign, IL',
      graduation: 'May 2027',
    },
    {
      degree: 'BS, Computer Science',
      school: 'Oregon State University',
      location: 'Corvallis, OR',
      gpa: '3.8',
      graduation: 'Aug 2025',
    },
  ],
  affiliations: ['CodePath', 'OSU App Development Club', 'OSU Hackathon Club'],
  skills: {
    languages: ['Python', 'JavaScript', 'TypeScript', 'Java'],
    frameworks_libraries: [
      'React',
      'Next.js',
      'Redux',
      'NestJS',
      'Express',
      'Django',
      'Framer Motion',
    ],
    databases: ['MongoDB', 'PostgreSQL'],
    cloud_devops: ['AWS', 'Docker'],
    testing: ['Playwright', 'Jest', 'Cypress'],
    other: ['GraphQL', 'OpenAPI/Swagger'],
  },
  experience: [
    {
      company: 'NASA Johnson Space Center',
      title: 'Software Engineering Intern',
      when: 'Jan 2025 – May 2025',
      location: 'Houston, TX',
      highlights: [
        'Built a multi‑page Next.js/TypeScript dashboard for crew‑exercise analytics with equipment lifecycle tracking and CSV export.',
        'Set up a Django + PostgreSQL backend to ingest 10+ years of ISS exercise device data.',
        'Configured a Raspberry Pi (Linux) access point with Nginx for local serving.',
      ],
      tech: [
        'Next.js',
        'TypeScript',
        'Python',
        'Django',
        'PostgreSQL',
        'Linux',
        'Nginx',
      ],
    },
    {
      company: 'Lucid Motors',
      title: 'Software Engineer Intern',
      when: 'May 2024 – Nov 2024',
      location: 'Newark, CA',
      highlights: [
        'Developed React/TypeScript components for the supplier portal; addressed RBAC/supplier issues across 10+ NestJS REST APIs.',
        'Reached ~85% Playwright coverage on onboarding flows; reduced manual QA ~30%.',
      ],
      tech: [
        'TypeScript',
        'React',
        'Redux',
        'NestJS',
        'MongoDB',
        'AWS',
        'Playwright',
        'Jest',
      ],
    },
    {
      company: 'Summersalt',
      title: 'Software Engineer Intern',
      when: 'May 2023 – May 2024',
      location: 'Remote',
      highlights: [
        'Migrated jQuery → React; ~25% faster render and ~2s faster page loads.',
        'Built TypeScript/Remix promos; contributed to $35K+/mo revenue lift.',
        'Introduced CI/CD with GitHub Actions + Cypress; fewer regressions.',
      ],
      tech: [
        'TypeScript',
        'React',
        'Redux',
        'GraphQL',
        'Remix',
        'SCSS',
        'jQuery',
        'Node.js',
        'Cypress',
      ],
    },
  ],
  projects: [
    {
      name: 'PromptMail (Capstone)',
      summary:
        'GPT‑powered email assistant. I led the backend in NestJS: JWT‑guarded APIs, secure CRUD across 5+ endpoints, Swagger docs, tested with Postman.',
      stack: [
        'TypeScript',
        'NestJS',
        'MongoDB',
        'Firebase',
        'OpenAPI/Swagger',
        'Postman',
      ],
    },
    {
      name: 'BeavsHub',
      summary:
        'Animated course review app with React + Framer Motion; 5+ NestJS endpoints; E2E coverage with Playwright and Jest.',
      stack: [
        'React',
        'NestJS',
        'MongoDB',
        'Framer Motion',
        'Playwright',
        'Jest',
      ],
    },
  ],
  hobbies: ['running', 'playing basketball', 'trying new foods/restaurants'],
  sharing_preferences: {
    share_email_by_default: true,
    share_phone_by_default: false,
  },
};
