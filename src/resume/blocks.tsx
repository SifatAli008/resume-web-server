import type { ReactNode } from "react";
import { SECTION_ICONS, SvgIcon, type IconName } from "./icons.js";
import type { LayoutRenderProps, ResumeData, SectionTitleVariant, SkillsVariant } from "./types.js";
import { dotScaleFilled, initials, skillBarPct } from "./util.js";

type FieldProps = {
  value: string;
  path: string;
  editable?: boolean;
  onFieldChange?: (path: string, value: string) => void;
  className?: string;
  multiline?: boolean;
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  fullName: "Your full name",
  title: "Job title",
  email: "email@example.com",
  phone: "+1 555 000 0000",
  location: "City, Country",
  summary: "Professional summary…",
  certifications: "Certifications",
  languages: "Languages",
};

export function F({
  value,
  path,
  editable,
  onFieldChange,
  className = "",
  multiline,
}: FieldProps) {
  if (!editable) return <span className={className}>{value}</span>;
  const leaf = path.split(".").pop() ?? path;
  const placeholder = FIELD_PLACEHOLDERS[leaf] ?? FIELD_PLACEHOLDERS[path] ?? "Edit…";
  if (multiline) {
    return (
      <textarea
        data-f={path}
        className={className}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onFieldChange?.(path, e.target.value)}
      />
    );
  }
  return (
    <input
      data-f={path}
      type="text"
      className={className}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onFieldChange?.(path, e.target.value)}
    />
  );
}

export function SecTitle({ title, variant }: { title: string; variant: SectionTitleVariant }) {
  const icon = (SECTION_ICONS[title] || "document") as IconName;
  const showIcon = variant !== "minimal";
  return (
    <h2 className={`cv-sec-title cv-sec-${variant}`}>
      {showIcon && <SvgIcon name={icon} className="cv-sec-icon" />}
      <span>{title}</span>
      {variant === "ruled" && <span className="cv-sec-rule" />}
    </h2>
  );
}

export function MetaRow({ data, editable, onFieldChange }: LayoutRenderProps) {
  const parts = [
    ["email", data.email],
    ["phone", data.phone],
    ["location", data.location],
    ["title", data.title],
  ] as const;
  return (
    <div className="cv-meta-row">
      {parts.map(([key, val], i) => (
        <span key={key}>
          {i > 0 && <span className="cv-meta-dot"> · </span>}
          <F
            value={val}
            path={key}
            editable={editable}
            onFieldChange={onFieldChange}
            className="cv-meta-value"
          />
        </span>
      ))}
    </div>
  );
}

export function Masthead({
  data,
  editable,
  onFieldChange,
  centered,
}: LayoutRenderProps & { centered?: boolean }) {
  return (
    <div className={`cv-masthead${centered ? " cv-masthead-center" : ""}`}>
      <p className="cv-doc-label">Curriculum Vitae</p>
      <F
        value={data.fullName}
        path="fullName"
        editable={editable}
        onFieldChange={onFieldChange}
        className="cv-name"
      />
    </div>
  );
}

export function Profile({ data, editable, onFieldChange, cfg }: LayoutRenderProps) {
  return (
    <section className="cv-profile cv-sec">
      <SecTitle title="Professional Summary" variant={cfg.sectionTitle} />
      <F
        value={data.summary}
        path="summary"
        editable={editable}
        onFieldChange={onFieldChange}
        className="cv-body"
        multiline
      />
    </section>
  );
}

export function PhotoSlot({
  data,
  shape,
  size,
  visible,
}: {
  data: ResumeData;
  shape: string;
  size: string;
  visible: boolean;
}) {
  const show = visible && data.showPhoto;
  return (
    <div
      className={`cv-photo-slot cv-photo-${shape} cv-photo-${size}${show ? "" : " cv-photo-hidden"}`}
      aria-hidden={!show}
    >
      {show && data.photoUrl ? (
        <img src={data.photoUrl} alt="" className="cv-photo-img" />
      ) : (
        <span className="cv-photo-initials">{initials(data.fullName)}</span>
      )}
    </div>
  );
}

