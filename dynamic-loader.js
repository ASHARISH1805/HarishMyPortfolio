document.addEventListener('DOMContentLoaded', async () => {
    // Only fetch if we are running on a server (http/https) to avoid errors when opening locally
    if (window.location.protocol.startsWith('http')) {
        await loadSkills();
        await loadProjects();
        await loadInternships();
        await loadCertifications();
        await loadAchievements();
        await loadMicroSaas();
        await loadStats();

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
// 6. Load Micro-SaaS
let saasProjects = [];

async function loadMicroSaas() {
    try {
        const response = await fetch('/api/micro-saas');
        saasProjects = await response.json();
        const container = document.querySelector('.saas-list');
        if (!container || !saasProjects.length) return;

        container.innerHTML = saasProjects.map((project, index) => {
            // Only show first 3 items as "Featured" if desired, or all if preferred.
            // Based on user request "keep 3 only", we can slice or just render what the API returns (and let DB/User control visibility/limit)
            // But user said "make featured, 3 only keep" - so let's respect the API return (assuming API returns what is needed)
            // The API returns everything. Better to limit to 3 here or in API.
            // Let's render all that come from API, assuming admin controls visibility.

            // Wait, we need to map the "tech" array correctly as it might be a string in DB
            const techStack = typeof project.technologies === 'string' ? project.technologies.split(',').map(t => t.trim()) : project.technologies;
            // Store cleaned tech back for modal use
            saasProjects[index].tech = techStack;
            saasProjects[index].desc = project.description;
            saasProjects[index].icon = project.icon_class;
            saasProjects[index].color = project.color_gradient;

            const boxShadowColor = project.color_gradient.match(/#[A-Fa-f0-9]{6}/g)?.[0] || '#000';
            // Convert hex to rgba for shadow
            const hexToRgba = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, 0.4)`;
            }
            const shadow = `0 4px 15px ${hexToRgba(boxShadowColor)}`;

            // Active class for first item by default? Maybe not.
            // Let's add active-saas to the first one only.
            const activeClass = index === 0 ? 'active-saas' : '';

            let statusClass = 'saas-status-default';
            const statusLower = (project.status || '').toLowerCase();

            if (statusLower.includes('development') || statusLower.includes('building')) {
                statusClass = 'saas-status-dev';
            } else if (statusLower.includes('prototype') || statusLower.includes('mvp')) {
                statusClass = 'saas-status-prototype';
            } else if (statusLower.includes('concept') || statusLower.includes('idea')) {
                statusClass = 'saas-status-concept';
            } else if (statusLower.includes('beta') || statusLower.includes('live')) {
                statusClass = 'saas-status-live';
            }

            return `
            <div class="saas-item ${activeClass}" onclick="openSaasModal(${index})">
                <div class="saas-icon" style="background: ${project.color_gradient}; box-shadow: ${shadow};">
                    <i class="${project.icon_class}"></i>
                </div>
                <div class="saas-info">
                    <div class="saas-title-row">
                        <h4>${project.title}</h4>
                        <span class="saas-status-pill ${statusClass}">${project.status}</span>
                    </div>
                    <span>${project.subtitle}</span>
                </div>
                <div class="saas-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
            `;
        }).join('');

    } catch (e) { console.error('Error loading Micro-SaaS', e); }
}

window.openSaasModal = function (index) {
    const project = saasProjects[index];
    if (!project) return;

    // Update Modal Content
    document.getElementById('saasModalTitle').innerText = project.title;
    document.getElementById('saasModalSubtitle').innerText = project.subtitle;
    // Convert description to bullet points if it contains newlines, otherwise just show text
    const descText = project.description || project.desc;
    const descContainer = document.getElementById('saasModalDesc');

    if (descText && descText.includes('\n')) {
        const listItems = descText.split('\n').filter(line => line.trim() !== '').map(line => `<li>${line.trim().replace(/^•\s*/, '')}</li>`).join('');
        descContainer.innerHTML = `<ul style="list-style-type: disc; padding-left: 20px; margin-top: 10px; text-align: left;">${listItems}</ul>`;
    } else {
        descContainer.innerHTML = `<p>${descText}</p>`;
    }
    document.getElementById('saasModalRole').innerText = project.role;
    document.getElementById('saasModalStatus').innerText = project.status;

    // Icon
    const iconContainer = document.getElementById('saasModalIcon');
    iconContainer.innerHTML = `<i class="${project.icon_class || project.icon}"></i>`;
    iconContainer.style.background = project.color_gradient || project.color;

    // Tech Stack
    const techContainer = document.getElementById('saasModalTech');
    let techs = project.tech || project.technologies;
    if (typeof techs === 'string') techs = techs.split(',');

    techContainer.innerHTML = techs.map(t => {
        const techName = t.trim();
        const iconClass = getTechIcon(techName); // Helper function
        return `<span class="saas-tech"><i class="${iconClass}"></i> ${techName}</span>`;
    }).join('');

    // Reset Video
    const videoContainer = document.getElementById('saasModalVideoContainer');
    const videoPlayer = document.getElementById('saasModalVideo');
    if (videoContainer) videoContainer.style.display = 'none';
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }

    // Show Modal
    const modal = document.getElementById('saasModal');
    modal.classList.add('show');
    modal.style.display = 'flex';

    // Highlight sidebar item
    document.querySelectorAll('.saas-item').forEach((item, i) => {
        if (i === index) item.classList.add('active-saas');
        else item.classList.remove('active-saas');
    });

    // Actions Footer
    const footer = document.getElementById('saasModalFooter');
    let buttonsHtml = '';

    if (project.source_code_link) {
        buttonsHtml += `<a href="${project.source_code_link}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> GitHub</a>`;
    }

    if (project.demo_video_link) {
        // We use a button to trigger the video play in the modal
        buttonsHtml += `<button class="btn btn-primary" onclick="playSaasVideo('${project.demo_video_link}')"><i class="fas fa-play"></i> Demo Video</button>`;
    }

    buttonsHtml += `<button class="btn btn-secondary" onclick="closeSaasModal()">Close</button>`;
    footer.innerHTML = buttonsHtml;
}

// Helper to get icons for tech
function getTechIcon(tech) {
    const t = tech.toLowerCase();
    if (t.includes('react')) return 'fab fa-react';
    if (t.includes('node')) return 'fab fa-node-js';
    if (t.includes('js') || t.includes('javascript')) return 'fab fa-js';
    if (t.includes('python')) return 'fab fa-python';
    if (t.includes('html')) return 'fab fa-html5';
    if (t.includes('css')) return 'fab fa-css3-alt';
    if (t.includes('java')) return 'fab fa-java';
    if (t.includes('php')) return 'fab fa-php';
    if (t.includes('aws')) return 'fab fa-aws';
    if (t.includes('docker')) return 'fab fa-docker';
    if (t.includes('git')) return 'fab fa-git-alt';
    if (t.includes('database') || t.includes('sql') || t.includes('mongo')) return 'fas fa-database';
    if (t.includes('chart')) return 'fas fa-chart-pie';
    if (t.includes('ai') || t.includes('ml') || t.includes('brain')) return 'fas fa-brain';
    if (t.includes('api')) return 'fas fa-plug';
    if (t.includes('scraping') || t.includes('selenium')) return 'fas fa-robot';

    return 'fas fa-code'; // Default
}

window.playSaasVideo = function (videoPath) {
    const videoContainer = document.getElementById('saasModalVideoContainer');
    const videoPlayer = document.getElementById('saasModalVideo');

    if (videoContainer && videoPlayer) {
        videoPlayer.src = videoPath;
        videoContainer.style.display = 'block';
        videoPlayer.play();
        // Scroll to video
        videoContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

window.closeSaasModal = function () {
    const modal = document.getElementById('saasModal');

    // Stop video
    const videoPlayer = document.getElementById('saasModalVideo');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }

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

async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();

        const projectCountEl = document.getElementById('project-count');
        const internshipCountEl = document.getElementById('internship-count');
        const hackathonCountEl = document.getElementById('hackathon-count');
        const certCountEl = document.getElementById('cert-count');
        const saasCountEl = document.getElementById('saas-count');

        // CGPA is now the one inside the specific card, or we can add an ID to it in HTML?
        // Let's use the ID-less selector as fallback or just add ID in HTML if we were editing it fully.
        // But for now, user didn't ask to change CGPA logic, just add others.
        // Wait, I should probably check if I can add an ID to CGPA too in index.html for robustness? 
        // No, let's stick to the selector unless it breaks.
        const cgpaEl = document.querySelector('.hero-stat-card:nth-child(3) .stat-number');

        if (projectCountEl) projectCountEl.innerText = stats.projects + '+';
        if (internshipCountEl) internshipCountEl.innerText = stats.internships;
        if (hackathonCountEl) hackathonCountEl.innerText = stats.hackathons;
        if (certCountEl) certCountEl.innerText = stats.certifications;
        if (saasCountEl) saasCountEl.innerText = stats.saas;
        if (cgpaEl) cgpaEl.innerText = stats.cgpa;

    } catch (e) {
        console.error('Error loading stats:', e);
    }
}
