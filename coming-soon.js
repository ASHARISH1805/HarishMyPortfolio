// Coming Soon Notification System
document.addEventListener('DOMContentLoaded', function () {
    // Create notification HTML
    const notificationHTML = `
        <div class="notification-overlay" id="notificationOverlay"></div>
        <div class="coming-soon-notification" id="comingSoonNotification">
            <div class="notification-icon">
                <i class="fas fa-hourglass-half"></i>
            </div>
            <h3>Content Under Development</h3>
            <p>Thank you for your interest! This resource is currently being prepared and will be available shortly. We appreciate your patience as we finalize the details.</p>
            <button class="notification-close" id="notificationClose">Understood</button>
        </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Get elements
    const overlay = document.getElementById('notificationOverlay');
    const notification = document.getElementById('comingSoonNotification');
    const closeBtn = document.getElementById('notificationClose');
    const notificationTitle = notification.querySelector('h3');
    const notificationText = notification.querySelector('p');
    const notificationIcon = notification.querySelector('.notification-icon i');

    // Function to show notification
    function showComingSoonNotification(type) {
        // Customize message based on type
        let title = 'Content Under Development';
        let message = 'Thank you for your interest! This resource is currently being prepared and will be available shortly. We appreciate your patience as we finalize the details.';
        let icon = 'fas fa-hourglass-half';

        switch (type) {
            case 'github':
                title = 'Repository Coming Soon';
                message = 'The source code repository for this project is currently being organized and documented. It will be publicly available on GitHub shortly.';
                icon = 'fab fa-github';
                break;
            case 'certificate':
                title = 'Certificate Verification';
                message = 'Digital certificate verification is being set up. The official certificate will be available for viewing soon. Thank you for your understanding.';
                icon = 'fas fa-certificate';
                break;
            case 'demo-video':
                title = 'Demo Video Coming Soon';
                message = 'We are currently recording and editing a comprehensive demo video showcasing this project. The video will be uploaded shortly.';
                icon = 'fas fa-video';
                break;
            case 'demo':
                title = 'Live Demo In Progress';
                message = 'We are currently deploying the live demonstration of this project. The interactive demo will be accessible shortly.';
                icon = 'fas fa-rocket';
                break;
        }

        // Update content
        notificationTitle.textContent = title;
        notificationText.textContent = message;
        notificationIcon.className = icon;

        // Show notification
        overlay.classList.add('active');
        notification.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to hide notification
    function hideNotification() {
        overlay.classList.remove('active');
        notification.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    closeBtn.addEventListener('click', hideNotification);
    overlay.addEventListener('click', hideNotification);

    // Attach to all coming-soon links
    document.addEventListener('click', function (e) {
        const comingSoonLink = e.target.closest('.coming-soon-link');
        if (comingSoonLink) {
            e.preventDefault();
            const type = comingSoonLink.getAttribute('data-type') || 'default';
            showComingSoonNotification(type);
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && notification.classList.contains('active')) {
            hideNotification();
        }
    });
});
