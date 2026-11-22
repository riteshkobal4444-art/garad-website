import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { ACTIVITIES, ActivityRecord } from '../src/data/activities';
import { ANNUAL_REPORT_2020_21 } from '../src/data/annualReport2020_21';
import { generateAnnualReportPdf } from './pdf/annualReportDesignSystem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_REPORTS_DIR = path.join(ROOT_DIR, 'public', 'assets', 'reports');
const ANNUAL_DIR = path.join(PUBLIC_REPORTS_DIR, 'annual');
const ACTIVITIES_DIR = path.join(PUBLIC_REPORTS_DIR, 'activities');
const MANIFEST_OUTPUT = path.join(
  ROOT_DIR,
  'src',
  'data',
  'reportsManifest.generated.ts'
);

// Garad Foundation Institutional Brand Palette
const COLORS = {
  forest950: '#082417',
  forest900: '#0D3021',
  forest800: '#16402E',
  sage50: '#EEF4F0',
  sage100: '#DCE9E1',
  cream50: '#FAF8F4',
  cream100: '#F4EFE5',
  cream200: '#E5DDD0',
  terracotta: '#9A3B1E',
  terracottaLight: '#FAEEE9',
  ochre: '#B57921',
  ink900: '#171C19',
  ink700: '#35403A',
  ink500: '#5C6660',
  ink400: '#7B847E',
  white: '#FFFFFF',
  border: '#DFD8CB',
} as const;

const PAGE = {
  width: 595.28, // A4 portrait width in pt
  height: 841.89, // A4 portrait height in pt
  marginX: 52,
  marginTop: 66,
  marginBottom: 62,
  contentWidth: 595.28 - 52 * 2,
};

const ACTIVITY_FILENAME_MAP: Record<
  string,
  { fileSlug: string; downloadFilename: string }
> = {
  'utsavachi-shidori': {
    fileSlug: 'utsavachi-shidori-report.pdf',
    downloadFilename: 'Garad-Foundation-Utsavachi-Shidori-Activity-Report.pdf',
  },
  'menstrual-hygiene-awareness': {
    fileSlug: 'menstrual-hygiene-awareness-report.pdf',
    downloadFilename:
      'Garad-Foundation-Menstrual-Hygiene-Awareness-Activity-Report.pdf',
  },
  'online-essay-poetry-competition': {
    fileSlug: 'online-essay-poetry-report.pdf',
    downloadFilename:
      'Garad-Foundation-Online-Essay-Poetry-Competition-Activity-Report.pdf',
  },
  'online-videography-awareness-contest': {
    fileSlug: 'online-videography-report.pdf',
    downloadFilename:
      'Garad-Foundation-Online-Videography-Contest-Activity-Report.pdf',
  },
  'mission-bharari-phase-1': {
    fileSlug: 'mission-bharari-phase-1-report.pdf',
    downloadFilename:
      'Garad-Foundation-Mission-Bharari-Phase-1-Activity-Report.pdf',
  },
  'marathi-rajbhasha-divas-spardha': {
    fileSlug: 'marathi-rajbhasha-divas-report.pdf',
    downloadFilename:
      'Garad-Foundation-Marathi-Rajbhasha-Divas-Spardha-Activity-Report.pdf',
  },
  'abhivyakta-2024': {
    fileSlug: 'abhivyakta-2024-report.pdf',
    downloadFilename: 'Garad-Foundation-Abhivyakta-2024-Activity-Report.pdf',
  },
  'gudhi-shikshanachi': {
    fileSlug: 'gudhi-shikshanachi-report.pdf',
    downloadFilename: 'Garad-Foundation-Gudhi-Shikshanachi-Activity-Report.pdf',
  },
  'sanitary-pad-distribution': {
    fileSlug: 'sanitary-pad-distribution-2019-report.pdf',
    downloadFilename:
      'Garad-Foundation-Sanitary-Pad-Distribution-2019-Activity-Report.pdf',
  },
  'chhatrapati-shivaji-maharaj-jayanti-2019': {
    fileSlug: 'chhatrapati-shivaji-maharaj-jayanti-2019-report.pdf',
    downloadFilename:
      'Garad-Foundation-Chhatrapati-Shivaji-Maharaj-Jayanti-2019-Activity-Report.pdf',
  },
  'selfie-with-bappa': {
    fileSlug: 'selfie-with-bappa-report.pdf',
    downloadFilename: 'Garad-Foundation-Selfie-With-Bappa-Activity-Report.pdf',
  },
  gyansetu: {
    fileSlug: 'gyansetu-report.pdf',
    downloadFilename: 'Garad-Foundation-Gyansetu-Activity-Report.pdf',
  },
  'blood-donation-drive-2022': {
    fileSlug: 'blood-donation-drive-2022-report.pdf',
    downloadFilename:
      'Garad-Foundation-Blood-Donation-Drive-2022-Activity-Report.pdf',
  },
  'sandals-for-children': {
    fileSlug: 'sandals-for-children-report.pdf',
    downloadFilename:
      'Garad-Foundation-Sandals-for-Children-Activity-Report.pdf',
  },
  'project-savitri': {
    fileSlug: 'project-savitri-report.pdf',
    downloadFilename: 'Garad-Foundation-Project-Savitri-Activity-Report.pdf',
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/**
 * Clean ASCII/WinAnsi safe typography sanitization so standard PDF fonts never emit missing glyphs.
 */
function sanitizePdfText(text: string): string {
  return text
    .replace(/\u2014/g, ' - ')
    .replace(/\u2013/g, '-')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u20B9/g, 'INR ')
    .replace(/\u00B7/g, ' | ');
}

function drawGaradEmblem(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  size: number
) {
  doc.save();
  // Outer architectural frame
  doc
    .roundedRect(x, y, size, size, 4)
    .lineWidth(1.2)
    .strokeColor('#E6A94A')
    .stroke();
  // Inner forest-sage geometric motif (minimal institutional monogram)
  doc
    .rect(x + 4, y + 4, size - 8, size - 8)
    .fillColor(COLORS.forest800)
    .fill();
  doc
    .font('Times-Bold')
    .fontSize(size * 0.46)
    .fillColor(COLORS.cream50)
    .text('GF', x, y + size * 0.27, {
      width: size,
      align: 'center',
      lineBreak: false,
    });
  doc.restore();
}

function ensureSpace(doc: PDFKit.PDFDocument, neededHeight: number) {
  const maxY = PAGE.height - PAGE.marginBottom;
  // Never add a new page if the cursor is already at the top of a fresh page.
  if (doc.y > PAGE.marginTop + 1 && doc.y + neededHeight > maxY) {
    doc.addPage();
    doc.y = PAGE.marginTop;
  }
}

function drawSectionHeading(
  doc: PDFKit.PDFDocument,
  sectionNumber: string,
  title: string
) {
  const topGap = doc.y > PAGE.marginTop + 8 ? 12 : 0;
  ensureSpace(doc, topGap + 68);
  if (doc.y > PAGE.marginTop + 8) {
    doc.y += 12;
  }
  const startY = doc.y;

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(COLORS.terracotta)
    .text(`SECTION ${sectionNumber}`, PAGE.marginX, startY, {
      characterSpacing: 1.2,
    });

  doc
    .font('Times-Bold')
    .fontSize(15.5)
    .fillColor(COLORS.forest900)
    .text(sanitizePdfText(title), PAGE.marginX, doc.y + 2, {
      width: PAGE.contentWidth,
    });

  const ruleY = doc.y + 5;
  doc
    .moveTo(PAGE.marginX, ruleY)
    .lineTo(PAGE.marginX + 38, ruleY)
    .lineWidth(1.8)
    .strokeColor(COLORS.terracotta)
    .stroke();

  doc
    .moveTo(PAGE.marginX + 42, ruleY)
    .lineTo(PAGE.marginX + PAGE.contentWidth, ruleY)
    .lineWidth(0.6)
    .strokeColor(COLORS.border)
    .stroke();

  doc.y = ruleY + 11;
}

function drawSubheading(doc: PDFKit.PDFDocument, title: string) {
  ensureSpace(doc, 36);
  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor(COLORS.forest900)
    .text(sanitizePdfText(title), PAGE.marginX, doc.y + 4, {
      width: PAGE.contentWidth,
    });
  doc.y += 4;
}

function drawParagraph(doc: PDFKit.PDFDocument, text: string) {
  const clean = sanitizePdfText(text);
  doc.font('Helvetica').fontSize(9.8);
  const h = doc.heightOfString(clean, {
    width: PAGE.contentWidth,
    lineGap: 3.5,
  });
  ensureSpace(doc, Math.min(h + 8, 90));
  doc
    .font('Helvetica')
    .fontSize(9.8)
    .fillColor(COLORS.ink700)
    .text(clean, PAGE.marginX, doc.y, {
      width: PAGE.contentWidth,
      lineGap: 3.5,
      align: 'left',
    });
  doc.y += 8;
}

function drawBulletList(doc: PDFKit.PDFDocument, items: string[]) {
  for (const item of items) {
    const clean = sanitizePdfText(item);
    doc.font('Helvetica').fontSize(9.5);
    const h = doc.heightOfString(clean, {
      width: PAGE.contentWidth - 18,
      lineGap: 3,
    });
    ensureSpace(doc, h + 7);
    const y = doc.y;
    doc
      .rect(PAGE.marginX + 3, y + 4.5, 4, 4)
      .fillColor(COLORS.terracotta)
      .fill();
    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor(COLORS.ink700)
      .text(clean, PAGE.marginX + 16, y, {
        width: PAGE.contentWidth - 16,
        lineGap: 3,
      });
    doc.y += 5;
  }
  doc.y += 4;
}

function drawCalloutBox(
  doc: PDFKit.PDFDocument,
  title: string,
  body: string,
  tone: 'sage' | 'cream' = 'cream'
) {
  const cleanTitle = sanitizePdfText(title);
  const cleanBody = sanitizePdfText(body);
  const padX = 14;
  const padY = 11;
  const innerW = PAGE.contentWidth - padX * 2;

  doc.font('Helvetica-Bold').fontSize(9);
  const titleH = doc.heightOfString(cleanTitle, { width: innerW });
  doc.font('Helvetica').fontSize(9);
  const bodyH = doc.heightOfString(cleanBody, { width: innerW, lineGap: 3 });
  const boxH = padY * 2 + titleH + bodyH + 5;

  ensureSpace(doc, boxH + 10);
  const y = doc.y;

  doc
    .roundedRect(PAGE.marginX, y, PAGE.contentWidth, boxH, 5)
    .fillColor(tone === 'sage' ? COLORS.sage50 : COLORS.cream100)
    .fill();
  doc
    .roundedRect(PAGE.marginX, y, PAGE.contentWidth, boxH, 5)
    .lineWidth(0.75)
    .strokeColor(tone === 'sage' ? COLORS.sage100 : COLORS.cream200)
    .stroke();

  // Top subtle accent strip (horizontal, editorial)
  doc
    .rect(PAGE.marginX, y, PAGE.contentWidth, 2.5)
    .fillColor(tone === 'sage' ? COLORS.forest800 : COLORS.terracotta)
    .fill();

  doc
    .font('Helvetica-Bold')
    .fontSize(8.8)
    .fillColor(tone === 'sage' ? COLORS.forest900 : COLORS.terracotta)
    .text(cleanTitle, PAGE.marginX + padX, y + padY + 1, { width: innerW });

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.ink700)
    .text(cleanBody, PAGE.marginX + padX, y + padY + titleH + 5, {
      width: innerW,
      lineGap: 3,
    });

  doc.y = y + boxH + 10;
}

