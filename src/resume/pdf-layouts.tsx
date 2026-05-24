import type { ReactNode } from "react";
import type { LayoutRenderProps } from "./types.js";
import type { PdfLayoutId } from "./pdf-design-map.js";
import {
  AdditionalInfo,
  CanvaClassicHeader,
  ContactStackLeft,
  EducationBlock,
  ExperienceBlock,
  F,
  KeyAchievements,
  Pages3,
  PhotoSlot,
  ProfileBlock,
  ProjectsBlock,
  ReferencesBlock,
  SecTitle,
  SkillsBlock,
  SkillsSection,
  TotalsFooter,
} from "./blocks.js";

function paginate(props: LayoutRenderProps, p1: ReactNode, p2?: ReactNode) {
  return (
    <Pages3
      formal={props.cfg.formalPadding}
      a={p1}
      b={
        p2 ?? (
          <>
            <ProjectsBlock {...props} />
            <SkillsSection {...props} />
          </>
        )
      }
      c={<TotalsFooter {...props} />}
    />
  );
}

function classicPage1(props: LayoutRenderProps) {
  return (
    <>
      <CanvaClassicHeader {...props} />
      <ProfileBlock {...props} />
      <SkillsSection {...props} />
      <ExperienceBlock {...props} />
    </>
  );
}

function classicPage2(props: LayoutRenderProps) {
  return (
    <>
      <EducationBlock {...props} />
      <KeyAchievements {...props} />
      <AdditionalInfo {...props} />
    </>
  );
}

function layout01(props: LayoutRenderProps) {
  return paginate(props, classicPage1(props), classicPage2(props));
}

function layout02(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <div className="cv-canva-split-32-68">
      <ContactStackLeft {...props} />
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
        </header>
        <ProfileBlock {...props} />
        <ExperienceBlock {...props} />
      </div>
    </div>,
  );
}

function layout03(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <div className="cv-canva-split-28-72">
      <aside className="cv-canva-sidebar-dark-panel">
        <p className="cv-canva-label">Contact</p>
        <ContactStackLeft {...props} />
        <SkillsSection {...props} />
      </aside>
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role">{data.title}</p>
        </header>
        <ProfileBlock {...props} />
        <ExperienceBlock {...props} />
      </div>
    </div>,
  );
}

function layout04(props: LayoutRenderProps) {
  const { data, cfg } = props;
  return paginate(
    props,
    <div className="cv-canva-split-35-65">
      <aside className="cv-canva-sidebar-panel">
        <ProfileBlock {...props} />
        <EducationBlock {...props} />
        <section className="cv-sec">
          <SecTitle title="Language" variant={cfg.sectionTitle} />
          <p className="cv-body">{data.languages}</p>
        </section>
        <SkillsSection {...props} />
        <ReferencesBlock data={data} />
      </aside>
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role" style={{ letterSpacing: "0.2em" }}>
            {data.title.split("").join(" ")}
          </p>
        </header>
        <ExperienceBlock {...props} />
      </div>
    </div>,
  );
}

function layout05(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <>
      <div className="cv-canva-creative-banner">
        <h1 className="cv-canva-hero-name">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} />
        </h1>
        <p className="cv-canva-hero-sub">{data.title}</p>
      </div>
      <div className="cv-canva-split-35-65">
        <EducationBlock {...props} />
        <SkillsSection {...props} />
      </div>
      <ExperienceBlock {...props} />
    </>,
  );
}

function layout06(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <>
      <header className="cv-canva-centered-head">
        <p className="cv-canva-hero-name" style={{ fontSize: "1.75rem" }}>
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} />
        </p>
        <p className="cv-canva-title-role">{data.title}</p>
        <div className="cv-canva-contact-row">
          <span>{data.phone}</span>
          <span>{data.email}</span>
          <span>{data.location}</span>
        </div>
      </header>
      <ProfileBlock {...props} />
      <ExperienceBlock {...props} />
    </>,
    <>
      <EducationBlock {...props} />
      <SkillsSection {...props} />
      <AdditionalInfo {...props} />
    </>,
  );
}

function layout07(props: LayoutRenderProps) {
  return paginate(
    props,
    <>
      <CanvaClassicHeader {...props} />
      <ProfileBlock {...props} />
      <SkillsSection {...props} />
      <ExperienceBlock {...props} />
      <ProjectsBlock {...props} />
    </>,
    classicPage2(props),
  );
}

