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
    }
});

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
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
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

        container.innerHTML = projects.map((project, index) => `
            <div class="project-card ${project.is_featured ? 'featured' : ''}" data-aos="fade-up" data-aos-delay="${index * 100}">
                ${project.is_featured ? '<div class="project-badge">Major Project</div>' : ''}
                <div class="project-icon">
                    <i class="${project.icon_class || 'fas fa-laptop-code'}"></i>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                </div>
                <div class="project-links icon-badge-wrapper">
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
                        <i class="fas fa-certificate"></i> View Certificate
                    </button>` : ''}
                </div>
            </div>
        `).join('');

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

            return `
            <div class="internship-card" data-aos="fade-up" data-aos-delay="${index * 100}">
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

        container.innerHTML = certs.map((cert, index) => `
            <div class="cert-card" data-certificate-image="${cert.certificate_image_path}">
                <div class="cert-icon">
                    <i class="${cert.icon_class || 'fas fa-certificate'}"></i>
                </div>
                <h4>${cert.title}</h4>
                <p class="cert-issuer">${cert.issuer}</p>
                <p class="cert-date">${cert.date_issued || cert.date}</p>
                <p class="cert-description">${cert.description}</p>
                <div class="card-actions">
                    ${cert.certificate_visible !== false ? `
                    <button onclick="openCertModal('${cert.certificate_image_path || '#'}')" class="icon-badge view-cert-btn">
                        <i class="fas fa-certificate"></i> View Certificate
                    </button>` : ''}
                </div>
            </div>
        `).join('');
    } catch (e) { console.error('Error loading certifications', e); }
}

// 5. Load Achievements
async function loadAchievements() {
    try {
        const response = await fetch('/api/achievements');
        const achievements = await response.json();
        const container = document.querySelector('.achievements-grid');
        if (!container || !achievements.length) return;

        container.innerHTML = achievements.map((item, index) => `
            <div class="achievement-card" data-aos="zoom-in" data-aos-delay="${index * 100}">
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
        `).join('');
    } catch (e) { console.error('Error loading achievements', e); }
}
