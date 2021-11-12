const ROUTE_MUSIC = '#music';
const DISABLED_CLASS = 'disabled';
const HIDDEN_CLASS = 'hidden';
const FADE_IN_RIGHT_CLASS  = 'fade-in-right';
const FADE_IN_LEFT_CLASS   = 'fade-in-left';
const FADE_OUT_RIGHT_CLASS = 'fade-out-right';
const FADE_OUT_LEFT_CLASS  = 'fade-out-left';
const KEY_ENTER = 'Enter';

const linkTreeView = document.querySelector('#menu-main');
const mainMenuItems = document.querySelectorAll('.menu-main-item');
const musicMenuItems = document.querySelectorAll('.menu-music-item');
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
        link.addEventListener('click', function (event) {
            event.preventDefault();
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
        link.addEventListener('keydown', (event) => {
            if( event.key === KEY_ENTER ) {
                event.preventDefault();
                link.click();
            }
        });
    });
}

function resetAllAnimations(targetNode) {
    targetNode.classList.remove(FADE_IN_RIGHT_CLASS);
    targetNode.classList.remove(FADE_IN_LEFT_CLASS);
    targetNode.classList.remove(FADE_OUT_RIGHT_CLASS);
    targetNode.classList.remove(FADE_OUT_LEFT_CLASS);
}

function musicToggle() {
    musicNode.addEventListener('click', function () {
        resetAllAnimations(linkTreeView);
        resetAllAnimations(musicView);
        linkTreeView.classList.add(FADE_OUT_LEFT_CLASS);
        linkTreeView.classList.add(DISABLED_CLASS);
        musicView.classList.add(FADE_IN_RIGHT_CLASS);
        musicView.classList.remove(HIDDEN_CLASS);
        musicView.classList.remove(DISABLED_CLASS);
        mainMenuItems.forEach(item => {
            item.setAttribute('tabindex', '-1');
        });
        musicMenuItems.forEach(item => {
            item.setAttribute('tabindex', '1');
        });
    });
    const musicToHome = document.querySelector('.music-to-home');
    musicToHome.addEventListener('click', function () {
        resetAllAnimations(linkTreeView);
        resetAllAnimations(musicView);
        linkTreeView.classList.add(FADE_IN_LEFT_CLASS);
        musicView.classList.add(FADE_OUT_RIGHT_CLASS);
        linkTreeView.classList.remove(DISABLED_CLASS);
        musicView.classList.add(DISABLED_CLASS);
        musicMenuItems.forEach(item => {
            item.setAttribute('tabindex', '-1');
        });
        mainMenuItems.forEach(item => {
            item.setAttribute('tabindex', '1');
        });
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
} init();
