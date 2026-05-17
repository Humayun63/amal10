import { createClient } from "./client";

export interface UserScoreRow {
  user_id: string;
  display_name: string;
  avatar_initial: string;
  total_points: number;
  today_points: number;
  streak_days: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarInitial: string;
  totalPoints: number;
  todayPoints: number;
  streakDays: number;
  isCurrentUser: boolean;
}

export async function syncUserScore(params: {
  userId: string;
  displayName: string;
  avatarInitial: string;
  totalPoints: number;
  todayPoints: number;
  streakDays: number;
}): Promise<void> {
  try {
    const client = createClient();
    await client.from("user_scores").upsert(
      {
        user_id: params.userId,
        display_name: params.displayName,
        avatar_initial: params.avatarInitial,
        total_points: params.totalPoints,
        today_points: params.todayPoints,
        streak_days: params.streakDays,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  } catch {
    // Silent fail — sync is best-effort
  }
}

export interface CommunityStats {
  totalParticipants: number;
  streakParticipants: number; // streak_days >= 3
  avgPoints: number;
}

export async function fetchCommunityStats(): Promise<CommunityStats> {
  try {
    const client = createClient();
    const { data, error } = await client
      .from("user_scores")
      .select("total_points, streak_days");
    if (error || !data) return { totalParticipants: 0, streakParticipants: 0, avgPoints: 0 };
    const total = data.length;
    const streakCount = data.filter((r) => (r as UserScoreRow).streak_days >= 3).length;
    const avg = total > 0 ? Math.round(data.reduce((s, r) => s + (r as UserScoreRow).total_points, 0) / total) : 0;
    return { totalParticipants: total, streakParticipants: streakCount, avgPoints: avg };
  } catch {
    return { totalParticipants: 0, streakParticipants: 0, avgPoints: 0 };
  }
}

export async function fetchLeaderboard(
  type: "global" | "today",
  currentUserId: string | null
): Promise<LeaderboardEntry[]> {
  const client = createClient();
  const orderCol = type === "global" ? "total_points" : "today_points";

  const { data, error } = await client
    .from("user_scores")
    .select("user_id, display_name, avatar_initial, total_points, today_points, streak_days")
    .order(orderCol, { ascending: false })
    .limit(50);

  if (error) throw error;
  if (!data) return [];

  return (data as UserScoreRow[]).map((row, i) => ({
    rank: i + 1,
    userId: row.user_id,
    name: row.display_name || "অজ্ঞাত",
    avatarInitial: row.avatar_initial || "?",
    totalPoints: row.total_points,
    todayPoints: row.today_points,
    streakDays: row.streak_days,
    isCurrentUser: row.user_id === currentUserId,
  }));
}
