import { users, type ChatiersUser } from "@/data/feed";
export const VIEWER_HANDLE = "ardikurniawan";

/** Seed a small, consistent demo graph. The viewer's follows always come from storage. */
export function profileConnections(
  handle: string,
  followed: Record<string, boolean>,
) {
  function following(account: string): ChatiersUser[] {
    if (account === VIEWER_HANDLE)
      return users.filter(
        (user) => user.handle !== account && followed[user.handle],
      );
    const index = users.findIndex((user) => user.handle === account);
    return [1, 2, 3].map((offset) => users[(index + offset) % users.length]);
  }
  return {
    following: following(handle),
    followers: users.filter(
      (user) =>
        user.handle !== handle &&
        following(user.handle).some((account) => account.handle === handle),
    ),
  };
}

export type ProfileDetails = { bio: string; location: string; website: string };

/** Only HTTP(S) URLs can become clickable links, including restored local data. */
export function profileWebsite(value: string): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(
      /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`,
    );
    return ["https:", "http:"].includes(url.protocol) && !!url.hostname
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function profileBio(handle: string): string {
  const bios: Record<string, string> = {
    sariwijaya:
      "Pemilik bisnis tekstil yang fokus pada distribusi grosir dan kemitraan produksi.",
    budisantoso:
      "Founder agency digital yang membantu brand berekspansi secara online.",
    alyarahma:
      "Buyer & sourcing manager yang menghubungkan supplier dengan kebutuhan produksi.",
    bimaaditya:
      "Founder agency yang menyediakan layanan branding dan ekspansi digital.",
    dimassaputra:
      "Pemilik bisnis F&B yang sedang mengembangkan jaringan distribusi kuliner.",
    ardikurniawan:
      "Pemilik bisnis kopi lokal yang sedang memperluas distribusi ke lebih banyak kota.",
  };
  return bios[handle] || "Pelaku bisnis di jaringan chatiers.";
}
export function profileSkills(handle: string): string[] {
  const skills: Record<string, string[]> = {
    sariwijaya: ["Grosir", "Distribusi", "Tekstil", "Produksi", "Kemitraan"],
    budisantoso: [
      "Digital Marketing",
      "Branding",
      "Agency",
      "Strategi",
      "Leadership",
    ],
    alyarahma: ["Sourcing", "Buyer", "Negosiasi", "Supply Chain", "Produksi"],
    bimaaditya: ["Branding", "Agency", "Pitching", "Strategi Digital", "Klien"],
    dimassaputra: ["F&B", "Distribusi", "Kuliner", "Operasional", "Retail"],
    ardikurniawan: [
      "Kopi Lokal",
      "Distribusi",
      "Retail",
      "Kemitraan",
      "Ekspansi",
    ],
  };
  return skills[handle] || ["Bisnis", "Jaringan", "Kolaborasi"];
}