export function SkillsBlock({ data, variant, dark }: { data: ResumeData; variant: SkillsVariant; dark?: boolean }) {
  const skills = data.skills.length ? data.skills : ["—"];
  if (variant === "plain-row") {
    return (
      <p className="cv-skills-plain-row">{skills.join("  ·  ")}</p>
    );
  }
  if (variant === "pills" || variant === "pills-dark" || variant === "sky-chips" || variant === "grad-dark") {
    const cls =
      variant === "pills-dark" || variant === "grad-dark"
        ? "cv-skills-pills cv-skills-on-dark"
        : variant === "sky-chips"
          ? "cv-skills-chips"
          : "cv-skills-pills";
    return (
      <div className={cls}>
        {skills.map((s) => (
          <span key={s} className="cv-skill-pill">
            {s}
          </span>
        ))}
      </div>
    );
  }
  if (variant === "outline") {
    return (
      <div className="cv-skills-outline">
        {skills.map((s) => (
          <span key={s} className="cv-skill-outline">
            {s}
          </span>
        ))}
      </div>
    );
  }
  if (variant === "grid-2col") {
    return (
      <div className="cv-skills-grid-2">
        {skills.map((s) => (
          <span key={s} className="cv-skill-cell">
            {s}
          </span>
        ))}
      </div>
    );
  }
  if (variant === "card-tiles") {
    return (
      <div className="cv-skills-cards">
        {skills.map((s) => (
          <div key={s} className="cv-skill-card">
            {s}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "progress-bars") {
    return (
      <div className="cv-skills-bars">
        {skills.map((s) => (
          <div key={s} className="cv-skill-bar-row">
            <span className="cv-skill-bar-label">{s}</span>
            <span className="cv-skill-bar-track">
              <span className="cv-skill-bar-fill" style={{ width: `${skillBarPct(s)}%` }} />
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "tags-band") {
    return (
      <div className="cv-skills-tags-band">
        {skills.map((s) => (
          <span key={s}>
            {s}
          </span>
        ))}
      </div>
    );
  }
  if (variant === "dot-scale") {
    return (
      <ul className="cv-skills-dots">
        {skills.map((s) => {
          const n = dotScaleFilled(s);
          return (
            <li key={s}>
              <span>{s}</span>
              <span className="cv-dot-scale" aria-label={`${n} of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < n ? "on" : ""} />
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    );
  }
  if (variant === "academic-list") {
    return (
      <ol className="cv-skills-academic">
        {skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    );
  }
  if (variant === "serif-blocks") {
    return (
      <div className="cv-skills-serif-blocks">
        {skills.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    );
  }
  if (variant === "rose-tiles") {
    return (
      <div className="cv-skills-rose-tiles">
        {skills.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    );
  }
  if (variant === "compact-dark") {
    return (
      <div className={`cv-skills-compact-dark${dark ? "" : ""}`}>
        {skills.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    );
  }
  if (variant === "cyan-stack") {
    return (
      <div className="cv-skills-cyan-stack">
        {skills.map((s) => (
          <div key={s} className="cv-cyan-row">
            {s}
          </div>
        ))}
      </div>
    );
  }
  if (variant === "swiss-dense") {
    return (
      <div className="cv-skills-swiss-dense">
        {skills.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    );
  }
  if (variant === "slate-list") {
    return (
      <ul className="cv-skills-slate-list">
        {skills.map((s) => (
          <li key={s}>
            <strong>{s}</strong>
            <span> — core competency</span>
          </li>
        ))}
      </ul>
    );
  }
  if (variant === "mag-cols") {
    return (
      <div className="cv-skills-mag-cols">
        {skills.map((s) => (
          <div key={s}>
            <span className="cv-mag-lead">{s}</span>
          </div>
        ))}
      </div>
    );
  }
  if (variant === "underline") {
    return (
      <p className="cv-skills-underline">
        {skills.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>
    );
  }
  return <p className="cv-skills-plain-row">{skills.join("  ·  ")}</p>;
}

export function ExpDateGrid({
  jobs,
  editable,
  onFieldChange,
  prefix = "experience",
}: {
  jobs: ResumeData["experience"];
  editable?: boolean;
  onFieldChange?: (path: string, value: string) => void;
  prefix?: string;
}) {
  return (
    <div className="cv-exp-table">
      {jobs.map((job, i) => (
        <article key={i} className="cv-row cv-exp-row">
          <div className="cv-date-col">
            <F
              value={job.start}
              path={`${prefix}.${i}.start`}
              editable={editable}
              onFieldChange={onFieldChange}
              className="cv-date"
            />
            <span className="cv-date-sep"> – </span>
            <F
              value={job.end}
              path={`${prefix}.${i}.end`}
              editable={editable}
              onFieldChange={onFieldChange}
              className="cv-date"
            />
          </div>
          <div className="cv-exp-body">
            <p className="cv-exp-head">
              <F
                value={job.role}
                path={`${prefix}.${i}.role`}
                editable={editable}
                onFieldChange={onFieldChange}
                className="cv-exp-role"
              />
              <span className="cv-exp-at"> · </span>
              <F
                value={job.company}
                path={`${prefix}.${i}.company`}
                editable={editable}
                onFieldChange={onFieldChange}
                className="cv-exp-co"
              />
            </p>
            <ul className="cv-bullets">
              {job.bullets.map((b, bi) => (
                <li key={bi}>
                  <F
                    value={b}
                    path={`${prefix}.${i}.bullets.${bi}`}
                    editable={editable}
                    onFieldChange={onFieldChange}
                    className="cv-body"
                  />
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ExpTableHtml({ jobs, editable, onFieldChange }: LayoutRenderProps & { jobs?: ResumeData["experience"] }) {
  const rows = jobs ?? [];
  return (
    <table className="cv-exp-table cv-exp-table-html">
      <thead>
        <tr>
          <th>Period</th>
          <th>Role</th>
          <th>Highlights</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((job, i) => (
          <tr key={i} className="cv-row">
            <td className="cv-date-col">
              <F value={job.start} path={`experience.${i}.start`} editable={editable} onFieldChange={onFieldChange} />
              <span> – </span>
              <F value={job.end} path={`experience.${i}.end`} editable={editable} onFieldChange={onFieldChange} />
            </td>
            <td>
              <F value={job.role} path={`experience.${i}.role`} editable={editable} onFieldChange={onFieldChange} />
              <br />
              <F value={job.company} path={`experience.${i}.company`} editable={editable} onFieldChange={onFieldChange} />
            </td>
            <td>
              <ul className="cv-bullets">
                {job.bullets.map((b, bi) => (
                  <li key={bi}>
                    <F value={b} path={`experience.${i}.bullets.${bi}`} editable={editable} onFieldChange={onFieldChange} />
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ProjectsBlock(props: LayoutRenderProps) {
  const { data, editable, onFieldChange } = props;
  return (
    <section className="cv-sec">
      <SecTitle title="Projects" variant={props.cfg.sectionTitle} />
      {data.projects.map((p, i) => (
        <article key={i} className="cv-row cv-proj-row">
          <p className="cv-proj-head">
            <F value={p.name} path={`projects.${i}.name`} editable={editable} onFieldChange={onFieldChange} className="cv-exp-role" />
            <span> — </span>
            <F value={p.context} path={`projects.${i}.context`} editable={editable} onFieldChange={onFieldChange} className="cv-exp-co" />
          </p>
          <ul className="cv-bullets">
            {p.bullets.map((b, bi) => (
              <li key={bi}>
                <F value={b} path={`projects.${i}.bullets.${bi}`} editable={editable} onFieldChange={onFieldChange} className="cv-body" />
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

export function TotalsFooter(props: LayoutRenderProps) {
  const { data, editable, onFieldChange, cfg } = props;
  return (
    <footer className="cv-totals-footer cv-sec">
      <div className="cv-footer-grid">
        <div>
          <SecTitle title="Education" variant={cfg.sectionTitle} />
          {data.education.map((e, i) => (
            <p key={i} className="cv-body cv-row">
              <F value={e.degree} path={`education.${i}.degree`} editable={editable} onFieldChange={onFieldChange} /> —{" "}
              <F value={e.school} path={`education.${i}.school`} editable={editable} onFieldChange={onFieldChange} /> (
              <F value={e.start} path={`education.${i}.start`} editable={editable} onFieldChange={onFieldChange} />–
              <F value={e.end} path={`education.${i}.end`} editable={editable} onFieldChange={onFieldChange} />)
            </p>
          ))}
        </div>
        <div>
          <SecTitle title="Certifications & Licenses" variant={cfg.sectionTitle} />
          <F value={data.certifications} path="certifications" editable={editable} onFieldChange={onFieldChange} className="cv-body" multiline />
        </div>
        <div>
          <SecTitle title="Languages" variant={cfg.sectionTitle} />
          <F value={data.languages} path="languages" editable={editable} onFieldChange={onFieldChange} className="cv-body" multiline />
        </div>
      </div>
    </footer>
  );
}

export function SkillsSection(props: LayoutRenderProps) {
  const title = props.cfg.layout.startsWith("pdf-") ? "Area of Expertise" : "Skills";
  return (
    <section className="cv-sec cv-skills-sec">
      <SecTitle title={title} variant={props.cfg.sectionTitle} />
      <SkillsBlock data={props.data} variant={props.cfg.skills} dark={props.cfg.layout.includes("dark")} />
    </section>
  );
}

export function CanvaClassicHeader({ data, editable, onFieldChange }: LayoutRenderProps) {
  return (
    <header className="cv-canva-header-classic cv-masthead">
      <F value={data.fullName} path="fullName" editable={editable} onFieldChange={onFieldChange} className="cv-name" />
      <p className="cv-canva-title-role">{data.title}</p>
      <div className="cv-meta-row">
        <F value={data.email} path="email" editable={editable} onFieldChange={onFieldChange} />
        <span className="cv-meta-dot"> | </span>
        <F value={data.phone} path="phone" editable={editable} onFieldChange={onFieldChange} />
        <span className="cv-meta-dot"> | </span>
        <F value={data.location} path="location" editable={editable} onFieldChange={onFieldChange} />
      </div>
    </header>
  );
}

export function ContactStackLeft({ data, editable, onFieldChange }: LayoutRenderProps) {
  return (
    <div className="cv-canva-contact-stack">
      <p>
        <strong>Address</strong>
        <F value={data.location} path="location" editable={editable} onFieldChange={onFieldChange} />
      </p>
      <p>
        <strong>Phone</strong>
        <F value={data.phone} path="phone" editable={editable} onFieldChange={onFieldChange} />
      </p>
      <p>
        <strong>Email</strong>
        <F value={data.email} path="email" editable={editable} onFieldChange={onFieldChange} />
      </p>
      {data.links[0]?.url && (
        <p>
          <strong>Website</strong>
          <F value={data.links[0].url} path="links.0.url" editable={editable} onFieldChange={onFieldChange} />
        </p>
      )}
    </div>
  );
}

export function KeyAchievements({ data, editable, onFieldChange, cfg }: LayoutRenderProps) {
  return (
    <section className="cv-sec">
      <SecTitle title="Key Achievements" variant={cfg.sectionTitle} />
      {data.projects.map((p, i) => (
        <div key={i} className="cv-canva-achievement-item cv-row">
          <strong>
            <F value={p.name} path={`projects.${i}.name`} editable={editable} onFieldChange={onFieldChange} />.
          </strong>
          <p className="cv-body">
            {p.bullets[0] && (
              <F value={p.bullets[0]} path={`projects.${i}.bullets.0`} editable={editable} onFieldChange={onFieldChange} />
            )}
          </p>
        </div>
      ))}
    </section>
  );
}

export function AdditionalInfo({ data, editable, onFieldChange, cfg }: LayoutRenderProps) {
  return (
    <section className="cv-sec">
      <SecTitle title="Additional Information" variant={cfg.sectionTitle} />
      <p className="cv-body">
        <strong>Certifications: </strong>
        <F value={data.certifications} path="certifications" editable={editable} onFieldChange={onFieldChange} />
      </p>
      <p className="cv-body">
        <strong>Languages: </strong>
        <F value={data.languages} path="languages" editable={editable} onFieldChange={onFieldChange} />
      </p>
    </section>
  );
}

export function EducationBlock(props: LayoutRenderProps) {
  const { data, editable, onFieldChange, cfg } = props;
  return (
    <section className="cv-sec">
      <SecTitle title="Education" variant={cfg.sectionTitle} />
      {data.education.map((e, i) => (
        <div key={i} className="cv-canva-edu-row cv-row">
          <div className="cv-date-col">
            <F value={e.start} path={`education.${i}.start`} editable={editable} onFieldChange={onFieldChange} />
            <span> – </span>
            <F value={e.end} path={`education.${i}.end`} editable={editable} onFieldChange={onFieldChange} />
          </div>
          <div>
            <p className="cv-exp-role">
              <F value={e.degree} path={`education.${i}.degree`} editable={editable} onFieldChange={onFieldChange} />
            </p>
            <p className="cv-exp-co">
              <F value={e.school} path={`education.${i}.school`} editable={editable} onFieldChange={onFieldChange} />
            </p>
            {e.details && <p className="cv-body">{e.details}</p>}
          </div>
        </div>
      ))}
    </section>
  );
}

export function ExperienceBlock(props: LayoutRenderProps) {
  const { data, editable, onFieldChange, cfg } = props;
  return (
    <section className="cv-sec">
      <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
      <ExpDateGrid jobs={data.experience} editable={editable} onFieldChange={onFieldChange} />
    </section>
  );
}

export function ProfileBlock(props: LayoutRenderProps) {
  const { data, editable, onFieldChange, cfg } = props;
  return (
    <section className="cv-sec cv-profile">
      <SecTitle title="Professional Summary" variant={cfg.sectionTitle} />
      <F value={data.summary} path="summary" editable={editable} onFieldChange={onFieldChange} className="cv-body" multiline />
    </section>
  );
}

export function ReferencesBlock({ data }: { data: ResumeData }) {
  const refs = [
    { name: "Bailey Dupont", role: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
    { name: "Harumi Kobayashi", role: "Wardiere Inc. / CEO", phone: "123-456-7890", email: "hello@reallygreatsite.com" },
  ];
  return (
    <section className="cv-sec">
      <p className="cv-canva-label">References</p>
      {refs.map((r) => (
        <div key={r.name} className="cv-canva-ref-block">
          <strong>{r.name}</strong>
          <span>
            {r.role}
            <br />
            Phone: {r.phone}
            <br />
            Email: {r.email}
          </span>
        </div>
      ))}
    </section>
  );
}

export function LinksRail({ data }: { data: ResumeData }) {
  const links = data.links.filter((l) => l.label || l.url);
  if (!links.length) return null;
  return (
    <div className="cv-links-rail">
      <SecTitle title="Links" variant="minimal" />
      <ul>
        {links.map((l, i) => (
          <li key={i}>
            {l.url ? (
              <a href={l.url.startsWith("http") ? l.url : `https://${l.url}`}>{l.label || l.url}</a>
            ) : (
              l.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Page({ children, formal }: { children: ReactNode; formal?: boolean }) {
  return <div className={`cv-page${formal ? " cv-page-formal" : ""}`}>{children}</div>;
}

/** A4 print: exactly three pages per template. */
export function Pages3({
  formal,
  a,
  b,
  c,
}: {
  formal?: boolean;
  a: ReactNode;
  b: ReactNode;
  c: ReactNode;
}) {
  return (
    <>
      <Page formal={formal}>{a}</Page>
      <Page formal={formal}>{b}</Page>
      <Page formal={formal}>{c}</Page>
    </>
  );
}