function drawMetricStrip(
  doc: PDFKit.PDFDocument,
  items: { value: string; label: string; sub?: string }[]
) {
  const gap = 10;
  const count = items.length;
  const boxW = (PAGE.contentWidth - gap * (count - 1)) / count;
  const boxH = 66;
  ensureSpace(doc, boxH + 12);
  const y = doc.y;

  items.forEach((item, idx) => {
    const x = PAGE.marginX + idx * (boxW + gap);
    doc
      .roundedRect(x, y, boxW, boxH, 5)
      .fillColor(idx % 2 === 0 ? COLORS.sage50 : COLORS.cream100)
      .fill();
    doc
      .roundedRect(x, y, boxW, boxH, 5)
      .lineWidth(0.7)
      .strokeColor(idx % 2 === 0 ? COLORS.sage100 : COLORS.cream200)
      .stroke();

    doc
      .font('Times-Bold')
      .fontSize(20)
      .fillColor(idx % 2 === 0 ? COLORS.forest900 : COLORS.terracotta)
      .text(sanitizePdfText(item.value), x + 10, y + 11, {
        width: boxW - 20,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(8.3)
      .fillColor(COLORS.ink900)
      .text(sanitizePdfText(item.label), x + 10, y + 36, {
        width: boxW - 20,
      });

    if (item.sub) {
      doc
        .font('Helvetica')
        .fontSize(7.4)
        .fillColor(COLORS.ink500)
        .text(sanitizePdfText(item.sub), x + 10, y + 48, {
          width: boxW - 20,
        });
    }
  });

  doc.y = y + boxH + 12;
}

function drawDataTable(
  doc: PDFKit.PDFDocument,
  headers: string[],
  rows: string[][],
  colRatios: number[]
) {
  const colWidths = colRatios.map((r) => r * PAGE.contentWidth);
  const headerH = 24;
  const padX = 8;
  const padY = 6;

  const measureRowHeight = (row: string[]): number => {
    let maxH = 0;
    row.forEach((cell, i) => {
      doc.font(i === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.7);
      const h = doc.heightOfString(sanitizePdfText(cell), {
        width: colWidths[i] - padX * 2,
        lineGap: 2,
      });
      if (h > maxH) maxH = h;
    });
    return Math.max(22, maxH + padY * 2);
  };

  const drawHeader = (startY: number) => {
    doc
      .rect(PAGE.marginX, startY, PAGE.contentWidth, headerH)
      .fillColor(COLORS.forest900)
      .fill();
    let x = PAGE.marginX;
    headers.forEach((h, i) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(8.3)
        .fillColor(COLORS.white)
        .text(sanitizePdfText(h), x + padX, startY + 7.5, {
          width: colWidths[i] - padX * 2,
          lineBreak: false,
        });
      x += colWidths[i];
    });
    return startY + headerH;
  };

  const rowHeights = rows.map(measureRowHeight);
  const firstRowH = rowHeights[0] ?? 24;

  // Ensure table header + at least the first row fit together so headers never orphan.
  ensureSpace(doc, headerH + firstRowH + 8);
  let y = drawHeader(doc.y);

  rows.forEach((row, rowIdx) => {
    const rowH = rowHeights[rowIdx];

    if (
      y > PAGE.marginTop + headerH + 1 &&
      y + rowH > PAGE.height - PAGE.marginBottom
    ) {
      doc.addPage();
      y = drawHeader(PAGE.marginTop);
    }

    doc
      .rect(PAGE.marginX, y, PAGE.contentWidth, rowH)
      .fillColor(rowIdx % 2 === 0 ? COLORS.white : COLORS.cream50)
      .fill();

    doc
      .moveTo(PAGE.marginX, y + rowH)
      .lineTo(PAGE.marginX + PAGE.contentWidth, y + rowH)
      .lineWidth(0.5)
      .strokeColor(COLORS.border)
      .stroke();

    let x = PAGE.marginX;
    row.forEach((cell, i) => {
      doc
        .font(i === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(8.7)
        .fillColor(i === 0 ? COLORS.ink900 : COLORS.ink700)
        .text(sanitizePdfText(cell), x + padX, y + padY, {
          width: colWidths[i] - padX * 2,
          lineGap: 2,
        });
      x += colWidths[i];
    });

    y += rowH;
  });

  // Outer frame border
  doc
    .moveTo(PAGE.marginX, y)
    .lineTo(PAGE.marginX + PAGE.contentWidth, y)
    .lineWidth(0.8)
    .strokeColor(COLORS.forest800)
    .stroke();

  doc.y = y + 12;
}

function drawHorizontalBarViz(
  doc: PDFKit.PDFDocument,
  title: string,
  bars: { label: string; value: number; display: string; color: string }[]
) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const totalH = 26 + bars.length * 32 + 12;
  ensureSpace(doc, totalH + 8);
  const startY = doc.y;

  doc
    .roundedRect(PAGE.marginX, startY, PAGE.contentWidth, totalH, 5)
    .fillColor(COLORS.cream50)
    .fill();
  doc
    .roundedRect(PAGE.marginX, startY, PAGE.contentWidth, totalH, 5)
    .lineWidth(0.7)
    .strokeColor(COLORS.border)
    .stroke();

  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor(COLORS.forest900)
    .text(sanitizePdfText(title), PAGE.marginX + 14, startY + 10);

  let y = startY + 28;
  const barMaxW = PAGE.contentWidth - 28;

  for (const bar of bars) {
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(COLORS.ink900)
      .text(sanitizePdfText(bar.label), PAGE.marginX + 14, y);
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(bar.color)
      .text(sanitizePdfText(bar.display), PAGE.marginX + 14, y, {
        width: barMaxW,
        align: 'right',
      });

    const trackY = y + 13;
    doc
      .roundedRect(PAGE.marginX + 14, trackY, barMaxW, 8, 4)
      .fillColor(COLORS.cream200)
      .fill();
    const fillW = Math.max(12, (bar.value / maxVal) * barMaxW);
    doc
      .roundedRect(PAGE.marginX + 14, trackY, fillW, 8, 4)
      .fillColor(bar.color)
      .fill();

    y += 32;
  }

  doc.y = startY + totalH + 12;
}

function drawCoverPage(
  doc: PDFKit.PDFDocument,
  options: {
    documentType: string;
    categoryLabel: string;
    title: string;
    subtitle: string;
    reportingPeriod: string;
    location: string;
    publicationNote: string;
    imagePath?: string | null;
    imageCaption: string;
    safeguardingNote?: string;
    metaRows: [string, string][];
  }
) {
  // Temporarily disable top/bottom auto-wrap margins on the full-bleed cover page
  // so positioned cover elements (especially the bottom institutional footer at
  // PAGE.height - 42) never trigger an implicit PDFKit addPage() before Page 2.
  const savedTopMargin = doc.page.margins.top;
  const savedBottomMargin = doc.page.margins.bottom;
  doc.page.margins.top = 0;
  doc.page.margins.bottom = 0;

  try {
    // Warm editorial canvas background for cover
    doc.rect(0, 0, PAGE.width, PAGE.height).fillColor(COLORS.cream50).fill();

    // Deep forest institutional masthead band
    doc.rect(0, 0, PAGE.width, 136).fillColor(COLORS.forest950).fill();
    doc.rect(0, 136, PAGE.width, 4).fillColor(COLORS.terracotta).fill();

    drawGaradEmblem(doc, PAGE.marginX, 38, 44);

    doc
      .font('Times-Bold')
      .fontSize(20)
      .fillColor(COLORS.white)
      .text('Garad Foundation', PAGE.marginX + 58, 40, { lineBreak: false });

    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor('#CBE0D5')
      .text(
        'Thane, Maharashtra, India  |  Youth-Led Grassroots Nonprofit',
        PAGE.marginX + 58,
        65,
        { lineBreak: false }
      );

    doc
      .font('Helvetica-Bold')
      .fontSize(8)
      .fillColor('#E6A94A')
      .text(
        sanitizePdfText(options.documentType.toUpperCase()),
        PAGE.marginX + 58,
        86,
        {
          characterSpacing: 1.4,
          lineBreak: false,
        }
      );

    // Category & Title block
    let y = 172;
    doc
      .font('Helvetica-Bold')
      .fontSize(8.8)
      .fillColor(COLORS.terracotta)
      .text(
        sanitizePdfText(options.categoryLabel.toUpperCase()),
        PAGE.marginX,
        y,
        {
          characterSpacing: 1.3,
          width: PAGE.contentWidth,
        }
      );

    y = doc.y + 8;
    doc
      .font('Times-Bold')
      .fontSize(27)
      .fillColor(COLORS.ink900)
      .text(sanitizePdfText(options.title), PAGE.marginX, y, {
        width: PAGE.contentWidth,
        lineGap: 3.5,
      });

    y = doc.y + 10;
    doc
      .font('Helvetica')
      .fontSize(10.8)
      .fillColor(COLORS.ink500)
      .text(sanitizePdfText(options.subtitle), PAGE.marginX, y, {
        width: PAGE.contentWidth,
        lineGap: 3.8,
      });

    y = doc.y + 18;

    // Pre-measure cover metadata rows so wrapped values never overlap dividers or footer
    const cardPad = 14;
    const labelColW = 152;
    const valueColW = PAGE.contentWidth - cardPad * 2 - 160;
    const measuredMetaRows = options.metaRows.map(([label, value]) => {
      const cleanLabel = sanitizePdfText(label.toUpperCase());
      const cleanValue = sanitizePdfText(value);
      doc.font('Helvetica-Bold').fontSize(8.2);
      const labelH = doc.heightOfString(cleanLabel, { width: labelColW });
      doc.font('Helvetica').fontSize(9.2);
      const valueH = doc.heightOfString(cleanValue, {
        width: valueColW,
        lineGap: 1.8,
      });
      const rowH = Math.max(21, Math.max(labelH, valueH) + 9);
      return { cleanLabel, cleanValue, rowH };
    });

    const metaH =
      cardPad * 2 + measuredMetaRows.reduce((sum, r) => sum + r.rowH, 0);
    const footerRuleY = PAGE.height - 54;
    const gapBetweenFrameAndMeta = 18;
    const gapAboveFooter = 16;

    // Fit the cover visual frame cleanly in the exact remaining vertical band on Page 1
    const availableForFrame =
      footerRuleY - gapAboveFooter - metaH - gapBetweenFrameAndMeta - y;
    const frameH = Math.max(132, Math.min(190, Math.floor(availableForFrame)));

    // Authentic Photo Frame OR Safeguarding-Aware Archival Documentation Frame
    const resolvedImg =
      options.imagePath &&
      fs.existsSync(
        path.join(ROOT_DIR, 'public', options.imagePath.replace(/^\//, ''))
      )
        ? path.join(ROOT_DIR, 'public', options.imagePath.replace(/^\//, ''))
        : null;

    if (resolvedImg) {
      doc.save();
      doc
        .roundedRect(PAGE.marginX, y, PAGE.contentWidth, frameH, 6)
        .clip();
      doc.image(resolvedImg, PAGE.marginX, y, {
        fit: [PAGE.contentWidth, frameH],
        align: 'center',
        valign: 'center',
      });
      doc.restore();
      doc
        .roundedRect(PAGE.marginX, y, PAGE.contentWidth, frameH, 6)
        .lineWidth(0.9)
        .strokeColor(COLORS.border)
        .stroke();
    } else {
      doc
        .roundedRect(PAGE.marginX, y, PAGE.contentWidth, frameH, 6)
        .fillColor(COLORS.forest900)
        .fill();
      // Architectural grid lines inside cover visual block
      doc.save();
      doc.strokeColor('#1F523B').lineWidth(0.5);
      for (
        let gx = PAGE.marginX + 24;
        gx < PAGE.marginX + PAGE.contentWidth;
        gx += 28
      ) {
        doc.moveTo(gx, y).lineTo(gx, y + frameH).stroke();
      }
      for (let gy = y + 24; gy < y + frameH; gy += 28) {
        doc
          .moveTo(PAGE.marginX, gy)
          .lineTo(PAGE.marginX + PAGE.contentWidth, gy)
          .stroke();
      }
      doc.restore();

      const innerPadX = 24;
      const innerW = PAGE.contentWidth - innerPadX * 2;
      const topInset = frameH < 160 ? 18 : 26;

      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .fillColor('#E6A94A')
        .text(
          'DOCUMENTARY RECORD & SAFEGUARDING ARCHIVE',
          PAGE.marginX + innerPadX,
          y + topInset,
          {
            characterSpacing: 1.2,
            width: innerW,
          }
        );

      doc
        .font('Times-Bold')
        .fontSize(frameH < 160 ? 15 : 16.5)
        .fillColor(COLORS.white)
        .text(sanitizePdfText(options.title), PAGE.marginX + innerPadX, doc.y + 6, {
          width: innerW,
        });

      doc
        .font('Helvetica')
        .fontSize(9.2)
        .fillColor('#CBE0D5')
        .text(
          sanitizePdfText(options.imageCaption),
          PAGE.marginX + innerPadX,
          doc.y + 6,
          {
            width: innerW,
            lineGap: 3,
          }
        );

      if (options.safeguardingNote) {
        const cleanNote = sanitizePdfText(options.safeguardingNote);
        doc.font('Helvetica-Oblique').fontSize(8.1);
        const noteH = doc.heightOfString(cleanNote, {
          width: innerW,
          lineGap: 2.2,
        });
        const noteY = Math.max(doc.y + 6, y + frameH - noteH - 14);
        if (noteY + noteH <= y + frameH - 6) {
          doc
            .font('Helvetica-Oblique')
            .fontSize(8.1)
            .fillColor('#A8C4B6')
            .text(cleanNote, PAGE.marginX + innerPadX, noteY, {
              width: innerW,
              lineGap: 2.2,
            });
        }
      }
    }

    y += frameH + gapBetweenFrameAndMeta;

    // Structured Cover Metadata Table
    doc
      .roundedRect(PAGE.marginX, y, PAGE.contentWidth, metaH, 6)
      .fillColor(COLORS.white)
      .fill();
    doc
      .roundedRect(PAGE.marginX, y, PAGE.contentWidth, metaH, 6)
      .lineWidth(0.8)
      .strokeColor(COLORS.border)
      .stroke();

    let my = y + cardPad;
    measuredMetaRows.forEach((row, i) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(8.2)
        .fillColor(COLORS.ink500)
        .text(row.cleanLabel, PAGE.marginX + cardPad, my + 2, {
          width: labelColW,
        });
      doc
        .font('Helvetica')
        .fontSize(9.2)
        .fillColor(COLORS.ink900)
        .text(row.cleanValue, PAGE.marginX + cardPad + 160, my + 1, {
          width: valueColW,
          lineGap: 1.8,
        });
      if (i < measuredMetaRows.length - 1) {
        doc
          .moveTo(PAGE.marginX + cardPad, my + row.rowH - 4)
          .lineTo(PAGE.marginX + PAGE.contentWidth - cardPad, my + row.rowH - 4)
          .lineWidth(0.5)
          .strokeColor('#EFEAE0')
          .stroke();
      }
      my += row.rowH;
    });

    // Bottom Cover Institutional Footer (strictly on Page 1; lineBreak: false)
    doc
      .moveTo(PAGE.marginX, footerRuleY)
      .lineTo(PAGE.marginX + PAGE.contentWidth, footerRuleY)
      .lineWidth(0.6)
      .strokeColor(COLORS.border)
      .stroke();

    doc
      .font('Helvetica')
      .fontSize(8.2)
      .fillColor(COLORS.ink500)
      .text(
        sanitizePdfText(
          `Published by Garad Foundation, Thane, Maharashtra  |  ${options.publicationNote}`
        ),
        PAGE.marginX,
        PAGE.height - 42,
        { width: PAGE.contentWidth, lineBreak: false }
      );
  } finally {
    doc.page.margins.top = savedTopMargin;
    doc.page.margins.bottom = savedBottomMargin;
  }

  // Guardrail: Cover page must occupy exactly Page 1 with zero spill-over pages.
  if (doc.bufferedPageRange().count !== 1) {
    throw new Error(
      `Cover page overflow detected for "${options.title}": expected 1 page, got ${doc.bufferedPageRange().count}.`
    );
  }
}

function applyRunningHeadersAndFooters(
  doc: PDFKit.PDFDocument,
  headerRight: string,
  footerLeft: string
) {
  const range = doc.bufferedPageRange();
  const totalPages = range.count;

  for (let i = 1; i < totalPages; i++) {
    doc.switchToPage(range.start + i);
    const savedTop = doc.page.margins.top;
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;

    try {
      // Running Header
      doc
        .font('Helvetica-Bold')
        .fontSize(7.6)
        .fillColor(COLORS.forest900)
        .text('GARAD FOUNDATION', PAGE.marginX, 26, {
          characterSpacing: 1,
          lineBreak: false,
        });

      doc
        .font('Helvetica')
        .fontSize(7.8)
        .fillColor(COLORS.ink500)
        .text(sanitizePdfText(headerRight), PAGE.marginX, 26, {
          width: PAGE.contentWidth,
          align: 'right',
          lineBreak: false,
        });

      doc
        .moveTo(PAGE.marginX, 42)
        .lineTo(PAGE.marginX + PAGE.contentWidth, 42)
        .lineWidth(0.6)
        .strokeColor(COLORS.border)
        .stroke();

      // Running Footer
      const footerRuleY = PAGE.height - 44;
      doc
        .moveTo(PAGE.marginX, footerRuleY)
        .lineTo(PAGE.marginX + PAGE.contentWidth, footerRuleY)
        .lineWidth(0.6)
        .strokeColor(COLORS.border)
        .stroke();

      doc
        .font('Helvetica')
        .fontSize(7.8)
        .fillColor(COLORS.ink500)
        .text(sanitizePdfText(footerLeft), PAGE.marginX, footerRuleY + 10, {
          width: PAGE.contentWidth - 80,
          lineBreak: false,
        });

      doc
        .font('Helvetica-Bold')
        .fontSize(7.8)
        .fillColor(COLORS.forest900)
        .text(`Page ${i + 1} of ${totalPages}`, PAGE.marginX, footerRuleY + 10, {
          width: PAGE.contentWidth,
          align: 'right',
          lineBreak: false,
        });
    } finally {
      doc.page.margins.top = savedTop;
      doc.page.margins.bottom = savedBottom;
    }
  }
}

async function writePdfToFile(
  doc: PDFKit.PDFDocument,
  targetPath: string
): Promise<{ fileSizeBytes: number; pageCount: number }> {
  const pageCount = doc.bufferedPageRange().count;
  await new Promise<void>((resolve, reject) => {
    const stream = fs.createWriteStream(targetPath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);
    doc.pipe(stream);
    doc.end();
  });
  const stat = fs.statSync(targetPath);
  return { fileSizeBytes: stat.size, pageCount };
}

function getActivityBeneficiaryDetails(activity: ActivityRecord): {
  targetGroup: string;
  actualReach: string;
  keyAchievement: string;
  tableHeaders: string[];
  tableRows: string[][];
  outcomesNote: string;
  challenges: string[];
  acknowledgements: string[];
} {
  switch (activity.slug) {
    case 'utsavachi-shidori':
      return {
        targetGroup:
          'Homeless and economically vulnerable individuals across major Thane traffic junctions.',
        actualReach: '175 food boxes distributed across two documented rounds.',
        keyAchievement:
          'Delivered 175 fresh, home-prepared meal boxes across 3 Thane signals using a 100% in-kind community donation (zero-budget) model.',
        tableHeaders: ['Distribution Segment', 'Documented Quantity', 'Coverage / Notes'],
        tableRows: [
          ['First Documented Round', '80 food boxes', 'Teen Haath Naka, Majiwada & Nitin Company Signals'],
          ['Second Documented Round', '95 food boxes', 'Direct signal-level handover by youth volunteers'],
          ['Verified Total Output', '175 food boxes', '100% in-kind community donations (zero-budget)'],
        ],
        outcomesNote:
          'This activity is documented at the output level (175 freshly prepared individual meal boxes distributed). Immediate short-term meal relief and volunteer civic engagement were observed; formal longitudinal social outcomes were not measured for this single-day drive.',
        challenges: [
          'Coordinating fresh home-prepared meal packing and hygienic handover across three high-traffic Thane intersections on the same day.',
          'Mobilising sufficient food volume solely through in-kind household donations without cash procurement.',
        ],
        acknowledgements: [
          'Garad Foundation youth volunteers in Thane who packed and distributed meal boxes directly on site.',
          'Local community households and contributors who supplied all meals and snacks in kind.',
        ],
      };

    case 'menstrual-hygiene-awareness':
      return {
        targetGroup:
          'Tribal women and adolescent girls in Mamnoli, Kalyan, Maharashtra.',
        actualReach:
          '200 verified participants (150 tribal women and 50 adolescent girls).',
        keyAchievement:
          'Conducted local-language menstrual hygiene workshops, distributed sanitary napkin kits to all 200 participants, and supported basic preventive health screening with referrals where needed.',
        tableHeaders: ['Beneficiary Cohort', 'Verified Count', 'Share of Reach', 'Provisions Documented'],
        tableRows: [
          ['Tribal Women', '150', '75%', 'Local-language hygiene session & sanitary napkin kit'],
          ['Adolescent Girls', '50', '25%', 'Age-appropriate hygiene session & sanitary napkin kit'],
          ['Total Verified Participants', '200', '100%', 'Jointly delivered with Aapla Thane Foundation'],
        ],
        outcomesNote:
          'Documented outputs confirm 200 participants reached with local-language menstrual health education and sanitary kits, alongside basic screening for anaemia and reproductive symptoms (individual screening and referral counts are not specified in the report). Longer-term behaviour-change tracking was not recorded in this edition.',
        challenges: [
          'Addressing stigma and hesitation around menstrual health conversations in a respectful, non-judgemental local-language setting.',
          'Upholding participant dignity and safeguarding standards for adolescent girls during health outreach and documentation.',
        ],
        acknowledgements: [
          'Aapla Thane Foundation — collaborating field outreach and community health partner.',
          'Local facilitators, health volunteers, and community coordinators in Mamnoli, Kalyan.',
        ],
      };

    case 'online-essay-poetry-competition':
      return {
        targetGroup:
          'Youth writers and students participating online during Academic Year 2020-21.',
        actualReach: '30 verified youth participants across Marathi, Hindi, and English.',
        keyAchievement:
          'Enabled multilingual creative participation in Essay and Poetry formats on a shared Indian history theme, with every submission individually reviewed and top participants receiving e-certificates.',
        tableHeaders: ['Programme Dimension', 'Documented Detail'],
        tableRows: [
          ['Verified Youth Participants', '30 participants'],
          ['Supported Languages', 'Marathi, Hindi, and English (3 languages)'],
          ['Literary Formats', 'Essay and Poetry (2 formats)'],
          ['Shared Theme', 'A common theme rooted in Indian history'],
          ['Recognition', 'All entries reviewed and appreciated; e-certificates issued to top participants'],
        ],
        outcomesNote:
          'Documented outputs verify 30 completed submissions reviewed across three languages. While the initiative encouraged independent historical reading and written expression during lockdown disruptions, formal post-activity learning assessments were not conducted.',
        challenges: [
          'Sustaining youth co-curricular engagement during prolonged pandemic school and college closures.',
          'Ensuring fair, attentive review of submissions written across three different languages and two literary formats.',
        ],
        acknowledgements: [
          'All 30 participating young writers across Marathi, Hindi, and English.',
          'Garad Foundation review volunteers who evaluated and acknowledged every entry.',
        ],
      };

    case 'online-videography-awareness-contest':
      return {
        targetGroup:
          'Youth creators producing short-form public-health awareness videos online.',
        actualReach:
          '20 verified youth creator submissions (with 2 documented prize awardees).',
        keyAchievement:
          'Mobilised 20 youth creators across Marathi, Hindi, and English via WhatsApp and email to communicate accurate COVID-19 awareness, with Core Team evaluation and post-lockdown prize courier fulfilment.',
        tableHeaders: ['Award / Metric', 'Documented Record', 'Video Title / Detail'],
        tableRows: [
          ['Total Verified Submissions', '20 youth creators', 'Submitted via WhatsApp & Email (Marathi, Hindi, English)'],
          ['First Prize', 'Janhavi Dandekar', '"Understanding Symptoms of COVID-19"'],
          ['Second Prize', 'Dinraj Aponkar', '"Corona Awareness"'],
          ['Prize Fulfilment', 'Completed post-lockdown', 'Trophy and signature pen couriered to winners'],
        ],
        outcomesNote:
          'Documented outputs verify 20 multilingual awareness videos produced across three COVID-19 public-health themes and evaluated by the Core Team. Digital view counts or population-level health behaviour shifts were not recorded in the archive.',
        challenges: [
          'Designing low-barrier digital submission channels (WhatsApp and email) so students with basic smartphones could participate.',
          'Coordinating physical prize procurement and courier delivery safely once lockdown logistics permitted.',
        ],
        acknowledgements: [
          'Garad Foundation Core Team members who reviewed all 20 submissions on creativity, clarity, and communication.',
          'All 20 youth creators, including awardees Janhavi Dandekar and Dinraj Aponkar.',
        ],
      };

    case 'mission-bharari-phase-1':
      return {
        targetGroup:
          'Rural Zilla Parishad primary and school students in Bhor Taluka, Pune District, Maharashtra.',
        actualReach:
          '220 students supported across 10 Zilla Parishad schools (internal activity reporting).',
        keyAchievement:
          'Executed a three-stage baseline-survey, 100% digital crowdfunding, and volunteer-led COVID-safe stationery distribution across 10 rural schools on 3 February 2021.',
        tableHeaders: ['Implementation Metric', 'Documented Figure', 'Verification / Basis'],
        tableRows: [
          ['Students Supported', '220 students', 'Internal 2020-21 activity reporting (not independently audited)'],
          ['Schools Covered', '10 Zilla Parishad schools', 'Baseline-surveyed in Bhor Taluka, Pune District'],
          ['Stationery Kit Contents', 'Complete individual kits', 'Notebooks, pens, geometry kits, erasers & essential stationery'],
          ['Funding Model', '100% digital crowdfunding', 'WhatsApp outreach, social media & personal calls'],
        ],
        outcomesNote:
          'Documented outputs verify individual stationery kits delivered to 220 students across 10 surveyed Zilla Parishad schools. While kits addressed immediate material barriers to classroom participation, formal academic-score tracking or multi-year retention evaluation was not part of Phase 1 reporting.',
        challenges: [
          'Conducting on-ground baseline needs mapping across 10 dispersed rural Zilla Parishad schools in Bhor Taluka prior to fundraising.',
          'Coordinating safe procurement, assembly, and rural field transport while maintaining COVID-19 precautions.',
        ],
        acknowledgements: [
          'Field coordinator and youth volunteers who conducted the baseline survey, digital crowdfunding, and Bhor Taluka field delivery.',
          'Participating Zilla Parishad school staff and community contributors who supported the digital crowdfunding campaign.',
        ],
      };

    case 'abhivyakta-2024':
      return {
        targetGroup:
          'Students from schools across Thane district (5th to 7th and 8th to 10th standard elocution participants and folk dance participants).',
        actualReach:
          'Elocution competition: 60 students; Folk dance competition: 75+ students (19 February 2024, Thane, Maharashtra).',
        keyAchievement:
          "Delivered a district-level event in Thane celebrating public speaking inspired by Chhatrapati Shivaji Maharaj (60 students) and traditional Maharashtrian folk dance (75+ students), concluding with an award ceremony.",
        tableHeaders: [
          'Competition Track',
          'Documented Participation',
          'Format & Recognition',
        ],
        tableRows: [
          [
            'Elocution Competition (Voices of Inspiration)',
            '60 students',
            '5th to 7th & 8th to 10th standard | Topics inspired by Chhatrapati Shivaji Maharaj',
          ],
          [
            'Folk Dance Competition (A Celebration of Culture)',
            '75+ students',
            'Traditional Maharashtrian folk dance in colourful costumes',
          ],
          [
            'Award Ceremony & Recognition',
            'Winning & participating students',
            'Trophies, certificates, book sets and cash prizes',
          ],
        ],
        outcomesNote:
          'Documented outputs record 60 students in the elocution competition and 75+ students in the folk dance competition, kept as separate participant groups per source records. Winners received trophies, certificates, book sets and cash prizes.',
        challenges: [
          'Coordinating two district-level student competitions (elocution across two grade categories and traditional Maharashtrian folk dance) on a single event day in Thane.',
          'Providing a supportive stage for students to develop public speaking skills and cultural expression.',
        ],
        acknowledgements: [
          'Participating students from schools across Thane district.',
          'Garad Foundation organising volunteers and event coordinators.',
        ],
      };

    case 'gudhi-shikshanachi':
      return {
        targetGroup:
          'Underprivileged children living in difficult circumstances near a garbage dumping ground.',
        actualReach:
          'Stationery kits (pencil boxes, compass boxes, notebooks and educational materials) distributed (exact child count not specified in source record).',
        keyAchievement:
          'Provided essential school supplies and conducted encouraging volunteer conversations about the importance of education on 20 March 2019.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Initiative Date', '20 March 2019'],
          [
            'Supplies Distributed',
            'Pencil boxes, compass boxes, notebooks and other essential educational materials',
          ],
          [
            'Volunteer Engagement',
            'Direct conversations with children on the importance of education and building a better future',
          ],
        ],
        outcomesNote:
          'Exact beneficiary count and precise geographic location are not recorded in the historical source document and are intentionally not estimated.',
        challenges: [
          'Supporting children living near a garbage dumping ground who face significant barriers to schooling.',
        ],
        acknowledgements: [
          'Garad Foundation volunteers who distributed stationery and interacted with the children.',
        ],
      };

    case 'sanitary-pad-distribution':
      return {
        targetGroup: 'Tribal women in Mamnoli village, Kalyan taluka, Maharashtra.',
        actualReach:
          'Sanitary pad distribution and menstrual hygiene awareness conversations conducted (exact beneficiary count not specified in source record).',
        keyAchievement:
          'Partnered with Aple Thane, Aple Foundation on 28 April 2019 to distribute sanitary pads and hold open conversations addressing myths and taboos around menstruation.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Date & Location', '28 April 2019 | Mamnoli village, Kalyan taluka, Maharashtra'],
          ['Collaborating Organisation', 'Aple Thane, Aple Foundation'],
          [
            'Activities Conducted',
            'Sanitary pad distribution and open conversations addressing menstrual health, myths and taboos',
          ],
        ],
        outcomesNote:
          'Exact beneficiary count is not recorded in the 2019 source document and is intentionally omitted. Inspired by discussions during the International Women’s Day session.',
        challenges: [
          'Breaking silence and long-standing taboos surrounding menstruation to foster open community dialogue.',
        ],
        acknowledgements: [
          'Collaborating NGO partner Aple Thane, Aple Foundation and Garad Foundation volunteers.',
        ],
      };

    case 'chhatrapati-shivaji-maharaj-jayanti-2019':
      return {
        targetGroup: 'Students residing at the Sharadashram hostel facility.',
        actualReach:
          'Interactive teaching sessions and discussions conducted (participant count not specified in source record).',
        keyAchievement:
          'Organised Garad Foundation’s first Chhatrapati Shivaji Maharaj Jayanti celebration on 19 February 2019, inspiring students with values of courage, governance and social justice.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Date & Venue', '19 February 2019 | Sharadashram hostel facility'],
          [
            'Format',
            'Interactive teaching sessions and student discussions on leadership, bravery, governance and social justice',
          ],
        ],
        outcomesNote:
          'Participant numbers are not specified in the historical source record and are intentionally not estimated.',
        challenges: [
          'Designing interactive historical sessions that connect leadership and social-justice values to students’ own lives.',
        ],
        acknowledgements: [
          'Students and staff at Sharadashram hostel facility and Garad Foundation volunteers.',
        ],
      };

    case 'selfie-with-bappa':
      return {
        targetGroup: 'Youth and community members celebrating Ganeshotsav on social media.',
        actualReach:
          'Social media environmental awareness campaign using #SelfieWithBappa (exact participation figure not specified in source record).',
        keyAchievement:
          'Promoted clay and natural, biodegradable Ganpati idols during Ganeshotsav 2019 while sparking conversations on reducing festival pollution from plaster of Paris.',
        tableHeaders: ['Campaign Element', 'Documented Detail'],
        tableRows: [
          ['Campaign Year', '2019'],
          ['Hashtag & Format', '#SelfieWithBappa social media photo-sharing awareness campaign'],
          [
            'Environmental Focus',
            'Promoting clay and biodegradable Ganpati idols and raising awareness about plaster of Paris pollution',
          ],
        ],
        outcomesNote:
          'Exact campaign dates and total participant count are not specified in the source record and are intentionally omitted.',
        challenges: [
          'Encouraging environmentally responsible festival choices through engaging youth-friendly social media outreach.',
        ],
        acknowledgements: [
          'Community members who shared photographs of eco-friendly Ganpati idols under #SelfieWithBappa.',
        ],
      };

    case 'gyansetu':
      return {
        targetGroup: 'Youth and school children accessing community study libraries.',
        actualReach:
          'Collected books distributed to 7 study libraries (15 October 2021).',
        keyAchievement:
          'Collected storybooks, novels, textbooks and reference materials from community donors and distributed them across 7 study libraries to cultivate reading habits.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Launch Date', '15 October 2021'],
          ['Libraries Supported', '7 study libraries'],
          [
            'Book Categories',
            'Storybooks, novels, textbooks and reference materials',
          ],
        ],
        outcomesNote:
          'Verified distribution reach is 7 study libraries. Total book count and individual library names are not specified in the source document.',
        challenges: [
          'Collecting a diverse mix of storybooks, novels, textbooks and reference materials suited to different student needs.',
        ],
        acknowledgements: [
          'Community book donors, receiving study libraries, and Garad Foundation volunteers.',
        ],
      };

    case 'blood-donation-drive-2022':
      return {
        targetGroup:
          'Community blood donors supporting emergency and hospital blood supply.',
        actualReach: '35 voluntary blood donors participated (20 February 2022).',
        keyAchievement:
          'Honoured Chhatrapati Shivaji Maharaj Jayanti by uniting 35 blood donors in collaboration with Kai. Wamanrao Oak Blood Bank and raising voluntary blood donation awareness.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Date', '20 February 2022'],
          ['Verified Donors', '35 voluntary blood donors'],
          ['Collaborating Partner', 'Kai. Wamanrao Oak Blood Bank'],
        ],
        outcomesNote:
          'Verified participation count is 35 voluntary blood donors supporting Kai. Wamanrao Oak Blood Bank.',
        challenges: [
          'Mobilising voluntary donors and raising awareness about the critical role of blood donation in medical emergencies and surgeries.',
        ],
        acknowledgements: [
          'All 35 blood donors, Kai. Wamanrao Oak Blood Bank team, and Garad Foundation volunteers.',
        ],
      };

    case 'sandals-for-children':
      return {
        targetGroup:
          'School-going children in Khardi village, Maharashtra (rural area with a predominantly tribal population).',
        actualReach:
          '250+ pairs of brand-new sandals distributed and fitted on-site (21 June 2022).',
        keyAchievement:
          'Distributed more than 250 pairs of sandals in Khardi village with careful volunteer sizing so children walking long distances to school commute safely and comfortably.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Date & Location', '21 June 2022 | Khardi village, Maharashtra'],
          ['Verified Quantity', '250+ pairs of brand-new sandals'],
          [
            'Distribution Approach',
            'Volunteers helped each child try on sandals and adjust straps for proper fit',
          ],
        ],
        outcomesNote:
          'Verified output is 250+ pairs of brand-new sandals distributed to children in Khardi village.',
        challenges: [
          'Fitting each child individually with suitable sandal sizes across more than 250 pairs in a rural community setting.',
        ],
        acknowledgements: [
          'Garad Foundation volunteers and community members in Khardi village.',
        ],
      };

    case 'project-savitri':
      return {
        targetGroup:
          'Women and children in the tribal parts of Kharidi village, Maharashtra.',
        actualReach:
          '140+ women and children received warm and rain-protective clothing (27 August 2023).',
        keyAchievement:
          'Collected, sorted and distributed sweaters, jackets, sturdy shoes and raincoats to over 140 women and children in Kharidi village during the rainy season.',
        tableHeaders: ['Activity Element', 'Documented Detail'],
        tableRows: [
          ['Date & Location', '27 August 2023 | Kharidi village, Maharashtra'],
          ['Verified Beneficiaries', '140+ women and children'],
          [
            'Clothing Distributed',
            'Sweaters, jackets, sturdy shoes and raincoats (community-donated, volunteer-sorted)',
          ],
        ],
        outcomesNote:
          'Verified output is 140+ women and children supported in Kharidi village (exact spelling preserved from source document).',
        challenges: [
          'Sorting and organising community-donated clothing to ensure every garment was usable and weather-appropriate during the rainy season.',
        ],
        acknowledgements: [
          'Community clothing donors and Garad Foundation volunteers who sorted and distributed items in Kharidi village.',
        ],
      };

    case 'marathi-rajbhasha-divas-spardha':
    default:
      return {
        targetGroup:
          'Youth speakers participating in online Marathi elocution (Vakta Spardha).',
        actualReach:
          '8 named awardees documented (total participant count beyond named awardees not specified in the report).',
        keyAchievement:
          'Hosted an accessible online Marathi elocution competition (Vakta Spardha) celebrating Marathi literature, cultural heritage, and social themes, evaluated on four criteria and honouring 8 named awardees.',
        tableHeaders: ['Recognition Tier', 'Named Awardee', 'Evaluation Criteria Applied'],
        tableRows: [
          ['First Prize', 'Akshay Jadhav', 'Content, Clarity, Fluency & Emotional Expression'],
          ['Second Prize', 'Chandranshu Chakrakint', 'Content, Clarity, Fluency & Emotional Expression'],
          ['Consolation', 'Gayatri Gokhale', 'Recorded Marathi Speech (Vakta Spardha)'],
          ['Consolation', 'Pradnya Jagtap', 'Recorded Marathi Speech (Vakta Spardha)'],
          ['Consolation', 'Ishwari Kedar', 'Recorded Marathi Speech (Vakta Spardha)'],
          ['Consolation', 'Poorva Kekean', 'Recorded Marathi Speech (Vakta Spardha)'],
          ['Consolation', 'Sagar Kawale', 'Recorded Marathi Speech (Vakta Spardha)'],
          ['Consolation', 'Sunita Kawale', 'Recorded Marathi Speech (Vakta Spardha)'],
        ],
        outcomesNote:
          'Documented outputs confirm the successful conduct of the online Vakta Spardha and formal recognition of 8 named awardees. Total registration count and post-event longitudinal indicators are not specified in the source report.',
        challenges: [
          'Maintaining cultural engagement and public-speaking rigour through recorded online speech submissions.',
          'Reviewing speeches consistently across four qualitative criteria (content, clarity, fluency, and emotional expression).',
        ],
        acknowledgements: [
          'All participating Marathi speakers and the eight documented awardees.',
          'Garad Foundation organising and evaluation volunteers.',
        ],
      };
  }
}

