import "@testing-library/jest-dom";
import { vi } from "vitest";

// мінімальний мок для app router
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
		back: vi.fn(),
	}),
	// якщо будеш десь викликати ці штуки — підкинь і їх
	redirect: () => {},
	notFound: () => {},
}));
