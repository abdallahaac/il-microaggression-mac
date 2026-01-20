const { defineConfig } = require("vite");

module.exports = defineConfig({
	optimizeDeps: {
		noDiscovery: true,
	},
	server: {
		open: true,
	},
});
