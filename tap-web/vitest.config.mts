import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true, // <-- додаємо це
		setupFiles: ["./vitest.setup.ts"],
	},
});
