import type { ReactNode } from "react";
import type { LayoutRenderProps } from "./types.js";
import { PDF_LAYOUT_BY_TEMPLATE, type PdfLayoutId } from "./pdf-design-map.js";
import { renderPdfLayout } from "./pdf-layouts.js";
import {
  ExpDateGrid,
  ExpTableHtml,
  LinksRail,
  Masthead,
  MetaRow,
  Page,
  Pages3,
  PhotoSlot,
  Profile,
  ProjectsBlock,
  SecTitle,
  SkillsSection,
  TotalsFooter,
} from "./blocks.js";

function standardTail(props: LayoutRenderProps) {
  return (
    <>
      <ProjectsBlock {...props} />
      <SkillsSection {...props} />
    </>
  );
}

function standardThreePage(props: LayoutRenderProps, page1: ReactNode, page2?: ReactNode) {
  const formal = props.cfg.formalPadding;
  return (
    <Pages3
      formal={formal}
      a={page1}
      b={page2 ?? standardTail(props)}
      c={<TotalsFooter {...props} />}
    />
  );
}

function InvoiceMain(props: LayoutRenderProps) {
  const { cfg, data, editable, onFieldChange } = props;
  return (
    <>
      <MetaRow {...props} />
      <Masthead {...props} />
      <Profile {...props} />
      <section className="cv-sec">
        <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
        <ExpDateGrid jobs={data.experience} editable={editable} onFieldChange={onFieldChange} />
      </section>
    </>
  );
}

function SidebarRail(props: LayoutRenderProps & { side: "left" | "right"; pct: number; dark?: boolean }) {
  const { data, cfg, editable, onFieldChange, side, pct, dark } = props;
  const showPhoto = cfg.photoDefault;
  return (
    <aside
      className={`cv-sidebar-rail cv-sidebar-${side}${dark ? " cv-sidebar-dark" : ""}`}
      style={{ flex: `0 0 ${pct}%` }}
      data-sidebar-gradient={dark ? "1" : undefined}
    >
      <PhotoSlot data={data} shape={cfg.photoShape} size={cfg.photoSize} visible={showPhoto} />
      <SkillsSection {...props} />
      <section className="cv-sec">
        <SecTitle title="Languages" variant={cfg.sectionTitle} />
        <span className="cv-body">{data.languages}</span>
      </section>
      <LinksRail data={data} />
    </aside>
  );
}

