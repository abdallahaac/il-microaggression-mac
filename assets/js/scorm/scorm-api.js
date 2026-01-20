export const scormApi = {
	handle: null,
	find(win) {
		if (!win) return null;
		if (win.API) return win.API;
		if (win.parent && win.parent !== win) return this.find(win.parent);
		if (win.opener && typeof win.opener !== "undefined") {
			return this.find(win.opener);
		}
		return null;
	},
	init() {
		try {
			const api = this.find(window);
			if (api && typeof api.LMSInitialize === "function") {
				this.handle = api;
				return api.LMSInitialize("");
			}
		} catch (error) {
			this.handle = null;
		}
		return false;
	},
	get(param) {
		try {
			if (this.handle && typeof this.handle.LMSGetValue === "function") {
				return this.handle.LMSGetValue(param);
			}
		} catch (error) {
			return null;
		}
		return null;
	},
	set(param, value) {
		try {
			if (this.handle && typeof this.handle.LMSSetValue === "function") {
				return this.handle.LMSSetValue(param, value);
			}
		} catch (error) {
			return false;
		}
		return false;
	},
	save() {
		try {
			if (this.handle && typeof this.handle.LMSCommit === "function") {
				return this.handle.LMSCommit("");
			}
		} catch (error) {
			return false;
		}
		return false;
	},
	quit() {
		try {
			if (this.handle && typeof this.handle.LMSFinish === "function") {
				return this.handle.LMSFinish("");
			}
		} catch (error) {
			return false;
		}
		return false;
	},
};
