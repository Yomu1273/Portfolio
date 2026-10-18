export type Facet = 'making' | 'research' | 'people' | 'delivery' | 'performance' | 'public'

export type ExhibitId =
  | 'early'
  | 'sign'
  | 'research'
  | 'workflow'
  | 'latency'
  | 'release'
  | 'pipeline'
  | 'lint'

export interface StoryLink {
  label: string
  href: string
}

export interface StoryNote {
  label: string
  value: string
}

export interface AtlasNode {
  id: string
  code: string
  year: string
  /** Professional name a recruiter can scan. The plate stays the creative subtitle. */
  heading: string
  /** Path without slashes, for example work/search-performance. */
  path: string
  plate: string
  mark: string
  title: string
  summary: string
  facet: Facet
  x: number
  y: number
  paragraphs: string[]
  notes: StoryNote[]
  links: StoryLink[]
  exhibit?: ExhibitId
}

export const FACETS: { id: Facet | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'making', label: 'Making' },
  { id: 'research', label: 'Research' },
  { id: 'people', label: 'People' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'performance', label: 'Performance' },
  { id: 'public', label: 'Public' },
]

export const NODES: AtlasNode[] = [
  {
    id: 'led',
    code: '01',
    year: '2023–2024',
    heading: 'Student leadership',
    path: 'work/student-leadership',
    plate: 'The room was a system',
    mark: 'Student body president',
    title: 'Leading the room',
    summary: 'Presidency, editing, documentation, and a tech-fest event. The work was people, time, and a public standard.',
    facet: 'people',
    x: 3,
    y: 4,
    paragraphs: [
      'From May 2023 to May 2024 I was president of the student body at SSN College of Engineering. Before that I edited and coordinated documentation. I also headed an event at Invente, the college tech fest.',
      'The work was people, schedules, and a standard other students could see. The same muscle shows up when a release has three engineers and the knowledge cannot live in one head: write it down, share the review, and leave a path for the next person.',
      'Public milestones from those years include first place in an internship competition, a first college trophy through NSS, third prize in an out-of-the-box thinking contest, a perfect score in a national quiz, and FieldOps cadet training for emergency volunteering. In 2021 I took part in a GUVI learning session recognized by Guinness World Records for how many people joined.',
    ],
    notes: [
      { label: 'Office', value: 'President, SSN student body' },
      { label: 'Also', value: 'Editor, documentation coordinator, Invente event head' },
      { label: 'Volunteer', value: 'FieldOps cadet training' },
    ],
    links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/yogesh-munees-130354196' }],
  },
  {
    id: 'signed',
    code: '02',
    year: '2024',
    heading: 'Indian Sign Language pipeline',
    path: 'work/indian-sign-language',
    plate: 'Speech into a sign',
    mark: 'ISL pipeline',
    title: 'A language someone can meet',
    summary: 'A final-year pipeline from speech to Indian Sign Language animation through text, HamNoSys, and a 3D avatar.',
    facet: 'research',
    x: 31,
    y: 4,
    paragraphs: [
      'For my final-year project I worked on turning speech into Indian Sign Language animation. Looking up videos was slow. Avatar systems also lacked a usable ISL dataset.',
      'The pipeline ran through speech recognition, natural language processing, HamNoSys notation, and a 3D avatar in a web application. Notation was the point. A sign described as parameters can be animated without waiting on a stitched clip. The project also aimed to widen the ISL dataset.',
      'The studio below walks the stages of that idea. It does not generate Indian Sign Language. Real signs need deaf expertise and a real lexicon. Leaving the notation slots empty is the honest version of this page.',
    ],
    notes: [
      { label: 'When', value: 'January–April 2024' },
      { label: 'Path', value: 'Speech, NLP, HamNoSys, 3D avatar' },
      { label: 'Surface', value: 'Web application' },
    ],
    links: [],
    exhibit: 'sign',
  },
  {
    id: 'accelerated',
    code: '03',
    year: '2026',
    heading: 'PostgreSQL search optimization',
    path: 'work/search-performance',
    plate: '2.6s down to 17ms',
    mark: 'Staging serial search',
    title: 'The search that kept people waiting',
    summary: 'GIN trigram indexes and a .NET API path. Full values landed at 17 ms. Short searches stayed visible at 254 ms.',
    facet: 'performance',
    x: 66,
    y: 4,
    paragraphs: [
      'In August 2026 I moved into a Software Engineer II role and took the platform’s search bottleneck directly. On staging, serial search sat around 2.4 to 2.6 seconds.',
      'I designed the .NET API path and PostgreSQL GIN trigram indexes that brought full-value searches to 17 ms, middle fragments to 35 ms, and common three-character searches to 254 ms. Full part-number autocomplete dropped from about 64 ms to under 1 ms.',
      'The decision is written down: benchmarks, access control, alternatives that were rejected, database constraints, deployment order, rollback, and the conditions production still required. The short searches did not become instant. They became fast enough to ship, with the remaining cost in the open.',
    ],
    notes: [
      { label: 'Full value', value: 'about 2.5 s → 17 ms' },
      { label: 'Middle fragment', value: 'about 2.5 s → 35 ms' },
      { label: 'Three characters', value: 'about 2.5 s → 254 ms' },
      { label: 'Part number', value: 'about 64 ms → under 1 ms' },
    ],
    links: [],
    exhibit: 'latency',
  },
  {
    id: 'imagined',
    code: '04',
    year: '2021–2022',
    heading: 'Early full-stack systems',
    path: 'work/early-systems',
    plate: 'Early systems',
    mark: 'Three builds',
    title: 'Making the whole thing',
    summary: 'A Mars ledger in Java, a live auction, and a Khelo India rebuild. Each one had a screen, rules, and a data store.',
    facet: 'making',
    x: 3,
    y: 37,
    paragraphs: [
      'In 2021 I built a Mars transportation ledger in Java. The destination was imaginary. The accounting was not. Fares, records, and a source of truth showed up before I had a production user.',
      'The same stretch produced an auction where people could list, bid, and sell, using Node.js, Express, and MongoDB. In 2022 a Khelo India website redesign, tagged on my profile as an SIH project, added MySQL and a faster path through the pages.',
      'None of these waited on a steering committee. They were how I learned to hold a whole system: interface, rules, data, and the person on the other side.',
    ],
    notes: [
      { label: 'Mars ledger', value: 'Java, 2021' },
      { label: 'Auction', value: 'Node.js, Express, MongoDB' },
      { label: 'Khelo India', value: 'Node.js, MySQL, Bootstrap' },
    ],
    links: [{ label: 'Mars ledger on GitHub', href: 'https://github.com/Yomu1273/MTISProject' }],
    exhibit: 'early',
  },
  {
    id: 'shipped',
    code: '05',
    year: '2024–2026',
    heading: 'Platform architecture',
    path: 'work/platform-architecture',
    plate: 'A proof that stayed',
    mark: 'Ten in two weeks',
    title: 'From a proof into the platform',
    summary: 'An internal proof of concept became the platform that replaced a vendor product. Configuration carried the workflow variety.',
    facet: 'delivery',
    x: 34,
    y: 37,
    paragraphs: [
      'I joined Trimble in June 2024 as a software engineer. I originated a proof of concept that became the platform replacing a third-party product, and I led the frontend architecture: integration, standards, planning, and how the work would ship. That ownership later widened into the API, the database, security, and the release.',
      'The interface had to carry many workflow types without a fresh codebase for each one. I led a configuration-driven React architecture for dynamic rules, conditional sections, and validation, and used it to deliver ten workflows in two weeks. A ticket-creation redesign fit in one sprint.',
      'Saved work, cross-tab notifications, searchable dashboards, attachments, comments, and a view across current and historical records were there so a customer or a support agent could continue a job they had already started.',
    ],
    notes: [
      { label: 'Role', value: 'Software Engineer, Jun 2024–Aug 2026' },
      { label: 'Scope', value: 'Frontend architecture through release' },
      { label: 'Pace', value: '10 workflows in two weeks' },
    ],
    links: [],
    exhibit: 'workflow',
  },
  {
    id: 'hardened',
    code: '06',
    year: '2025–2026',
    heading: 'Release engineering',
    path: 'work/release-engineering',
    plate: 'The finished path',
    mark: 'About 400 findings',
    title: 'A release that could move',
    summary: 'Role-aware gating, separated workflows, safer email, and analytics that can fail without taking the product with them.',
    facet: 'delivery',
    x: 66,
    y: 37,
    paragraphs: [
      'A release date does not wait for every workflow. I added fail-safe, role-aware gating across routes, dashboard requests, saved filters, drafts, and notifications. External customers could use the finished claims journey while unfinished work stayed closed.',
      'Warranty and product-return screens had become coupled. I separated them so acceptance testing could continue, and so two streams could move without a rewrite at the end.',
      'About 400 findings came off the board across Mend dependency checks, Sonar static analysis, and lint, as part of making the release ready. HTML email went through a safe rendering path. API security requirements were assessed rather than assumed. Product analytics sat behind a failure boundary: privacy-aware URL filtering, custom events, environment-specific configuration, and lazy loading. When staffing dropped to three people, I moved from the frontend into the backend and kept the committed release on time for QA.',
    ],
    notes: [
      { label: 'Findings', value: 'About 400 across Mend, Sonar, and lint' },
      { label: 'Gate', value: 'Routes, filters, drafts, notifications' },
      { label: 'Team', value: 'Cross-stack work in a three-person release' },
    ],
    links: [],
    exhibit: 'release',
  },
  {
    id: 'measured',
    code: '07',
    year: '2022',
    heading: 'Search-result diversification',
    path: 'work/search-diversification',
    plate: 'Measure, then choose',
    mark: 'CART MAE 0.003',
    title: 'Fifty-six answers, then a measurement',
    summary: 'A CLEF 2022 working note on fusing image-search results. CART won the base-model comparison and went into the submissions.',
    facet: 'research',
    x: 12,
    y: 70,
    paragraphs: [
      'In 2022 I co-authored a CLEF working note on diversifying image search results. Fifty-six retrieval systems had already produced answers. The task was to fuse them.',
      'We trained KNN, CART, and SVR on 167,139 values and tested them on 175,591. CART had the lowest error among the base models, with an MAE of 0.003. KNN sat at 0.004, SVR at 0.085, and the voting regressor at 0.017. CART went into the submission runs. The best of those reached an F1 of 0.5634 and a cluster recall of 0.4414.',
      'The habit I kept: compare the approaches on the same data, then keep the one the numbers support.',
    ],
    notes: [
      { label: 'Training rows', value: '167,139' },
      { label: 'Test rows', value: '175,591' },
      { label: 'Best F1 / cluster recall', value: '0.5634 / 0.4414' },
    ],
    links: [
      { label: 'Read the paper', href: 'https://ceur-ws.org/Vol-3180/paper-107.pdf' },
      { label: 'DBLP record', href: 'https://dblp.org/rec/conf/clef/KalinathanBESMR22' },
    ],
    exhibit: 'research',
  },
  {
    id: 'automated',
    code: '08',
    year: '2025–2026',
    heading: 'Applied AI',
    path: 'work/applied-ai',
    plate: 'Drafts stop for review',
    mark: '92% evaluated',
    title: 'Models, drafts, and a human review',
    summary: 'An issue recommender evaluated at 92%, prototypes after three retrieval approaches, and a Jira-to-draft-PR path that stops for a person.',
    facet: 'research',
    x: 39,
    y: 70,
    paragraphs: [
      'An issue-recommendation solution I evaluated scored 92%. That figure is the evaluation of the solution. It is not a score I assign to one retrieval approach. Around that work I compared TF-IDF, vector search, and a knowledge-backed language model, then prototyped conversational navigation, intent detection, and multi-agent orchestration.',
      'I also built a path from a Jira defect to a draft pull request with n8n, GitHub, and Cursor. The draft is where a person takes over. The automation clears space for review. It does not merge itself.',
      'Architecture notes, pull-request review, onboarding, and sessions on AI safety and secure agentic systems were part of the same effort: the system should still make sense when I am not the one holding it.',
    ],
    notes: [
      { label: 'Evaluation', value: '92% on issue recommendation' },
      { label: 'Compared', value: 'TF-IDF, vector search, knowledge-backed LLM' },
      { label: 'Automation', value: 'Jira, n8n, GitHub, Cursor' },
    ],
    links: [],
    exhibit: 'pipeline',
  },
  {
    id: 'published',
    code: '09',
    year: '2026',
    heading: 'schema-form-lint',
    path: 'work/schema-form-lint',
    plate: 'A public lint package',
    mark: '17 rules, 46 tests',
    title: 'schema-form-lint',
    summary: 'A zero-dependency static analyzer for JSON Forms and react-jsonschema-form, published under MIT.',
    facet: 'public',
    x: 66,
    y: 70,
    paragraphs: [
      'schema-form-lint is the public version of bugs I was tired of meeting at runtime. It is an MIT-licensed npm package, a CLI, and a library. It reads JSON Forms and react-jsonschema-form configuration and reports problems before a user does.',
      'Seventeen rules cover hidden required fields, impossible conditions, and UI configuration the renderer will silently ignore. Suggestions use Levenshtein distance. The package has no runtime dependencies, ships TypeScript declarations, and carries 46 automated tests across Node.js 20, 22, and 24. I checked it against official examples.',
      'The studio on this page runs a readable subset of that engine in your browser. The published package is the full set.',
    ],
    notes: [
      { label: 'License', value: 'MIT' },
      { label: 'Package', value: 'CLI, library, type declarations' },
      { label: 'Checks', value: '46 tests on Node 20, 22, and 24' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Yomu1273/schema-form-lint' },
      { label: 'npm', href: 'https://www.npmjs.com/package/schema-form-lint' },
    ],
    exhibit: 'lint',
  },
]

export const EDGES: { from: string; to: string }[] = [
  { from: 'imagined', to: 'measured' },
  { from: 'imagined', to: 'shipped' },
  { from: 'signed', to: 'measured' },
  { from: 'led', to: 'signed' },
  { from: 'led', to: 'shipped' },
  { from: 'measured', to: 'automated' },
  { from: 'shipped', to: 'accelerated' },
  { from: 'shipped', to: 'hardened' },
  { from: 'shipped', to: 'published' },
  { from: 'automated', to: 'published' },
]

export interface Credential {
  id: string
  label: string
  detail: string
  href?: string
}

export const EDUCATION: Credential[] = [
  { id: 'degree', label: 'B.E. Computer Science and Engineering', detail: 'SSN College of Engineering, Chennai, 2020–2024. First Class with Distinction. CGPA 9.1.' },
  { id: 'school', label: 'CBSE Class XII, school topper', detail: 'SKV Vidhyashram, 2018–2020. 485/500, 97%.' },
]

export const PUBLICATION: Credential = {
  id: 'paper',
  label: 'A Fusion Approach for Web Search Result Diversification Using Machine Learning Algorithms',
  detail: 'CLEF 2022 working note. CEUR Workshop Proceedings, Vol-3180.',
  href: 'https://ceur-ws.org/Vol-3180/paper-107.pdf',
}

export const CERTIFICATIONS: Credential[] = [
  { id: 'aws', label: 'AI-Driven Development Lifecycle', detail: 'Amazon Web Services, 2026.', href: 'https://drive.google.com/file/d/1bbj2RUj-jsadCA-KVxeRdTvSPLYO53hd/view' },
  { id: 'n8n', label: 'AI Builder: Agents, Voice Agents and Automations in n8n', detail: 'Ligency, 2026.', href: 'https://www.udemy.com/certificate/UC-0115f9a2-447e-41eb-808b-191f415ffe68/' },
  { id: 'scrum', label: 'Agile Scrum Master', detail: 'Agile Enterprise Coach, London, 2026.', href: 'https://drive.google.com/file/d/1W8x6HAnjJ_xGL49Lqzb7Cb6wvvWo-q41/view' },
  { id: 'rwd', label: 'Responsive Web Design', detail: 'freeCodeCamp, 2021. 300 hours.', href: 'https://www.freecodecamp.org/certification/yomu/responsive-web-design' },
  { id: 'js', label: 'JavaScript Algorithms and Data Structures', detail: 'freeCodeCamp, 2021. 300 hours.', href: 'https://www.freecodecamp.org/certification/yomu/javascript-algorithms-and-data-structures' },
  { id: 'py', label: 'Data Analysis with Python', detail: 'Cognitive Class, IBM Developer Skills Network, 2021.', href: 'https://courses.cognitiveclass.ai/certificates/4a05c7eb5fba4371a9b5ae4b1b46a16b' },
]

export const LEADERSHIP: string[] = [
  'President, SSN College student body, May 2023–May 2024.',
  'Event head, Invente, the SSN tech fest. Editor and documentation coordinator before the presidency.',
  'Finalist in company-wide innovation hackathons. First place in an internship innovation competition.',
  'Third prize, out-of-the-box thinking. A perfect score on a national quiz. First college trophy through NSS.',
  'FieldOps cadet training for emergency volunteering.',
]

export const BEYOND: { label: string; value: string }[] = [
  { label: 'Creative', value: 'Songwriting, short films, video editing, photography, and dance.' },
  { label: 'Sport and games', value: 'Skating, football, cricket, chess, and Rubik’s cube.' },
  { label: 'Culture', value: 'Reading, cinema, and anime.' },
]

export const SONG = {
  title: 'Maaya Dhevadhaiye',
  href: 'https://distrokid.com/hyperfollow/vikashanandsyogeshmunees/maaya-dhevadhaiye-feat-sridharan-kumaran--bavashri',
  credit: 'Co-released with Vikash Anand S, featuring Sridharan Kumaran and Bavashri.',
}

export interface Role {
  org: string
  place: string
  title: string
  dates: string
  points: string[]
}

export const EXPERIENCE: Role[] = [
  {
    org: 'Trimble',
    place: 'Chennai, India',
    title: 'Software Engineer II',
    dates: 'Aug 2026 — Present',
    points: [
      'Reduced staging serial-search latency from about 2.4–2.6 seconds to 17 ms for full values, 35 ms for middle fragments, and 254 ms for common three-character searches with .NET APIs and PostgreSQL GIN trigram indexes.',
      'Wrote the autocomplete architecture decision: benchmarks, access control, rejected alternatives, database constraints, deployment order, rollback, and production prerequisites. Full part-number search dropped from about 64 ms to under 1 ms.',
      'Shipped fail-safe, role-aware release gating so external customers could use the finished claims journey while unfinished workflows stayed closed.',
      'Moved from frontend into backend during a three-person release and kept the committed date on time for QA.',
    ],
  },
  {
    org: 'Trimble',
    place: 'Chennai, India',
    title: 'Software Engineer',
    dates: 'Jun 2024 — Aug 2026',
    points: [
      'Originated a proof of concept that became the in-house platform replacing a third-party vendor, and led frontend architecture, API integration, standards, planning, and release delivery.',
      'Delivered 10 workflows in two weeks, and a ticket-creation redesign in one sprint, on a configuration-driven React architecture for dynamic rules, conditional sections, and validation.',
      'Resolved about 400 Mend, Sonar, and lint findings and put HTML email on a safe rendering path after assessing API security requirements.',
      'Evaluated an AI issue-recommendation solution at 92% accuracy, then prototyped conversational navigation, intent detection, and multi-agent orchestration after comparing TF-IDF, vector search, and a knowledge-backed model.',
      'Built a Jira-to-draft-pull-request path with n8n, GitHub, and Cursor that stops for human review, and spread system knowledge through architecture notes, reviews, onboarding, and mentoring.',
    ],
  },
]

export const SKILL_GROUPS: { label: string; value: string }[] = [
  { label: 'Languages', value: 'JavaScript, TypeScript, Python, C#, SQL, Java' },
  { label: 'Frontend', value: 'React, Angular, XState, React Router, HTML, CSS, component architecture, accessibility' },
  { label: 'Backend and APIs', value: '.NET, REST APIs, API design, authentication, authorization, third-party integrations' },
  { label: 'Data and performance', value: 'PostgreSQL, MongoDB, Azure Cosmos DB, query optimization, GIN indexing, trigram search, performance testing' },
  { label: 'AI and automation', value: 'RAG, LLM applications, AI agents, MCP, prompt engineering, n8n' },
  { label: 'Engineering', value: 'System design, application architecture, ADRs, security, CI/CD, GitHub Actions, Git, Agile, Scrum' },
]

export interface OfferFigure {
  value: string
  label: string
  node: string
}

export interface OfferSignal {
  area: string
  line: string
  node: string
}

export interface OfferStandout {
  id: string
  area: string
  title: string
  paragraphs: string[]
  links: { label: string; node: string }[]
}

export const OFFER = {
  line: 'What he takes responsibility for.',
  signals: [
    { area: 'Ownership', line: 'A proof became the platform I led', node: 'shipped' },
    { area: 'Leadership', line: 'Standards kept for the people after me', node: 'led' },
    { area: 'Applied AI', line: 'Models compared, then a person decides', node: 'automated' },
    { area: 'Decisions', line: 'The call written down, including the no', node: 'accelerated' },
  ] satisfies OfferSignal[],
  figures: [
    { value: '17 ms', label: 'Full-value search, from ~2.5 s', node: 'accelerated' },
    { value: '10', label: 'Workflows shipped in two weeks', node: 'shipped' },
    { value: '~400', label: 'Findings cleared before release', node: 'hardened' },
    { value: '92%', label: 'Issue recommender, evaluated', node: 'automated' },
  ] satisfies OfferFigure[],
  standouts: [
    {
      id: 'ownership',
      area: 'Ownership',
      title: 'I originated the proof, then stayed for the parts that were not mine yet.',
      paragraphs: [
        'The proof of concept became the platform that replaced a vendor product. I led the frontend architecture: standards, API integration, planning, and the release. The work did not stop at the screen.',
        'As Engineer II the same system was still mine when the slow part was PostgreSQL, when the risk was a release gate, and when staffing dropped to three people. I moved into the backend so the committed date still reached QA.',
      ],
      links: [
        { label: 'The platform', node: 'shipped' },
        { label: 'The release', node: 'hardened' },
        { label: 'The search path', node: 'accelerated' },
      ],
    },
    {
      id: 'leadership',
      area: 'Leadership',
      title: 'I lead by making the next person able to change the system.',
      paragraphs: [
        'From May 2023 to May 2024 I was president of the SSN student body. Before that I edited and coordinated documentation, and I headed an event at Invente. The job was people, a schedule, and a standard other students could see.',
        'At Trimble that shows up as architecture notes, pull-request review, onboarding, mentoring, and sessions on AI safety and secure agentic systems. A release with three engineers cannot keep its knowledge in one head.',
      ],
      links: [
        { label: 'The room', node: 'led' },
        { label: 'The three-person release', node: 'hardened' },
      ],
    },
    {
      id: 'ai',
      area: 'Applied AI',
      title: 'The AI work is a set of projects, each with a boundary.',
      paragraphs: [
        'I evaluated an issue recommender at 92%. Around it I compared TF-IDF, vector search, and a knowledge-backed language model. The 92% is the evaluation of that solution. It is not a score I assign to one of those three approaches.',
        'I prototyped conversational navigation, intent detection, and multi-agent orchestration. A Jira defect can become a draft pull request through n8n, GitHub, and Cursor. The draft is where a person takes over.',
        'Earlier, the final-year project turned speech into an Indian Sign Language pipeline: recognition, natural language processing, HamNoSys, and a 3D avatar. It does not invent signs. In 2022 I co-authored a CLEF working note that fused 56 image-search systems and kept the model the error supported.',
      ],
      links: [
        { label: 'The recommender and the drafts', node: 'automated' },
        { label: 'Speech into a sign', node: 'signed' },
        { label: 'The paper', node: 'measured' },
      ],
    },
    {
      id: 'decisions',
      area: 'Decisions',
      title: 'The call is written down, and the blast radius stays small.',
      paragraphs: [
        'The search change has an architecture decision: benchmarks, access control, the alternatives we rejected, database constraints, deployment order, rollback, and what production still required. Short searches got faster. They did not become instant, and the page says so.',
        'Customers could start the finished claims journey while unfinished workflows stayed closed. Warranty and returns were split before they blocked acceptance testing. Analytics can fail without taking the product with them. schema-form-lint publishes a class of bugs so the next build meets them before a user does.',
      ],
      links: [
        { label: 'The written decision', node: 'accelerated' },
        { label: 'The gate', node: 'hardened' },
        { label: 'The public package', node: 'published' },
      ],
    },
  ] satisfies OfferStandout[],
  range: [
    { label: 'Recognition', value: 'Finalist in company innovation hackathons. First place in an internship innovation competition. Third prize, out-of-the-box thinking. A perfect score on a national quiz.' },
    { label: 'Service', value: 'FieldOps cadet training for emergency volunteering. A first college trophy through NSS.' },
    { label: 'Study', value: 'B.E. Computer Science, SSN, First Class with Distinction, CGPA 9.1. CBSE XII school topper, 485/500.' },
  ],
  toolkit: SKILL_GROUPS.map((group) => group.value).join(', ') + '.',
  caveat:
    'Angular is part of the toolkit. Java is the 2021 Mars ledger. Accessibility is how the interfaces are built. None of those is a separate score.',
}

export const PROFILE = {
  name: 'Yogesh Munees',
  role: 'Software Engineer II',
  org: 'Trimble',
  place: 'Chennai, Tamil Nadu, India',
  email: 'yogeshmunees@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yogesh-munees-130354196',
  github: 'https://github.com/Yomu1273',
  positioning:
    'Full-stack software engineer building enterprise React/.NET platforms, performance-sensitive APIs, and applied-AI workflows.',
  summary:
    'I build full-stack enterprise platforms and the tools around them. React, .NET, Python, PostgreSQL, and applied AI, with the architecture written down so someone else can change it.',
}

export const SELECTED_WORK = ['shipped', 'accelerated', 'hardened', 'automated', 'published']

export function nodeHref(id: string): string {
  const node = findNode(id)
  return node ? `/${node.path}/` : '/work/'
}

export function findNode(id: string): AtlasNode | undefined {
  return NODES.find((node) => node.id === id)
}

export function connectedNodes(id: string): AtlasNode[] {
  const ids = new Set<string>()
  for (const edge of EDGES) {
    if (edge.from === id) ids.add(edge.to)
    if (edge.to === id) ids.add(edge.from)
  }
  return NODES.filter((node) => ids.has(node.id))
}

export function nodeHaystack(node: AtlasNode): string {
  return [
    node.code,
    node.heading,
    node.plate,
    node.title,
    node.summary,
    node.year,
    node.mark,
    node.facet,
    ...node.paragraphs,
    ...node.notes.flatMap((note) => [note.label, note.value]),
  ]
    .join(' ')
    .toLowerCase()
}

export function matchesQuery(haystack: string, query: string): boolean {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}
