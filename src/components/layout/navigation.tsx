"use client";

import {
  Clapperboard,
  Home,
  Bookmark,
  Bell,
  MessageCircle,
  Users,
  Plus,
  Settings,
  ArrowUpRight,
  Briefcase,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { tabPaths } from "@/lib/navigation";
import { BrandLogo } from "@/components/layout/brand-logo";
const items = [
  { name: "Beranda", icon: Home },
  { name: "Jelajahi", icon: Clapperboard },
  { name: "Lowongan", icon: Briefcase },
  { name: "Tersimpan", icon: Bookmark },
  { name: "Notifikasi", icon: Bell },
  { name: "Pesan", icon: MessageCircle },
  { name: "Komunitas", icon: Users },
];
export function Navigation({
  active,
  onSelect,
  onCompose,
  keepMobileVisible = false,
}: {
  active: string;
  onSelect: (v: string) => void;
  onCompose: () => void;
  keepMobileVisible?: boolean;
}) {
  const [navHidden, setNavHidden] = useState(false);
  const hideMobile = navHidden && !keepMobileVisible;
  useEffect(() => {
    let previousY = window.scrollY;
    const onWindowScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 20) {
        setNavHidden(false);
        previousY = currentY;
        return;
      }
      const delta = currentY - previousY;
      if (Math.abs(delta) > 8) {
        setNavHidden(delta > 0);
        previousY = currentY;
      }
    };
    const onAppScroll = (event: Event) => {
      const direction = (event as CustomEvent<{ direction: "up" | "down" }>)
        .detail.direction;
      setNavHidden(direction === "down");
    };
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    window.addEventListener("chatiers-scroll-direction", onAppScroll);
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("chatiers-scroll-direction", onAppScroll);
    };
  }, []);
  return (
    <>
      <aside className="navigation">
        <BrandLogo />
        <div className="nav-label">
          RUANG BISNIS KAMU <span>01</span>
        </div>
        <nav>
          {items.map(({ name, icon: Icon }) => (
            <Link
              href={tabPaths[name]}
              key={name}
              className={`nav-item ${name === "Lowongan" ? "lowongan-item" : ""} ${active === name ? "selected" : ""}`}
              onClick={() => onSelect(name)}
            >
              <Icon size={21} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
        <button className="compose-button" onClick={onCompose}>
          <Plus size={20} /> Buat postingan <ArrowUpRight size={18} />
        </button>
        <Link href="/komunitas" className="sidebar-community-link">
          <Users size={20} />
          <span>
            Perluas jaringanmu<small>Temukan komunitas bisnis</small>
          </span>
          <ArrowUpRight size={17} />
        </Link>
        <Link
          href="/profile/ardikurniawan"
          className={`profile-button ${active === "Profil" ? "selected" : ""}`}
          aria-current={active === "Profil" ? "page" : undefined}
        >
          <span className="avatar yellow">AK</span>
          <span>
            <strong>Ardi Kurniawan</strong>
            <small>@ardikurniawan · Pemilik Bisnis</small>
          </span>
          <Settings size={18} />
        </Link>
      </aside>
      <nav
        className={`mobile-bottom-nav ${hideMobile ? "is-hidden" : ""}`}
        aria-label="Navigasi utama"
        aria-hidden={hideMobile}
        inert={hideMobile}
      >
        {items
          .filter(({ name }) => ["Beranda", "Jelajahi"].includes(name))
          .map(({ name, icon: Icon }) => (
            <Link
              href={tabPaths[name]}
              key={name}
              className={`mobile-nav-item ${active === name ? "selected" : ""}`}
              aria-label={name}
              aria-current={active === name ? "page" : undefined}
              onClick={() => onSelect(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
            </Link>
          ))}
        <button
          type="button"
          className="mobile-post-button"
          aria-label="Buat postingan"
          onClick={onCompose}
        >
          <Plus size={26} strokeWidth={2.4} />
        </button>
        {items
          .filter(({ name }) => name === "Notifikasi")
          .map(({ name, icon: Icon }) => (
            <Link
              href={tabPaths[name]}
              key={name}
              className={`mobile-nav-item ${active === name ? "selected" : ""}`}
              aria-label={name}
              aria-current={active === name ? "page" : undefined}
              onClick={() => onSelect(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
            </Link>
          ))}
        <Link
          href="/profile/ardikurniawan"
          className={`mobile-nav-item ${active === "Profil" ? "selected" : ""}`}
          aria-label="Profil"
          aria-current={active === "Profil" ? "page" : undefined}
        >
          <UserRound size={19} />
          <span>Profil</span>
        </Link>
      </nav>
    </>
  );
}
