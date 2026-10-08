import { describe, expect, it, vi, afterEach } from "vitest";
import { getPrompts } from "./services/api";

afterEach(() => vi.restoreAllMocks());

describe("Problem Statement 1 data explorer", () => {
  it("sends search, filters, sort and pagination to the API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], total: 0, page: 2, pageSize: 25, totalPages: 0 }) }));
    await getPrompts({ search: "geo", platform: "ChatGPT", status: "Mentioned", sort: "mentions_asc", page: 2, pageSize: 25 });
    const url = String((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(url).toContain("search=geo");
    expect(url).toContain("platform=ChatGPT");
    expect(url).toContain("status=Mentioned");
    expect(url).toContain("sort=mentions_asc");
    expect(url).toContain("page=2");
  });

  it("passes AbortSignal through so superseded requests can be cancelled", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [], total: 0, page: 1, pageSize: 25, totalPages: 1 }) }));
    const controller = new AbortController();
    await getPrompts({ search: "first" }, controller.signal);
    expect((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].signal).toBe(controller.signal);
  });

  it("turns failed API responses into a user-facing error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ error: "Mock API failure" }) }));
    await expect(getPrompts()).rejects.toThrow("Mock API failure");
  });
});
