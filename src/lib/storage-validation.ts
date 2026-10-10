/** Runtime validation protects the UI from stale or manually edited browser data. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function everyValue(
  value: unknown,
  predicate: (item: unknown) => boolean,
): boolean {
  return isRecord(value) && Object.values(value).every(predicate);
}
function isComment(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.text === "string" &&
    (value.side === "left" || value.side === "right") &&
    typeof value.likes === "number" &&
    Number.isFinite(value.likes) &&
    typeof value.liked === "boolean" &&
    Array.isArray(value.replies) &&
    value.replies.every(isComment)
  );
}
export function validStoredValue(key: string, value: unknown): boolean {
  if (key === "feed-mode") return value === "all" || value === "following";
  if (
    [
      "post-likes",
      "post-saved",
      "post-reposts",
      "job-likes",
      "job-saved",
      "explore-hidden",
    ].includes(key)
  )
    return (
      Array.isArray(value) &&
      value.every(
        (item) => typeof item === "number" && Number.isSafeInteger(item),
      )
    );
  if (["recent-searches", "joined-communities"].includes(key))
    return (
      Array.isArray(value) && value.every((item) => typeof item === "string")
    );
  if (["following", "post-muted"].includes(key))
    return everyValue(value, (item) => typeof item === "boolean");
  if (["post-comments", "job-comments", "announcement-comments"].includes(key))
    return everyValue(
      value,
      (item) => Array.isArray(item) && item.every(isComment),
    );
  if (key === "announcement-reactions")
    return everyValue(
      value,
      (item) =>
        isRecord(item) &&
        typeof item.liked === "boolean" &&
        typeof item.count === "number" &&
        Number.isFinite(item.count),
    );
  if (key === "announcements")
    return (
      Array.isArray(value) &&
      value.every(
        (item) =>
          isRecord(item) &&
          ["purple", "yellow", "pink", "blue", "green", "white"].includes(
            String(item.color),
          ) &&
          [
            "megaphone",
            "handshake",
            "calendar",
            "users",
            "star",
            "bulb",
          ].includes(String(item.icon)),
      )
    );
  if (key === "posts")
    return (
      Array.isArray(value) &&
      value.every(
        (item) =>
          isRecord(item) &&
          (item.video === undefined || typeof item.video === "boolean") &&
          (item.gallery === undefined ||
            (Array.isArray(item.gallery) &&
              item.gallery.every(
                (media) =>
                  isRecord(media) &&
                  typeof media.image === "string" &&
                  typeof media.alt === "string",
              ))) &&
          (item.kind === undefined ||
            ["update", "partner", "supplier", "hiring"].includes(
              String(item.kind),
            )) &&
          (item.opportunityTitle === undefined ||
            typeof item.opportunityTitle === "string") &&
          (item.opportunityDetail === undefined ||
            typeof item.opportunityDetail === "string") &&
          Array.isArray(item.replies) &&
          item.replies.every((reply) => typeof reply === "string"),
      )
    );
  if (key === "jobs")
    return (
      Array.isArray(value) &&
      value.every(
        (item) =>
          isRecord(item) &&
          Array.isArray(item.replies) &&
          item.replies.every((reply) => typeof reply === "string"),
      )
    );
  return true;
}
