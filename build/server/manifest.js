const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.DQI--NX7.js",app:"_app/immutable/entry/app.P5efO4kk.js",imports:["_app/immutable/entry/start.DQI--NX7.js","_app/immutable/chunks/BAcUUudc.js","_app/immutable/chunks/XKlFPWCa.js","_app/immutable/chunks/DWb8MTu3.js","_app/immutable/entry/app.P5efO4kk.js","_app/immutable/chunks/XKlFPWCa.js","_app/immutable/chunks/CGCOxSlq.js","_app/immutable/chunks/B9QI8j-U.js","_app/immutable/chunks/1HDVubvE.js","_app/immutable/chunks/hzirVfAw.js","_app/immutable/chunks/BD4inijO.js","_app/immutable/chunks/DWb8MTu3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-VQqUTh3C.js')),
			__memo(() => import('./chunks/1-ctrSjPbS.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/","/about"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set(["/","/about"]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
