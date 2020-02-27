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
        iconClosed:'+',
        iconType:'text', // text, class
        containerSelector:'abs-accordion-container',
        headerSelector:'abs-accordion-header',
        contentSelector:'abs-accordion-content',
        iconSelector:'abs-accordion-icon',
        hidingClass:'hidden',
        eventTrigger:'header', // header, icon
        eventType:'click', // click. dbclick

        init: function()
        {
            const _notSetErrStr = 'param is not set or incorrectly set';
            let accordions = document.querySelectorAll('.'+abs.accordion.containerSelector);
            accordions.forEach(accordion => {
                const header = accordion.querySelector('.'+abs.accordion.headerSelector);
                const content = accordion.querySelector('.'+abs.accordion.contentSelector);
                const icon = accordion.querySelector('.'+abs.accordion.iconSelector)
                
                let eventTrigger;
                switch( abs.accordion.eventTrigger )
                {
                    case 'header': eventTrigger = header;
                    break;

                    case 'icon': eventTrigger = icon;
                    break;

                    default: eventTrigger = header; console.error("abs.accordion.eventTrigger "+_notSetErrStr);
                }
                
                eventTrigger.addEventListener(abs.accordion.eventType, () => {
                    const icon = header.querySelector('.'+abs.accordion.iconSelector);
                    if( content.classList.contains(abs.accordion.hidingClass) )
                    {
                        switch( abs.accordion.iconType )
                        {
                            case 'class': icon.classList.replace( abs.accordion.iconClosed, abs.accordion.iconOpen );
                            break;
                            
                            case 'text': icon.innerHTML = abs.accordion.iconOpen;
                            break;

                            default: console.error("abs.accordion.iconType "+_notSetErrStr);
                        }
                    }
                    else
                    {
                        switch( abs.accordion.iconType )
                        {
                            case 'class': icon.classList.replace( abs.accordion.iconOpen, abs.accordion.iconClosed );
                            break;

                            case 'text': icon.innerHTML = abs.accordion.iconClosed;
                            break;

                            default: console.error("abs.accordion.iconType "+_notSetErrStr);
                        }
                    }
                    content.classList.toggle(abs.accordion.hidingClass);
                });
            });
            return accordions;
        }
    }
}

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