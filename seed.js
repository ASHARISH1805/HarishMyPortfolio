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
                    INSERT INTO achievements (title, role, description, source_code_link, demo_video_link, live_demo_link, display_order, icon_class)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [a.title, a.role, a.description, a.source, a.demo_video, a.live_demo, a.order, a.icon]);
            }
            console.log('✅ Achievements seeded');
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
