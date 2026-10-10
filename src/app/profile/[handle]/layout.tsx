import type { ReactNode } from "react";
import { ProfileShell } from "@/features/profiles/profile-shell";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return <ProfileShell>{children}</ProfileShell>;
}
