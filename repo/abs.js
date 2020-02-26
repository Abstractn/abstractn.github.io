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