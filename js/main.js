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
            <div class="text-left">
                <ul>
                    ${project.media.map(item => `
                        <li>
                            <a href="${item.url}" target="_blank">${item.title}</a>
                            ${item.date ? ` - ${item.date}` : ''}
                        </li>
                    `).join('')}
                </ul>
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
                                <i class="fa fa-github"></i>
                            </a>
                        ` : ''}
                    </h4>
                    ${mediaList}
                </div>
            </div>
        </div>
    `;
}

function createBadgeCard(badge) {
    return `
        <div class="card card-cascade">
            <div class="view overlay">
                <img src="${badge.image}" class="img-fluid" alt="${badge.title || 'Achievement Badge'}" 
                     title="${badge.date}${badge.title ? ' - ' + badge.title : ''}">
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
    }

    // Load badges
    const badgesData = await loadJSON('data/badges.json');
    if (badgesData) {
        const badgesContainer = document.getElementById('badges-container');
        badgesContainer.classList.remove('loading');
        
        // Sort badges by date in descending order
        const sortedBadges = badgesData.badges.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Group badges into sets of 4 for card-deck
        const badgeDecks = [];
        for (let i = 0; i < sortedBadges.length; i += 4) {
            const deck = sortedBadges.slice(i, i + 4);
            badgeDecks.push(`
                <div class="card-deck">
                    ${deck.map(createBadgeCard).join('')}
                    ${deck.length < 4 ? '<div class="card card-cascade"><div class="view overlay">&nbsp;</div></div>'.repeat(4 - deck.length) : ''}
                </div>
            `);
        }
        badgesContainer.innerHTML = badgeDecks.join('');
    }

    // Load social links
    const socialData = await loadJSON('data/social.json');
    if (socialData) {
        const socialContainer = document.getElementById('social-links');
        socialContainer.innerHTML = socialData.links.map(createSocialLink).join('');
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 