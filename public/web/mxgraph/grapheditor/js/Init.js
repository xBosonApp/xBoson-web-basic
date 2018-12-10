// urlParams is null when used for embedding
window.urlParams = window.urlParams || {};
org = urlParams.org || 'a297dfacd7a84eab9656675f61750078';

// Public global variables
window.MAX_REQUEST_SIZE = window.MAX_REQUEST_SIZE  || 10485760;
window.MAX_AREA = window.MAX_AREA || 15000 * 15000;

// URLs for save and export
window.SAVE_URL = window.SAVE_URL || '/xboson/app/'+ org +'/a510370fd076433dbe8eb33a885f0199/basic/save?id='+ urlParams.id;
window.OPEN_URL = window.OPEN_URL || '/xboson/app/'+ org +'/a510370fd076433dbe8eb33a885f0199/basic/load?id='+ urlParams.id;
window.EXPORT_URL = window.EXPORT_URL || '/xboson/face/masquerade/tag/chip/flow_diagram.htm?fileid='+ urlParams.id +"&org="+ org;
window.RESOURCES_PATH = window.RESOURCES_PATH || 'resources';
window.RESOURCE_BASE = window.RESOURCE_BASE || window.RESOURCES_PATH + '/grapheditor';
window.STENCIL_PATH = window.STENCIL_PATH || 'stencils';
window.IMAGE_PATH = window.IMAGE_PATH || 'images';
window.STYLE_PATH = window.STYLE_PATH || 'styles';
window.CSS_PATH = window.CSS_PATH || 'styles';
window.OPEN_FORM = window.OPEN_FORM || 'open.html';

// Sets the base path, the UI language via URL param and configures the
// supported languages to avoid 404s. The loading of all core language
// resources is disabled as all required resources are in grapheditor.
// properties. Note that in this example the loading of two resource
// files (the special bundle and the default bundle) is disabled to
// save a GET request. This requires that all resources be present in
// each properties file since only one file is loaded.
window.mxBasePath = window.mxBasePath || '../../../web/mxgraph';
window.mxLanguage = window.mxLanguage || urlParams['lang'] || 'zh-CN';
window.mxLanguages = window.mxLanguages || ['zh-CN', 'de'];