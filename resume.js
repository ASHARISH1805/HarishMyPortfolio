document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    loadInternships();
    loadProjects();
    loadCertifications();
    loadAchievements();
});

async function loadSkills() {
    try {
        const response = await fetch('/api/skills');
        const skills = await response.json();
        const container = document.getElementById('resume-skills');

        container.innerHTML = skills.map(skill => `
            <div style="flex-basis: 48%; margin-bottom: 5px;">
                <span class="skill-category">${skill.title}:</span>
                <span class="skill-items">${skill.technologies}</span>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function loadInternships() {
    try {
        const response = await fetch('/api/internships');
        let interns = await response.json();
        const container = document.getElementById('resume-internships');

        // Sort by date (assuming id represents insertion order/recency mostly) or just take top 3
        container.innerHTML = interns.map(data => `
            <div class="entry">
                <div class="entry-header">
                    <span class="entry-title">${data.role}</span>
                    <span class="entry-date">${data.duration}</span>
                </div>
                <div class="entry-subtitle">${data.company}</div>
                <ul class="entry-details">
                    ${formatList(data.description)}
                </ul>
                <div class="resume-links" style="font-size: 9pt; margin-left: 18px; margin-top: 2px;">
                    ${data.source_code_link ? `<a href="${data.source_code_link}" target="_blank">Source Code</a>` : ''}
                    ${data.live_demo_link ? ` | <a href="${data.live_demo_link}" target="_blank">Live Demo</a>` : ''}
                    ${data.certificate_link ? ` | <a href="${data.certificate_link}" target="_blank">Certificate</a>` : ''}
                </div>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        let projects = await response.json();
        // Filter: Use 'Major Project' or top 3-4 projects based on complexity
        // We will just show top 4 for space
        projects = projects.slice(0, 4);

        const container = document.getElementById('resume-projects');
        container.innerHTML = projects.map(project => `
            <div class="entry" style="margin-bottom: 8px;">
                <div class="entry-header">
                    <span class="entry-title">${project.title}</span>
                </div>
                <p style="font-size: 10pt; color: #475569;">${project.description}</p>
                <div class="project-tech">Tech: ${project.technologies}</div>
                <div class="resume-links" style="font-size: 9pt; margin-top: 2px;">
                    ${project.source_code_link ? `<a href="${project.source_code_link}" target="_blank">Source Code</a>` : ''}
                    ${project.live_demo_link ? ` | <a href="${project.live_demo_link}" target="_blank">Live Demo</a>` : ''}
                    ${project.demo_video_link ? ` | <a href="${project.demo_video_link}" target="_blank">Demo Video</a>` : ''}
                    ${project.certificate_link ? ` | <a href="${project.certificate_link}" target="_blank">Project Link</a>` : ''}
                </div>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

async function loadCertifications() {
    try {
        const response = await fetch('/api/certifications');
        let certs = await response.json();
        const container = document.getElementById('resume-certs');

        // Compact list
        // Compact list with links
        container.innerHTML = certs.slice(0, 6).map(cert => {
            const link = cert.certificate_link || cert.certificate_image_path || '#';
            const isClickable = link !== '#';
            return `
            <div class="cert-item">
                <div class="cert-name">
                    ${isClickable ? `<a href="${link}" target="_blank" style="text-decoration:none; color:inherit;">${cert.title} <i class="fas fa-external-link-alt" style="font-size:0.7em"></i></a>` : cert.title}
                </div>
                <div class="cert-issuer">${cert.issuer} | ${cert.date_issued || cert.date}</div>
            </div>
            `;
        }).join('');
    } catch (e) { console.error(e); }
}

async function loadAchievements() {
    try {
        const response = await fetch('/api/achievements');
        let data = await response.json();
        const container = document.getElementById('resume-achievements');

        container.innerHTML = `<ul class="entry-details">` +
            data.map(item => `
                <li><strong>${item.title}:</strong> ${item.description}</li>
            `).join('') +
            `</ul>`;
    } catch (e) { console.error(e); }
}

// Helper to format bullet points from text
function formatList(text) {
    if (!text) return '';
    // If text contains '•' or newlines, split by them
    const points = text.split(/[•\n]/).filter(p => p.trim().length > 0);
    if (points.length > 0) {
        return points.map(p => `<li>${p.trim()}</li>`).join('');
    }
    return `<li>${text}</li>`;
}
