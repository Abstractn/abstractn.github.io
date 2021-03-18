const ROUTE_MUSIC = '#music';

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
            switch( true ) {
                case link.getAttribute('href') === '':
                break;
                case link.getAttribute('href').charAt(0) == '#':
                    window.location.hash = link.getAttribute('href');
                break;
                default:
                    if( link.hasAttribute('link-newtab') ) {
                        window.open(link.getAttribute('href'), '_blank');
                    } else {
                        window.location = link.getAttribute('href');
                    }
                break;
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

function urlManager() {
    const URL = window.location;
    switch( URL.hash ) {
        case ROUTE_MUSIC:
            musicNode.click();
        break;
    }
}

function init() {
    customIcons();
    customLinksEvent();
    musicToggle();
    urlManager();
}

init();