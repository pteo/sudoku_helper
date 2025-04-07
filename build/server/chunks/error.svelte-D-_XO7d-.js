import { p as push, F as escape_html, n as pop } from './exports-05ThlI1p.js';
import { p as page } from './index2-C7flnoDJ.js';

function Error($$payload, $$props) {
  push();
  $$payload.out += `<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`;
  pop();
}

export { Error as default };
//# sourceMappingURL=error.svelte-D-_XO7d-.js.map
