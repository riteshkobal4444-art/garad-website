import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import {
  AnnualReportData,
  AnnualReportImpactItem,
  AnnualReportProject,
} from '../../src/data/annualReport2020_21';

/**
 * =============================================================================
 * GARAD FOUNDATION — REUSABLE ANNUAL REPORT PDF DESIGN SYSTEM
 * =============================================================================
 * - A4 Portrait (595.28 × 841.89 pt) print-ready editorial layout
 * - Official logo-inspired colour palette (#B92D09, #D24D0A, #5F140A, #E6D1B1,
 *   #C1A88B, #30221C, #FAF7F0, #FFFFFF)
 * - Reusable upper-right logo header component stamped automatically on EVERY
 *   page (cover + contents + all content & overflow pages)
 * - Embedded Google Noto Serif / Noto Sans + Noto Devanagari TrueType fonts
 *   for selectable, searchable English & Marathi text
 * - Dynamic two-pass Table of Contents with mathematically exact page numbers
 * - Strict zero-blank-page pagination safeguards
 * =============================================================================
 */

export const REPORT_PALETTE = {
  rustRed: '#B92D09', // Main headings & important highlights
  burntOrange: '#D24D0A', // Section accents, charts, numbers & infographic highlights
  deepMaroon: '#5F140A', // Strong headings & dark design elements (used sparingly)
  warmCream: '#E6D1B1', // Soft backgrounds & decorative/info panels
  antiqueGold: '#C1A88B', // Borders, dividers & octagonal decorative details
  darkBrown: '#30221C', // Main body text
  softIvory: '#FAF7F0', // Primary page background
  white: '#FFFFFF', // Content cards & table backgrounds

  // Subtle derived tints strictly within the official palette family
  creamSoft: '#F3E9D8',
  ivoryBorder: '#E2D4BF',
  mutedBrown: '#69574E',
} as const;

const MM_TO_PT = 72 / 25.4;

const LAYOUT = {
  width: 595.28, // A4 width (210 mm)
  height: 841.89, // A4 height (297 mm)
  marginX: 50, // ~17.6 mm left/right margin
  marginTop: 86, // Keeps content strictly below the upper-right 22mm logo header
  marginBottom: 58, // Keeps content strictly above the running footer
  contentWidth: 595.28 - 50 * 2,
  // Logo dimensions (exact spec: 20-25mm on content pages, slightly larger on cover)
  contentLogoW: Math.round(22 * MM_TO_PT), // ~62 pt (22 mm)
  contentLogoH: Math.round(18 * MM_TO_PT), // ~51 pt max height (aspect ratio preserved via fit)
  coverLogoW: Math.round(30 * MM_TO_PT), // ~85 pt (30 mm)
  coverLogoH: Math.round(26 * MM_TO_PT), // ~74 pt max height (aspect ratio preserved via fit)
};

interface RegisteredFonts {
  serif: string;
  serifBold: string;
  serifItalic: string;
  sans: string;
  sansBold: string;
  devanagariSerif: string;
  devanagariSerifBold: string;
  devanagariSans: string;
  hasUnicodeFonts: boolean;
}

const FONT_PATHS = {
  notoSerif: '/usr/share/fonts/truetype/noto/NotoSerif-Regular.ttf',
  notoSerifBold: '/usr/share/fonts/truetype/noto/NotoSerif-Bold.ttf',
  notoSerifItalic: '/usr/share/fonts/truetype/noto/NotoSerif-Italic.ttf',
  notoSans: '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
  notoSansBold: '/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf',
  notoDevaSerif: '/usr/share/fonts/truetype/noto/NotoSerifDevanagari-Regular.ttf',
  notoDevaSerifBold: '/usr/share/fonts/truetype/noto/NotoSerifDevanagari-Bold.ttf',
  notoDevaSans: '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf',
};

function registerReportFonts(doc: PDFKit.PDFDocument): RegisteredFonts {
  const hasCoreNoto =
    fs.existsSync(FONT_PATHS.notoSerif) &&
    fs.existsSync(FONT_PATHS.notoSerifBold) &&
    fs.existsSync(FONT_PATHS.notoSans) &&
    fs.existsSync(FONT_PATHS.notoSansBold);

  if (hasCoreNoto) {
    doc.registerFont('GF-Serif', FONT_PATHS.notoSerif);
    doc.registerFont('GF-Serif-Bold', FONT_PATHS.notoSerifBold);
    doc.registerFont(
      'GF-Serif-Italic',
      fs.existsSync(FONT_PATHS.notoSerifItalic)
        ? FONT_PATHS.notoSerifItalic
        : FONT_PATHS.notoSerif
    );
    doc.registerFont('GF-Sans', FONT_PATHS.notoSans);
    doc.registerFont('GF-Sans-Bold', FONT_PATHS.notoSansBold);

    const hasDevaSerif = fs.existsSync(FONT_PATHS.notoDevaSerif);
    const hasDevaSerifBold = fs.existsSync(FONT_PATHS.notoDevaSerifBold);
    const hasDevaSans = fs.existsSync(FONT_PATHS.notoDevaSans);

    if (hasDevaSerif) doc.registerFont('GF-Deva-Serif', FONT_PATHS.notoDevaSerif);
    if (hasDevaSerifBold)
      doc.registerFont('GF-Deva-Serif-Bold', FONT_PATHS.notoDevaSerifBold);
    if (hasDevaSans) doc.registerFont('GF-Deva-Sans', FONT_PATHS.notoDevaSans);

    return {
      serif: 'GF-Serif',
      serifBold: 'GF-Serif-Bold',
      serifItalic: 'GF-Serif-Italic',
      sans: 'GF-Sans',
      sansBold: 'GF-Sans-Bold',
      devanagariSerif: hasDevaSerif ? 'GF-Deva-Serif' : 'GF-Serif',
      devanagariSerifBold: hasDevaSerifBold ? 'GF-Deva-Serif-Bold' : 'GF-Serif-Bold',
      devanagariSans: hasDevaSans ? 'GF-Deva-Sans' : 'GF-Sans',
      hasUnicodeFonts: true,
    };
  }

  return {
    serif: 'Times-Roman',
    serifBold: 'Times-Bold',
    serifItalic: 'Times-Italic',
    sans: 'Helvetica',
    sansBold: 'Helvetica-Bold',
    devanagariSerif: 'Times-Roman',
    devanagariSerifBold: 'Times-Bold',
    devanagariSans: 'Helvetica',
    hasUnicodeFonts: false,
  };
}

function containsDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function safeText(text: string, fonts: RegisteredFonts): string {
  if (fonts.hasUnicodeFonts) {
    return text;
  }
  return text
    .replace(/\u2014/g, ' - ')
    .replace(/\u2013/g, '-')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u20B9/g, 'INR ')
    .replace(/\u00B7/g, ' | ');
}

function resolveLogoAssetPath(rootDir: string, configuredPath: string): string | null {
  const candidates = [
    configuredPath,
    'public/assets/branding/garad-foundation-logo.png',
    'public/assets/branding/garad-foundation-logo.jpg',
    'public/assets/branding/garad-foundation-logo.jpeg',
    'src/assets/branding/garad-foundation-logo.png',
  ];
  for (const rel of candidates) {
    if (!rel) continue;
    const abs = path.isAbsolute(rel) ? rel : path.join(rootDir, rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      return abs;
    }
  }
  return null;
}

function resolveImageAssetPath(rootDir: string, relPath?: string | null): string | null {
  if (!relPath) return null;
  const abs = path.isAbsolute(relPath) ? relPath : path.join(rootDir, relPath);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
    return abs;
  }
  return null;
}

/**
 * Draws a subtle regular octagon vector path inspired by the Garad Foundation logo border.
 */
function traceOctagonPath(
  doc: PDFKit.PDFDocument,
  cx: number,
  cy: number,
  radius: number
) {
  const sides = 8;
  const offsetAngle = Math.PI / 8; // Flat top & bottom edges
  for (let i = 0; i < sides; i++) {
    const angle = offsetAngle + (i * 2 * Math.PI) / sides;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);
    if (i === 0) doc.moveTo(px, py);
    else doc.lineTo(px, py);
  }
  doc.closePath();
}

/**
 * REUSABLE UPPER-RIGHT OFFICIAL LOGO COMPONENT
 * ---------------------------------------------------------------------------
 * Placed in the upper-right corner of EVERY page (cover + contents + every
 * content & auto-overflow page).
 * - Uses the exact unmodified original logo file when present, strictly
 *   preserving its aspect ratio via `fit` (never stretched, cropped, or recoloured).
 * - Renders a clearly labelled octagonal slot placeholder ONLY when the logo
 *   image file has not yet been placed in `public/assets/branding/`.
 */
function drawOfficialLogoUpperRight(
  doc: PDFKit.PDFDocument,
  fonts: RegisteredFonts,
  logoAbsPath: string | null,
  variant: 'cover' | 'content'
) {
  const boxW = variant === 'cover' ? LAYOUT.coverLogoW : LAYOUT.contentLogoW;
  const boxH = variant === 'cover' ? LAYOUT.coverLogoH : LAYOUT.contentLogoH;
  const x = LAYOUT.width - LAYOUT.marginX - boxW;
  const y = variant === 'cover' ? 24 : 15;

  doc.save();

  if (logoAbsPath) {
    // Clean compatible ivory/white backing only if subtle framing is helpful;
    // preserves transparent PNGs directly on the Soft Ivory canvas.
    doc.image(logoAbsPath, x, y, {
      fit: [boxW, boxH],
      align: 'right',
      valign: 'center',
    });
  } else {
    // Honest placeholder slot in exact octagonal geometry until official file is uploaded
    const r = Math.min(boxW, boxH) * 0.48;
    const cx = x + boxW - r - 2;
    const cy = y + boxH / 2;

    traceOctagonPath(doc, cx, cy, r);
    doc.fillColor(REPORT_PALETTE.white).fill();

    traceOctagonPath(doc, cx, cy, r);
    doc.lineWidth(1.1).strokeColor(REPORT_PALETTE.antiqueGold).stroke();

    traceOctagonPath(doc, cx, cy, r - 3.2);
    doc.lineWidth(0.5).strokeColor(REPORT_PALETTE.rustRed).stroke();

    doc
      .font(fonts.serifBold)
      .fontSize(variant === 'cover' ? 9.5 : 7.2)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text('GARAD', cx - r, cy - (variant === 'cover' ? 9 : 6.5), {
        width: r * 2,
        align: 'center',
        lineBreak: false,
      });

    doc
      .font(fonts.sansBold)
      .fontSize(variant === 'cover' ? 5.6 : 4.5)
      .fillColor(REPORT_PALETTE.rustRed)
      .text('OFFICIAL LOGO', cx - r, cy + (variant === 'cover' ? 2.5 : 1.5), {
        width: r * 2,
        align: 'center',
        lineBreak: false,
      });
  }

  doc.restore();
}

