import * as universal from '../entries/pages/about/_page.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/about/+page.js";
export const imports = ["_app/immutable/nodes/3.BvCE9lfC.js","_app/immutable/chunks/XKlFPWCa.js","_app/immutable/chunks/hzirVfAw.js","_app/immutable/chunks/De_iWBOB.js","_app/immutable/chunks/1HDVubvE.js"];
export const stylesheets = [];
export const fonts = [];
