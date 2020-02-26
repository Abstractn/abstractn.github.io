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

let accordionIconOpen = '';
let accordionIconClose = '';
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