interface PageMeta {
  headerLeft: string;
}

class AnnualReportBuilder {
  doc: PDFKit.PDFDocument;
  fonts: RegisteredFonts;
  data: AnnualReportData;
  rootDir: string;
  logoAbsPath: string | null;
  pageMeta: PageMeta[] = [];
  currentSectionLabel = 'Table of Contents';
  sectionPageMap = new Map<string, number>();

  constructor(data: AnnualReportData, rootDir: string) {
    this.data = data;
    this.rootDir = rootDir;
    this.logoAbsPath = resolveLogoAssetPath(rootDir, data.branding.logoPath);

    this.doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: LAYOUT.marginTop,
        bottom: LAYOUT.marginBottom,
        left: LAYOUT.marginX,
        right: LAYOUT.marginX,
      },
      bufferPages: true,
      info: {
        Title: `${data.branding.organisationName} — ${data.reportTitle}`,
        Author: `${data.branding.organisationName}, ${data.branding.locationLabel}`,
        Subject: `${data.reportTitle} (${data.reportingPeriod}) — ${data.tagline}`,
        Keywords: `${data.branding.organisationName}, Annual Report, ${data.reportYearLabel}, CSR, Nonprofit, Maharashtra`,
        Creator: 'Garad Foundation Annual Report PDF Design System',
      },
    });

    this.fonts = registerReportFonts(this.doc);

    // Record Page 1 (Cover) metadata
    this.pageMeta.push({ headerLeft: '' });

    // Every automatically or manually added page gets the Soft Ivory background underneath content
    this.doc.on('pageAdded', () => {
      this.pageMeta.push({ headerLeft: this.currentSectionLabel });
      this.paintSoftIvoryBackground();
    });
  }

  private paintSoftIvoryBackground() {
    this.doc.save();
    this.doc
      .rect(0, 0, LAYOUT.width, LAYOUT.height)
      .fillColor(REPORT_PALETTE.softIvory)
      .fill();
    this.doc.restore();
  }

  get currentPageNumber(): number {
    return this.doc.bufferedPageRange().count;
  }

  addFreshPage(sectionLabel: string) {
    this.currentSectionLabel = sectionLabel;
    this.doc.addPage();
    this.doc.y = LAYOUT.marginTop;
  }

  ensureSpace(neededHeight: number) {
    const maxY = LAYOUT.height - LAYOUT.marginBottom;
    if (this.doc.y > LAYOUT.marginTop + 2 && this.doc.y + neededHeight > maxY) {
      this.doc.addPage();
      this.doc.y = LAYOUT.marginTop;
    }
  }

  /**
   * Starts a major numbered section on a fresh page (or continues cleanly) and
   * records its exact 1-based page number for the automatic Table of Contents.
   */
  beginMajorSection(
    sectionNum: string,
    title: string,
    options?: { startOnNewPage?: boolean; subtitle?: string }
  ) {
    const startNew = options?.startOnNewPage ?? true;
    this.currentSectionLabel = `${sectionNum}. ${title}`;

    if (startNew) {
      this.doc.addPage();
      this.doc.y = LAYOUT.marginTop;
    } else {
      this.ensureSpace(120);
      if (this.doc.y > LAYOUT.marginTop + 6) {
        this.doc.y += 14;
      }
      // Update current page header if starting near top of page
      if (this.doc.y <= LAYOUT.marginTop + 4) {
        this.pageMeta[this.pageMeta.length - 1] = {
          headerLeft: this.currentSectionLabel,
        };
      }
    }

    this.sectionPageMap.set(sectionNum, this.currentPageNumber);

    const startY = this.doc.y;

    // Octagonal section index badge
    const badgeR = 12;
    const badgeCx = LAYOUT.marginX + badgeR;
    const badgeCy = startY + 13;

    this.doc.save();
    traceOctagonPath(this.doc, badgeCx, badgeCy, badgeR);
    this.doc.fillColor(REPORT_PALETTE.warmCream).fill();
    traceOctagonPath(this.doc, badgeCx, badgeCy, badgeR);
    this.doc.lineWidth(0.9).strokeColor(REPORT_PALETTE.antiqueGold).stroke();

    this.doc
      .font(this.fonts.sansBold)
      .fontSize(8.5)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(sectionNum, badgeCx - badgeR, badgeCy - 4.5, {
        width: badgeR * 2,
        align: 'center',
        lineBreak: false,
      });
    this.doc.restore();

    const textX = LAYOUT.marginX + badgeR * 2 + 10;
    const textW = LAYOUT.contentWidth - (badgeR * 2 + 10);

    this.doc
      .font(this.fonts.sansBold)
      .fontSize(7.8)
      .fillColor(REPORT_PALETTE.burntOrange)
      .text(`SECTION ${sectionNum}`, textX, startY, {
        width: textW,
        characterSpacing: 1.4,
      });

    this.doc
      .font(this.fonts.serifBold)
      .fontSize(19)
      .fillColor(REPORT_PALETTE.rustRed)
      .text(safeText(title, this.fonts), textX, startY + 10, {
        width: textW,
      });

    if (options?.subtitle) {
      this.doc
        .font(this.fonts.sans)
        .fontSize(9.2)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(safeText(options.subtitle, this.fonts), textX, this.doc.y + 2, {
          width: textW,
        });
    }

    const ruleY = Math.max(this.doc.y + 7, startY + 34);
    this.doc
      .moveTo(LAYOUT.marginX, ruleY)
      .lineTo(LAYOUT.marginX + 54, ruleY)
      .lineWidth(1.8)
      .strokeColor(REPORT_PALETTE.rustRed)
      .stroke();

    this.doc
      .moveTo(LAYOUT.marginX + 60, ruleY)
      .lineTo(LAYOUT.marginX + LAYOUT.contentWidth, ruleY)
      .lineWidth(0.7)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    this.doc.y = ruleY + 14;
  }

  drawSubheading(title: string) {
    this.ensureSpace(36);
    this.doc
      .font(this.fonts.serifBold)
      .fontSize(12)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(safeText(title, this.fonts), LAYOUT.marginX, this.doc.y + 4, {
        width: LAYOUT.contentWidth,
      });
    this.doc.y += 5;
  }

  drawParagraph(
    text: string,
    options?: { fontSize?: number; color?: string; italic?: boolean; gapAfter?: number }
  ) {
    const clean = safeText(text, this.fonts);
    const fontSize = options?.fontSize ?? 9.8;
    const isDeva = containsDevanagari(clean);
    const fontName = isDeva
      ? this.fonts.devanagariSans
      : options?.italic
      ? this.fonts.serifItalic
      : this.fonts.sans;

    this.doc.font(fontName).fontSize(fontSize);
    const h = this.doc.heightOfString(clean, {
      width: LAYOUT.contentWidth,
      lineGap: 3.6,
    });

    this.ensureSpace(Math.min(h + 10, 96));

    this.doc
      .font(fontName)
      .fontSize(fontSize)
      .fillColor(options?.color ?? REPORT_PALETTE.darkBrown)
      .text(clean, LAYOUT.marginX, this.doc.y, {
        width: LAYOUT.contentWidth,
        lineGap: 3.6,
        align: 'left',
      });

    this.doc.y += options?.gapAfter ?? 8;
  }

  drawBulletList(items: string[], bulletColor: string = REPORT_PALETTE.burntOrange) {
    for (const item of items) {
      const clean = safeText(item, this.fonts);
      const fontName = containsDevanagari(clean)
        ? this.fonts.devanagariSans
        : this.fonts.sans;
      this.doc.font(fontName).fontSize(9.5);
      const h = this.doc.heightOfString(clean, {
        width: LAYOUT.contentWidth - 18,
        lineGap: 3.2,
      });

      this.ensureSpace(h + 7);
      const y = this.doc.y;

      // Restrained small rotated diamond/octagon-inspired bullet
      this.doc.save();
      this.doc
        .polygon(
          [LAYOUT.marginX + 4, y + 4],
          [LAYOUT.marginX + 7, y + 7],
          [LAYOUT.marginX + 4, y + 10],
          [LAYOUT.marginX + 1, y + 7]
        )
        .fillColor(bulletColor)
        .fill();
      this.doc.restore();

      this.doc
        .font(fontName)
        .fontSize(9.5)
        .fillColor(REPORT_PALETTE.darkBrown)
        .text(clean, LAYOUT.marginX + 16, y, {
          width: LAYOUT.contentWidth - 16,
          lineGap: 3.2,
        });

      this.doc.y += 5;
    }
    this.doc.y += 4;
  }

  drawInfoPanel(
    title: string,
    body: string,
    tone: 'cream' | 'white' = 'cream'
  ) {
    const cleanTitle = safeText(title, this.fonts);
    const cleanBody = safeText(body, this.fonts);
    const padX = 14;
    const padY = 11;
    const innerW = LAYOUT.contentWidth - padX * 2;

    this.doc.font(this.fonts.sansBold).fontSize(9.2);
    const titleH = this.doc.heightOfString(cleanTitle, { width: innerW });
    this.doc.font(this.fonts.sans).fontSize(9.1);
    const bodyH = this.doc.heightOfString(cleanBody, {
      width: innerW,
      lineGap: 3.2,
    });

    const boxH = padY * 2 + titleH + bodyH + 6;
    this.ensureSpace(boxH + 10);
    const y = this.doc.y;

    this.doc
      .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, boxH, 5)
      .fillColor(
        tone === 'cream' ? REPORT_PALETTE.creamSoft : REPORT_PALETTE.white
      )
      .fill();

    this.doc
      .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, boxH, 5)
      .lineWidth(0.75)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    // Subtle horizontal top editorial accent line
    this.doc
      .rect(LAYOUT.marginX, y, LAYOUT.contentWidth, 2.2)
      .fillColor(tone === 'cream' ? REPORT_PALETTE.rustRed : REPORT_PALETTE.burntOrange)
      .fill();

    this.doc
      .font(this.fonts.sansBold)
      .fontSize(9.1)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(cleanTitle, LAYOUT.marginX + padX, y + padY + 1, { width: innerW });

    this.doc
      .font(this.fonts.sans)
      .fontSize(9.1)
      .fillColor(REPORT_PALETTE.darkBrown)
      .text(cleanBody, LAYOUT.marginX + padX, y + padY + titleH + 6, {
        width: innerW,
        lineGap: 3.2,
      });

    this.doc.y = y + boxH + 12;
  }

  drawTable(
    headers: string[],
    rows: string[][],
    colRatios: number[]
  ) {
    const colWidths = colRatios.map((r) => r * LAYOUT.contentWidth);
    const headerH = 26;
    const padX = 9;
    const padY = 6.5;

    const measureRow = (row: string[]) => {
      let maxH = 0;
      row.forEach((cell, i) => {
        const clean = safeText(cell, this.fonts);
        this.doc
          .font(i === 0 ? this.fonts.sansBold : this.fonts.sans)
          .fontSize(8.8);
        const h = this.doc.heightOfString(clean, {
          width: colWidths[i] - padX * 2,
          lineGap: 2.2,
        });
        if (h > maxH) maxH = h;
      });
      return Math.max(24, maxH + padY * 2);
    };

    const drawHeaderRow = (startY: number) => {
      this.doc
        .rect(LAYOUT.marginX, startY, LAYOUT.contentWidth, headerH)
        .fillColor(REPORT_PALETTE.deepMaroon)
        .fill();

      let x = LAYOUT.marginX;
      headers.forEach((h, i) => {
        this.doc
          .font(this.fonts.sansBold)
          .fontSize(8.5)
          .fillColor(REPORT_PALETTE.white)
          .text(safeText(h, this.fonts), x + padX, startY + 8, {
            width: colWidths[i] - padX * 2,
            lineBreak: false,
          });
        x += colWidths[i];
      });
      return startY + headerH;
    };

    const rowHeights = rows.map(measureRow);
    const firstRowH = rowHeights[0] ?? 24;

    // Prevent orphaned table headers
    this.ensureSpace(headerH + firstRowH + 10);
    let y = drawHeaderRow(this.doc.y);

    rows.forEach((row, idx) => {
      const rowH = rowHeights[idx];
      if (
        y > LAYOUT.marginTop + headerH + 2 &&
        y + rowH > LAYOUT.height - LAYOUT.marginBottom
      ) {
        this.doc.addPage();
        y = drawHeaderRow(LAYOUT.marginTop);
      }

      this.doc
        .rect(LAYOUT.marginX, y, LAYOUT.contentWidth, rowH)
        .fillColor(idx % 2 === 0 ? REPORT_PALETTE.white : REPORT_PALETTE.creamSoft)
        .fill();

      this.doc
        .moveTo(LAYOUT.marginX, y + rowH)
        .lineTo(LAYOUT.marginX + LAYOUT.contentWidth, y + rowH)
        .lineWidth(0.55)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      let x = LAYOUT.marginX;
      row.forEach((cell, i) => {
        const clean = safeText(cell, this.fonts);
        const isPlaceholder = clean.startsWith('[');
        this.doc
          .font(i === 0 ? this.fonts.sansBold : this.fonts.sans)
          .fontSize(8.8)
          .fillColor(
            isPlaceholder
              ? REPORT_PALETTE.mutedBrown
              : i === 0
              ? REPORT_PALETTE.deepMaroon
              : REPORT_PALETTE.darkBrown
          )
          .text(clean, x + padX, y + padY, {
            width: colWidths[i] - padX * 2,
            lineGap: 2.2,
          });
        x += colWidths[i];
      });

      y += rowH;
    });

    this.doc
      .moveTo(LAYOUT.marginX, y)
      .lineTo(LAYOUT.marginX + LAYOUT.contentWidth, y)
      .lineWidth(1)
      .strokeColor(REPORT_PALETTE.rustRed)
      .stroke();

    this.doc.y = y + 13;
  }

  private drawMinimalVectorIcon(
    kind: AnnualReportImpactItem['icon'],
    cx: number,
    cy: number
  ) {
    this.doc.save();
    this.doc.strokeColor(REPORT_PALETTE.rustRed).lineWidth(1.2);
    if (kind === 'schools' || kind === 'projects') {
      // Open book / document motif
      this.doc.rect(cx - 6, cy - 5, 12, 10).stroke();
      this.doc.moveTo(cx, cy - 5).lineTo(cx, cy + 5).stroke();
    } else if (kind === 'beneficiaries' || kind === 'volunteers') {
      // Minimal community person motif
      this.doc.circle(cx, cy - 3.5, 2.8).stroke();
      this.doc.moveTo(cx - 5.5, cy + 5).quadraticCurveTo(cx, cy, cx + 5.5, cy + 5).stroke();
    } else if (kind === 'funds') {
      // Octagonal coin / stewardship emblem
      traceOctagonPath(this.doc, cx, cy, 6);
      this.doc.stroke();
      this.doc.circle(cx, cy, 2).fillColor(REPORT_PALETTE.burntOrange).fill();
    } else {
      // Location diamond pin
      this.doc.circle(cx, cy - 1.5, 3.5).stroke();
      this.doc.moveTo(cx - 2.6, cy + 1).lineTo(cx, cy + 6).lineTo(cx + 2.6, cy + 1).stroke();
    }
    this.doc.restore();
  }

  // =========================================================================
  // PAGE 1 — COVER PAGE
  // =========================================================================
  renderCoverPage() {
    const savedTop = this.doc.page.margins.top;
    const savedBottom = this.doc.page.margins.bottom;
    this.doc.page.margins.top = 0;
    this.doc.page.margins.bottom = 0;

    try {
      // Primary Soft Ivory page background
      this.paintSoftIvoryBackground();

      // Restrained Warm Cream top architectural canvas band (light & refined, never heavy orange/red)
      this.doc
        .rect(0, 0, LAYOUT.width, 146)
        .fillColor(REPORT_PALETTE.creamSoft)
        .fill();

      // Crisp Rust Red & Antique Gold top double rule
      this.doc
        .rect(0, 0, LAYOUT.width, 5)
        .fillColor(REPORT_PALETTE.rustRed)
        .fill();

      this.doc
        .moveTo(LAYOUT.marginX, 146)
        .lineTo(LAYOUT.width - LAYOUT.marginX, 146)
        .lineWidth(0.9)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      // Official Garad Foundation Logo in upper-right corner (slightly larger: 30mm)
      drawOfficialLogoUpperRight(this.doc, this.fonts, this.logoAbsPath, 'cover');

      // Left masthead typography — strictly leaves clearance for the 30mm logo on the right
      const mastheadMaxW = LAYOUT.contentWidth - LAYOUT.coverLogoW - 20;

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(8.5)
        .fillColor(REPORT_PALETTE.burntOrange)
        .text(
          safeText(this.data.branding.organisationName.toUpperCase(), this.fonts),
          LAYOUT.marginX,
          36,
          { width: mastheadMaxW, characterSpacing: 2.2, lineBreak: false }
        );

      if (this.data.marathiSubline) {
        const devaFont = containsDevanagari(this.data.marathiSubline)
          ? this.fonts.devanagariSerifBold
          : this.fonts.serif;
        this.doc
          .font(devaFont)
          .fontSize(10.5)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(safeText(this.data.marathiSubline, this.fonts), LAYOUT.marginX, 54, {
            width: mastheadMaxW,
            lineBreak: false,
          });
      }

      this.doc
        .font(this.fonts.sans)
        .fontSize(9)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(
          safeText(`Reporting Period: ${this.data.reportingPeriod}`, this.fonts),
          LAYOUT.marginX,
          76,
          { width: mastheadMaxW, lineBreak: false }
        );

      // Subtle octagonal ornament beside reporting edition label
      const ornY = 114;
      traceOctagonPath(this.doc, LAYOUT.marginX + 6, ornY + 4, 5.5);
      this.doc.lineWidth(0.8).strokeColor(REPORT_PALETTE.rustRed).stroke();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(8)
        .fillColor(REPORT_PALETTE.deepMaroon)
        .text(
          safeText(this.data.cover.editionNote, this.fonts),
          LAYOUT.marginX + 18,
          ornY,
          { width: mastheadMaxW - 18, lineBreak: false }
        );

      // Cover Title Block
      const titleY = 172;
      this.doc
        .font(this.fonts.serifBold)
        .fontSize(34)
        .fillColor(REPORT_PALETTE.rustRed)
        .text(safeText(this.data.reportTitle, this.fonts), LAYOUT.marginX, titleY, {
          width: LAYOUT.contentWidth,
        });

      // Tagline
      const tagY = this.doc.y + 8;
      this.doc
        .font(this.fonts.serifItalic)
        .fontSize(14.5)
        .fillColor(REPORT_PALETTE.deepMaroon)
        .text(safeText(`“${this.data.tagline}”`, this.fonts), LAYOUT.marginX, tagY, {
          width: LAYOUT.contentWidth,
        });

      // Short Rust Red + Antique Gold decorative divider
      const divY = this.doc.y + 12;
      this.doc
        .moveTo(LAYOUT.marginX, divY)
        .lineTo(LAYOUT.marginX + 68, divY)
        .lineWidth(2.2)
        .strokeColor(REPORT_PALETTE.burntOrange)
        .stroke();
      this.doc
        .moveTo(LAYOUT.marginX + 76, divY)
        .lineTo(LAYOUT.width - LAYOUT.marginX, divY)
        .lineWidth(0.75)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      // Main Cover Visual — One Strong Authentic Field Photograph (undistorted)
      const imgFrameY = divY + 18;
      const imgFrameH = 296;
      const imgAbs = resolveImageAssetPath(this.rootDir, this.data.cover.photoPath);

      this.doc
        .roundedRect(LAYOUT.marginX, imgFrameY, LAYOUT.contentWidth, imgFrameH, 8)
        .fillColor(REPORT_PALETTE.white)
        .fill();

      this.doc
        .roundedRect(LAYOUT.marginX, imgFrameY, LAYOUT.contentWidth, imgFrameH, 8)
        .lineWidth(1)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      const innerPad = 8;
      const innerW = LAYOUT.contentWidth - innerPad * 2;
      const innerH = imgFrameH - innerPad * 2 - 26;

      if (imgAbs) {
        this.doc.save();
        this.doc
          .roundedRect(
            LAYOUT.marginX + innerPad,
            imgFrameY + innerPad,
            innerW,
            innerH,
            5
          )
          .clip();
        this.doc.image(imgAbs, LAYOUT.marginX + innerPad, imgFrameY + innerPad, {
          cover: [innerW, innerH],
          align: 'center',
          valign: 'center',
        });
        this.doc.restore();
      } else {
        this.doc
          .roundedRect(
            LAYOUT.marginX + innerPad,
            imgFrameY + innerPad,
            innerW,
            innerH,
            5
          )
          .fillColor(REPORT_PALETTE.warmCream)
          .fill();
        this.doc
          .font(this.fonts.sans)
          .fontSize(10)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(
            '[Insert high-resolution authentic Garad Foundation field photograph]',
            LAYOUT.marginX + innerPad + 20,
            imgFrameY + innerH / 2,
            { width: innerW - 40, align: 'center' }
          );
      }

      this.doc
        .font(this.fonts.sans)
        .fontSize(8.2)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(
          safeText(this.data.cover.photoCaption, this.fonts),
          LAYOUT.marginX + innerPad,
          imgFrameY + imgFrameH - 22,
          { width: innerW, lineBreak: false }
        );

      // Restrained Warm Cream Institutional Metadata Panel
      const metaY = imgFrameY + imgFrameH + 18;
      const metaH = 128;

      this.doc
        .roundedRect(LAYOUT.marginX, metaY, LAYOUT.contentWidth, metaH, 6)
        .fillColor(REPORT_PALETTE.creamSoft)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, metaY, LAYOUT.contentWidth, metaH, 6)
        .lineWidth(0.85)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      let rowY = metaY + 14;
      for (const [k, v] of this.data.cover.metaSummary) {
        this.doc
          .font(this.fonts.sansBold)
          .fontSize(8.5)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(safeText(k, this.fonts), LAYOUT.marginX + 16, rowY, {
            width: 148,
            lineBreak: false,
          });
        this.doc
          .font(this.fonts.sans)
          .fontSize(8.8)
          .fillColor(REPORT_PALETTE.darkBrown)
          .text(safeText(v, this.fonts), LAYOUT.marginX + 168, rowY, {
            width: LAYOUT.contentWidth - 184,
            lineBreak: false,
          });
        rowY += 26;
      }

      // Clean Cover Bottom Footer Rule
      const footerY = LAYOUT.height - 42;
      this.doc
        .moveTo(LAYOUT.marginX, footerY - 10)
        .lineTo(LAYOUT.width - LAYOUT.marginX, footerY - 10)
        .lineWidth(0.7)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(8)
        .fillColor(REPORT_PALETTE.deepMaroon)
        .text(
          safeText(
            `${this.data.branding.organisationName}  |  ${this.data.reportTitle}`,
            this.fonts
          ),
          LAYOUT.marginX,
          footerY,
          { lineBreak: false }
        );

      this.doc
        .font(this.fonts.sans)
        .fontSize(8)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(
          safeText(this.data.branding.locationLabel, this.fonts),
          LAYOUT.marginX,
          footerY,
          { width: LAYOUT.contentWidth, align: 'right', lineBreak: false }
        );
    } finally {
      this.doc.page.margins.top = savedTop;
      this.doc.page.margins.bottom = savedBottom;
    }
  }

  // =========================================================================
  // PAGE 2 — RESERVED TABLE OF CONTENTS (Back-filled after all sections paginate)
  // =========================================================================
  reserveTableOfContentsPage() {
    this.addFreshPage('Contents');
  }

  populateTableOfContentsPage(
    entries: { num: string; title: string; subtitle: string }[]
  ) {
    this.doc.switchToPage(1); // 0-indexed page 1 = Page 2
    const savedTop = this.doc.page.margins.top;
    const savedBottom = this.doc.page.margins.bottom;
    this.doc.page.margins.top = 0;
    this.doc.page.margins.bottom = 0;

    try {
      let y = LAYOUT.marginTop + 4;

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(8.2)
        .fillColor(REPORT_PALETTE.burntOrange)
        .text('CONTENTS', LAYOUT.marginX, y, {
          characterSpacing: 1.8,
          lineBreak: false,
        });

      y += 14;
      this.doc
        .font(this.fonts.serifBold)
        .fontSize(24)
        .fillColor(REPORT_PALETTE.rustRed)
        .text('Table of Contents', LAYOUT.marginX, y, { lineBreak: false });

      y += 32;
      this.doc
        .font(this.fonts.sans)
        .fontSize(9.5)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(
          safeText(
            `${this.data.branding.organisationName} · ${this.data.reportTitle} (${this.data.reportingPeriod})`,
            this.fonts
          ),
          LAYOUT.marginX,
          y,
          { lineBreak: false }
        );

      y += 18;
      this.doc
        .moveTo(LAYOUT.marginX, y)
        .lineTo(LAYOUT.marginX + 64, y)
        .lineWidth(2)
        .strokeColor(REPORT_PALETTE.rustRed)
        .stroke();
      this.doc
        .moveTo(LAYOUT.marginX + 70, y)
        .lineTo(LAYOUT.width - LAYOUT.marginX, y)
        .lineWidth(0.75)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      y += 22;

      // White editorial card holding all 11 sections cleanly
      const rowStep = 46;
      const cardH = entries.length * rowStep + 22;

      this.doc
        .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, cardH, 7)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, cardH, 7)
        .lineWidth(0.8)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      let itemY = y + 14;
      for (let idx = 0; idx < entries.length; idx++) {
        const entry = entries[idx];
        const pageNum = this.sectionPageMap.get(entry.num) ?? 3;
        const pageStr = String(pageNum).padStart(2, '0');

        // Small octagonal number emblem
        const cx = LAYOUT.marginX + 26;
        const cy = itemY + 15;
        traceOctagonPath(this.doc, cx, cy, 11);
        this.doc.fillColor(REPORT_PALETTE.creamSoft).fill();
        traceOctagonPath(this.doc, cx, cy, 11);
        this.doc.lineWidth(0.75).strokeColor(REPORT_PALETTE.antiqueGold).stroke();

        this.doc
          .font(this.fonts.sansBold)
          .fontSize(8)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(entry.num, cx - 11, cy - 4, {
            width: 22,
            align: 'center',
            lineBreak: false,
          });

        // Section title
        const titleX = LAYOUT.marginX + 48;
        this.doc
          .font(this.fonts.serifBold)
          .fontSize(11.2)
          .fillColor(REPORT_PALETTE.darkBrown)
          .text(safeText(entry.title, this.fonts), titleX, itemY + 4, {
            lineBreak: false,
          });

        // Subtitle
        this.doc
          .font(this.fonts.sans)
          .fontSize(8.2)
          .fillColor(REPORT_PALETTE.mutedBrown)
          .text(safeText(entry.subtitle, this.fonts), titleX, itemY + 20, {
            width: LAYOUT.contentWidth - 110,
            lineBreak: false,
          });

        // Dotted leader to page number
        const rightX = LAYOUT.marginX + LAYOUT.contentWidth - 18;
        this.doc
          .font(this.fonts.sansBold)
          .fontSize(11)
          .fillColor(REPORT_PALETTE.rustRed)
          .text(pageStr, rightX - 24, itemY + 8, {
            width: 24,
            align: 'right',
            lineBreak: false,
          });

        if (idx < entries.length - 1) {
          this.doc
            .moveTo(LAYOUT.marginX + 16, itemY + rowStep - 4)
            .lineTo(LAYOUT.marginX + LAYOUT.contentWidth - 16, itemY + rowStep - 4)
            .lineWidth(0.45)
            .strokeColor(REPORT_PALETTE.ivoryBorder)
            .stroke();
        }

        itemY += rowStep;
      }

      // Subtle reader note at bottom of TOC
      const noteY = y + cardH + 16;
      if (noteY < LAYOUT.height - LAYOUT.marginBottom - 20) {
        this.doc
          .font(this.fonts.sans)
          .fontSize(8.2)
          .fillColor(REPORT_PALETTE.mutedBrown)
          .text(
            safeText(
              'Note: Page numbers are calculated automatically during PDF generation. Bracketed fields indicate editable sections awaiting verified institutional records.',
              this.fonts
            ),
            LAYOUT.marginX,
            noteY,
            { width: LAYOUT.contentWidth, lineGap: 2.5 }
          );
      }
    } finally {
      this.doc.page.margins.top = savedTop;
      this.doc.page.margins.bottom = savedBottom;
    }
  }

  // =========================================================================
  // SECTION 1 — ABOUT GARAD FOUNDATION
  // =========================================================================
  renderSection1About() {
    this.beginMajorSection('01', 'About Garad Foundation', {
      startOnNewPage: true,
      subtitle: 'Purpose, values, grassroots approach & organisational identity',
    });

    for (const para of this.data.about.overviewParagraphs) {
      this.drawParagraph(para);
    }

    // Vision & Mission side-by-side editorial cards
    const gap = 12;
    const cardW = (LAYOUT.contentWidth - gap) / 2;
    this.doc.font(this.fonts.sans).fontSize(9.2);
    const vH = this.doc.heightOfString(safeText(this.data.about.vision, this.fonts), {
      width: cardW - 24,
      lineGap: 3,
    });
    const mH = this.doc.heightOfString(safeText(this.data.about.mission, this.fonts), {
      width: cardW - 24,
      lineGap: 3,
    });
    const vmBoxH = Math.max(vH, mH) + 42;

    this.ensureSpace(vmBoxH + 14);
    const vmY = this.doc.y;

    const vmCards = [
      { label: 'OUR VISION', body: this.data.about.vision, accent: REPORT_PALETTE.rustRed },
      { label: 'OUR MISSION', body: this.data.about.mission, accent: REPORT_PALETTE.burntOrange },
    ];

    vmCards.forEach((c, idx) => {
      const x = LAYOUT.marginX + idx * (cardW + gap);
      this.doc
        .roundedRect(x, vmY, cardW, vmBoxH, 6)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(x, vmY, cardW, vmBoxH, 6)
        .lineWidth(0.75)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();
      this.doc.rect(x, vmY, cardW, 2.5).fillColor(c.accent).fill();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(8.2)
        .fillColor(c.accent)
        .text(c.label, x + 12, vmY + 12, { characterSpacing: 1.2 });

      this.doc
        .font(this.fonts.sans)
        .fontSize(9.2)
        .fillColor(REPORT_PALETTE.darkBrown)
        .text(safeText(c.body, this.fonts), x + 12, vmY + 27, {
          width: cardW - 24,
          lineGap: 3,
        });
    });

    this.doc.y = vmY + vmBoxH + 14;

    // Our Approach — 3 Pillars
    this.drawSubheading('Our Grassroots Approach');
    const pillarGap = 10;
    const pillarW = (LAYOUT.contentWidth - pillarGap * 2) / 3;
    const pillarH = 92;
    this.ensureSpace(pillarH + 14);
    const pY = this.doc.y;

    this.data.about.approachPillars.forEach((pillar, idx) => {
      const x = LAYOUT.marginX + idx * (pillarW + pillarGap);
      this.doc
        .roundedRect(x, pY, pillarW, pillarH, 5)
        .fillColor(REPORT_PALETTE.creamSoft)
        .fill();
      this.doc
        .roundedRect(x, pY, pillarW, pillarH, 5)
        .lineWidth(0.7)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      this.doc
        .font(this.fonts.serifBold)
        .fontSize(10.5)
        .fillColor(REPORT_PALETTE.rustRed)
        .text(safeText(pillar.title, this.fonts), x + 10, pY + 11, {
          width: pillarW - 20,
        });

      this.doc
        .font(this.fonts.sans)
        .fontSize(8.4)
        .fillColor(REPORT_PALETTE.darkBrown)
        .text(safeText(pillar.description, this.fonts), x + 10, pY + 28, {
          width: pillarW - 20,
          lineGap: 2.5,
        });
    });
    this.doc.y = pY + pillarH + 14;

    // Core Values
    this.drawSubheading('Core Values');
    this.drawBulletList(
      this.data.about.coreValues.map((v) => `${v.title}: ${v.description}`)
    );

    // Founding & Registration Table
    this.drawSubheading('Organisational & Registration Information');
    this.drawTable(
      ['Institutional Field', 'Verified Record / Editable Entry'],
      this.data.about.foundingAndRegistration,
      [0.34, 0.66]
    );
  }

  // =========================================================================
  // SECTION 2 — MESSAGE FROM THE FOUNDER / CHAIRMAN
  // =========================================================================
  renderSection2FounderMessage() {
    this.beginMajorSection('02', 'Message from the Founder / Chairman', {
      startOnNewPage: true,
      subtitle: 'Reflections on the reporting year, challenges & gratitude',
    });

    const fm = this.data.founderMessage;

    // Top editorial strip with portrait placeholder + author identification
    const boxH = 88;
    this.ensureSpace(boxH + 12);
    const boxY = this.doc.y;

    this.doc
      .roundedRect(LAYOUT.marginX, boxY, LAYOUT.contentWidth, boxH, 6)
      .fillColor(REPORT_PALETTE.creamSoft)
      .fill();
    this.doc
      .roundedRect(LAYOUT.marginX, boxY, LAYOUT.contentWidth, boxH, 6)
      .lineWidth(0.8)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    const photoX = LAYOUT.marginX + 12;
    const photoY = boxY + 9;
    const photoSize = 70;
    const founderImg = resolveImageAssetPath(this.rootDir, fm.photoPath);

    if (founderImg) {
      this.doc.save();
      this.doc.roundedRect(photoX, photoY, photoSize, photoSize, 5).clip();
      this.doc.image(founderImg, photoX, photoY, {
        cover: [photoSize, photoSize],
        align: 'center',
        valign: 'center',
      });
      this.doc.restore();
    } else {
      this.doc
        .roundedRect(photoX, photoY, photoSize, photoSize, 5)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(photoX, photoY, photoSize, photoSize, 5)
        .lineWidth(0.75)
        .dash(3, { space: 3 })
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke()
        .undash();
      this.doc
        .font(this.fonts.sans)
        .fontSize(7.2)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text('Authorised\nFounder\nPhotograph', photoX + 4, photoY + 20, {
          width: photoSize - 8,
          align: 'center',
        });
    }

    const metaX = photoX + photoSize + 16;
    const metaW = LAYOUT.contentWidth - photoSize - 42;

    this.doc
      .font(this.fonts.sansBold)
      .fontSize(7.8)
      .fillColor(REPORT_PALETTE.burntOrange)
      .text('LEADERSHIP FOREWORD', metaX, boxY + 14, { characterSpacing: 1.4 });

    this.doc
      .font(this.fonts.serifBold)
      .fontSize(13.5)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(safeText(fm.authorName, this.fonts), metaX, boxY + 28, { width: metaW });

    this.doc
      .font(this.fonts.sans)
      .fontSize(9)
      .fillColor(REPORT_PALETTE.darkBrown)
      .text(safeText(fm.authorRole, this.fonts), metaX, boxY + 47, { width: metaW });

    this.doc
      .font(this.fonts.sans)
      .fontSize(8)
      .fillColor(REPORT_PALETTE.mutedBrown)
      .text(
        safeText(`Reporting Year: ${this.data.reportingPeriod}`, this.fonts),
        metaX,
        boxY + 63,
        { width: metaW }
      );

    this.doc.y = boxY + boxH + 12;

    // Salutation & Editorial Body
    this.drawParagraph(fm.salutation, {
      fontSize: 9.8,
      color: REPORT_PALETTE.deepMaroon,
      italic: true,
      gapAfter: 7,
    });

    for (const para of fm.paragraphs) {
      const isDraftNote = para.startsWith('[');
      this.drawParagraph(para, {
        fontSize: isDraftNote ? 8.6 : 9.4,
        color: isDraftNote ? REPORT_PALETTE.rustRed : REPORT_PALETTE.darkBrown,
        italic: isDraftNote,
        gapAfter: 6.5,
      });
    }

    // Authorised Signature Space
    this.ensureSpace(78);
    const sigY = this.doc.y + 4;
    const sigImg = resolveImageAssetPath(this.rootDir, fm.signaturePath);

    if (sigImg) {
      this.doc.image(sigImg, LAYOUT.marginX, sigY, { fit: [132, 36] });
    } else {
      this.doc
        .roundedRect(LAYOUT.marginX, sigY, 165, 36, 4)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, sigY, 165, 36, 4)
        .lineWidth(0.65)
        .dash(3, { space: 3 })
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke()
        .undash();
      this.doc
        .font(this.fonts.sans)
        .fontSize(7.6)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text('[Space for Authorised Signature]', LAYOUT.marginX + 8, sigY + 13, {
          width: 149,
          align: 'center',
        });
    }

    this.doc
      .moveTo(LAYOUT.marginX, sigY + 43)
      .lineTo(LAYOUT.marginX + 185, sigY + 43)
      .lineWidth(0.75)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    this.doc
      .font(this.fonts.serifBold)
      .fontSize(9.6)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(safeText(fm.authorName, this.fonts), LAYOUT.marginX, sigY + 47);

    this.doc
      .font(this.fonts.sans)
      .fontSize(8.3)
      .fillColor(REPORT_PALETTE.mutedBrown)
      .text(safeText(fm.authorRole, this.fonts), LAYOUT.marginX, sigY + 60);

    this.doc.y = sigY + 78;

    this.drawInfoPanel('Authorisation & Editorial Safeguard', fm.editorialNote, 'cream');
  }

  // =========================================================================
  // SECTION 3 — OUR IMPACT AT A GLANCE (Infographic Page)
  // =========================================================================
  renderSection3Impact() {
    this.beginMajorSection('03', 'Our Impact at a Glance', {
      startOnNewPage: true,
      subtitle: `Documented reach & key figures (${this.data.reportingPeriod})`,
    });

    this.drawParagraph(this.data.impactAtAGlance.intro);

    // 2×3 Infographic Metric Card Grid
    const cols = 2;
    const gapX = 12;
    const gapY = 12;
    const cardW = (LAYOUT.contentWidth - gapX) / cols;
    const cardH = 84;

    const metrics = this.data.impactAtAGlance.metrics;
    for (let i = 0; i < metrics.length; i += cols) {
      this.ensureSpace(cardH + gapY);
      const rowY = this.doc.y;

      for (let c = 0; c < cols; c++) {
        const item = metrics[i + c];
        if (!item) continue;
        const x = LAYOUT.marginX + c * (cardW + gapX);

        this.doc
          .roundedRect(x, rowY, cardW, cardH, 6)
          .fillColor(item.isPlaceholder ? REPORT_PALETTE.creamSoft : REPORT_PALETTE.white)
          .fill();

        this.doc
          .roundedRect(x, rowY, cardW, cardH, 6)
          .lineWidth(0.8)
          .strokeColor(REPORT_PALETTE.antiqueGold)
          .stroke();

        // Top accent bar
        this.doc
          .rect(x, rowY, cardW, 2.5)
          .fillColor(
            item.isPlaceholder ? REPORT_PALETTE.antiqueGold : REPORT_PALETTE.burntOrange
          )
          .fill();

        // Minimal octagonal icon badge on right
        const iconCx = x + cardW - 22;
        const iconCy = rowY + 24;
        traceOctagonPath(this.doc, iconCx, iconCy, 12);
        this.doc.fillColor(REPORT_PALETTE.creamSoft).fill();
        this.drawMinimalVectorIcon(item.icon, iconCx, iconCy);

        // Large metric figure
        this.doc
          .font(item.isPlaceholder ? this.fonts.sansBold : this.fonts.serifBold)
          .fontSize(item.isPlaceholder ? 11.5 : 23)
          .fillColor(
            item.isPlaceholder ? REPORT_PALETTE.mutedBrown : REPORT_PALETTE.burntOrange
          )
          .text(
            safeText(item.value, this.fonts),
            x + 14,
            item.isPlaceholder ? rowY + 18 : rowY + 11,
            { width: cardW - 52 }
          );

        // Metric label
        this.doc
          .font(this.fonts.sansBold)
          .fontSize(9.2)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(safeText(item.label, this.fonts), x + 14, rowY + 42, {
            width: cardW - 28,
          });

        // Detail note
        this.doc
          .font(this.fonts.sans)
          .fontSize(7.9)
          .fillColor(REPORT_PALETTE.mutedBrown)
          .text(safeText(item.detail, this.fonts), x + 14, rowY + 56, {
            width: cardW - 28,
            lineGap: 1.8,
          });
      }

      this.doc.y = rowY + cardH + gapY;
    }

    this.drawInfoPanel(
      'Reporting Integrity & Non-Duplication Note',
      this.data.impactAtAGlance.methodologyNote,
      'cream'
    );

    this.drawSubheading('Verified Activity Output Register (FY 2020–21)');
    this.drawTable(
      ['Activity / Initiative', 'Date', 'Location', 'Documented Output'],
      this.data.impactAtAGlance.verifiedActivitySummaryRows,
      [0.26, 0.14, 0.24, 0.36]
    );
  }

  // =========================================================================
  // SECTION 4 — KEY PROJECTS AND CAMPAIGNS
  // =========================================================================
  private renderProjectBlock(project: AnnualReportProject, index: number) {
    // Start major verified projects cleanly with enough vertical room
    this.ensureSpace(165);

    const headerY = this.doc.y;
    const headerH = 54;

    // Distinct Warm Cream project banner with Deep Maroon & Rust Red typography
    this.doc
      .roundedRect(LAYOUT.marginX, headerY, LAYOUT.contentWidth, headerH, 6)
      .fillColor(
        project.isPlaceholderRecord ? REPORT_PALETTE.creamSoft : REPORT_PALETTE.warmCream
      )
      .fill();
    this.doc
      .roundedRect(LAYOUT.marginX, headerY, LAYOUT.contentWidth, headerH, 6)
      .lineWidth(0.8)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    // Index badge
    const idxLabel = `4.${index + 1}`;
    this.doc
      .font(this.fonts.sansBold)
      .fontSize(8)
      .fillColor(REPORT_PALETTE.burntOrange)
      .text(
        safeText(`PROJECT ${idxLabel}  ·  ${project.statusTag.toUpperCase()}`, this.fonts),
        LAYOUT.marginX + 14,
        headerY + 9,
        { width: LAYOUT.contentWidth - 28, characterSpacing: 0.7 }
      );

    this.doc
      .font(this.fonts.serifBold)
      .fontSize(14)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(safeText(project.name, this.fonts), LAYOUT.marginX + 14, headerY + 22, {
        width: LAYOUT.contentWidth - 28,
      });

    this.doc
      .font(this.fonts.sans)
      .fontSize(8.4)
      .fillColor(REPORT_PALETTE.darkBrown)
      .text(safeText(project.subtitle, this.fonts), LAYOUT.marginX + 14, headerY + 39, {
        width: LAYOUT.contentWidth - 28,
        lineBreak: false,
      });

    this.doc.y = headerY + headerH + 10;

    // Compact Location & Beneficiaries summary strip
    this.drawTable(
      ['Location & Geography', 'Beneficiaries / Reach'],
      [[project.location, project.beneficiaries]],
      [0.48, 0.52]
    );

    // Optional authentic photograph framed cleanly without distortion
    const photoAbs = resolveImageAssetPath(this.rootDir, project.photoPath);
    if (photoAbs) {
      const photoBoxH = 158;
      this.ensureSpace(photoBoxH + 18);
      const py = this.doc.y;

      this.doc
        .roundedRect(LAYOUT.marginX, py, LAYOUT.contentWidth, photoBoxH, 6)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, py, LAYOUT.contentWidth, photoBoxH, 6)
        .lineWidth(0.75)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      this.doc.save();
      this.doc
        .roundedRect(LAYOUT.marginX + 6, py + 6, LAYOUT.contentWidth - 12, photoBoxH - 26, 4)
        .clip();
      this.doc.image(photoAbs, LAYOUT.marginX + 6, py + 6, {
        cover: [LAYOUT.contentWidth - 12, photoBoxH - 26],
        align: 'center',
        valign: 'center',
      });
      this.doc.restore();

      if (project.photoCaption) {
        this.doc
          .font(this.fonts.sans)
          .fontSize(7.6)
          .fillColor(REPORT_PALETTE.mutedBrown)
          .text(
            safeText(project.photoCaption, this.fonts),
            LAYOUT.marginX + 8,
            py + photoBoxH - 17,
            { width: LAYOUT.contentWidth - 16, lineBreak: false }
          );
      }
      this.doc.y = py + photoBoxH + 8;
    }

    this.drawSubheading('Background and Need Addressed');
    for (const para of project.backgroundAndNeed) {
      this.drawParagraph(para, { fontSize: 9.4, gapAfter: 6 });
    }

    this.drawSubheading('Objectives');
    this.drawBulletList(project.objectives);

    this.drawSubheading('Activities Conducted');
    this.drawBulletList(project.activitiesConducted);

    this.drawSubheading('Actual Outcomes');
    this.drawBulletList(project.outcomes, REPORT_PALETTE.rustRed);

    if (project.testimonial) {
      this.drawInfoPanel(
        `Verified Voice — ${project.testimonial.attribution}`,
        `“${project.testimonial.quote}”`,
        'white'
      );
    }

    // Visual spacing between projects
    this.doc.y += 6;
  }

  renderSection4Projects() {
    this.beginMajorSection('04', 'Key Projects and Campaigns', {
      startOnNewPage: true,
      subtitle: 'Structured overview of flagship programmes and community initiatives',
    });

    this.drawParagraph(this.data.projects.intro);

    this.data.projects.items.forEach((project, idx) => {
      if (idx > 0) {
        // Begin each full project on a fresh page if less than 260pt remains
        this.ensureSpace(260);
      }
      this.renderProjectBlock(project, idx);
    });
  }

  // =========================================================================
  // SECTION 5 — FINANCIAL OVERVIEW
  // =========================================================================
  renderSection5Financial() {
    this.beginMajorSection('05', 'Financial Overview', {
      startOnNewPage: true,
      subtitle: 'Income, expenditure structure, visual breakdown & audit disclosures',
    });

    const fin = this.data.financialOverview;
    this.drawParagraph(fin.intro);

    // 3 Summary Financial Cards
    const gap = 10;
    const cardW = (LAYOUT.contentWidth - gap * 2) / 3;
    const cardH = 74;
    this.ensureSpace(cardH + 14);
    const y = this.doc.y;

    fin.summaryMetrics.forEach((m, idx) => {
      const x = LAYOUT.marginX + idx * (cardW + gap);
      this.doc
        .roundedRect(x, y, cardW, cardH, 6)
        .fillColor(m.isPlaceholder ? REPORT_PALETTE.creamSoft : REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(x, y, cardW, cardH, 6)
        .lineWidth(0.8)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();
      this.doc
        .rect(x, y, cardW, 2.5)
        .fillColor(idx === 2 ? REPORT_PALETTE.deepMaroon : REPORT_PALETTE.rustRed)
        .fill();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(7.8)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(safeText(m.label, this.fonts), x + 10, y + 11, { width: cardW - 20 });

      this.doc
        .font(m.isPlaceholder ? this.fonts.sansBold : this.fonts.serifBold)
        .fontSize(m.isPlaceholder ? 10 : 15)
        .fillColor(
          m.isPlaceholder ? REPORT_PALETTE.deepMaroon : REPORT_PALETTE.burntOrange
        )
        .text(safeText(m.value, this.fonts), x + 10, y + 27, { width: cardW - 20 });

      this.doc
        .font(this.fonts.sans)
        .fontSize(7.4)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(safeText(m.note, this.fonts), x + 10, y + 48, {
          width: cardW - 20,
          lineGap: 1.5,
        });
    });

    this.doc.y = y + cardH + 14;

    this.drawSubheading('Income Sources');
    this.drawTable(
      ['Income Source', 'Amount (INR)', 'Notes & Documentation Basis'],
      fin.incomeSources.map((r) => [r.category, r.amountLabel, r.notes]),
      [0.34, 0.24, 0.42]
    );

    this.drawSubheading('Expenditure Categories');
    this.drawTable(
      ['Expense Category', 'Amount (INR)', 'Scope / Allocation Note'],
      fin.expenseCategories.map((r) => [r.category, r.amountLabel, r.notes]),
      [0.34, 0.24, 0.42]
    );

    // Expenditure Chart (automatically renders real proportional bars when numeric audited data exists)
    const numericExpenses = fin.expenseCategories.filter(
      (e) => typeof e.amountNumeric === 'number' && e.amountNumeric > 0
    );

    if (numericExpenses.length > 0) {
      const totalExp = numericExpenses.reduce(
        (sum, item) => sum + (item.amountNumeric || 0),
        0
      );
      const chartH = 34 + numericExpenses.length * 30 + 12;
      this.ensureSpace(chartH + 12);
      const chartY = this.doc.y;

      this.doc
        .roundedRect(LAYOUT.marginX, chartY, LAYOUT.contentWidth, chartH, 6)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, chartY, LAYOUT.contentWidth, chartH, 6)
        .lineWidth(0.8)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(9)
        .fillColor(REPORT_PALETTE.deepMaroon)
        .text('Audited Expenditure Distribution', LAYOUT.marginX + 14, chartY + 11);

      let barY = chartY + 32;
      const barMaxW = LAYOUT.contentWidth - 28;

      numericExpenses.forEach((exp, idx) => {
        const val = exp.amountNumeric || 0;
        const pct = Math.round((val / totalExp) * 100);
        const barColor =
          idx % 2 === 0 ? REPORT_PALETTE.burntOrange : REPORT_PALETTE.rustRed;

        this.doc
          .font(this.fonts.sansBold)
          .fontSize(8.4)
          .fillColor(REPORT_PALETTE.darkBrown)
          .text(safeText(exp.category, this.fonts), LAYOUT.marginX + 14, barY);

        this.doc
          .font(this.fonts.sansBold)
          .fontSize(8.4)
          .fillColor(barColor)
          .text(`${exp.amountLabel} (${pct}%)`, LAYOUT.marginX + 14, barY, {
            width: barMaxW,
            align: 'right',
          });

        this.doc
          .roundedRect(LAYOUT.marginX + 14, barY + 13, barMaxW, 8, 4)
          .fillColor(REPORT_PALETTE.creamSoft)
          .fill();

        const fillW = Math.max(10, (val / totalExp) * barMaxW);
        this.doc
          .roundedRect(LAYOUT.marginX + 14, barY + 13, fillW, 8, 4)
          .fillColor(barColor)
          .fill();

        barY += 30;
      });

      this.doc.y = chartY + chartH + 12;
    } else {
      this.drawInfoPanel(
        'Expenditure Visualisation — Automatic Chart Ready',
        'No estimated percentages or placeholder chart bars are drawn here. Once exact audited INR amounts are entered into the numeric fields of src/data/annualReport2020_21.ts, this design system automatically renders proportional Burnt Orange and Rust Red expenditure bars.',
        'white'
      );
    }

    this.drawInfoPanel('Donor Contribution Schedule', fin.donorContributionNote, 'cream');
    this.drawInfoPanel('Audit Note & Financial Disclosures', fin.auditAndDisclosureNote, 'cream');
  }

  // =========================================================================
  // SECTION 6 — VOLUNTEER AND DONOR ENGAGEMENT
  // =========================================================================
  renderSection6VolunteerAndDonor() {
    this.beginMajorSection('06', 'Volunteer and Donor Engagement', {
      startOnNewPage: true,
      subtitle: 'Youth leadership, grassroots participation & community stewardship',
    });

    const vd = this.data.volunteerAndDonorEngagement;
    this.drawParagraph(vd.intro);

    const photoAbs = resolveImageAssetPath(this.rootDir, vd.photoPath);
    if (photoAbs) {
      const boxH = 138;
      this.ensureSpace(boxH + 14);
      const py = this.doc.y;

      this.doc
        .roundedRect(LAYOUT.marginX, py, LAYOUT.contentWidth, boxH, 6)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, py, LAYOUT.contentWidth, boxH, 6)
        .lineWidth(0.8)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      this.doc.save();
      this.doc
        .roundedRect(LAYOUT.marginX + 6, py + 6, LAYOUT.contentWidth - 12, boxH - 26, 4)
        .clip();
      this.doc.image(photoAbs, LAYOUT.marginX + 6, py + 6, {
        cover: [LAYOUT.contentWidth - 12, boxH - 26],
        align: 'center',
        valign: 'center',
      });
      this.doc.restore();

      if (vd.photoCaption) {
        this.doc
          .font(this.fonts.sans)
          .fontSize(7.7)
          .fillColor(REPORT_PALETTE.mutedBrown)
          .text(
            safeText(vd.photoCaption, this.fonts),
            LAYOUT.marginX + 8,
            py + boxH - 17,
            { width: LAYOUT.contentWidth - 16, lineBreak: false }
          );
      }

      this.doc.y = py + boxH + 10;
    }

    this.drawSubheading('Volunteer Participation');
    this.drawBulletList(vd.volunteerParticipation);

    this.drawSubheading('Youth Leadership & Creative Participation');
    this.drawBulletList(vd.youthLeadershipHighlights);

    this.drawSubheading('Donor Acknowledgements');
    this.drawBulletList(vd.donorAcknowledgements);

    this.drawSubheading('Community Engagement Channels');
    this.drawBulletList(vd.communityChannels);
  }

  // =========================================================================
  // SECTION 7 — PARTNERSHIPS AND COLLABORATIONS
  // =========================================================================
  renderSection7Partnerships() {
    this.beginMajorSection('07', 'Partnerships and Collaborations', {
      startOnNewPage: true,
      subtitle: 'Verified NGO, school, government & institutional collaborations',
    });

    this.drawParagraph(this.data.partnerships.intro);

    this.drawTable(
      ['Collaboration Type', 'Partner Name', 'Documented Role'],
      this.data.partnerships.partners.map((p) => [p.category, p.name, p.role]),
      [0.23, 0.27, 0.5]
    );

    this.drawInfoPanel(
      'Partner Representation & Logo Policy',
      this.data.partnerships.collaborationNote,
      'cream'
    );
  }

  // =========================================================================
  // SECTION 8 — STORIES OF CHANGE
  // =========================================================================
  renderSection8Stories() {
    this.beginMajorSection('08', 'Stories of Change', {
      startOnNewPage: true,
      subtitle: 'Human-interest narratives grounded in dignity & verified consent',
    });

    this.drawParagraph(this.data.storiesOfChange.intro);

    for (const story of this.data.storiesOfChange.stories) {
      const innerW = LAYOUT.contentWidth - 28;
      this.doc.font(this.fonts.sans).fontSize(8.9);

      const hBg = this.doc.heightOfString(
        safeText(`Background: ${story.background}`, this.fonts),
        { width: innerW, lineGap: 2.6 }
      );
      const hChg = this.doc.heightOfString(
        safeText(`What Changed: ${story.whatChanged}`, this.fonts),
        { width: innerW, lineGap: 2.6 }
      );
      const hInt = this.doc.heightOfString(
        safeText(`Initiative Contribution: ${story.initiativeContribution}`, this.fonts),
        { width: innerW, lineGap: 2.6 }
      );

      const cardH = 68 + hBg + hChg + hInt + 34;
      this.ensureSpace(cardH + 12);
      const y = this.doc.y;

      this.doc
        .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, cardH, 6)
        .fillColor(REPORT_PALETTE.white)
        .fill();
      this.doc
        .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, cardH, 6)
        .lineWidth(0.8)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      // Warm Cream header strip
      this.doc
        .roundedRect(LAYOUT.marginX, y, LAYOUT.contentWidth, 44, 6)
        .fillColor(REPORT_PALETTE.creamSoft)
        .fill();
      this.doc
        .rect(LAYOUT.marginX, y + 38, LAYOUT.contentWidth, 6)
        .fillColor(REPORT_PALETTE.creamSoft)
        .fill();
      this.doc
        .moveTo(LAYOUT.marginX, y + 44)
        .lineTo(LAYOUT.marginX + LAYOUT.contentWidth, y + 44)
        .lineWidth(0.6)
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(7.8)
        .fillColor(REPORT_PALETTE.burntOrange)
        .text(safeText(story.label.toUpperCase(), this.fonts), LAYOUT.marginX + 14, y + 9, {
          width: innerW,
          characterSpacing: 0.8,
        });

      this.doc
        .font(this.fonts.serifBold)
        .fontSize(10.5)
        .fillColor(REPORT_PALETTE.deepMaroon)
        .text(safeText(story.personName, this.fonts), LAYOUT.marginX + 14, y + 22, {
          width: innerW,
        });

      let cy = y + 52;
      this.doc
        .font(this.fonts.sansBold)
        .fontSize(8.2)
        .fillColor(REPORT_PALETTE.rustRed)
        .text(safeText(`Location: ${story.location}`, this.fonts), LAYOUT.marginX + 14, cy, {
          width: innerW,
        });
      cy += 15;

      const blocks = [
        `Background: ${story.background}`,
        `What Changed: ${story.whatChanged}`,
        `Initiative Contribution: ${story.initiativeContribution}`,
      ];

      for (const blk of blocks) {
        this.doc
          .font(this.fonts.sans)
          .fontSize(8.9)
          .fillColor(REPORT_PALETTE.darkBrown)
          .text(safeText(blk, this.fonts), LAYOUT.marginX + 14, cy, {
            width: innerW,
            lineGap: 2.6,
          });
        cy = this.doc.y + 6;
      }

      this.doc
        .font(this.fonts.sans)
        .fontSize(7.6)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text(safeText(story.consentStatus, this.fonts), LAYOUT.marginX + 14, y + cardH - 17, {
          width: innerW,
          lineBreak: false,
        });

      this.doc.y = y + cardH + 12;
    }
  }

  // =========================================================================
  // SECTION 9 — LOOKING AHEAD: THE ROADMAP
  // =========================================================================
  renderSection9Roadmap() {
    this.beginMajorSection('09', 'Looking Ahead: The Roadmap', {
      startOnNewPage: true,
      subtitle: 'Confirmed commitments vs. proposed programmes & resource needs',
    });

    const la = this.data.lookingAhead;
    this.drawParagraph(la.intro, { fontSize: 9.4, gapAfter: 6 });

    this.drawSubheading('Confirmed Institutional Commitments');
    this.drawBulletList(la.confirmedCommitments, REPORT_PALETTE.deepMaroon);

    this.drawSubheading('Proposed Programmes & Resource Requirements (Subject to Approval)');
    this.drawTable(
      ['Focus Area / Programme', 'Proposed Goal & Community Need', 'Status & Resource Requirement'],
      la.proposedPlans.map((p) => [
        p.area,
        `${p.goal} Need: ${p.communityNeed}`,
        p.resourceRequirement,
      ]),
      [0.26, 0.42, 0.32]
    );

    this.drawInfoPanel('Planning Distinction Note', la.strategicFocusNote, 'cream');
  }

  // =========================================================================
  // SECTION 10 — THANK YOU AND ACKNOWLEDGMENTS
  // =========================================================================
  renderSection10Acknowledgments() {
    this.beginMajorSection('10', 'Thank You and Acknowledgments', {
      startOnNewPage: true,
      subtitle: 'Gratitude to our community of volunteers, donors & partners',
    });

    const ack = this.data.acknowledgments;
    this.drawParagraph(ack.openingParagraph, { fontSize: 10.2, gapAfter: 12 });

    // Warm Cream editorial gratitude cards
    for (const grp of ack.groups) {
      this.drawInfoPanel(grp.group, grp.message, 'white');
    }

    // Restrained octagonal closing ornament & warm closing note
    this.ensureSpace(94);
    const boxY = this.doc.y + 6;
    const boxH = 74;

    this.doc
      .roundedRect(LAYOUT.marginX, boxY, LAYOUT.contentWidth, boxH, 6)
      .fillColor(REPORT_PALETTE.creamSoft)
      .fill();
    this.doc
      .roundedRect(LAYOUT.marginX, boxY, LAYOUT.contentWidth, boxH, 6)
      .lineWidth(0.9)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    const cx = LAYOUT.marginX + LAYOUT.contentWidth / 2;
    traceOctagonPath(this.doc, cx, boxY + 18, 7);
    this.doc.lineWidth(0.9).strokeColor(REPORT_PALETTE.rustRed).stroke();

    this.doc
      .font(this.fonts.serifItalic)
      .fontSize(10.8)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(safeText(ack.closingParagraph, this.fonts), LAYOUT.marginX + 26, boxY + 32, {
        width: LAYOUT.contentWidth - 52,
        align: 'center',
        lineGap: 3.2,
      });

    this.doc.y = boxY + boxH + 12;
  }

  // =========================================================================
  // SECTION 11 — CONTACT INFORMATION
  // =========================================================================
  renderSection11Contact() {
    this.beginMajorSection('11', 'Contact Information', {
      startOnNewPage: true,
      subtitle: 'Connect with Garad Foundation for CSR, volunteering & enquiries',
    });

    const ct = this.data.contact;
    this.drawParagraph(ct.intro);

    this.drawTable(
      ['Contact Channel', 'Official Details (Editable)'],
      ct.fields,
      [0.32, 0.68]
    );

    // Optional Official QR Code Box (never generates a fake QR code)
    const qrBoxH = 112;
    this.ensureSpace(qrBoxH + 14);
    const qrY = this.doc.y + 4;

    this.doc
      .roundedRect(LAYOUT.marginX, qrY, LAYOUT.contentWidth, qrBoxH, 6)
      .fillColor(REPORT_PALETTE.white)
      .fill();
    this.doc
      .roundedRect(LAYOUT.marginX, qrY, LAYOUT.contentWidth, qrBoxH, 6)
      .lineWidth(0.8)
      .strokeColor(REPORT_PALETTE.antiqueGold)
      .stroke();

    const qrSlotSize = 84;
    const qrSlotX = LAYOUT.marginX + 16;
    const qrSlotY = qrY + 14;
    const qrAbs = resolveImageAssetPath(this.rootDir, ct.qrCodePath);

    if (qrAbs) {
      this.doc.image(qrAbs, qrSlotX, qrSlotY, {
        fit: [qrSlotSize, qrSlotSize],
        align: 'center',
        valign: 'center',
      });
    } else {
      this.doc
        .roundedRect(qrSlotX, qrSlotY, qrSlotSize, qrSlotSize, 4)
        .fillColor(REPORT_PALETTE.creamSoft)
        .fill();
      this.doc
        .roundedRect(qrSlotX, qrSlotY, qrSlotSize, qrSlotSize, 4)
        .lineWidth(0.75)
        .dash(3, { space: 3 })
        .strokeColor(REPORT_PALETTE.antiqueGold)
        .stroke()
        .undash();

      this.doc
        .font(this.fonts.sansBold)
        .fontSize(7.5)
        .fillColor(REPORT_PALETTE.mutedBrown)
        .text('Optional\nOfficial\nQR Code', qrSlotX + 6, qrSlotY + 26, {
          width: qrSlotSize - 12,
          align: 'center',
        });
    }

    const textX = qrSlotX + qrSlotSize + 18;
    const textW = LAYOUT.contentWidth - qrSlotSize - 50;

    this.doc
      .font(this.fonts.serifBold)
      .fontSize(12)
      .fillColor(REPORT_PALETTE.rustRed)
      .text('Stay Connected with Garad Foundation', textX, qrY + 20, {
        width: textW,
      });

    this.doc
      .font(this.fonts.sans)
      .fontSize(8.9)
      .fillColor(REPORT_PALETTE.darkBrown)
      .text(safeText(ct.qrCodeCaption, this.fonts), textX, qrY + 39, {
        width: textW,
        lineGap: 3,
      });

    this.doc
      .font(this.fonts.sansBold)
      .fontSize(8.2)
      .fillColor(REPORT_PALETTE.deepMaroon)
      .text(
        safeText(
          `${this.data.branding.organisationName} · ${this.data.branding.locationLabel}`,
          this.fonts
        ),
        textX,
        qrY + 80,
        { width: textW }
      );

    this.doc.y = qrY + qrBoxH + 12;
  }

  // =========================================================================
  // STAMP RUNNING HEADER (WITH UPPER-RIGHT LOGO) & FOOTER ON EVERY CONTENT PAGE
  // =========================================================================
  applyRunningChromeToAllPages() {
    const range = this.doc.bufferedPageRange();
    const totalPages = range.count;

    for (let i = 1; i < totalPages; i++) {
      this.doc.switchToPage(i);
      const savedTop = this.doc.page.margins.top;
      const savedBottom = this.doc.page.margins.bottom;
      this.doc.page.margins.top = 0;
      this.doc.page.margins.bottom = 0;

      try {
        const meta = this.pageMeta[i] || { headerLeft: this.data.reportTitle };

        // Left header: compact report + section title (leaves wide clearance for 22mm logo on right)
        const leftMaxW = LAYOUT.contentWidth - LAYOUT.contentLogoW - 18;

        this.doc
          .font(this.fonts.sansBold)
          .fontSize(7.4)
          .fillColor(REPORT_PALETTE.burntOrange)
          .text(
            safeText(
              `${this.data.branding.organisationName.toUpperCase()}  ·  ${this.data.reportTitle.toUpperCase()}`,
              this.fonts
            ),
            LAYOUT.marginX,
            24,
            { width: leftMaxW, characterSpacing: 0.9, lineBreak: false }
          );

        this.doc
          .font(this.fonts.serif)
          .fontSize(9.5)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(safeText(meta.headerLeft, this.fonts), LAYOUT.marginX, 37, {
            width: leftMaxW,
            lineBreak: false,
          });

        // Upper-right official Garad Foundation logo on EVERY content & overflow page
        drawOfficialLogoUpperRight(this.doc, this.fonts, this.logoAbsPath, 'content');

        // Subtle Antique Gold + short Rust Red header separator at y = 70pt (marginTop = 86pt)
        const sepY = 70;
        this.doc
          .moveTo(LAYOUT.marginX, sepY)
          .lineTo(LAYOUT.marginX + 36, sepY)
          .lineWidth(1.4)
          .strokeColor(REPORT_PALETTE.rustRed)
          .stroke();
        this.doc
          .moveTo(LAYOUT.marginX + 40, sepY)
          .lineTo(LAYOUT.width - LAYOUT.marginX, sepY)
          .lineWidth(0.6)
          .strokeColor(REPORT_PALETTE.antiqueGold)
          .stroke();

        // Compact Footer with subtle Antique Gold rule
        const footerRuleY = LAYOUT.height - 44;
        this.doc
          .moveTo(LAYOUT.marginX, footerRuleY)
          .lineTo(LAYOUT.width - LAYOUT.marginX, footerRuleY)
          .lineWidth(0.6)
          .strokeColor(REPORT_PALETTE.antiqueGold)
          .stroke();

        this.doc
          .font(this.fonts.sans)
          .fontSize(8)
          .fillColor(REPORT_PALETTE.mutedBrown)
          .text(
            safeText(
              `${this.data.branding.organisationName} | ${this.data.reportTitle}`,
              this.fonts
            ),
            LAYOUT.marginX,
            footerRuleY + 10,
            { lineBreak: false }
          );

        this.doc
          .font(this.fonts.sansBold)
          .fontSize(8)
          .fillColor(REPORT_PALETTE.deepMaroon)
          .text(
            `Page ${i + 1} of ${totalPages}`,
            LAYOUT.marginX,
            footerRuleY + 10,
            {
              width: LAYOUT.contentWidth,
              align: 'right',
              lineBreak: false,
            }
          );
      } finally {
        this.doc.page.margins.top = savedTop;
        this.doc.page.margins.bottom = savedBottom;
      }
    }
  }

  async writeToFile(targetPath: string): Promise<{
    fileSizeBytes: number;
    pageCount: number;
    usedOriginalLogo: boolean;
  }> {
    const pageCount = this.doc.bufferedPageRange().count;
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const stream = fs.createWriteStream(targetPath);
      stream.on('finish', resolve);
      stream.on('error', reject);
      this.doc.on('error', reject);
      this.doc.pipe(stream);
      this.doc.end();
    });

    const stat = fs.statSync(targetPath);
    return {
      fileSizeBytes: stat.size,
      pageCount,
      usedOriginalLogo: Boolean(this.logoAbsPath),
    };
  }
}

