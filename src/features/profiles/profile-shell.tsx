"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/navigation";
import { Discovery } from "@/components/layout/discovery";
import { tabPaths } from "@/lib/navigation";

export function ProfileShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = (query: string) =>
    router.push(`/?q=${encodeURIComponent(query)}`);
  return (
    <div className="app-shell profile-shell">
      <Navigation
        active={pathname.startsWith("/profile/ardikurniawan") ? "Profil" : ""}
        onSelect={(name) => router.push(tabPaths[name])}
        onCompose={() => router.push("/?compose=text")}
      />
      <div className="profile-content">{children}</div>
      <Discovery
        searchOnSubmit
        onSearch={search}
        onTopic={(tag) => router.push(`/?q=${encodeURIComponent(`#${tag}`)}`)}
      />
    </div>
  );
}
