import type { SocialPost } from "@/data/feed";

export function isVideoSource(source: string) {
  return /\.(mp4|webm|ogg)(?:[?#]|$)/i.test(source);
}

export function getPostVideoSource(post: SocialPost, skipIntro = false) {
  return isVideoSource(post.image)
    ? post.image
    : `/media/demo-video.mp4${skipIntro ? "#t=4" : ""}`;
}
