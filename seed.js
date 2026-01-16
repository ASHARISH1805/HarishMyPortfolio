const db = require('./database');

const skills = [
    {
        title: 'Programming Languages',
        technologies: 'Python, Java, SQL',
        order: 1,
        icon: 'fas fa-code'
    },
    {
        title: 'Data Analysis & Visualization',
        technologies: 'Pandas, NumPy, Matplotlib, Seaborn, Qlik Sense',
        order: 2,
        icon: 'fas fa-chart-bar'
    },
    {
        title: 'Machine Learning',
        technologies: 'Time-Series Forecasting, Regression Models, Model Training and Evaluation',
        order: 3,
        icon: 'fas fa-brain'
    },
    {
        title: 'Web Development',
        technologies: 'HTML5, CSS3, JavaScript, Flask',
        order: 4,
        icon: 'fas fa-laptop-code'
    },
    {
        title: 'Web Scraping & Automation',
        technologies: 'BeautifulSoup, Requests, Automated Data Extraction',
        order: 5,
        icon: 'fas fa-robot'
    },
    {
        title: 'Databases',
        technologies: 'MySQL, SQLite',
        order: 6,
        icon: 'fas fa-database'
    },
    {
        title: 'Dashboards & Analytics',
        technologies: 'Interactive BI Dashboards, Supply Chain Analytics, Business Intelligence',
        order: 7,
        icon: 'fas fa-tachometer-alt'
    },
    {
        title: 'Cloud & Deployment',
        technologies: 'Render, Base44, Web Application Hosting',
        order: 8,
        icon: 'fas fa-cloud'
    },
    {
        title: 'Tools & Platforms',
        technologies: 'Git, REST APIs, Qlik Sense, VS Code',
        order: 9,
        icon: 'fas fa-tools'
    },
    {
        title: 'Software Engineering Practices',
        technologies: 'Modular Design, API Integration, Prototype Development, Debugging',
        order: 10,
        icon: 'fas fa-cogs'
    }
];

async function seedSkills() {
    console.log('🔄 Re-seeding Skills...');
    // Clear existing skills to ensure list matches exactly
    await db.query('DELETE FROM skills');

    // Reset ID sequence if possible (optional, for cleanliness)
    try { await db.query('ALTER SEQUENCE skills_id_seq RESTART WITH 1'); } catch (e) { }

    for (const skill of skills) {
        await db.query(`
            INSERT INTO skills (title, technologies, display_order, icon_class) 
            VALUES ($1, $2, $3, $4)
        `, [skill.title, skill.technologies, skill.order, skill.icon]);
    }
    console.log('✅ Skills updated.');
}