async function generateActivityReportPdf(activity: ActivityRecord) {
  const fileMeta = ACTIVITY_FILENAME_MAP[activity.slug];
  if (!fileMeta) {
    throw new Error(`Missing PDF filename mapping for activity slug: ${activity.slug}`);
  }

  const targetPath = path.join(ACTIVITIES_DIR, fileMeta.fileSlug);
  const details = getActivityBeneficiaryDetails(activity);

  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: PAGE.marginTop,
      bottom: PAGE.marginBottom,
      left: PAGE.marginX,
      right: PAGE.marginX,
    },
    bufferPages: true,
    info: {
      Title: `${activity.title} - Activity Report (${activity.yearDisplay})`,
      Author: 'Garad Foundation, Thane, Maharashtra',
      Subject: `CSR-ready documented activity report for ${activity.title}`,
      Keywords: `Garad Foundation, ${activity.category}, ${activity.yearDisplay}, Activity Report, CSR`,
      Creator: 'Garad Foundation Institutional Reporting System',
    },
  });

  const editionLabel = activity.yearDisplay.includes('–')
    ? `FY ${activity.yearDisplay}`
    : activity.yearDisplay;

  const coverMetaRows: [string, string][] = [
    ['Project / Activity', activity.title],
    ['Programme Category', activity.categoryDisplayLabel || activity.category],
    ['Date / Reporting Period', activity.date],
  ];
  if (activity.location) {
    coverMetaRows.push(['Location', activity.location]);
  }
  coverMetaRows.push(
    ['Document Reference', `${activity.archiveNumber} (${editionLabel})`],
    ['Reporting Organisation', 'Garad Foundation, Thane, Maharashtra']
  );

  // 1. COVER PAGE
  drawCoverPage(doc, {
    documentType: `INDIVIDUAL ACTIVITY REPORT  |  ${activity.archiveNumber}`,
    categoryLabel: `${activity.categoryDisplayLabel || activity.category}  |  ${editionLabel}`,
    title: activity.title,
    subtitle: activity.cardDescription,
    reportingPeriod: activity.date,
    location: activity.location || 'Garad Foundation Archive',
    publicationNote: `Activity Report Edition ${editionLabel}`,
    imagePath:
      activity.heroImage.imageType === 'sample'
        ? null
        : activity.heroImage.imagePath,
    imageCaption: activity.heroImage.caption,
    safeguardingNote: activity.heroImage.safeguardingNote,
    metaRows: coverMetaRows,
  });

  // PAGE 2+: STRUCTURED REPORT SECTIONS
  doc.addPage();
  doc.y = PAGE.marginTop;

  // 2. EXECUTIVE SUMMARY
  drawSectionHeading(doc, '01', 'Executive Summary');
  drawParagraph(doc, activity.introduction);
  drawDataTable(
    doc,
    ['Summary Parameter', 'Documented Detail'],
    [
      ['Need Addressed', activity.needAndRationale.heading],
      ['Primary Objective', activity.objectives[0]?.description || activity.title],
      ['Target Beneficiary Group', details.targetGroup],
      ['Verified Reach / Output', details.actualReach],
      ['Key Achievement', details.keyAchievement],
    ],
    [0.32, 0.68]
  );

  // Key verified metrics strip (rendered only when numeric figures are documented)
  if (activity.verifiedMetrics.length > 0) {
    drawMetricStrip(
      doc,
      activity.verifiedMetrics.map((m) => ({
        value: m.value,
        label: m.label,
        sub: editionLabel,
      }))
    );
  }

  // 3. BACKGROUND AND PROJECT NEED
  drawSectionHeading(doc, '02', 'Background and Project Need');
  drawSubheading(doc, activity.needAndRationale.heading);
  for (const para of activity.needAndRationale.paragraphs) {
    drawParagraph(doc, para);
  }

  // 4. PROJECT OBJECTIVES
  drawSectionHeading(doc, '03', 'Project Objectives');
  drawBulletList(
    doc,
    activity.objectives.map((o) => `${o.title}: ${o.description}`)
  );

  // 5. IMPLEMENTATION DETAILS
  drawSectionHeading(doc, '04', 'Implementation Details');
  const implRows: string[][] = [['Implementation Date / Period', activity.date]];
  if (activity.location) {
    implRows.push(['Location & Geography', activity.location]);
  }
  implRows.push(
    ['Target Group', details.targetGroup],
    ['Activities Conducted', activity.whatWeDid.heading]
  );
  if (activity.implementation.deliveryModel) {
    implRows.push(['Delivery Model', activity.implementation.deliveryModel]);
  }
  if (activity.implementation.fundingModel) {
    implRows.push(['Funding / Resource Model', activity.implementation.fundingModel]);
  }
  if (activity.implementation.languages?.length) {
    implRows.push(['Languages Supported', activity.implementation.languages.join(', ')]);
  }
  if (activity.implementation.formats?.length) {
    implRows.push(['Formats', activity.implementation.formats.join(', ')]);
  }
  if (activity.implementation.submissionChannels?.length) {
    implRows.push([
      'Submission Channels',
      activity.implementation.submissionChannels.join(', '),
    ]);
  }
  if (activity.implementation.evaluatedBy) {
    implRows.push(['Evaluated By', activity.implementation.evaluatedBy]);
  }
  if (activity.implementation.evaluationCriteria?.length) {
    implRows.push([
      'Evaluation Criteria',
      activity.implementation.evaluationCriteria.join(', '),
    ]);
  }
  if (activity.partners?.length) {
    implRows.push([
      'Documented Partner(s)',
      activity.partners.map((p) => `${p.name} (${p.role})`).join('; '),
    ]);
  }

  drawDataTable(doc, ['Implementation Parameter', 'Documented Record'], implRows, [0.34, 0.66]);

  for (const para of activity.whatWeDid.paragraphs) {
    drawParagraph(doc, para);
  }

  // Mission Bharari 3-stage methodology table if present
  if (activity.implementation.methodology) {
    drawSubheading(doc, activity.implementation.methodology.heading);
    drawDataTable(
      doc,
      ['Stage', 'Phase Title', 'Scope & Execution'],
      activity.implementation.methodology.stages.map((s) => [
        s.stageNumber,
        `${s.title} (${s.subtitleMeta})`,
        s.description,
      ]),
      [0.14, 0.28, 0.58]
    );
  }

  // Videography themes if present
  if (activity.participationDetails?.videoThemes?.length) {
    drawSubheading(doc, 'Documented Public-Health Video Themes');
    drawBulletList(doc, activity.participationDetails.videoThemes);
  }

  // 6. BENEFICIARY REACH
  drawSectionHeading(doc, '05', 'Beneficiary Reach & Verified Breakdown');
  drawDataTable(
    doc,
    details.tableHeaders,
    details.tableRows,
    details.tableHeaders.length === 4
      ? [0.25, 0.16, 0.16, 0.43]
      : details.tableHeaders.length === 3
      ? [0.28, 0.24, 0.48]
      : [0.35, 0.65]
  );

  // Activity-specific restrained visual bars
  if (activity.participationDetails?.distributionBreakdown) {
    const bd = activity.participationDetails.distributionBreakdown;
    drawHorizontalBarViz(
      doc,
      'Documented Food Box Distribution by Round (Total: 175 Boxes)',
      bd.rounds.map((r, i) => ({
        label: r.roundLabel,
        value: r.boxes,
        display: `${r.boxes} boxes (${Math.round((r.boxes / bd.totalBoxes) * 100)}%)`,
        color: i === 0 ? COLORS.forest800 : COLORS.terracotta,
      }))
    );
  }

  if (activity.participationDetails?.participantSplit) {
    drawHorizontalBarViz(
      doc,
      'Verified Participant Disaggregation — Mamnoli, Kalyan (Total: 200)',
      activity.participationDetails.participantSplit.map((g) => ({
        label: g.label,
        value: g.count,
        display: `${g.count} participants (${g.sharePercent}%)`,
        color: g.tone === 'forest' ? COLORS.forest800 : COLORS.terracotta,
      }))
    );
  }

  if (activity.metricsDisclaimer) {
    drawCalloutBox(doc, 'Reporting Basis & Verification Note', activity.metricsDisclaimer, 'sage');
  }
  if (activity.participationDetails?.healthScreeningNote) {
    drawCalloutBox(
      doc,
      'Preventive Health Screening Disclosure',
      activity.participationDetails.healthScreeningNote,
      'cream'
    );
  }

  // 7. KEY OUTPUTS AND OUTCOMES
  drawSectionHeading(doc, '06', 'Key Outputs and Outcomes');
  drawSubheading(doc, 'Documented Outputs (Delivered / Completed)');
  if (activity.outputs?.items?.length) {
    drawBulletList(doc, activity.outputs.items);
  }
  drawSubheading(doc, 'Observed & Documented Outcomes (Evidence Scope)');
  drawParagraph(doc, details.outcomesNote);

  // 8. PHOTOGRAPHIC DOCUMENTATION
  drawSectionHeading(doc, '07', 'Photographic Documentation & Safeguarding');
  const availablePhotos = [activity.heroImage, ...activity.gallery].filter(
    (m) =>
      m.imagePath &&
      m.imageType !== 'sample' &&
      fs.existsSync(path.join(ROOT_DIR, 'public', m.imagePath.replace(/^\//, '')))
  );
  if (availablePhotos.length > 0) {
    for (const photo of availablePhotos) {
      const fullPath = path.join(ROOT_DIR, 'public', photo.imagePath!.replace(/^\//, ''));
      ensureSpace(doc, 200);
      doc.image(fullPath, PAGE.marginX, doc.y, {
        fit: [PAGE.contentWidth, 165],
      });
      doc.y += 170;
      drawParagraph(doc, `Caption: ${photo.caption}`);
    }
  } else {
    drawCalloutBox(
      doc,
      'Archival Photography & Participant Safeguarding Standard',
      `${activity.heroImage.caption} ${
        activity.heroImage.safeguardingNote ||
        'Original field photographs for this activity are maintained in Garad Foundation archival records and are published only after verification for dignity, accuracy, and participant/guardian consent.'
      }`,
      'sage'
    );
    if (activity.gallery.length > 0) {
      drawSubheading(doc, 'Documented Archival Photo Captions on Record');
      drawBulletList(
        doc,
        activity.gallery.map(
          (g) =>
            `${g.caption}${g.locationRecorded ? ` (${g.locationRecorded})` : ''}`
        )
      );
    }
  }

  // 9. FINANCIAL OVERVIEW (Strictly factual — zero invented figures)
  drawSectionHeading(doc, '08', 'Financial Overview');
  const financialBody = activity.implementation.fundingModel
    ? `Documented Funding Model: ${activity.implementation.fundingModel}. Detailed project-level budgets, audited expenditure vouchers, and utilisation summaries are not included in this public activity report edition. Institutional CSR teams and grant reviewers may request audited accounts directly from Garad Foundation.`
    : 'Project-level audited financial figures are not included in this public activity report edition. Garad Foundation maintains statutory financial records separately and provides supporting expenditure documentation to institutional donors and CSR due-diligence teams upon request.';
  drawCalloutBox(doc, 'Financial Transparency Disclosure', financialBody, 'cream');

  // 10. CHALLENGES AND LEARNINGS
  drawSectionHeading(doc, '09', 'Challenges and Learnings');
  drawBulletList(doc, details.challenges);
  if (activity.reflection.paragraphs.length > 0) {
    drawSubheading(doc, activity.reflection.heading);
    for (const para of activity.reflection.paragraphs) {
      drawParagraph(doc, para);
    }
  }

  // 11. ACKNOWLEDGEMENTS
  drawSectionHeading(doc, '10', 'Acknowledgements');
  drawBulletList(doc, details.acknowledgements);

  // 12. CLOSING NOTE
  drawSectionHeading(doc, '11', 'Closing Note & Institutional Contact');
  drawParagraph(
    doc,
    `This activity report has been compiled from Garad Foundation's documented FY ${activity.yearDisplay} activity records for transparent sharing with corporate CSR teams, institutional partners, donors, and community stakeholders.`
  );
  drawDataTable(
    doc,
    ['Organisation Detail', 'Information'],
    [
      ['Organisation', 'Garad Foundation'],
      ['Headquarters', 'Thane, Maharashtra, India'],
      ['Digital Archive & Reports', 'Available via the Garad Foundation web portal (/activities and /reports)'],
      ['Verification Standard', 'Compiled strictly from documented activity records without estimated or fabricated metrics'],
    ],
    [0.32, 0.68]
  );

  applyRunningHeadersAndFooters(
    doc,
    activity.shortTitle,
    `Garad Foundation  |  ${activity.shortTitle} Activity Report  |  FY ${activity.yearDisplay}`
  );

  const stats = await writePdfToFile(doc, targetPath);
  return {
    slug: activity.slug,
    fileUrl: `/assets/reports/activities/${fileMeta.fileSlug}`,
    downloadFilename: fileMeta.downloadFilename,
    ...stats,
  };
}

async function generateAnnualReport2020_21Pdf() {
  const fileName = 'annual-report-2020-21.pdf';
  const targetPath = path.join(ANNUAL_DIR, fileName);

  const stats = await generateAnnualReportPdf(
    ANNUAL_REPORT_2020_21,
    targetPath,
    ROOT_DIR
  );

  if (!stats.usedOriginalLogo) {
    console.warn(
      '  [NOTE] Official logo file not yet found at public/assets/branding/garad-foundation-logo.png — rendered octagonal logo placeholder slot on every page.'
    );
  }

  return {
    id: ANNUAL_REPORT_2020_21.id,
    fileUrl: `/assets/reports/annual/${fileName}`,
    downloadFilename: 'Garad-Foundation-Annual-Report-2020-21.pdf',
    fileSizeBytes: stats.fileSizeBytes,
    pageCount: stats.pageCount,
  };
}

async function main() {
  fs.mkdirSync(ANNUAL_DIR, { recursive: true });
  fs.mkdirSync(ACTIVITIES_DIR, { recursive: true });

  console.log('Generating Garad Foundation CSR-ready PDF reports...');
  const annual = await generateAnnualReport2020_21Pdf();
  console.log(
    `  [OK] Annual Report 2020-21 -> ${annual.fileUrl} (${annual.pageCount} pages, ${formatFileSize(annual.fileSizeBytes)})`
  );

  const activityResults: Record<
    string,
    {
      fileUrl: string;
      downloadFilename: string;
      fileSizeBytes: number;
      fileSizeLabel: string;
      pageCount: number;
    }
  > = {};

  for (const activity of ACTIVITIES) {
    const res = await generateActivityReportPdf(activity);
    activityResults[activity.slug] = {
      fileUrl: res.fileUrl,
      downloadFilename: res.downloadFilename,
      fileSizeBytes: res.fileSizeBytes,
      fileSizeLabel: formatFileSize(res.fileSizeBytes),
      pageCount: res.pageCount,
    };
    console.log(
      `  [OK] ${activity.title} -> ${res.fileUrl} (${res.pageCount} pages, ${formatFileSize(res.fileSizeBytes)})`
    );
  }

  const manifestSource = `// Auto-generated by scripts/generate-reports.ts — do not hand-edit byte sizes or page counts.
export interface GeneratedReportFileMeta {
  fileUrl: string;
  downloadFilename: string;
  fileSizeBytes: number;
  fileSizeLabel: string;
  pageCount: number;
}

export const GENERATED_ANNUAL_REPORTS: Record<string, GeneratedReportFileMeta> = {
  'annual-report-2020-21': {
    fileUrl: '${annual.fileUrl}',
    downloadFilename: '${annual.downloadFilename}',
    fileSizeBytes: ${annual.fileSizeBytes},
    fileSizeLabel: '${formatFileSize(annual.fileSizeBytes)}',
    pageCount: ${annual.pageCount},
  },
};

export const GENERATED_ACTIVITY_REPORTS: Record<string, GeneratedReportFileMeta> = ${JSON.stringify(
    activityResults,
    null,
    2
  )};
`;

  fs.writeFileSync(MANIFEST_OUTPUT, manifestSource, 'utf8');
  console.log(`Manifest written to ${path.relative(ROOT_DIR, MANIFEST_OUTPUT)}`);
}

main().catch((err) => {
  console.error('Failed to generate PDF reports:', err);
  process.exit(1);
});
