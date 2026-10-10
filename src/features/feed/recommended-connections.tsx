"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { people } from "@/data/feed";
import { ProfileLink } from "@/components/profile-link";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function RecommendedConnections({
  inline = false,
}: {
  inline?: boolean;
}) {
  const [following, setFollowing] = useLocalStorage<Record<string, boolean>>(
    "following",
    {},
  );
  return (
    <section
      className={`recommended-connections ${inline ? "is-inline" : ""}`}
      aria-label="Rekomendasi koneksi bisnis"
    >
      <div className="connections-heading">
        <div>
          <h2>Koneksi bisnis untukmu</h2>
          <p>Kenali bisnis dan keahlian mereka.</p>
        </div>
        <Link href="/komunitas" aria-label="Temukan komunitas bisnis">
          <ArrowUpRight size={20} />
        </Link>
      </div>
      <div className="connection-list">
        {people.map((person) => (
          <div className="connection-card" key={person.handle}>
            <ProfileLink handle={person.handle} className="profile-avatar-link">
              <span className={`avatar ${person.color}`}>
                {person.initials}
              </span>
            </ProfileLink>
            <div className="connection-info">
              <strong>
                <ProfileLink handle={person.handle}>{person.name}</ProfileLink>
              </strong>
              <small>{person.detail}</small>
              <p>{person.reason}</p>
            </div>
            <button
              type="button"
              className={`connection-follow ${following[person.handle] ? "is-following" : ""}`}
              aria-label={`${following[person.handle] ? "Batal mengikuti" : "Ikuti"} ${person.name}`}
              aria-pressed={!!following[person.handle]}
              onClick={() =>
                setFollowing((previous) => ({
                  ...previous,
                  [person.handle]: !previous[person.handle],
                }))
              }
            >
              {following[person.handle] ? (
                <Check size={17} />
              ) : (
                <Plus size={17} />
              )}
              <span>{following[person.handle] ? "Mengikuti" : "Ikuti"}</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
