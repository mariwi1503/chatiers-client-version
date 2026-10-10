"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tabPaths } from "@/lib/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Feed } from "@/features/feed/feed";
import { Discovery } from "@/components/layout/discovery";
import { initialPosts, type NewPost } from "@/data/feed";
import { jobVacancies, type JobVacancy } from "@/data/jobs";

type ComposeType = "text" | "media" | "custom";

export function SocialApp({
  initialActive = "Beranda",
  search = {},
}: {
  initialActive?: string;
  search?: Record<string, string | undefined>;
}) {
  const params = { get: (name: string) => search[name] };
  const composeParam = params.get("compose") || "";
  const isJobCompose = composeParam === "job";
  const openComposer = ["1", "text", "media", "custom"].includes(composeParam);
  const initialType: ComposeType =
    composeParam === "media"
      ? "media"
      : composeParam === "custom"
        ? "custom"
        : "text";

  const [active, setActive] = useState(
    params.get("tab") === "lowongan" || isJobCompose
      ? "Lowongan"
      : initialActive,
  );
  const [posts, setPosts] = useLocalStorage("posts", initialPosts);
  const [jobs, setJobs] = useLocalStorage<JobVacancy[]>("jobs", jobVacancies);
  const [composerOpen, setComposerOpen] = useState(openComposer);
  const [composeType, setComposeType] = useState<ComposeType>(initialType);
  const [query, setQuery] = useState(search.q || "");
  const [region, setRegion] = useLocalStorage("region", "Public");
  const router = useRouter();

  function select(v: string) {
    setActive(v);
    setQuery("");
    router.push(tabPaths[v] || "/");
  }

  function publishPost(post: NewPost) {
    setPosts((p) => [
      {
        id: Math.max(0, ...p.map((x) => x.id)) + 1,
        name: "Ardi Kurniawan",
        handle: "ardikurniawan",
        initials: "AK",
        color: "yellow",
        time: "Baru saja",
        location:
          region === "Public" ? "Jakarta, Indonesia" : `${region}, Indonesia`,
        company: "Kopi Nusantara",
        role: "Pemilik Bisnis",
        text: post.text,
        tags: post.tags || "#NetworkingBisnis",
        image: post.image || "",
        alt: post.alt || "",
        video: post.video,
        kind: post.kind || "update",
        opportunityTitle: post.opportunityTitle,
        opportunityDetail: post.opportunityDetail,
        likes: 0,
        comments: 0,
        replies: [],
      },
      ...p,
    ]);
    setActive("Beranda");
    setQuery("");
    router.push("/");
  }

  return (
    <div
      className={`app-shell ${active === "Jelajahi" && !query ? "explore-shell" : ""}`}
    >
      <Navigation
        active={active}
        keepMobileVisible={active === "Jelajahi"}
        onSelect={select}
        onCompose={() => {
          setComposeType("text");
          setComposerOpen(true);
        }}
      />
      <Feed
        active={active}
        posts={posts}
        onPost={publishPost}
        jobs={jobs}
        onPostJob={(job) => setJobs((j) => [job, ...j])}
        composerOpen={composerOpen}
        setComposerOpen={setComposerOpen}
        composeType={composeType}
        setComposeType={setComposeType}
        jobAutoOpen={isJobCompose}
        jobPresetType={params.get("type") || undefined}
        query={query}
        region={region}
        setRegion={setRegion}
        locations={[
          "Public",
          "Batam",
          "Bandung",
          "Surabaya",
          "Jakarta",
          "Nusa Penida",
          "Yogyakarta",
        ]}
        onSearch={(q) => {
          setQuery(q);
          setActive("Jelajahi");
        }}
      />
      <Discovery
        onSearch={(q) => {
          setQuery(q);
          setActive("Jelajahi");
        }}
        onTopic={(q) => {
          if (q === "Komunitas") select(q);
          else {
            setActive("Jelajahi");
            setQuery(q);
          }
        }}
      />
    </div>
  );
}
