const linkTreeView = document.querySelector('#menu-main');
const musicView = document.querySelector('#menu-music');
const musicNode = document.querySelector('#linktree-music');
const iconNodes = document.querySelectorAll('i.custom-icon');
const customLinksNodes = document.querySelectorAll('[link]');

// #########################################################################################################################

function customIcons() {    
    iconNodes?.forEach(iconNode => {
        iconNode.style.backgroundImage = `url(${iconNode.getAttribute('src')})`;
    });
}

function customLinksEvent() {
    customLinksNodes.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if( link.hasAttribute('link-newtab') ) {
                window.open(link.getAttribute('href'), '_blank');
            } else {
                window.open(link.getAttribute('href'));
            }
        });
    });
}

function resetAllAnimations(targetNode) {
    targetNode.classList.remove('fade-in-right');
    targetNode.classList.remove('fade-in-left');
    targetNode.classList.remove('fade-out-right');
    targetNode.classList.remove('fade-out-left');
}

function musicToggle() {
    musicNode.addEventListener('click', function () {
        resetAllAnimations(linkTreeView);
        resetAllAnimations(musicView);
        linkTreeView.classList.add('fade-out-left');
        linkTreeView.classList.add('disabled');
        musicView.classList.add('fade-in-right');
        musicView.classList.remove('hidden');
        musicView.classList.remove('disabled');
    });
    const musicToHome = document.querySelector('.music-to-home');
    musicToHome.addEventListener('click', function () {
        resetAllAnimations(linkTreeView);
        resetAllAnimations(musicView);
        linkTreeView.classList.add('fade-in-left');
        musicView.classList.add('fade-out-right');
        linkTreeView.classList.remove('disabled');
        musicView.classList.add('disabled');
    });
}

function init() {
    customIcons();
    customLinksEvent();
    musicToggle();
}

init();