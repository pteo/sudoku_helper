import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.CTflpcYM.js","_app/immutable/chunks/hzirVfAw.js","_app/immutable/chunks/XKlFPWCa.js","_app/immutable/chunks/De_iWBOB.js","_app/immutable/chunks/CGCOxSlq.js","_app/immutable/chunks/B9QI8j-U.js","_app/immutable/chunks/1HDVubvE.js","_app/immutable/chunks/BD4inijO.js","_app/immutable/chunks/M3z0DU39.js","_app/immutable/chunks/Dwm1MJbq.js"];
export const stylesheets = [];
export const fonts = [];