async function seedData() {
    try {
        console.log('🌱 Starting database seeding...');

        // 1. Skills
        await seedSkills();

        // 2. Projects (Check if empty before seeding to avoid duplicates during full seed)
        const projCount = await db.query('SELECT COUNT(*) FROM projects');
        if (parseInt(projCount.rows[0].count) === 0) {
            const projects = [
                {
                    title: 'Reservoir Water Demand Forecasting and Storage Optimization System',
                    description: 'Advanced ML-based system for predicting water demand and optimizing reservoir storage using time-series forecasting, regression models, and interactive Flask dashboard.',
                    technologies: 'Python, Time-Series Forecasting, Flask, Regression Models, Data Optimization',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-tint',
                    featured: true,
                    order: 1
                },
                {
                    title: 'Automated Job Board Aggregation and Intelligent Search Platform',
                    description: 'Web scraping and automation platform aggregating job listings from multiple sources with intelligent search, real-time updates, and REST API integration.',
                    technologies: 'Python, BeautifulSoup, Web Scraping, Flask, REST APIs',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-briefcase',
                    featured: false,
                    order: 2
                },
                {
                    title: 'IT Industry Insights and Business Analytics Dashboard',
                    description: 'Comprehensive BI dashboard providing insights into IT industry trends, business metrics, and predictive analytics for data-driven decision making.',
                    technologies: 'Business Intelligence, Python, Data Analytics, Visualization',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-chart-line',
                    featured: false,
                    order: 3
                },
                {
                    title: 'Interactive Qlik-Based Supply Chain Analytics Dashboard',
                    description: 'Advanced supply chain analytics dashboard using Qlik Sense on DataCo case study for optimizing logistics, inventory management, and delivery performance.',
                    technologies: 'Qlik Sense, Supply Chain Analytics, Business Intelligence, Data Visualization',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-truck',
                    featured: false,
                    order: 4
                },
                {
                    title: 'Smart India Hackathon 2025 Website Replication and System Implementation',
                    description: 'Full-stack web application replicating SIH platform with participant registration, team management, problem statements, and admin dashboard functionalities.',
                    technologies: 'HTML/CSS/JavaScript, Flask, MySQL, Full-Stack Development',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-trophy',
                    featured: false,
                    order: 5
                },
                {
                    title: 'Neural Network-Based Quantum-Resistant Cryptographic Framework',
                    description: 'Advanced cryptographic system using neural networks to develop quantum-resistant encryption algorithms for secure data protection against future quantum computing threats.',
                    technologies: 'Deep Learning, TensorFlow, Cryptography, Security',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-shield-alt',
                    featured: false,
                    order: 6
                }
            ];

            for (const p of projects) {
                await db.query(`
                    INSERT INTO projects (title, description, technologies, source_code_link, demo_video_link, live_demo_link, display_order, is_featured, icon_class)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [p.title, p.description, p.technologies, p.source, p.demo_video, p.live_demo, p.order, p.featured, p.icon]);
            }
            console.log('✅ Projects seeded');
        }

        // 3. Internships
        const internCount = await db.query('SELECT COUNT(*) FROM internships');
        if (parseInt(internCount.rows[0].count) === 0) {
            const internships = [
                {
                    title: 'Machine Learning Intern',
                    company: 'CodingMissions IT Solutions',
                    period: 'Aug 2024 – Oct 2024',
                    description: 'Focused on data preprocessing, feature engineering, and model development\nBuilt and evaluated machine learning models for real-world applications\nWorked on model optimization and hyperparameter tuning techniques',
                    technologies: 'Python, Machine Learning, Scikit-learn',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-briefcase',
                    order: 1
                },
                {
                    title: 'AI-ML-DS Intern',
                    company: 'International Institute of Digital Technologies and Blackbuck Engineers, APSCHE',
                    period: 'Jun 2024 – Jul 2024',
                    description: 'Built ML models and performed data preprocessing on real-world datasets\nConducted data analysis and developed predictive analytics solutions\nGained hands-on experience with AI/ML tools and frameworks',
                    technologies: 'Machine Learning, Data Science, Python',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-brain',
                    order: 2
                }
            ];

            for (const i of internships) {
                await db.query(`
                    INSERT INTO internships (title, company, period, description, technologies, source_code_link, demo_video_link, live_demo_link, display_order, icon_class)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [i.title, i.company, i.period, i.description, i.technologies, i.source, i.demo_video, i.live_demo, i.order, i.icon]);
            }
            console.log('✅ Internships seeded');
        }

        // 4. Certifications
        const certCount = await db.query('SELECT COUNT(*) FROM certifications');
        if (parseInt(certCount.rows[0].count) === 0) {
            const certifications = [
                {
                    title: 'Quantum Hardware Technologies & Challenges',
                    issuer: 'QuEdX TalkOn',
                    date: 'Jan 2026',
                    description: 'Comprehensive understanding of quantum hardware architectures, qubit technologies, and error mitigation challenges in quantum computing systems.',
                    image: 'certificates/quantum-hardware-cert.jpg',
                    icon: 'fas fa-atom',
                    order: 1
                },
                {
                    title: 'Quantum Fundamentals',
                    issuer: 'IBM Quantum',
                    date: '2025',
                    description: 'Gained solid foundation in quantum mechanics principles, qubits, quantum gates, and basic quantum algorithms using Qiskit.',
                    image: 'certificates/quantum-fundamentals-cert.jpg',
                    icon: 'fas fa-atom',
                    order: 2
                },
                {
                    title: 'AI/ML & Geodata Analysis',
                    issuer: 'ISRO',
                    date: '2025',
                    description: 'Specialized training in applying artificial intelligence and machine learning techniques for analyzing geospatial data and satellite imagery.',
                    image: 'certificates/isro-cert.jpg',
                    icon: 'fas fa-satellite',
                    order: 3
                },
                {
                    title: 'Power BI Data Analyst Associate',
                    issuer: 'Microsoft',
                    date: '2025',
                    description: 'Proficient in creating interactive dashboards, data visualization, DAX calculations, and business intelligence reporting with Power BI.',
                    image: 'certificates/powerbi-cert.jpg',
                    icon: 'fas fa-chart-bar',
                    order: 4
                },
                {
                    title: 'SQL for Data Science',
                    issuer: 'IBM',
                    date: '2025',
                    description: 'Mastered SQL queries, database management, data manipulation, joins, and aggregations for data science and analytics workflows.',
                    image: 'certificates/sql-cert.jpg',
                    icon: 'fas fa-graduation-cap',
                    order: 5
                },
                {
                    title: 'C Programming',
                    issuer: 'UC Santa Cruz',
                    date: '2023',
                    description: 'Strong foundation in C programming, including pointers, memory management, data structures, and algorithm implementation.',
                    image: 'certificates/c-programming-cert.jpg',
                    icon: 'fas fa-graduation-cap',
                    order: 6
                },
                {
                    title: 'Deep Learning Specialization',
                    issuer: 'DeepLearning.AI',
                    date: '2025',
                    description: 'Mastered neural networks, CNNs, RNNs, and hyperparameter tuning.',
                    image: 'certificates/dl-specialization.jpg',
                    icon: 'fas fa-brain',
                    order: 7
                },
                {
                    title: 'Google Cloud Professional Architect',
                    issuer: 'Google Cloud',
                    date: '2025',
                    description: 'Designed scalable and reliable cloud infrastructure solutions on GCP.',
                    image: 'certificates/gcp-architect.jpg',
                    icon: 'fas fa-cloud',
                    order: 8
                },
                {
                    title: 'Full Stack Web Development',
                    issuer: 'Udemy',
                    date: '2024',
                    description: 'Comprehensive boot camp covering React, Node.js, Express, and MongoDB.',
                    image: 'certificates/fullstack-bootcamp.jpg',
                    icon: 'fas fa-laptop-code',
                    order: 9
                },
                {
                    title: 'Advanced Data Structures & Algorithms',
                    issuer: 'Coursera',
                    date: '2024',
                    description: 'In-depth study of graph algorithms, dynamic programming, and data structure optimization.',
                    image: 'certificates/dsa-advanced.jpg',
                    icon: 'fas fa-code-branch',
                    order: 10
                },
                {
                    title: 'Cyber Security Fundamentals',
                    issuer: 'CompTIA',
                    date: '2024',
                    description: 'Understanding of network security, threat management, and cryptography.',
                    image: 'certificates/comptia-security.jpg',
                    icon: 'fas fa-user-secret',
                    order: 11
                },
                {
                    title: 'Agile Project Management',
                    issuer: 'Google',
                    date: '2024',
                    description: 'Learned Agile methodologies, Scrum framework, and effective team collaboration strategies.',
                    image: 'certificates/agile-pm.jpg',
                    icon: 'fas fa-tasks',
                    order: 12
                }
            ];

            for (const c of certifications) {
                await db.query(`
                    INSERT INTO certifications (title, issuer, date_issued, description, certificate_image_path, display_order, icon_class)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [c.title, c.issuer, c.date, c.description, c.image, c.order, c.icon]);
            }
            console.log('✅ Certifications seeded');
        }

        // 5. Achievements
        const achieveCount = await db.query('SELECT COUNT(*) FROM achievements');
        if (parseInt(achieveCount.rows[0].count) === 0) {
            const achievements = [
                {
                    title: 'MIT iQuHACK 2026 (Remote)',
                    role: 'Selected Participant',
                    category: 'Hackathon',
                    description: 'Worked on quantum computing challenges focusing on quantum algorithms and hybrid quantum–AI approaches',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-atom',
                    order: 1
                },
                {
                    title: 'Smart India Hackathon 2024',
                    role: 'Finalist',
                    category: 'Hackathon',
                    description: 'Selected among top teams nationwide for developing an AI-based solution for smart city management',
                    source: 'https://github.com/asharish1805',
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-trophy',
                    order: 2
                },
                {
                    title: 'MSME IDEA Hackathon 2024',
                    role: 'Participant',
                    category: 'Hackathon',
                    description: 'Participated in MSME IDEA Hackathon developing innovative solutions for MSME sector challenges',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-medal',
                    order: 3
                },
                {
                    title: 'AI & Data Science Projects',
                    role: '6 Major Projects',
                    category: 'Project',
                    description: 'Successfully completed 6 comprehensive AI/ML projects covering forecasting, web scraping, BI dashboards, and cryptography',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-laptop-code',
                    order: 4
                },
                {
                    title: 'Academic Performance',
                    role: '7.47 CGPA',
                    category: 'Education',
                    description: 'Maintained good academic standing throughout B.E. in Artificial Intelligence & Data Science program',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-star',
                    order: 5
                },
                {
                    title: 'Technical Club Leadership',
                    role: 'AI Club Member',
                    category: 'Leadership',
                    description: 'Active member organizing workshops and sessions on AI/ML technologies for fellow students',
                    source: null,
                    demo_video: null,
                    live_demo: null,
                    icon: 'fas fa-users',
                    order: 6
                }
            ];

            for (const a of achievements) {
                await db.query(`
                    INSERT INTO achievements (title, role, category, description, source_code_link, demo_video_link, live_demo_link, display_order, icon_class)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [a.title, a.role, a.category || 'Achievement', a.description, a.source, a.demo_video, a.live_demo, a.order, a.icon]);
            }
            console.log('✅ Achievements seeded');
        }

        // 6. Micro-SaaS
        const saasCount = await db.query('SELECT COUNT(*) FROM micro_saas');
        if (parseInt(saasCount.rows[0].count) === 0) {
            const micronSaas = [
                {
                    title: "StreamFlow",
                    subtitle: "Netflix AI Copilot",
                    role: "Lead Developer & Product Designer",
                    status: "Prototype (MVP)",
                    description: "Built a 'Micro-SaaS' desktop application to automate streaming workflows, reducing user interaction time by 90%.\nEngineered a Computer Vision layer (OpenCV) to autonomously detect and click dynamic UI elements like 'Skip Intro'.\nDeveloped a custom recommendation engine mapping user moods to content queries using complex logic.\nDesigned a native-style GUI (Tkinter) with secure coordinate-based authentication handling.",
                    technologies: "Python, Selenium, Tkinter, OpenCV, Threading",
                    icon: "fas fa-play",
                    color: "linear-gradient(135deg, #E50914, #B81D24)",
                    order: 1
                },
                {
                    title: "RecruitAI",
                    subtitle: "Smart Hiring Assistant",
                    role: "Full Stack Developer",
                    status: "Beta Testing",
                    description: "Developed an AI-powered recruitment platform automating resume screening and scheduling.\nImplemented NLP algorithms to parse resumes and match candidates to job descriptions with 85% accuracy.\nReduced hiring administrative time by 40% through automated interview scheduling workflows.\nBuilt a responsive React frontend with real-time candidate analytics.",
                    technologies: "Python, FastAPI, React, NLP, PostgreSQL",
                    icon: "fas fa-robot",
                    color: "linear-gradient(135deg, #0077B5, #00A0DC)",
                    order: 2
                },
                {
                    title: "DocuMind",
                    subtitle: "Intelligent Document Analysis",
                    role: "AI Engineer",
                    status: "Concept",
                    description: "Designed a document processing SaaS using OCR and LLMs to extract insights from legal documents.\nImplemented Tesseract OCR for high-accuracy text extraction from scanned PDFs and images.\nIntegrated Transformer models to summarize complex legal jargon into actionable executive summaries.\nEnables instant querying of document repositories using natural language.",
                    technologies: "Python, Tesseract, Transformers, Flask, React",
                    icon: "fas fa-file-invoice",
                    color: "linear-gradient(135deg, #10B981, #34D399)",
                    order: 3
                },
                {
                    title: "FinTrack",
                    subtitle: "Personal Finance Analytics",
                    role: "Solutions Architect",
                    status: "Development",
                    description: "Architected a personal finance management tool aggregating data from multiple bank accounts.\nDeveloped ML models to categorize transaction expenses automatically with 90% precision.\nCreated predictive budget insights helping users forecast savings based on spending habits.\nVisualized financial health through interactive charts using Chart.js.",
                    technologies: "Node.js, Express, MongoDB, Chart.js, ML.NET",
                    icon: "fas fa-chart-pie",
                    color: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                    order: 4
                },
                {
                    title: "EdSync",
                    subtitle: "Smart Learning Platform",
                    role: "Lead Developer",
                    status: "Ideation",
                    description: "Conceptualized an adaptive learning platform customizing study plans based on student performance.\nFeatures real-time progress tracking to identify knowledge gaps and recommend resources.\nUses collaborative filtering to suggest peer study groups and relevant learning materials.\nDesigned a gamified interface to increase student engagement and retention.",
                    technologies: "Vue.js, Firebase, Python, Sklearn",
                    icon: "fas fa-graduation-cap",
                    color: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
                    order: 5
                },
                {
                    title: "QuantumLeap",
                    subtitle: "Quantum Sim Interface",
                    role: "Researcher",
                    status: "Prototype",
                    description: "Developed a visual interface for simulating quantum circuits and visualizing qubit states.\nImplemented the Bloch sphere visualization using Three.js for intuitive quantum state representation.\nIntegrated Qiskit backend to execute quantum algorithms and display real-time results.\nMakes complex quantum computing concepts accessible to students through interactive simulations.",
                    technologies: "Python, Qiskit, React, Three.js",
                    icon: "fas fa-atom",
                    color: "linear-gradient(135deg, #3B82F6, #93C5FD)",
                    order: 6
                },
                {
                    title: "CyberSentinel",
                    subtitle: "Threat Detection AI",
                    role: "Security Engineer",
                    status: "Concept",
                    description: "Proposed a real-time network traffic anomaly detection system using deep learning autoencoders.\nDesigned to identify potential security breaches and zero-day attacks by analyzing traffic patterns.\nUses PyTorch for training models on normal traffic data to detect deviations.\nIntegrated Grafana for real-time monitoring and alerting of suspicious activities.",
                    technologies: "Python, PyTorch, Scapy, Grafana",
                    icon: "fas fa-shield-virus",
                    color: "linear-gradient(135deg, #EF4444, #FCA5A5)",
                    order: 7
                },
                {
                    title: "HealthPulse",
                    subtitle: "Remote Patient Monitoring",
                    role: "Backend Dev",
                    status: "Development",
                    description: "Building an IoT-enabled platform for continuous monitoring of patient vitals remotely.\nConnects wearable devices via MQTT to a centralized MongoDB database for real-time tracking.\nImplements AI-driven alerts to notify medical staff of irregular vital signs immediately.\nDeveloping a secure Flutter mobile app for patients to view their health metrics.",
                    technologies: "Node.js, MQTT, MongoDB, Flutter",
                    icon: "fas fa-heartbeat",
                    color: "linear-gradient(135deg, #EC4899, #FBCFE8)",
                    order: 8
                }
            ];

            for (const s of micronSaas) {
                await db.query(`
                    INSERT INTO micro_saas (title, subtitle, role, status, description, technologies, icon_class, color_gradient, display_order)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [s.title, s.subtitle, s.role, s.status, s.description, s.technologies, s.icon, s.color, s.order]);
            }
            console.log('✅ Micro-SaaS seeded');
        }

        console.log('🎉 Seeding complete!');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
}

// Allow direct execution
if (require.main === module) {
    seedData().then(() => process.exit());
}

// Export for other scripts
module.exports = { seedData, seedSkills };