/**
 * Generates a print-ready A4 Annual Report PDF using the reusable Garad Foundation
 * Annual Report Design System for any financial year dataset.
 */
export async function generateAnnualReportPdf(
  data: AnnualReportData,
  targetPath: string,
  rootDir: string
) {
  const builder = new AnnualReportBuilder(data, rootDir);

  // Page 1: Cover Page
  builder.renderCoverPage();

  // Page 2: Reserve Table of Contents (back-filled with exact page numbers after layout)
  builder.reserveTableOfContentsPage();

  // Sections 1–11
  builder.renderSection1About();
  builder.renderSection2FounderMessage();
  builder.renderSection3Impact();
  builder.renderSection4Projects();
  builder.renderSection5Financial();
  builder.renderSection6VolunteerAndDonor();
  builder.renderSection7Partnerships();
  builder.renderSection8Stories();
  builder.renderSection9Roadmap();
  builder.renderSection10Acknowledgments();
  builder.renderSection11Contact();

  // Back-fill Page 2 TOC with exact auto-calculated page numbers
  builder.populateTableOfContentsPage([
    { num: '01', title: 'About Garad Foundation', subtitle: 'Mission, vision, core values, approach & registration' },
    { num: '02', title: 'Message from the Founder / Chairman', subtitle: 'Reflections on the year, challenges & gratitude' },
    { num: '03', title: 'Our Impact at a Glance', subtitle: 'Verified outputs & key organisational figures' },
    { num: '04', title: 'Key Projects and Campaigns', subtitle: 'Mission Bharari, Swasthya Saksharta, Relief & frameworks' },
    { num: '05', title: 'Financial Overview', subtitle: 'Income, expenditure, chart framework & audit note' },
    { num: '06', title: 'Volunteer and Donor Engagement', subtitle: 'Volunteer participation, youth leadership & acknowledgements' },
    { num: '07', title: 'Partnerships and Collaborations', subtitle: 'Verified NGO, school & institutional partnerships' },
    { num: '08', title: 'Stories of Change', subtitle: 'Human-interest story layouts with safeguarding standards' },
    { num: '09', title: 'Looking Ahead', subtitle: 'Confirmed commitments vs. proposed next-year roadmap' },
    { num: '10', title: 'Thank You and Acknowledgments', subtitle: 'Gratitude to volunteers, donors, educators & communities' },
    { num: '11', title: 'Contact Information', subtitle: 'Official channels, address & optional QR code' },
  ]);

  // Stamp running header (with upper-right official logo) & footer on every page 2..N
  builder.applyRunningChromeToAllPages();

  return builder.writeToFile(targetPath);
}
