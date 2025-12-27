// ===================================
// Theme Toggle Functionality
// ===================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark' mode
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Update icon based on theme
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (html.getAttribute('data-theme') === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
});

// ===================================
// Navigation Functionality
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    highlightActiveSection();

    // Back to Top button visibility
    toggleBackToTop();
});

// ===================================
// Active Section Highlighting
// ===================================
function highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100; // Offset for fixed nav
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
        } else {
            const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
            if (navLink) navLink.classList.remove('active');
        }
    });
}

// ===================================
// Back to Top Button
// ===================================
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// AOS (Animate On Scroll) Initialization
// ===================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 0
    });
}

// ===================================
// Contact Form Handling
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Here you would typically send the data to a backend service
        // For now, we'll just show a success message
        showNotification('Message sent successfully! I will get back to you soon.', 'success');

        // Reset form
        contactForm.reset();
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;

    notification.querySelector('i').style.fontSize = '1.25rem';

    // Add to body
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations to the document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Scroll Progress Indicator
// ===================================
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, hsl(250, 75%, 58%), hsl(335, 85%, 58%));
        z-index: 10000;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createScrollProgressBar();

// ===================================
// Typing Effect for Hero Section (Optional Enhancement)
// ===================================
function createTypingEffect() {
    const heroDescription = document.querySelector('.hero-description');
    if (!heroDescription) return;

    const text = heroDescription.textContent;
    heroDescription.textContent = '';
    heroDescription.style.opacity = '1';

    let index = 0;
    const speed = 30;

    function type() {
        if (index < text.length) {
            heroDescription.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a small delay
    setTimeout(type, 1000);
}

// Uncomment the line below to enable typing effect
// createTypingEffect();

// ===================================
// Cursor Trail Effect (Optional Premium Feature)
// ===================================
function createCursorTrail() {
    const coords = { x: 0, y: 0 };
    const circles = [];
    const colors = [
        'hsla(250, 75%, 58%, 0.3)',
        'hsla(280, 75%, 58%, 0.3)',
        'hsla(335, 85%, 58%, 0.3)'
    ];

    // Create circle elements
    for (let i = 0; i < 20; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.3s ease;
        `;
        circle.style.backgroundColor = colors[i % colors.length];
        document.body.appendChild(circle);
        circles.push(circle);
    }

    // Update coordinates on mouse move
    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    // Animate circles
    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach((circle, index) => {
            circle.style.left = x - 5 + 'px';
            circle.style.top = y - 5 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

            const nextCircle = circles[index + 1] || circles[0];
            x += (parseInt(nextCircle.style.left) || coords.x - 5 - x) * 0.3;
            y += (parseInt(nextCircle.style.top) || coords.y - 5 - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// Uncomment to enable cursor trail (only on desktop)
// if (window.innerWidth > 1024) {
//     createCursorTrail();
// }

// ===================================
// Project Links Update Helper
// ===================================
// Function to help update GitHub and LinkedIn links
function updateSocialLinks() {
    console.log('%c📝 Portfolio Configuration Helper', 'color: #6366f1; font-size: 16px; font-weight: bold;');
    console.log('%cTo customize your portfolio, update the following in index.html:', 'color: #10b981; font-size: 14px;');
    console.log('%c1. Replace "yourusername" with your GitHub username', 'color: #666;');
    console.log('%c2. Replace "yourprofile" with your LinkedIn profile', 'color: #666;');
    console.log('%c3. Update email addresses and phone numbers', 'color: #666;');
    console.log('%c4. Add your actual project GitHub links', 'color: #666;');
    console.log('%c\n✨ Your portfolio is ready to shine!', 'color: #6366f1; font-size: 14px; font-weight: bold;');
}

// Call on page load
window.addEventListener('load', () => {
    updateSocialLinks();
});

// ===================================
// Performance Optimization
// ===================================
// Lazy load images if needed
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Accessibility Enhancements
// ===================================
// Skip to main content functionality
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: hsl(250, 75%, 58%);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 10001;
    border-radius: 0 0 8px 0;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ===================================
// Console Easter Egg
// ===================================
console.log('%c👨‍💻 Harish - AI & Data Science Portfolio', 'color: #6366f1; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%c🚀 Built with HTML, CSS, and JavaScript', 'color: #10b981; font-size: 14px;');
console.log('%c💡 Looking for opportunities as AI Developer, ML Engineer, Data Analyst', 'color: #f59e0b; font-size: 14px;');
console.log('%c📧 Get in touch: Check the Contact section!', 'color: #ec4899; font-size: 14px;');
console.log('%c\n🔍 Interested in the code? Check out my GitHub!', 'color: #8b5cf6; font-size: 14px; font-weight: bold;');

// ===================================
// Analytics Ready
// ===================================
// Placeholder for Google Analytics or other tracking
// Add your tracking code here
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR-GA-ID');
*/

// ===================================
// Certificate/Achievement Modal
// ===================================
const certificateModal = document.getElementById('certificateModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalIssuer = document.getElementById('modalIssuer');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');

// Get all "View Certificate" buttons
const viewCertButtons = document.querySelectorAll('.view-cert-btn');

// Function to open modal
function openModal(data) {
    certificateModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Populate modal with data
    modalTitle.textContent = data.title;
    modalIssuer.textContent = data.issuer || '';
    modalDate.textContent = data.date || '';
    modalDescription.textContent = data.description || '';

    // Set image if available, otherwise hide it
    if (data.image) {
        modalImage.src = data.image;
        modalImage.alt = data.title;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }
}

// Function to close modal
function closeModal() {
    certificateModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    modalImage.src = '';
}

// Add click event to all "View Certificate" buttons
viewCertButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling

        // Find the parent card
        const card = button.closest('.cert-card, .achievement-card, .timeline-content');

        if (!card) return;

        // Extract data from the card
        let title, issuer, date, description, image;

        if (card.classList.contains('cert-card')) {
            // Certificate card
            title = card.querySelector('h4')?.textContent || '';
            issuer = card.querySelector('.cert-issuer')?.textContent || '';
            date = card.querySelector('.cert-date')?.textContent || '';
            description = `Certificate awarded for completing ${title}`;
            image = card.getAttribute('data-certificate-image') || null;
        } else if (card.classList.contains('achievement-card')) {
            // Achievement/Hackathon card
            title = card.querySelector('h3')?.textContent || '';
            issuer = card.querySelector('.achievement-position')?.textContent || '';
            date = '';
            description = card.querySelector('.achievement-description')?.textContent || '';
            image = card.getAttribute('data-certificate-image') || null;
        } else if (card.classList.contains('timeline-content')) {
            // Internship timeline item
            title = card.querySelector('h4')?.textContent || '';
            issuer = card.querySelector('.timeline-company')?.textContent || '';
            date = card.querySelector('.timeline-date')?.textContent || '';

            // Get description from timeline points
            const points = card.querySelectorAll('.timeline-points li');
            description = Array.from(points).map(li => '• ' + li.textContent).join('\n');

            image = card.closest('.timeline-item')?.getAttribute('data-certificate-image') || null;
        }

        openModal({
            title,
            issuer,
            date,
            description,
            image
        });
    });
});

// Close modal on close button click
modalClose.addEventListener('click', closeModal);

// Close modal on overlay click
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
        closeModal();
    }
});

// Prevent modal content clicks from closing the modal
document.querySelector('.modal-container').addEventListener('click', (e) => {
    e.stopPropagation();
});

console.log('%c✨ Modal System Ready!', 'color: #10b981; font-size: 14px; font-weight: bold;');
console.log('%c📜 Click "View Certificate" buttons to see certificate details', 'color: #6366f1; font-size: 12px;');