export function renderLayoutBody(props: LayoutRenderProps): ReactNode {
  const pdfLayout = PDF_LAYOUT_BY_TEMPLATE[props.cfg.id] as PdfLayoutId | undefined;
  if (pdfLayout) return renderPdfLayout(pdfLayout, props);

  const { cfg, data } = props;
  const L = cfg.layout;

  if (L === "swiss-single") {
    return standardThreePage(
      props,
      <>
        <div className="cv-swiss-head">
          <Masthead {...props} />
          <p className="cv-role-title">{data.title}</p>
        </div>
        <MetaRow {...props} />
        <Profile {...props} />
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
    );
  }

  if (L === "sidebar-left" || L === "sidebar-left-dark") {
    const dark = L === "sidebar-left-dark";
    const pct = cfg.sidebarPct ?? 27;
    return standardThreePage(
      props,
      <div className="cv-split">
        <SidebarRail {...props} side="left" pct={pct} dark={dark} />
        <main className="cv-main" style={{ flex: `1 1 ${100 - pct}%` }}>
          <InvoiceMain {...props} />
        </main>
      </div>,
      <ProjectsBlock {...props} />,
    );
  }

  if (L === "sidebar-right") {
    const pct = cfg.sidebarPct ?? 30;
    return standardThreePage(
      props,
      <div className="cv-split">
        <main className="cv-main cv-rail-tint" style={{ flex: `1 1 ${100 - pct}%` }}>
          <InvoiceMain {...props} />
        </main>
        <SidebarRail {...props} side="right" pct={pct} />
      </div>,
    );
  }

  if (L === "minimal-dense") {
    return standardThreePage(
      props,
      <>
        <Masthead {...props} />
        <div className="cv-hairline" />
        <MetaRow {...props} />
        <Profile {...props} />
        <section className="cv-sec cv-dense">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
    );
  }

  if (L === "timeline") {
    return standardThreePage(
      props,
      <>
        <MetaRow {...props} />
        <Masthead {...props} />
        <Profile {...props} />
        <section className="cv-sec cv-timeline-wrap">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <div className="cv-timeline">
            <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
          </div>
        </section>
      </>,
      <>
        <SkillsSection {...props} />
        <ProjectsBlock {...props} />
      </>,
    );
  }

  if (L === "magazine-hero") {
    return standardThreePage(
      props,
      <>
        <Masthead {...props} />
        <MetaRow {...props} />
        <div className="cv-mag-hero">
          <div className="cv-mag-summary">
            <Profile {...props} />
          </div>
          <div className="cv-mag-skills">
            <SkillsSection {...props} />
          </div>
        </div>
        <section className="cv-sec cv-banded">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
      <ProjectsBlock {...props} />,
    );
  }

  if (L === "bands") {
    return standardThreePage(
      props,
      <>
        <MetaRow {...props} />
        <Masthead {...props} />
        <div className="cv-band">
          <Profile {...props} />
        </div>
        <div className="cv-band">
          <section className="cv-sec">
            <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
            <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
          </section>
        </div>
        <div className="cv-band">
          <SkillsSection {...props} />
        </div>
      </>,
      <ProjectsBlock {...props} />,
    );
  }

  if (L === "banner-exec") {
    return standardThreePage(
      props,
      <>
        <header className="cv-exec-banner">
          <MetaRow {...props} />
          <Masthead {...props} />
        </header>
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
      <>
        <SkillsSection {...props} />
        <ProjectsBlock {...props} />
      </>,
    );
  }

  if (L === "invoice-table") {
    const pct = cfg.sidebarPct ?? 24;
    return standardThreePage(
      props,
      <div className="cv-split">
        <main className="cv-main" style={{ flex: `1 1 ${100 - pct}%` }}>
          <MetaRow {...props} />
          <Masthead {...props} />
          <Profile {...props} />
          <section className="cv-sec">
            <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
            <ExpTableHtml {...props} jobs={data.experience} />
          </section>
        </main>
        <SidebarRail {...props} side="right" pct={pct} />
      </div>,
      <ProjectsBlock {...props} />,
    );
  }

  if (L === "academic-boxed") {
    return standardThreePage(
      props,
      <>
        <Masthead {...props} />
        <MetaRow {...props} />
        <div className="cv-box">
          <Profile {...props} />
        </div>
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
    );
  }

  if (L === "centered-serif" || L === "centered-luxury") {
    return standardThreePage(
      props,
      <div className="cv-centered-col cv-serif-doc">
        <Masthead {...props} centered />
        <MetaRow {...props} />
        <Profile {...props} />
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </div>,
      <>
        <SkillsSection {...props} />
        <ProjectsBlock {...props} />
      </>,
    );
  }

  if (L === "asymmetric") {
    return standardThreePage(
      props,
      <>
        <div className="cv-asym-head">
          <Masthead {...props} />
        </div>
        <p className="cv-asym-role">{data.title}</p>
        <div className="cv-asym-summary">
          <Profile {...props} />
        </div>
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
      <>
        <div className="cv-proj-cols">
          <ProjectsBlock {...props} />
        </div>
        <SkillsSection {...props} />
      </>,
    );
  }

  if (L === "card-modular") {
    return standardThreePage(
      props,
      <>
        <div className="cv-card-grid">
          <div className="cv-card">
            <Profile {...props} />
          </div>
          <div className="cv-card cv-card-dark">
            <SkillsSection {...props} />
          </div>
          <div className="cv-card">
            <PhotoSlot data={data} shape={cfg.photoShape} size={cfg.photoSize} visible={cfg.photoDefault} />
            <LinksRail data={data} />
          </div>
        </div>
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          {data.experience.map((job, i) => (
            <div key={i} className="cv-card cv-row">
              <ExpDateGrid jobs={[job]} editable={props.editable} onFieldChange={props.onFieldChange} />
            </div>
          ))}
        </section>
      </>,
      <ProjectsBlock {...props} />,
    );
  }

  if (L === "grid-12") {
    return standardThreePage(
      props,
      <div className="cv-grid12">
        <div className="cv-g12-name">
          <Masthead {...props} />
        </div>
        <div className="cv-g12-meta">
          <MetaRow {...props} />
        </div>
        <div className="cv-g12-sum">
          <Profile {...props} />
        </div>
        <div className="cv-g12-skills">
          <SkillsSection {...props} />
        </div>
        <div className="cv-g12-exp">
          <section className="cv-sec">
            <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
            <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
          </section>
        </div>
      </div>,
      <ProjectsBlock {...props} />,
    );
  }

  if (L === "newspaper") {
    return standardThreePage(
      props,
      <>
        <div className="cv-news-rule" />
        <Masthead {...props} />
        <div className="cv-news-cols">
          <Profile {...props} />
        </div>
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
      <>
        <div className="cv-news-cols-2">
          <ProjectsBlock {...props} />
        </div>
        <SkillsSection {...props} />
      </>,
    );
  }

  if (L === "brutalist") {
    return standardThreePage(
      props,
      <>
        <div className="cv-brutal-top" />
        <MetaRow {...props} />
        <Masthead {...props} />
        <Profile {...props} />
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
    );
  }

  if (L === "offset-magazine") {
    return standardThreePage(
      props,
      <>
        <div className="cv-prism-hero">
          <PhotoSlot data={data} shape={cfg.photoShape} size={cfg.photoSize} visible={cfg.photoDefault} />
          <div className="cv-prism-mast">
            <Masthead {...props} />
          </div>
        </div>
        <MetaRow {...props} />
        <Profile {...props} />
        <section className="cv-sec">
          <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
          <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
        </section>
      </>,
    );
  }

  if (L === "sidebar-narrow") {
    const pct = cfg.sidebarPct ?? 22;
    return standardThreePage(
      props,
      <div className="cv-split cv-dense">
        <SidebarRail {...props} side="left" pct={pct} dark />
        <main className="cv-main" style={{ flex: `1 1 ${100 - pct}%` }}>
          <InvoiceMain {...props} />
        </main>
      </div>,
      <ProjectsBlock {...props} />,
    );
  }

  return standardThreePage(
    props,
    <>
      <Masthead {...props} />
      <MetaRow {...props} />
      <Profile {...props} />
      <section className="cv-sec">
        <SecTitle title="Professional Experience" variant={cfg.sectionTitle} />
        <ExpDateGrid jobs={data.experience} editable={props.editable} onFieldChange={props.onFieldChange} />
      </section>
    </>,
  );
}
