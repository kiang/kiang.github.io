async function loadJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

function createTalkRow(talk) {
    return `
        <tr>
            <td>
                ${talk.slides ? 
                    `<a href="${talk.slides}" target="_blank" class="btn btn-default">${talk.title}</a>` :
                    talk.title
                }
            </td>
            <td>${talk.event}</td>
            <td>${talk.date}</td>
            <td>
                ${talk.links ? talk.links.map(link => 
                    `<a href="${link.url}" target="_blank" class="btn btn-primary">${link.title}</a>`
                ).join(' ') : ''}
            </td>
        </tr>
    `;
}

function createProjectCard(project) {
    let mediaList = '';
    if (project.media && project.media.length > 0) {
        mediaList = `
            <div class="project-media-container">
                <button class="scroll-arrow scroll-left" aria-label="Scroll left">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="project-media-scroll">
                    ${project.media.map(item => `
                        <div class="project-media-item">
                            <a href="${item.url}" target="_blank">${item.title}</a>
                            ${item.date ? `<span class="media-date">${item.date}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                <button class="scroll-arrow scroll-right" aria-label="Scroll right">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    return `
        <div class="col-lg-6">
            <div class="card card-cascade">
                <div class="view overlay">
                    <img src="${project.image}" class="img-fluid" alt="${project.title}">
                    <a href="${project.url}" target="_blank">
                        <div class="mask rgba-white-slight"></div>
                    </a>
                </div>
                <div class="card-body text-center">
                    <h4 class="card-title">
                        <a href="${project.url}" target="_blank"><strong>${project.title}</strong></a>
                        ${project.sourceCode ? `
                            <br />
                            <a type="button" class="btn-floating btn-small btn-tw" 
                               href="${project.sourceCode}" target="_blank">
                                <i class="fa-brands fa-github"></i>
                            </a>
                        ` : ''}
                    </h4>
                    ${mediaList}
                </div>
            </div>
        </div>
    `;
}

function createSocialLink(link) {
    return `
        <a href="${link.url}" target="_blank" title="${link.title}">
            <i class="fas ${link.icon}"></i>
        </a>
    `;
}

function createLinkRow(link) {
    return `
        <tr>
            <td><a href="${link.url}" target="_blank">${link.title}</a></td>
            <td>${link.date}</td>
        </tr>
    `;
}

// Load badges
async function loadBadges() {
    const badgesData = await loadJSON('data/badges.json');
    if (badgesData) {
        const badgesContainer = document.getElementById('badges-container');
        badgesContainer.classList.remove('loading');
        
        // Sort badges by date in descending order
        const sortedBadges = badgesData.badges.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Create container with navigation arrows
        badgesContainer.innerHTML = `
            <div class="achievements-scroll-container">
                <button class="scroll-arrow scroll-left" aria-label="Previous achievements">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="achievements-scroll-area">
                    <div class="row g-4 achievements-row">
                        ${sortedBadges.map(badge => {
                            const thumbnailPath = badge.thumbnail || badge.image;
                            const fullImagePath = badge.image;
                            
                            return `
                                <div class="col-6 col-md-4 col-lg-3 achievement-col">
                                    <div class="achievement-item">
                                        <div class="achievement-content">
                                            <img src="${thumbnailPath}" 
                                                 alt="${badge.title || 'Achievement Badge'}"
                                                 class="achievement-thumbnail"
                                                 data-bs-toggle="modal"
                                                 data-bs-target="#achievementModal"
                                                 data-fullsize="${fullImagePath}"
                                                 onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 300 300\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23f8f9fa\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'14\' fill=\'%236c757d\'%3ENo Image%3C/text%3E%3C/svg%3E';">
                                            <div class="achievement-overlay">
                                                <h3>${badge.title || 'Achievement'}</h3>
                                                <p>${badge.date}${badge.description ? ' - ' + badge.description : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <button class="scroll-arrow scroll-right" aria-label="Next achievements">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        // Initialize scroll functionality for achievements
        const container = badgesContainer.querySelector('.achievements-scroll-container');
        const scrollArea = container.querySelector('.achievements-scroll-area');
        const leftBtn = container.querySelector('.scroll-left');
        const rightBtn = container.querySelector('.scroll-right');

        // Update button states
        function updateScrollButtons() {
            leftBtn.disabled = scrollArea.scrollLeft <= 0;
            rightBtn.disabled = scrollArea.scrollLeft + scrollArea.clientWidth >= scrollArea.scrollWidth;
        }

        // Initial button states
        updateScrollButtons();

        // Scroll event listener
        scrollArea.addEventListener('scroll', updateScrollButtons);

        // Button click handlers
        leftBtn.addEventListener('click', () => {
            const colWidth = scrollArea.querySelector('.achievement-col').offsetWidth;
            const visibleCols = Math.floor(scrollArea.clientWidth / colWidth);
            scrollArea.scrollBy({
                left: -(colWidth * visibleCols),
                behavior: 'smooth'
            });
        });

        rightBtn.addEventListener('click', () => {
            const colWidth = scrollArea.querySelector('.achievement-col').offsetWidth;
            const visibleCols = Math.floor(scrollArea.clientWidth / colWidth);
            scrollArea.scrollBy({
                left: colWidth * visibleCols,
                behavior: 'smooth'
            });
        });

        // Add touch swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        scrollArea.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        scrollArea.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left, go right
                    rightBtn.click();
                } else {
                    // Swipe right, go left
                    leftBtn.click();
                }
            }
        }
    }
}

async function initializePage() {
    // Load talks
    const talksData = await loadJSON('data/talks.json');
    if (talksData) {
        const talksContainer = document.getElementById('talks-container');
        talksContainer.classList.remove('loading');
        talksContainer.innerHTML = talksData.talks.map(createTalkRow).join('');
    }

    // Load links
    const linksData = await loadJSON('data/links.json');
    if (linksData) {
        const linksContainer = document.getElementById('links-container');
        linksContainer.classList.remove('loading');
        linksContainer.innerHTML = linksData.map(createLinkRow).join('');
    }

    // Load projects
    const projectsData = await loadJSON('data/projects.json');
    if (projectsData) {
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.classList.remove('loading');
        projectsContainer.innerHTML = projectsData.projects.map(createProjectCard).join('');
        
        // Initialize scroll buttons after projects are loaded
        document.querySelectorAll('.project-media-container').forEach(container => {
            const scrollArea = container.querySelector('.project-media-scroll');
            const leftBtn = container.querySelector('.scroll-left');
            const rightBtn = container.querySelector('.scroll-right');

            // Update button states
            function updateScrollButtons() {
                leftBtn.disabled = scrollArea.scrollLeft <= 0;
                rightBtn.disabled = scrollArea.scrollLeft + scrollArea.clientWidth >= scrollArea.scrollWidth;
            }

            // Initial button states
            updateScrollButtons();

            // Scroll event listener
            scrollArea.addEventListener('scroll', updateScrollButtons);

            // Button click handlers
            leftBtn.addEventListener('click', () => {
                const itemWidth = scrollArea.querySelector('.project-media-item').offsetWidth;
                scrollArea.scrollBy({
                    left: -itemWidth,
                    behavior: 'smooth'
                });
            });

            rightBtn.addEventListener('click', () => {
                const itemWidth = scrollArea.querySelector('.project-media-item').offsetWidth;
                scrollArea.scrollBy({
                    left: itemWidth,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Load badges as gallery
    await loadBadges();
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Achievement Modal Handling
document.addEventListener('DOMContentLoaded', function() {
    const achievementModal = document.getElementById('achievementModal');
    const modalImage = achievementModal.querySelector('.achievement-full-image');
    const modalTitle = achievementModal.querySelector('.modal-title');
    const modalDescription = achievementModal.querySelector('.achievement-description');

    // Add navigation buttons to modal
    const modalBody = achievementModal.querySelector('.modal-body');
    modalBody.insertAdjacentHTML('beforeend', `
        <button class="scroll-arrow modal-nav modal-prev" aria-label="Previous achievement">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="scroll-arrow modal-nav modal-next" aria-label="Next achievement">
            <i class="fas fa-chevron-right"></i>
        </button>
    `);

    const prevBtn = modalBody.querySelector('.modal-prev');
    const nextBtn = modalBody.querySelector('.modal-next');
    let currentAchievementItem = null;

    function updateModalContent(achievementItem) {
        currentAchievementItem = achievementItem;
        const title = achievementItem.querySelector('h3').textContent;
        const description = achievementItem.querySelector('p').textContent;
        const fullSizeImage = achievementItem.querySelector('.achievement-thumbnail').dataset.fullsize;

        // Remove any existing placeholder
        const existingPlaceholder = modalImage.parentNode.querySelector('.image-placeholder');
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        
        // Reset modal image display
        modalImage.style.display = 'block';
        modalImage.src = fullSizeImage;
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        // Update navigation buttons
        const achievementCol = achievementItem.closest('.achievement-col');
        prevBtn.disabled = !achievementCol.previousElementSibling;
        nextBtn.disabled = !achievementCol.nextElementSibling;
    }

    // Handle thumbnail clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('achievement-thumbnail')) {
            const achievementItem = e.target.closest('.achievement-item');
            updateModalContent(achievementItem);
        }
    });

    // Handle navigation clicks
    prevBtn.addEventListener('click', () => {
        const achievementCol = currentAchievementItem.closest('.achievement-col');
        const prevCol = achievementCol.previousElementSibling;
        if (prevCol) {
            const prevItem = prevCol.querySelector('.achievement-item');
            updateModalContent(prevItem);
            // Scroll the gallery to keep the current item in view
            prevCol.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    nextBtn.addEventListener('click', () => {
        const achievementCol = currentAchievementItem.closest('.achievement-col');
        const nextCol = achievementCol.nextElementSibling;
        if (nextCol) {
            const nextItem = nextCol.querySelector('.achievement-item');
            updateModalContent(nextItem);
            // Scroll the gallery to keep the current item in view
            nextCol.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    // Add keyboard navigation
    achievementModal.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        }
    });

    // Reset modal content when closed
    achievementModal.addEventListener('hidden.bs.modal', function() {
        modalImage.src = '';
        modalTitle.textContent = '';
        modalDescription.textContent = '';
        currentAchievementItem = null;
        
        // Remove any placeholder if exists
        const placeholder = modalImage.parentNode.querySelector('.image-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        // Reset modal image display
        modalImage.style.display = 'block';
    });

    // Handle image loading errors
    modalImage.addEventListener('error', function(e) {
        console.error('Failed to load image:', this.src);
        // Only show placeholder if image actually fails to load
        if (!this.src || this.src === 'null' || this.src === 'undefined') {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-content">
                    <i class="fas fa-image"></i>
                    <p>Image not available</p>
                </div>
            `;
            this.parentNode.insertBefore(placeholder, this);
        }
    });
});

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    /* Hero Section Styles */
    .hero-section {
        position: relative;
        min-height: 100vh;
        padding: 100px 0;
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
    }
    .hero-content {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    .hero-text {
        flex: 1;
    }
    .chinese-name {
        display: block;
        font-size: 0.8em;
        color: #6c757d;
        margin-top: 0.5rem;
        font-weight: normal;
    }
    /* Social Links Styles */
    #social-links, #footer-social-links {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
    }
    #social-links {
        justify-content: center;
        max-width: 300px;
        margin: 0 auto;
    }
    #footer-social-links {
        justify-content: flex-end;
    }
    #social-links a, #footer-social-links a {
        color: #495057;
        font-size: 1.5rem;
        transition: color 0.3s ease, transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
    }
    #social-links a:hover, #footer-social-links a:hover {
        color: #0d6efd;
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.2);
    }
    @media (max-width: 768px) {
        #social-links, #footer-social-links {
            justify-content: center;
            gap: 0.75rem;
        }
        #social-links {
            max-width: 250px;
        }
        #social-links a, #footer-social-links a {
            font-size: 1.25rem;
            width: 35px;
            height: 35px;
        }
        #footer-social-links {
            margin-top: 1rem;
        }
    }
    .profile-photo {
        width: 300px;
        height: 300px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .profile-photo:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    @media (max-width: 768px) {
        .hero-content {
            flex-direction: column-reverse;
            text-align: center;
        }
        .profile-photo {
            width: 200px;
            height: 200px;
            margin-bottom: 1rem;
        }
        .chinese-name {
            margin-top: 0.3rem;
        }
    }

    /* Existing styles... */
    .image-placeholder {
        width: 100%;
        min-height: 300px;
        background-color: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .placeholder-content {
        text-align: center;
        color: #6c757d;
    }
    .placeholder-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    .placeholder-content p {
        margin: 0;
        font-size: 1rem;
    }

    /* Project Media Scrolling Styles */
    .project-media-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        padding: 10px 0;
        display: flex;
        align-items: center;
    }
    .project-media-scroll {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        gap: 15px;
        padding: 5px 15px;
        scroll-behavior: smooth;
        flex: 1;
    }
    .project-media-scroll::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .project-media-item {
        flex: 0 0 auto;
        scroll-snap-align: start;
        background: #f8f9fa;
        padding: 10px 15px;
        border-radius: 8px;
        white-space: nowrap;
        transition: transform 0.3s ease;
    }
    .project-media-item:hover {
        transform: translateY(-2px);
    }
    .media-date {
        color: #6c757d;
        font-size: 0.85em;
        margin-left: 8px;
    }
    .scroll-arrow {
        position: relative;
        z-index: 2;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        color: #495057;
        padding: 0;
        margin: 0 5px;
    }
    .scroll-arrow:hover {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        color: #000;
    }
    .scroll-arrow:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .scroll-arrow i {
        font-size: 0.8rem;
    }

    /* Achievement Gallery Scrolling Styles */
    .achievements-scroll-container {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .achievements-scroll-area {
        flex: 1;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scroll-behavior: smooth;
    }
    .achievements-scroll-area::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    .achievements-row {
        flex-wrap: nowrap;
        margin: 0;
    }
    .achievement-col {
        flex: 0 0 auto;
        scroll-snap-align: start;
    }

    @media (max-width: 768px) {
        .achievements-scroll-container {
            margin: 0 -10px;
        }
        .scroll-arrow {
            width: 28px;
            height: 28px;
        }
    }

    /* Modal Navigation Styles */
    .modal-body {
        position: relative;
    }
    .modal-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1060;
        background: rgba(255, 255, 255, 0.9);
        width: 40px;
        height: 40px;
    }
    .modal-prev {
        left: 10px;
    }
    .modal-next {
        right: 10px;
    }
    @media (max-width: 768px) {
        .modal-nav {
            width: 32px;
            height: 32px;
        }
    }
    .achievement-full-image {
        max-height: 80vh;
        width: auto;
        margin: 0 auto;
    }
`;
document.head.appendChild(style);

// Remove the duplicate scroll functionality initialization
const existingScrollFunctionality = document.querySelector('script[data-scroll-functionality]');
if (existingScrollFunctionality) {
    existingScrollFunctionality.remove();
} 