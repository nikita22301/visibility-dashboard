import type { Dashboard, Platform, Prompt } from "../types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type PromptQuery = {
  search?: string;
  platform?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export type PromptResponse = {
  items: Prompt[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  latencyMs?: number;
};

export async function getDashboard(): Promise<Dashboard> {
  await wait(450);

  return {
    visibility: 78,
    visibilityDelta: 12.4,
    mentions: 1248,
    mentionsDelta: 18.7,
    citations: 683,
    citationsDelta: 9.2,
    prompts: 12000,
    promptsDelta: 6.1,

    chart: Array.from({ length: 14 }, (_, i) => ({
      date: `Oct ${i + 1}`,
      score: 62 + i + (i % 4) * 2,
      mentions: 55 + i * 8,
    })),

    platforms: [
      {
        name: "ChatGPT",
        score: 84,
        mentions: 412,
        color: "",
      },
      {
        name: "Perplexity",
        score: 79,
        mentions: 336,
        color: "",
      },
      {
        name: "Gemini",
        score: 72,
        mentions: 287,
        color: "",
      },
      {
        name: "Copilot",
        score: 68,
        mentions: 213,
        color: "",
      },
    ],
  };
}

/**
 * Local mock data is used only when running the app in Vite development mode.
 *
 * Vitest runs with MODE === "test", so automated tests use the real fetch()
 * path. This allows us to test:
 * - query parameters
 * - AbortSignal
 * - API failures
 */
const useLocalMock =
  import.meta.env.DEV && import.meta.env.MODE !== "test";

export async function getPrompts(
  query: PromptQuery = {},
  signal?: AbortSignal
): Promise<PromptResponse> {
  if (useLocalMock) {
    const { localPrompts } = await import("./localMockApi");

    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    return localPrompts(query);
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== "" &&
      value !== "All"
    ) {
      params.set(key, String(value));
    }
  });

  const response = await fetch(
    `/api/prompts?${params.toString()}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.error || "The request failed. Please try again."
    );
  }

  return response.json();
}

export async function trackPrompt(
  text: string,
  platform: Platform
): Promise<Prompt> {
  await wait(500);

  return {
    id: Date.now(),
    text,
    platform,
    status: "Monitoring",
    position: null,
    mentions: 0,
    lastChecked: "just now",
  };
}

export async function deletePrompt(_id: number) {
  await wait(350);
}

export async function getPromptById(
  id: number,
  signal?: AbortSignal
): Promise<Prompt> {
  if (useLocalMock) {
    const { localPrompt } = await import("./localMockApi");

    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    return localPrompt(id);
  }

  const response = await fetch(
    `/api/prompts?id=${id}`,
    {
      signal,
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.error || "The request failed. Please try again."
    );
  }

  const data = await response.json();

  return data.item;
}