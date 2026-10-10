import { Building2, Globe, Mail, MapPin } from "lucide-react";
import type { ChatiersUser } from "@/data/feed";
import { companyByHandle } from "@/data/products";
import {
  profileSkills,
  profileWebsite,
  type ProfileDetails,
} from "@/lib/profiles";

export function ProfileAbout({
  user,
  details,
}: {
  user: ChatiersUser;
  details: ProfileDetails;
}) {
  const company = companyByHandle(user.handle);
  const website = profileWebsite(details.website);
  return (
    <section
      className="profile-about-panel"
      aria-labelledby="profile-about-title"
    >
      <h2 id="profile-about-title">Tentang {user.name.split(" ")[0]}</h2>
      <p>{details.bio}</p>
      <h3>Fokus & keahlian</h3>
      <div className="profile-skill-list">
        {profileSkills(user.handle).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
      <h3>Informasi bisnis</h3>
      <dl className="profile-business-details">
        <div>
          <dt>
            <Building2 size={16} /> Perusahaan
          </dt>
          <dd>{user.company}</dd>
        </div>
        <div>
          <dt>
            <MapPin size={16} /> Lokasi
          </dt>
          <dd>{details.location}</dd>
        </div>
        {company && (
          <div>
            <dt>
              <Mail size={16} /> Email bisnis
            </dt>
            <dd>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </dd>
          </div>
        )}
        {website && (
          <div>
            <dt>
              <Globe size={16} /> Situs bisnis
            </dt>
            <dd>
              <a href={website} target="_blank" rel="noopener noreferrer">
                {details.website}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
