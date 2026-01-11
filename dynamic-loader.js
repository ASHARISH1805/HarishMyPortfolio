document.addEventListener('DOMContentLoaded', async () => {
    // Only fetch if we are running on a server (http/https) to avoid errors when opening locally
    if (window.location.protocol.startsWith('http')) {
        await loadSkills();
        await loadProjects();
        await loadInternships();
        await loadCertifications();
        await loadAchievements();

        // Re-initialize animations if needed (e.g. AOS)
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        setupCertModal();
        setupProjectModal();
    }
});

function setupProjectModal() {
    const modalHtml = `
    <div id="projectModal" class="project-modal">
        <div class="project-modal-content">
            <span class="close-project-modal" onclick="document.getElementById('projectModal').style.display='none'">&times;</span>
            <img id="projectModalImg" class="project-modal-image" src="" alt="Project Preview">
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    window.openProjectModal = (path) => {
        if (!path) return;
        const modal = document.getElementById('projectModal');
        const img = document.getElementById('projectModalImg');

        // Optional: Add a spinner or loading state here if desired
        img.style.opacity = '0';
        img.src = path;

        modal.style.display = 'flex';

        img.onload = () => {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '1';
        };
    };

    window.onclick = (e) => {
        const pModal = document.getElementById('projectModal');
        const cModal = document.getElementById('certModal');
        if (e.target == pModal) pModal.style.display = 'none';
        if (e.target == cModal) cModal.style.display = 'none';
    }
}

function setupCertModal() {
    const modalHtml = `
    <div id="certModal" class="cert-modal">
        <div class="cert-modal-content">
            <span class="close-modal" onclick="document.getElementById('certModal').style.display='none'">&times;</span>
            <div id="certContainer" style="margin-top:20px;"></div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    window.openCertModal = (path) => {
        if (!path) return;
        const modal = document.getElementById('certModal');
        const container = document.getElementById('certContainer');

        container.innerHTML = '';
        const ext = path.split('.').pop().toLowerCase();

        let content;
        // Check if path is an image (Base64 or File Extension)
        const isImage = path.startsWith('data:image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

        if (isImage) {
            content = `<img src="${path}" style="max-width:100%; max-height:70vh;border-radius:5px;">`;
        } else {
            content = `<iframe src="${path}" style="width:80vw; height:70vh; border:none; background:white;"></iframe>`;
        }

        container.innerHTML = content;
        modal.style.display = 'flex';
    };

    window.onclick = (e) => {
        const modal = document.getElementById('certModal');
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// 1. Load Skills
async function loadSkills() {
    try {
        const response = await fetch('/api/skills');
        const skills = await response.json();
        const container = document.querySelector('.skills-grid');
        if (!container || !skills.length) return;

        container.innerHTML = skills.map((skill, index) => {
            // Split technologies string into array of tags
            const tags = skill.technologies ? skill.technologies.split(',').map(t => t.trim()) : [];

            return `
            <div class="skill-category" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="category-header">
                    <i class="${skill.icon_class || 'fas fa-code'}"></i>
                    <h3>${skill.title}</h3>
                </div>
                <div class="skill-tags">
                    ${tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
            </div>
            `;
        }).join('');
    } catch (e) { console.error('Error loading skills', e); }
}

// 2. Load Projects
async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const container = document.querySelector('.projects-grid');
        if (!container || !projects.length) return;

        container.innerHTML = projects.map((project, index) => {
            const hasPopup = project.project_image_path && project.project_image_path.trim() !== '';
            const cursorStyle = hasPopup ? 'cursor: pointer;' : '';
            const clickAttr = hasPopup ? `onclick="openProjectModal('${project.project_image_path}')"` : '';

            return `
            <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}" 
                 style="${cursorStyle}" ${clickAttr}>
                <div class="project-icon">
                    <i class="${project.icon_class || 'fas fa-laptop-code'}"></i>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                </div>
                <br>
                <div class="project-links icon-badge-wrapper" onclick="event.stopPropagation()">
                    ${project.source_code_link && project.source_code_visible !== false ? `
                    <a href="${project.source_code_link}" target="_blank" class="project-link icon-badge" data-type="github">
                        <i class="fab fa-github"></i> Source Code (GitHub)
                    </a>` : ''}
                    
                    ${project.demo_video_link && project.demo_video_visible !== false ? `
                    <a href="${project.demo_video_link}" target="_blank" class="project-link icon-badge" data-type="demo-video">
                        <i class="fas fa-video"></i> Demo Video
                    </a>` : ''}
                    
                    ${project.live_demo_link && project.live_demo_visible !== false ? `
                    <a href="${project.live_demo_link}" target="_blank" class="project-link icon-badge" data-type="demo">
                        <i class="fas fa-rocket"></i> Live Project Demo
                    </a>` : ''}
                    
                    ${project.certificate_link && project.certificate_visible !== false ? `
                    <button onclick="openCertModal('${project.certificate_link}')" class="project-link icon-badge" data-type="certificate">
                        <i class="fas fa-image"></i> Project Home Page
                    </button>` : ''}
                </div>
            </div>
        `}).join('');

    } catch (e) { console.error('Error loading projects', e); }
}

// 3. Load Internships
async function loadInternships() {
    try {
        const response = await fetch('/api/internships');
        const internships = await response.json();
        const container = document.querySelector('.internships-grid');
        if (!container || !internships.length) return;

        container.innerHTML = internships.map((intern, index) => {
            // Safe split for description bullets
            const points = intern.description
                ? intern.description.split('\n').filter(line => line.trim().length > 0)
                : [];

            // Safe split for technologies
            const techs = intern.technologies
                ? intern.technologies.split(',').map(t => t.trim())
                : [];

            const hasPopup = intern.certificate_link && intern.certificate_link.trim() !== '';
            const cursorStyle = hasPopup ? 'cursor: pointer;' : '';
            const clickAttr = hasPopup ? `onclick="openCertModal('${intern.certificate_link}')"` : '';

            return `
            <div class="internship-card" data-aos="fade-up" data-aos-delay="${index * 100}" 
                 style="${cursorStyle}" ${clickAttr}>
                <div class="internship-icon">
                    <i class="${intern.icon_class || 'fas fa-briefcase'}"></i>
                </div>
                <h4>${intern.title}</h4>
                <p class="internship-company">${intern.company}</p>
                <p class="internship-date">${intern.duration || intern.period || ''}</p>
                <ul class="internship-points">
                    ${points.map(point => `<li>${point.replace(/^•\s*/, '')}</li>`).join('')}
                </ul>
                <div class="internship-skills">
                    ${techs.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="card-actions">
                    ${intern.source_code_link && intern.source_code_visible !== false ? `
                    <a href="${intern.source_code_link}" target="_blank" class="icon-badge" data-type="github">
                        <i class="fab fa-github"></i>
                        Source Code (GitHub)
                    </a>` : ''}
                    
                    ${intern.demo_video_link && intern.demo_video_visible !== false ? `
                    <a href="${intern.demo_video_link}" target="_blank" class="icon-badge" data-type="demo-video">
                        <i class="fas fa-video"></i>
                        Demo Video
                    </a>` : ''}
                    
                    ${intern.live_demo_link && intern.live_demo_visible !== false ? `
                    <a href="${intern.live_demo_link}" target="_blank" class="icon-badge" data-type="demo">
                        <i class="fas fa-rocket"></i>
                        Live Project Demo
                    </a>` : ''}
                    
                    ${intern.certificate_link && intern.certificate_visible !== false ? `
                    <button onclick="openCertModal('${intern.certificate_link}')" class="project-link icon-badge" data-type="certificate">
                        <i class="fas fa-certificate"></i> View Certificate
                    </button>` : ''}
                </div>
            </div>
            `;
        }).join('');
    } catch (e) { console.error('Error loading internships', e); }
}

// 4. Load Certifications
async function loadCertifications() {
    try {
        const response = await fetch('/api/certifications');
        const certs = await response.json();
        const container = document.querySelector('.certifications-grid');
        if (!container || !certs.length) return;

        container.innerHTML = certs.map((cert, index) => {
            const hasPopup = cert.certificate_image_path && cert.certificate_visible !== false;
            const cursorStyle = hasPopup ? 'cursor: pointer;' : '';
            const clickAttr = hasPopup ? `onclick="openCertModal('${cert.certificate_image_path}')"` : '';

            return `
            <div class="cert-card" data-certificate-image="${cert.certificate_image_path}"
                 style="${cursorStyle}" ${clickAttr}>
                <div class="cert-icon">
                    <i class="${cert.icon_class || 'fas fa-certificate'}"></i>
                </div>
                <h4>${cert.title}</h4>
                <p class="cert-issuer">${cert.issuer}</p>
                <p class="cert-date">${cert.date_issued || cert.date}</p>
                <p class="cert-description">${cert.description}</p>
                <div class="card-actions">
                    ${(cert.certificate_image_path && cert.certificate_visible !== false) ? `
                    <button onclick="openCertModal('${cert.certificate_image_path}')" class="icon-badge view-cert-btn">
                        <i class="fas fa-certificate"></i> View Certificate
                    </button>` : `
                    <span class="cert-ongoing">
                        <i class="fas fa-user-clock"></i> Currently undergoing this course
                    </span>`}
                </div>
            </div>
        `;
        }).join('');
    } catch (e) { console.error('Error loading certifications', e); }
}

// 5. Load Achievements
async function loadAchievements() {
    try {
        const response = await fetch('/api/achievements');
        const achievements = await response.json();
        const container = document.querySelector('.achievements-grid');
        if (!container || !achievements.length) return;

        container.innerHTML = achievements.map((item, index) => {
            const hasPopup = item.certificate_link && item.certificate_visible !== false;
            const cursorStyle = hasPopup ? 'cursor: pointer;' : '';
            const clickAttr = hasPopup ? `onclick="openCertModal('${item.certificate_link}')"` : '';

            return `
            <div class="achievement-card" data-aos="zoom-in" data-aos-delay="${index * 100}"
                 style="${cursorStyle}" ${clickAttr}>
                <div class="achievement-icon">
                    <i class="${item.icon_class || 'fas fa-trophy'}"></i>
                </div>
                <h3>${item.title}</h3>
                <p class="achievement-position">${item.role || ''}</p>
                <p class="achievement-description">${item.description}</p>
                <div class="card-actions">
                    ${item.source_code_link && item.source_code_visible !== false ? `
                    <a href="${item.source_code_link}" target="_blank" class="icon-badge" data-type="github">
                        <i class="fab fa-github"></i> Source Code (GitHub)
                    </a>` : ''}
                    
                    ${item.demo_video_link && item.demo_video_visible !== false ? `
                    <a href="${item.demo_video_link}" target="_blank" class="icon-badge" data-type="demo-video">
                        <i class="fas fa-video"></i> Demo Video
                    </a>` : ''}

                    ${item.certificate_link && item.certificate_visible !== false ? `
                    <button onclick="openCertModal('${item.certificate_link}')" class="icon-badge" data-type="certificate">
                        <i class="fas fa-certificate"></i> View Certificate
                    </button>` : ''}
                    
                    ${item.live_demo_link && item.live_demo_visible !== false ? `
                    <a href="${item.live_demo_link}" class="icon-badge" data-type="demo">
                        <i class="fas fa-rocket"></i> Live Project Demo
                    </a>` : ''}
                </div>
            </div>
            `;
        }).join('');
    } catch (e) { console.error('Error loading achievements', e); }
}

// ===================================
// Micro-SaaS Showcase Logic
// ===================================
const saasProjects = [
    {
        title: "StreamFlow",
        subtitle: "Netflix AI Copilot",
        role: "Lead Developer & Product Designer",
        status: "Prototype (MVP)",
        desc: "Designed and developed a desktop automation ecosystem acting as an intelligent 'Co-pilot' for streaming platforms. Solving the 'choice paralysis' problem, this tool reduces the time-to-content by 90% through mood-based recommendations and autonomous navigation handling.",
        tech: ["Python", "Selenium", "Tkinter", "OpenCV", "Threading"],
        icon: "fas fa-play",
        color: "linear-gradient(135deg, #E50914, #B81D24)"
    },
    {
        title: "RecruitAI",
        subtitle: "Smart Hiring Assistant",
        role: "Full Stack Developer",
        status: "Beta Testing",
        desc: "An AI-powered recruitment platform that automates resume screening, schedules interviews, and provides candidate insights using NLP. Reduces hiring time by 40% and improves candidate matching accuracy.",
        tech: ["Python", "FastAPI", "React", "NLP", "PostgreSQL"],
        icon: "fas fa-robot",
        color: "linear-gradient(135deg, #0077B5, #00A0DC)"
    },
    {
        title: "DocuMind",
        subtitle: "Intelligent Document Analysis",
        role: "AI Engineer",
        status: "Concept",
        desc: "A document processing SaaS that uses OCR and LLMs to extract, summarize, and query information from legal and financial documents instantly, transforming unstructured data into actionable insights.",
        tech: ["Python", "Tesseract", "Transformers", "Flask", "React"],
        icon: "fas fa-file-invoice",
        color: "linear-gradient(135deg, #10B981, #34D399)"
    },
    {
        title: "FinTrack",
        subtitle: "Personal Finance Analytics",
        role: "Solutions Architect",
        status: "Development",
        desc: "A personal finance management tool that aggregates bank transactions, categorizes expenses using ML, and provides predictive budget insights to help users achieve financial goals.",
        tech: ["Node.js", "Express", "MongoDB", "Chart.js", "ML.NET"],
        icon: "fas fa-chart-pie",
        color: "linear-gradient(135deg, #F59E0B, #FBBF24)"
    },
    {
        title: "EdSync",
        subtitle: "Smart Learning Platform",
        role: "Lead Developer",
        status: "Ideation",
        desc: "An adaptive learning platform that customizes study plans based on student performance and learning pace. Features real-time progress tracking and resource recommendations.",
        tech: ["Vue.js", "Firebase", "Python", "Sklearn"],
        icon: "fas fa-graduation-cap",
        color: "linear-gradient(135deg, #8B5CF6, #A78BFA)"
    }
];

window.openSaasModal = function (index) {
    const project = saasProjects[index];
    if (!project) return;

    // Update Modal Content
    document.getElementById('saasModalTitle').innerText = project.title;
    document.getElementById('saasModalSubtitle').innerText = project.subtitle;
    document.getElementById('saasModalDesc').innerText = project.desc;
    document.getElementById('saasModalRole').innerText = project.role;
    document.getElementById('saasModalStatus').innerText = project.status;

    // Icon
    const iconContainer = document.getElementById('saasModalIcon');
    iconContainer.innerHTML = `<i class="${project.icon}"></i>`;
    iconContainer.style.background = project.color;

    // Tech Stack
    const techContainer = document.getElementById('saasModalTech');
    techContainer.innerHTML = project.tech.map(t => `<span class="saas-tech">${t}</span>`).join('');

    // Show Modal
    const modal = document.getElementById('saasModal');
    modal.classList.add('show');
    modal.style.display = 'flex';

    // Highlight sidebar item
    document.querySelectorAll('.saas-item').forEach((item, i) => {
        if (i === index) item.classList.add('active-saas');
        else item.classList.remove('active-saas');
    });
}

window.closeSaasModal = function () {
    const modal = document.getElementById('saasModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close on click outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('saasModal');
    if (e.target === modal) {
        closeSaasModal();
    }
});
