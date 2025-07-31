async function loadJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

function getLocalizedText(textObj) {
    if (typeof textObj === 'string') {
        return textObj;
    }
    if (typeof textObj === 'object' && textObj !== null) {
        return textObj[currentLang] || textObj['en'] || textObj['zh'] || '';
    }
    return '';
}

function createTalkRow(talk) {
    const title = getLocalizedText(talk.title);
    const event = getLocalizedText(talk.event);
    
    return `
        <tr>
            <td>
                ${talk.slides ? 
                    `<a href="${talk.slides}" target="_blank" class="btn btn-default">${title}</a>` :
                    title
                }
            </td>
            <td>${event}</td>
            <td>${talk.date}</td>
            <td>
                ${talk.links ? talk.links.map(link => 
                    `<a href="${link.url}" target="_blank" class="btn btn-primary">${getLocalizedText(link.title)}</a>`
                ).join(' ') : ''}
            </td>
        </tr>
    `;
}

function createProjectCard(project) {
    const title = getLocalizedText(project.title);
    const description = getLocalizedText(project.description);
    
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
                    <img src="${project.image}" class="img-fluid" alt="${title}" onerror="console.error('Failed to load project image:', '${project.image}', 'for project:', '${title}'); this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100%25\\' height=\\'200\\' viewBox=\\'0 0 300 200\\'%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' fill=\\'%23f8f9fa\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%236c757d\\'%3ENo Image%3C/text%3E%3C/svg%3E';"
                    <a href="${project.url}" target="_blank">
                        <div class="mask rgba-white-slight"></div>
                    </a>
                </div>
                <div class="card-body">
                    <div class="text-center mb-3">
                        <h4 class="card-title mb-2">
                            <a href="${project.url}" target="_blank" class="text-decoration-none">
                                <strong>${title}</strong>
                            </a>
                        </h4>
                        ${project.sourceCode ? `
                            <a type="button" class="btn-floating btn-small btn-tw" 
                               href="${project.sourceCode}" target="_blank" title="View Source Code">
                                <i class="fa-brands fa-github"></i>
                            </a>
                        ` : ''}
                    </div>
                    ${description ? `
                        <div class="project-description">
                            <div class="d-flex align-items-start mb-2">
                                <i class="fas fa-info-circle text-primary me-2 mt-1"></i>
                                <p class="card-text mb-0 text-start">${description}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${mediaList ? `
                        <div class="project-media-section mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <i class="fas fa-newspaper text-success me-2"></i>
                                <small class="text-muted"><strong>${currentLang === 'zh' ? '媒體報導' : 'Media Coverage'}</strong></small>
                            </div>
                            ${mediaList}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function createLinkRow(link) {
    const title = getLocalizedText(link.title);
    return `
        <tr>
            <td><a href="${link.url}" target="_blank">${title}</a></td>
            <td>${link.date}</td>
        </tr>
    `;
}

function createExperienceItem(experience) {
    const position = getLocalizedText(experience.position);
    const company = getLocalizedText(experience.company);
    const description = getLocalizedText(experience.description);
    const location = getLocalizedText(experience.location);
    
    return `
        <div class="timeline-item">
            <div class="timeline-date">${experience.dateRange}</div>
            <div class="timeline-content">
                <h4>${position}</h4>
                <h5>${company}</h5>
                <p class="description">${description}</p>
                <p class="location">${location}</p>
            </div>
        </div>
    `;
}

// Load badges
async function loadBadges() {
    const badgesData = await loadJSON('data/badges.json');
    if (badgesData) {
        const badgesContainer = document.getElementById('badges-container');
        badgesContainer.classList.remove('loading');
        
        // Log badges with missing image paths
        badgesData.badges.forEach((badge, index) => {
            if (!badge.image) {
                console.log(`Badge ${index + 1} has no image path:`, badge);
            }
        });
        
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
                        ${sortedBadges.map((badge, index) => {
                            const thumbnailPath = badge.thumbnail || badge.image || '';
                            const fullImagePath = badge.image || '';
                            
                            // Debug: log badges with missing images
                            if (!badge.image || badge.image.trim() === '') {
                                console.warn(`Badge ${index} missing image:`, badge);
                            }
                            
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
                                                 onerror="console.error('Failed to load badge thumbnail:', '${thumbnailPath}', 'full image:', '${fullImagePath}', 'badge index:', ${index}); this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 300 300\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23f8f9fa\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'14\' fill=\'%236c757d\'%3ENo Image%3C/text%3E%3C/svg%3E';">
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

async function loadMediaCoverage() {
    const projectsData = await loadJSON('data/projects.json');
    if (projectsData) {
        const mediaContainer = document.getElementById('media-container');
        mediaContainer.classList.remove('loading');
        
        // Collect all media items from all projects
        const allMedia = [];
        projectsData.projects.forEach(project => {
            if (project.media && project.media.length > 0) {
                project.media.forEach(item => {
                    allMedia.push({
                        ...item,
                        projectTitle: getLocalizedText(project.title),
                        projectUrl: project.url
                    });
                });
            }
        });
        
        // Sort by date in descending order
        allMedia.sort((a, b) => {
            const dateA = parseInt(a.date || '0');
            const dateB = parseInt(b.date || '0');
            return dateB - dateA;
        });
        
        // Format date for display
        function formatDate(dateStr) {
            if (!dateStr) return '';
            // Convert YYYYMMDD to YYYY-MM-DD
            if (dateStr.length === 8) {
                return `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(6, 2)}`;
            }
            return dateStr;
        }
        
        // Create table rows
        mediaContainer.innerHTML = allMedia.map(item => `
            <tr>
                <td>${formatDate(item.date)}</td>
                <td><a href="${item.url}" target="_blank">${item.title}</a></td>
                <td><a href="${item.projectUrl}" target="_blank">${item.projectTitle}</a></td>
            </tr>
        `).join('');
    }
}

async function initializePage() {
    // Load experience
    const experienceData = await loadJSON('data/experience.json');
    if (experienceData) {
        const experienceContainer = document.getElementById('experience-container');
        if (experienceContainer) {
            experienceContainer.classList.remove('loading');
            experienceContainer.innerHTML = experienceData.experiences.map(createExperienceItem).join('');
        }
    }

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
        
        // Log only projects with no image path
        projectsData.projects.forEach((project, index) => {
            if (!project.image) {
                console.log(`Project ${index + 1} has no image path:`, project.title);
            }
        });
        
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
    
    // Load media coverage
    await loadMediaCoverage();
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
        
        console.log('updateModalContent called with:', {
            title: title,
            description: description,
            fullSizeImage: fullSizeImage,
            thumbnailSrc: achievementItem.querySelector('.achievement-thumbnail').src
        });

        // Remove any existing placeholder
        const existingPlaceholder = modalImage.parentNode.querySelector('.image-placeholder');
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        
        // Reset modal image display
        modalImage.style.display = 'block';
        console.log('Loading modal image:', fullSizeImage, 'for title:', title);
        
        // Only set image source if we have a valid path
        if (fullSizeImage && fullSizeImage.trim() !== '') {
            modalImage.src = fullSizeImage;
        } else {
            console.warn('No valid image path for modal, using placeholder');
            modalImage.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'300\' viewBox=\'0 0 400 300\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23f8f9fa\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'16\' fill=\'%236c757d\'%3ENo Image Available%3C/text%3E%3C/svg%3E';
        }
        
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
            const fullSizeData = e.target.dataset.fullsize;
            console.log('Clicked achievement thumbnail with data-fullsize:', fullSizeData);
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
        // Clear image src properly to prevent error
        modalImage.removeAttribute('src');
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
        // Skip logging if the error is from base URL (empty src issue)
        if (this.src && this.src.endsWith('kiang.github.io/') && !this.src.includes('badge/')) {
            console.warn('Skipping error for base URL (empty src):', this.src);
            return;
        }
        
        console.error('Failed to load modal image:', this.src);
        console.error('Modal image error details:', {
            src: this.src,
            alt: this.alt,
            naturalWidth: this.naturalWidth,
            naturalHeight: this.naturalHeight,
            complete: this.complete
        });
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

// Language Toggle Functionality
const translations = {
    en: {
        // Navigation
        'nav-about': 'About',
        'nav-experience': 'Experience',
        'nav-skills': 'Skills',
        'nav-education': 'Education',
        'nav-projects': 'Projects',
        'nav-media': 'Media',
        'nav-talks': 'Talks',
        'nav-achievements': 'Achievements',
        'lang-toggle': '中文',
        
        // Hero Section
        'hero-subtitle': 'Developer • Speaker • Open Source Contributor',
        'hero-motto': 'somebody as a nobody, nobody as a somebody',
        
        // About Section
        'section-about': 'About',
        'about-description': 'Experienced developer, speaker, and open source contributor with expertise in web development, cybersecurity, and application architecture. Based in Tainan City, Taiwan, with a passion for technology and community engagement.',
        
        // Experience Section
        'section-experience': 'Professional Experience',
        
        // Skills Section
        'section-skills': 'Top Skills',
        
        // Education Section
        'section-education': 'Education',
        
        // Languages Section
        'section-languages': 'Languages',
        
        // Projects Section
        'section-projects': 'Featured Projects',
        
        // Media Coverage Section
        'section-media': 'Media Coverage',
        'table-project': 'Project',
        
        // Talks Section
        'section-talks': 'Recent Talks',
        'table-title': 'Title (Slides)',
        'table-event': 'Event',
        'table-date': 'Date',
        'table-links': 'Links',
        
        // Links Section
        'section-links': 'Featured Links',
        
        // Achievements Section
        'section-achievements': 'Achievements',
        
        // Footer
        'footer-copyright': '© 2024 Finjon Kiang. All rights reserved.'
    },
    zh: {
        // Navigation
        'nav-about': '關於',
        'nav-experience': '經歷',
        'nav-skills': '技能',
        'nav-education': '學歷',
        'nav-projects': '專案',
        'nav-media': '媒體報導',
        'nav-talks': '演講',
        'nav-achievements': '成就',
        'lang-toggle': 'English',
        
        // Hero Section
        'hero-subtitle': '開發者 • 講師 • 開源貢獻者',
        'hero-motto': '有人當無人，無人當有人',
        
        // About Section
        'section-about': '關於我',
        'about-description': '經驗豐富的開發者、講師和開源貢獻者，專精於網頁開發、資訊安全和應用架構。居住於台灣台南市，對技術和社群參與充滿熱忱。',
        
        // Experience Section
        'section-experience': '專業經歷',
        
        // Skills Section
        'section-skills': '核心技能',
        
        // Education Section
        'section-education': '學歷',
        
        // Languages Section
        'section-languages': '語言能力',
        
        // Projects Section
        'section-projects': '精選專案',
        
        // Media Coverage Section
        'section-media': '媒體報導',
        'table-project': '專案',
        
        // Talks Section
        'section-talks': '近期演講',
        'table-title': '標題（投影片）',
        'table-event': '活動',
        'table-date': '日期',
        'table-links': '連結',
        
        // Links Section
        'section-links': '精選連結',
        
        // Achievements Section
        'section-achievements': '成就',
        
        // Footer
        'footer-copyright': '© 2024 江明宗。版權所有。'
    }
};

let currentLang = 'en';

function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-translate attributes
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
    
    // Reload dynamic content with new language
    reloadDynamicContent();
}

async function reloadDynamicContent() {
    // Reload experience
    const experienceData = await loadJSON('data/experience.json');
    if (experienceData) {
        const experienceContainer = document.getElementById('experience-container');
        if (experienceContainer) {
            experienceContainer.innerHTML = experienceData.experiences.map(createExperienceItem).join('');
        }
    }

    // Reload talks
    const talksData = await loadJSON('data/talks.json');
    if (talksData) {
        const talksContainer = document.getElementById('talks-container');
        if (talksContainer) {
            talksContainer.innerHTML = talksData.talks.map(createTalkRow).join('');
        }
    }

    // Reload links
    const linksData = await loadJSON('data/links.json');
    if (linksData) {
        const linksContainer = document.getElementById('links-container');
        if (linksContainer) {
            linksContainer.innerHTML = linksData.map(createLinkRow).join('');
        }
    }

    // Reload projects
    const projectsData = await loadJSON('data/projects.json');
    if (projectsData) {
        const projectsContainer = document.getElementById('projects-container');
        if (projectsContainer) {
            projectsContainer.innerHTML = projectsData.projects.map(createProjectCard).join('');
            
            // Reinitialize scroll buttons after projects are reloaded
            document.querySelectorAll('.project-media-container').forEach(container => {
                const scrollArea = container.querySelector('.project-media-scroll');
                const leftBtn = container.querySelector('.scroll-left');
                const rightBtn = container.querySelector('.scroll-right');

                function updateScrollButtons() {
                    leftBtn.disabled = scrollArea.scrollLeft <= 0;
                    rightBtn.disabled = scrollArea.scrollLeft + scrollArea.clientWidth >= scrollArea.scrollWidth;
                }

                updateScrollButtons();
                scrollArea.addEventListener('scroll', updateScrollButtons);

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
    }
}

// Initialize language toggle
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    
    // Set up language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            const newLang = currentLang === 'en' ? 'zh' : 'en';
            updateLanguage(newLang);
        });
    }
    
    // Apply saved language
    updateLanguage(savedLang);
});

// Remove the duplicate scroll functionality initialization
const existingScrollFunctionality = document.querySelector('script[data-scroll-functionality]');
if (existingScrollFunctionality) {
    existingScrollFunctionality.remove();
}

// Menu collapse functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Close menu when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close menu if it's currently open (on mobile)
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // Close menu when clicking on language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', function() {
            // Only close menu if it's currently open (on mobile)
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
}); 