function layout08(props: LayoutRenderProps) {
  const { data, cfg } = props;
  return paginate(
    props,
    <div className="cv-canva-split-32-68">
      <aside className="cv-canva-sidebar-panel">
        <PhotoSlot data={data} shape={cfg.photoShape} size={cfg.photoSize} visible={cfg.photoDefault} />
        <ProfileBlock {...props} />
        <EducationBlock {...props} />
        <SkillsSection {...props} />
        <section className="cv-sec">
          <SecTitle title="Language" variant={cfg.sectionTitle} />
          <p className="cv-body">{data.languages}</p>
        </section>
      </aside>
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role">{data.title}</p>
        </header>
        <ExperienceBlock {...props} />
        <ReferencesBlock data={data} />
      </div>
    </div>,
  );
}

function layout09(props: LayoutRenderProps) {
  const { data, cfg } = props;
  return paginate(
    props,
    <div className="cv-canva-split-32-68">
      <aside className="cv-canva-sidebar-panel">
        <p className="cv-canva-label">About Me</p>
        <F value={data.summary} path="summary" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-body" multiline />
        <EducationBlock {...props} />
        <SkillsSection {...props} />
        <section className="cv-sec">
          <SecTitle title="Language" variant={cfg.sectionTitle} />
          <p className="cv-body">{data.languages}</p>
        </section>
        <ReferencesBlock data={data} />
      </aside>
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role" style={{ letterSpacing: "0.15em" }}>
            {data.title.toUpperCase()}
          </p>
        </header>
        <ExperienceBlock {...props} />
      </div>
    </div>,
  );
}

function layoutWebSplit(props: LayoutRenderProps, alt?: boolean) {
  const { data, cfg } = props;
  return paginate(
    props,
    <div className={`cv-canva-web-split${alt ? " cv-canva-web-split-alt" : ""}`}>
      <div>
        <p className="cv-canva-label">Contact</p>
        <ContactStackLeft {...props} />
        <ExperienceBlock {...props} />
        <ProfileBlock {...props} />
      </div>
      <aside className="cv-canva-rail">
        <header className="cv-masthead cv-masthead-center">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role">{data.title}</p>
        </header>
        <EducationBlock {...props} />
        <SkillsSection {...props} />
        <section className="cv-sec">
          <SecTitle title="Language" variant={cfg.sectionTitle} />
          <p className="cv-body">{data.languages}</p>
        </section>
        <ReferencesBlock data={data} />
      </aside>
    </div>,
  );
}

function layout12(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <>
      <div className="cv-canva-split-35-65">
        <div>
          <p className="cv-canva-label">Contact</p>
          <ContactStackLeft {...props} />
          <EducationBlock {...props} />
        </div>
        <SkillsSection {...props} />
      </div>
      <header className="cv-masthead">
        <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
        <p className="cv-canva-title-role">{data.title}</p>
      </header>
      <ProfileBlock {...props} />
      <ExperienceBlock {...props} />
    </>,
  );
}

function layout14(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <>
      <header style={{ marginBottom: "1rem" }}>
        <p className="cv-canva-hero-name" style={{ fontSize: "2.25rem", textTransform: "none" }}>
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} />
        </p>
        <p className="cv-canva-title-role">{data.title}</p>
        <div className="cv-meta-row">
          <F value={data.phone} path="phone" editable={props.editable} onFieldChange={props.onFieldChange} />
          <span className="cv-meta-dot"> · </span>
          <F value={data.email} path="email" editable={props.editable} onFieldChange={props.onFieldChange} />
          <span className="cv-meta-dot"> · </span>
          <F value={data.location} path="location" editable={props.editable} onFieldChange={props.onFieldChange} />
        </div>
      </header>
      <ProfileBlock {...props} />
      <ExperienceBlock {...props} />
    </>,
    <>
      <EducationBlock {...props} />
      <SkillsSection {...props} />
    </>,
  );
}

function layout15(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <>
      <header className="cv-masthead">
        <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
        <p className="cv-canva-title-role">{data.title}</p>
      </header>
      <ProfileBlock {...props} />
      <ExperienceBlock {...props} />
      <KeyAchievements {...props} />
    </>,
    <>
      <EducationBlock {...props} />
      <SkillsSection {...props} />
    </>,
  );
}

