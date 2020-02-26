// ################################################################################
// ### --- UTIL FUNCTIONS --- #####################################################
// ################################################################################

function log(elem)
{
    if(typeof _F_DEBUG == "undefined")
    { console.error("Please define 'const _F_DEBUG:boolean'"); }
    else if(_F_DEBUG)
    { console.log(elem); }
}

// ################################################################################
// ### --- ACCORDION --- ##########################################################
// ################################################################################

var abs =
{
    accordion:
    {
        iconOpen:'-',
            setIconOpen: function(input) { abs.accordion.iconOpen = input || console.error("abs.accordion.iconOpen cannot be empty"); },
            getIconOpen: function()      { return abs.accordion.iconOpen; },
        
        iconClosed:'+',
            setIconClosed: function(input) { abs.accordion.iconClosed = input || console.error("abs.accordion.iconClosed cannot be empty"); },
            getIconClosed: function()      { return abs.accordion.iconClosed; },

        iconType:'text', // text, class
            setIconType: function(input) { abs.accordion.iconType = input || console.error("abs.accordion.iconType cannot be empty"); },
            getIconType: function()      { return abs.accordion.iconType; },

        containerSelector:'abs-accordion-container',
            setContainerSelector: function (input) { abs.accordion.containerSelector = input || console.error("abs.accordion.containerSelector cannot be empty"); },
            getContainerSelector: function ()      { return abs.accordion.containerSelector; },

        headerSelector:'abs-accordion-header',
            setHeaderSelector: function (input) { abs.accordion.headerSelector = input || console.error("abs.accordion.headerSelector cannot be empty"); },
            getHeaderSelector: function ()      { return abs.accordion.headerSelector; },

        contentSelector:'abs-accordion-content',
            setContentSelector: function (input) { abs.accordion.contentSelector = input || console.error("abs.accordion.contentSelector cannot be empty"); },
            getContentSelector: function ()      { return abs.accordion.contentSelector; },

        iconSelector:'abs-accordion-icon',
            setIconSelector: function (input) { abs.accordion.iconSelector = input || console.error("abs.accordion.iconSelector cannot be empty"); },
            getIconSelector: function ()      { return abs.accordion.iconSelector; },

        hidingClass:'hidden',
            setHidingClass: function (input) { abs.accordion.hidingClass = input || console.error("abs.accordion.hidingClass cannot be empty"); },
            getHidingClass: function ()      { return abs.accordion.hidingClass; },
        
        init: function()
        {
            let accordions = document.querySelectorAll("."+abs.accordion.containerSelector);
            accordions.forEach(accordion => {
                const header = accordion.querySelector('.'+abs.accordion.headerSelector);
                const content = accordion.querySelector('.'+abs.accordion.contentSelector);
                header.addEventListener("click", () => {
                    const icon = header.querySelector('.'+abs.accordion.iconSelector);
                    if( content.classList.contains(abs.accordion.hidingClass) )
                    {
                        switch( abs.accordion.iconType )
                        {
                            case 'class': icon.classList.replace( abs.accordion.iconClosed, abs.accordion.iconOpen );
                            break;
                            
                            case 'text': icon.innerHTML = ab.accordion.iconOpen;
                            break;

                            default: console.error("abs.accordion.iconType param is not set");
                        }
                    }
                    else
                    {
                        switch( abs.accordion.iconType )
                        {
                            case 'class': icon.classList.replace( abs.accordion.iconOpen, abs.accordion.iconClosed );
                            break;

                            case 'text': icon.innerHTML = ab.accordion.iconClosed;
                            break;

                            default: console.error("abs.accordion.iconType param is not set");
                        }
                    }
                    content.classList.toggle(abs.accordion.hidingClass);
                });
            });
            return accordions;
        }
    }
}

let accordions = document.querySelectorAll(".abs-accordion-container");
accordions.forEach(accordion => {
    const header = accordion.querySelector('.abs-accordion-header');
    const content = accordion.querySelector('.abs-accordion-content');
    header.addEventListener("click", () => {
        const icon = header.querySelector('.abs-accordion-icon');
        if( content.classList.contains("hidden") )
        {
            icon.classList.remove(accordionIconClosed);
            icon.classList.add(accordionIconOpen);
        }
        else
        {
            icon.classList.remove(accordionIconOpen);
            icon.classList.add(accordionIconClosed);
        }
        content.classList.toggle("hidden");
    });
});

/*
    <!-- --- BASE HTML STRUCTURE FOR ACCORDIONS --- -->
<div class="abs-accordion-container">
    <div class="abs-accordion-header">
        ...
        <i class="abs-accordion-icon ..."></i>
    </div>
    <div class="abs-accordion-content hidden">
        ...
    </div>
</div>

*/