'use cache';

import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "../supabase/server";
import type { PortfolioEntry } from "./types";

export const PORTFOLIO_CONTENT_TAG = "portfolio_content";

/**
 * Returns every entry that is currently published in the `portfolio_content`
 * table, ordered for display.
 *
 * Cached with a tag so admin mutations can expire it immediately through
 * `updateTag` from a Server Action after saving, which makes published edits
 * show up on the public homepage without a redeploy.
 */
export async function getPublishedEntries(): Promise<PortfolioEntry[]> {
  'use cache';
  cacheTag(PORTFOLIO_CONTENT_TAG);
  cacheLife('days');

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      console.error("Unable to load published portfolio content.");
      return [];
    }

    return (data as PortfolioEntry[]).map((entry) => ({
      ...entry,
      content: (entry.content ?? {}) as Record<string, unknown>,
    }));
  } catch {
    console.error("Unable to connect to the portfolio content database.");
    return [];
  }
}