function layout16(props: LayoutRenderProps) {
  const { data } = props;
  return paginate(
    props,
    <>
      <header style={{ borderBottom: "3px solid var(--cv-a600)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
        <p className="cv-canva-hero-name" style={{ fontSize: "2rem" }}>
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} />
        </p>
        <p className="cv-canva-title-role">{data.title}</p>
      </header>
      <ProfileBlock {...props} />
      <ExperienceBlock {...props} />
      <KeyAchievements {...props} />
    </>,
    <>
      <EducationBlock {...props} />
      <SkillsSection {...props} />
    </>,
  );
}

function layout17(props: LayoutRenderProps) {
  const { data, cfg } = props;
  const parts = data.fullName.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ") || "";
  return paginate(
    props,
    <div className="cv-canva-vertical-name">
      <div className="cv-vname-stack" aria-hidden>
        {first} {last}
      </div>
      <div>
        <p className="cv-canva-title-role" style={{ fontSize: "1rem", marginBottom: "1rem" }}>
          {data.title}
        </p>
        <ProfileBlock {...props} />
        <ExperienceBlock {...props} />
        <PhotoSlot data={data} shape={cfg.photoShape} size={cfg.photoSize} visible={cfg.photoDefault} />
      </div>
    </div>,
  );
}

function layout18(props: LayoutRenderProps) {
  const { data, cfg } = props;
  return paginate(
    props,
    <div className="cv-canva-split-35-65">
      <aside className="cv-canva-sidebar-panel">
        <p className="cv-canva-label">Contact</p>
        <ContactStackLeft {...props} />
        <section className="cv-sec">
          <SecTitle title="Expertise" variant={cfg.sectionTitle} />
          <SkillsBlock data={data} variant={cfg.skills} />
        </section>
        <ReferencesBlock data={data} />
      </aside>
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role">{data.title}</p>
        </header>
        <ProfileBlock {...props} />
        <ExperienceBlock {...props} />
        <EducationBlock {...props} />
      </div>
    </div>,
  );
}

function layout19(props: LayoutRenderProps) {
  const { data, cfg } = props;
  return paginate(
    props,
    <div className="cv-canva-split-32-68">
      <aside className="cv-canva-sidebar-panel">
        <p className="cv-canva-label">Profile</p>
        <F value={data.summary} path="summary" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-body" multiline />
        <SkillsSection {...props} />
        <section className="cv-sec">
          <SecTitle title="Awards" variant={cfg.sectionTitle} />
          <KeyAchievements {...props} />
        </section>
        <EducationBlock {...props} />
      </aside>
      <div>
        <header className="cv-masthead">
          <F value={data.fullName} path="fullName" editable={props.editable} onFieldChange={props.onFieldChange} className="cv-name" />
          <p className="cv-canva-title-role">{data.title}</p>
        </header>
        <ExperienceBlock {...props} />
      </div>
    </div>,
  );
}

function layout20(props: LayoutRenderProps) {
  return paginate(
    props,
    <>
      <CanvaClassicHeader {...props} />
      <ProfileBlock {...props} />
      <section className="cv-sec cv-timeline-wrap">
        <div className="cv-timeline">
          <ExperienceBlock {...props} />
        </div>
      </section>
      <SkillsSection {...props} />
    </>,
    <>
      <EducationBlock {...props} />
      <KeyAchievements {...props} />
      <AdditionalInfo {...props} />
    </>,
  );
}

const RENDERERS: Record<PdfLayoutId, (p: LayoutRenderProps) => ReactNode> = {
  "pdf-01-classic": layout01,
  "pdf-02-contact-left": layout02,
  "pdf-03-sidebar-contact": layout03,
  "pdf-04-about-left": layout04,
  "pdf-05-creative-name": layout05,
  "pdf-06-centered-pro": layout06,
  "pdf-07-classic-process": layout07,
  "pdf-08-sidebar-about": layout08,
  "pdf-09-sidebar-product": layout09,
  "pdf-10-web-split": (p) => layoutWebSplit(p, false),
  "pdf-11-web-split-alt": (p) => layoutWebSplit(p, true),
  "pdf-12-graphic-top": layout12,
  "pdf-13-classic-pm": layout01,
  "pdf-14-hero-accountant": layout14,
  "pdf-15-social-achieve": layout15,
  "pdf-16-marketing-header": layout16,
  "pdf-17-vertical-name": layout17,
  "pdf-18-copywriter-cols": layout18,
  "pdf-19-it-profile": layout19,
  "pdf-20-it-timeline": layout20,
};

export function renderPdfLayout(layoutId: PdfLayoutId, props: LayoutRenderProps) {
  const fn = RENDERERS[layoutId] ?? layout01;
  return fn(props);
}
