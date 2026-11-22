import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { ACTIVITIES, ActivityRecord } from '../src/data/activities';

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

  // 1. COVER PAGE
  drawCoverPage(doc, {
    documentType: `INDIVIDUAL ACTIVITY REPORT  |  ${activity.archiveNumber}`,
    categoryLabel: `${activity.category}  |  FY ${activity.yearDisplay}`,
    title: activity.title,
    subtitle: activity.cardDescription,
    reportingPeriod: activity.date,
    location: activity.location,
    publicationNote: `Activity Report Edition FY ${activity.yearDisplay}`,
    imagePath: activity.heroImage.imagePath,
    imageCaption: activity.heroImage.caption,
    safeguardingNote: activity.heroImage.safeguardingNote,
    metaRows: [
      ['Project / Activity', activity.title],
      ['Programme Category', activity.category],
      ['Date / Reporting Period', activity.date],
      ['Location', activity.location],
      ['Document Reference', `${activity.archiveNumber} (FY ${activity.yearDisplay})`],
      ['Reporting Organisation', 'Garad Foundation, Thane, Maharashtra'],
    ],
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

  // Key verified metrics strip
  drawMetricStrip(
    doc,
    activity.verifiedMetrics.map((m) => ({
      value: m.value,
      label: m.label,
      sub: `FY ${activity.yearDisplay}`,
    }))
  );

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
  const implRows: string[][] = [
    ['Implementation Date / Period', activity.date],
    ['Location & Geography', activity.location],
    ['Target Group', details.targetGroup],
    ['Activities Conducted', activity.whatWeDid.heading],
  ];
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
  const fyActivities = ACTIVITIES.filter((a) => a.year === '2020-21');

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
      Title: 'Garad Foundation - Annual Report 2020-21',
      Author: 'Garad Foundation, Thane, Maharashtra',
      Subject:
        'Consolidated institutional Annual Report of Garad Foundation for Financial Year 2020-21',
      Keywords:
        'Garad Foundation, Annual Report 2020-21, CSR, Nonprofit, Thane, Maharashtra, Education, Community Welfare',
      Creator: 'Garad Foundation Institutional Reporting System',
    },
  });

  // 1. COVER PAGE
  drawCoverPage(doc, {
    documentType: 'INSTITUTIONAL ANNUAL REPORT  |  FINANCIAL YEAR 2020-21',
    categoryLabel: 'ANNUAL REPORT  |  FY 2020-21',
    title: 'Annual Report 2020-21',
    subtitle:
      'A consolidated institutional overview of Garad Foundation programmes, documented field activities, youth initiatives, and governance practices during Financial Year 2020-21.',
    reportingPeriod: 'Financial Year 2020-21 (with documented early-2020 founding drives)',
    location: 'Thane, Kalyan, Bhor Taluka (Pune District) & Online across Maharashtra',
    publicationNote: 'Institutional Publication for CSR & Donor Review',
    imagePath: null,
    imageCaption:
      'Documenting six verified grassroots initiatives across community welfare, women and menstrual health, rural primary education, public health awareness, and youth literary and cultural engagement.',
    safeguardingNote:
      'Prepared strictly from verified Garad Foundation activity records. Safeguarding-cleared photography is archived separately and shared in compliance with participant consent protocols.',
    metaRows: [
      ['Publication Title', 'Garad Foundation Annual Report 2020-21'],
      ['Reporting Period', 'Financial Year 2020-21'],
      ['Documented Initiatives', '6 Completed & Documented Activities'],
      ['Geographic Footprint', 'Thane, Mamnoli (Kalyan), Bhor Taluka (Pune), and Online (Maharashtra)'],
      ['Headquarters', 'Thane, Maharashtra, India'],
      ['Intended Audience', 'CSR Teams, Institutional Donors, Grant Reviewers & Community Partners'],
    ],
  });

  // PAGE 2: LEADERSHIP MESSAGE & ABOUT GARAD FOUNDATION
  doc.addPage();
  doc.y = PAGE.marginTop;

  // 2. FOUNDER / LEADERSHIP MESSAGE
  drawSectionHeading(doc, '01', 'Leadership & Editorial Foreword');
  drawParagraph(
    doc,
    'Financial Year 2020-21 tested every community across Maharashtra. Alongside everyday gaps in rural schooling, urban food insecurity, and women\'s health awareness, the COVID-19 pandemic disrupted classrooms, livelihoods, and in-person community spaces.'
  );
  drawParagraph(
    doc,
    'Through this period, Garad Foundation remained focused on disciplined, responsive grassroots action led by young volunteers in Thane. From packing 175 home-prepared meal boxes at city signals on the first day of 2020, to partnering with Aapla Thane Foundation for menstrual hygiene sessions in Mamnoli, to conducting a ten-school baseline survey in Bhor Taluka for Mission Bharari - Phase 1, each effort was guided by direct listening rather than assumptions.'
  );
  drawParagraph(
    doc,
    'This Annual Report consolidates our documented activities for 2020-21 in a clear, verifiable format suitable for CSR partners, grant reviewers, and individual supporters. Where records are internal, pending verification, or maintained outside this public document (such as audited financial statements), we state so transparently.'
  );

  // 3. ABOUT GARAD FOUNDATION
  drawSectionHeading(doc, '02', 'About Garad Foundation');
  drawParagraph(
    doc,
    'Garad Foundation is a youth-driven nonprofit organisation based in Thane, Maharashtra, India. Founded on the principle that consistent small efforts build lasting community dignity, the Foundation mobilises student and youth volunteers to address practical gaps in education, women\'s health awareness, community welfare, public health communication, and regional language and culture.'
  );
  drawDataTable(
    doc,
    ['Institutional Pillar', 'Summary'],
    [
      ['Core Purpose', 'Enable equitable access to foundational education, dignified community welfare, preventive health awareness, and constructive youth expression.'],
      ['Operating Approach', 'Baseline-informed rural outreach, zero-intermediary volunteer delivery, community in-kind mobilisation, and transparent digital engagement.'],
      ['Primary Focus Areas', 'Education, Women & Community Development, Health & Wellbeing, Youth Development, and Marathi Language & Culture.'],
      ['Geographic Presence (FY 2020-21)', 'Thane urban intersections, Mamnoli (Kalyan), Bhor Taluka (Pune District), and online statewide participation across Maharashtra.'],
    ],
    [0.3, 0.7]
  );

  // 4. ORGANISATION AND GOVERNANCE
  drawSectionHeading(doc, '03', 'Organisation and Governance');
  drawParagraph(
    doc,
    'Garad Foundation operates through a volunteer-led core team headquartered in Thane, supported by field coordinators and community volunteers who execute needs assessments, resource mobilisation, logistics, and evaluation.'
  );
  drawBulletList(doc, [
    'Core Team Oversight: Plans annual priorities, reviews youth competition entries against defined evaluation rubrics, and maintains activity records.',
    'Field Coordination: Dedicated field coordinators conduct school-level baseline surveys (such as across 10 Zilla Parishad schools in Bhor Taluka) prior to procurement and distribution.',
    'Volunteer Participation: Youth volunteers lead meal packing, digital crowdfunding, stationery kit assembly, and local outreach. (Note: Consolidated historical volunteer headcount across multi-year cohorts is marked as undergoing internal registry verification.)',
    'Safeguarding & Consent Policy: Identifiable photographs of children, students, and health-camp participants are withheld from public publication until documented institutional or guardian consent is verified.',
  ]);

  // 5. YEAR AT A GLANCE
  drawSectionHeading(doc, '04', 'Year at a Glance (FY 2020-21 Verified Outputs)');
  drawMetricStrip(doc, [
    { value: '6', label: 'Documented Activities', sub: 'FY 2020-21 Edition' },
    { value: '220', label: 'Students Supported', sub: '10 ZP Schools (Bhor)' },
    { value: '200', label: 'Health Drive Reach', sub: '150 Women, 50 Girls' },
    { value: '175', label: 'Meal Boxes Shared', sub: '3 Thane Signals' },
  ]);

  drawDataTable(
    doc,
    ['Programme / Activity', 'Verified Quantitative Indicator', 'Reporting Basis'],
    [
      ['Utsavachi Shidori', '175 individual food boxes (80 + 95 rounds)', 'Documented distribution log'],
      ['Menstrual Hygiene & Pad Drive', '200 participants (150 tribal women, 50 adolescent girls)', 'Joint partner attendance record'],
      ['Online Essay & Poetry Contest', '30 youth participants (Marathi, Hindi, English)', 'Verified digital entry register'],
      ['Online Videography Contest', '20 youth creator submissions; 2 named winners', 'Core Team evaluation record'],
      ['Mission Bharari - Phase 1', '220 students across 10 Zilla Parishad schools', 'Internal 2020-21 activity report'],
      ['Marathi Rajbhasha Divas Spardha', '8 named awardees documented (Vakta Spardha)', 'Documented awardee list'],
    ],
    [0.32, 0.4, 0.28]
  );

  drawCalloutBox(
    doc,
    'Non-Duplication Methodology Note',
    'Indicator figures above are reported strictly at the individual activity level. Because online youth competitions and community drives serve distinct cohorts without a unified unique-ID registry, Garad Foundation does not sum outputs across unrelated programmes into a single deduplicated beneficiary headcount.',
    'sage'
  );

  // 6. PROGRAMME OVERVIEW
  drawSectionHeading(doc, '05', 'Programme Overview');
  drawHorizontalBarViz(doc, 'FY 2020-21 Documented Activities by Programme Area (Total: 6)', [
    { label: 'Education (Mission Bharari - Phase 1)', value: 1, display: '1 flagship initiative (220 students)', color: COLORS.forest900 },
    { label: 'Women & Health Awareness (Mamnoli Drive)', value: 1, display: '1 rural outreach (200 participants)', color: COLORS.terracotta },
    { label: 'Community Welfare (Utsavachi Shidori)', value: 1, display: '1 urban relief drive (175 food boxes)', color: COLORS.forest800 },
    { label: 'Public Health & Youth (Videography Contest)', value: 1, display: '1 online campaign (20 creators)', color: COLORS.ochre },
    { label: 'Youth Development & Language/Culture (Essay & Marathi Spardha)', value: 2, display: '2 multilingual contests', color: COLORS.forest800 },
  ]);

  drawBulletList(doc, [
    'Education: Targeted rural Zilla Parishad school support informed by on-ground baseline surveys (Mission Bharari - Phase 1).',
    'Women & Community Development: Dignified menstrual hygiene awareness, sanitary kit access, and urban meal solidarity.',
    'Health & Wellbeing: Local-language preventive health awareness, basic anaemia/reproductive health symptom referrals, and peer COVID-19 communication.',
    'Youth Development & Cultural Heritage: Accessible multilingual digital writing, short-form awareness filmmaking, and Marathi elocution platforms.',
  ]);

  // 7. DETAILED ACTIVITY HIGHLIGHTS
  drawSectionHeading(doc, '06', 'Detailed Activity Highlights (FY 2020-21)');
  for (const act of fyActivities) {
    const det = getActivityBeneficiaryDetails(act);
    ensureSpace(doc, 118);
    drawSubheading(doc, `${act.archiveNumber}: ${act.title}`);
    drawDataTable(
      doc,
      ['Attribute', 'Documented Record'],
      [
        ['Category & Date', `${act.category}  |  ${act.date}`],
        ['Location', act.location],
        ['Objective', act.objectives[0]?.description || act.needAndRationale.heading],
        ['Beneficiaries / Reach', det.actualReach],
        ['Key Outputs', act.outputs?.items.slice(0, 3).join('; ') || act.cardKeyStat],
        ['Outcomes Scope', det.outcomesNote],
      ],
      [0.24, 0.76]
    );
  }

  // 8. GEOGRAPHIC REACH
  drawSectionHeading(doc, '07', 'Geographic Reach');
  drawDataTable(
    doc,
    ['Region / District', 'Specific Locations Covered', 'Activities Delivered'],
    [
      ['Thane District (Urban)', 'Teen Haath Naka, Majiwada & Nitin Company Signals', 'Utsavachi Shidori (175 food boxes)'],
      ['Thane District (Rural / Kalyan)', 'Mamnoli, Kalyan', 'Menstrual Hygiene Awareness & Pad Distribution (200 participants)'],
      ['Pune District (Rural)', '10 Zilla Parishad Schools, Bhor Taluka', 'Mission Bharari - Phase 1 (220 students)'],
      ['Statewide Digital Reach', 'Online (WhatsApp, Email & Digital Platforms)', 'Essay & Poetry Contest, COVID-19 Videography Contest, Marathi Rajbhasha Divas Spardha'],
    ],
    [0.25, 0.37, 0.38]
  );

  // 9. MONITORING, EVALUATION AND LEARNING
  drawSectionHeading(doc, '08', 'Monitoring, Evaluation and Documentation Practices');
  drawParagraph(
    doc,
    'Garad Foundation emphasises factual, transparent documentation aligned with CSR accountability standards rather than promotional claims:'
  );
  drawBulletList(doc, [
    'Pre-Implementation Baseline Surveys: Prior to Mission Bharari - Phase 1, a field coordinator surveyed all 10 participating Zilla Parishad schools in Bhor Taluka to record actual student stationery requirements.',
    'Structured Distribution Logs: Field drives maintain round-wise and cohort-wise logs (e.g., 80 + 95 meal boxes in Thane; 150 tribal women + 50 adolescent girls in Mamnoli).',
    'Rubric-Based Evaluation: Youth competitions are evaluated by the Core Team using explicit criteria (such as creativity, clarity, communication, content, fluency, and emotional expression).',
    'Honest Output vs. Outcome Separation: Activity outputs are documented conservatively and never overstated as audited long-term impact where longitudinal studies have not been conducted.',
  ]);

  // 10. FINANCIAL OVERVIEW
  drawSectionHeading(doc, '09', 'Financial Overview');
  drawParagraph(
    doc,
    'During FY 2020-21, Garad Foundation mobilised resources primarily through community-rooted, low-overhead channels documented in individual activity records:'
  );
  drawBulletList(doc, [
    'In-Kind Community Support: Utsavachi Shidori operated as a 100% in-kind, zero-budget initiative supported directly by household contributions.',
    'Peer Digital Crowdfunding: Mission Bharari - Phase 1 was funded 100% through volunteer-led digital crowdfunding via WhatsApp, social media, and personal outreach.',
    'Collaborative Field Execution: Menstrual hygiene outreach in Mamnoli was conducted in partnership with Aapla Thane Foundation.',
  ]);
  drawCalloutBox(
    doc,
    'Audited Financial Statements Disclosure',
    'Consolidated audited Income & Expenditure statements, Balance Sheets, and programme-wise financial ledgers for FY 2020-21 are not embedded in this public summary edition. Certified copies of audited financial statements are shared directly with corporate CSR teams, institutional donors, and regulatory reviewers upon formal request.',
    'cream'
  );

  // 11. DONORS, VOLUNTEERS AND PARTNERS
  drawSectionHeading(doc, '10', 'Partners, Volunteers and Community Contributors');
  drawBulletList(doc, [
    'Aapla Thane Foundation: Collaborating field partner for the Menstrual Hygiene Awareness & Sanitary Pad Distribution drive in Mamnoli, Kalyan.',
    'Zilla Parishad School Communities (Bhor Taluka): School leadership and teachers who facilitated baseline assessment and COVID-safe stationery handover across 10 schools.',
    'Youth Volunteers & Community Supporters: Student volunteers, households contributing in-kind meals, and digital crowdfunding donors who sustained grassroots operations throughout 2020-21.',
  ]);

  // 12. CHALLENGES AND LEARNINGS
  drawSectionHeading(doc, '11', 'Challenges and Learnings');
  drawBulletList(doc, [
    'Pandemic Continuity: Lockdowns restricted in-person gatherings; pivoting rapidly to WhatsApp, email, and recorded-speech formats preserved youth engagement without requiring expensive digital tools.',
    'Rural Material Gaps: Baseline school mapping in Bhor Taluka underscored that basic physical stationery remained a primary barrier even before digital-learning disparities.',
    'Safeguarding & Privacy Discipline: Health outreach with adolescent girls and rural school visits reinforced the necessity of strict written consent before publishing identifiable photographs.',
    'Structured Record-Keeping: Transitioning from informal volunteer logs to standardised CSR-ready activity documentation ensures long-term institutional accountability.',
  ]);

  // 13. PRIORITIES FOR THE NEXT FINANCIAL YEAR
  drawSectionHeading(doc, '12', 'Priorities for the Next Financial Year');
  drawBulletList(doc, [
    'Strengthen rural education support by building on the baseline-survey and volunteer-delivery blueprint piloted in Mission Bharari - Phase 1.',
    'Expand women\'s health awareness and preventive hygiene outreach through trusted local partnerships in underserved rural and tribal hamlets.',
    'Standardise project-level financial tracking, attendance verification, and consent-cleared photographic archiving across every initiative.',
    'Publish subsequent financial-year annual reports (FY 2021-22 onward) progressively once underlying activity records and financial statements are reviewed and approved.',
  ]);

  // 14. COMPLIANCE AND ORGANISATIONAL INFORMATION
  drawSectionHeading(doc, '13', 'Compliance and Organisational Information');
  drawDataTable(
    doc,
    ['Compliance Parameter', 'Status / Verification Protocol'],
    [
      ['Legal Name & Base', 'Garad Foundation, Thane, Maharashtra, India'],
      ['Section 80G Status', 'Garad Foundation holds Section 80G approval. Deduction eligibility for donors is governed by applicable Income Tax Act rules and statutory Form 10BD / Form 10BE compliance.'],
      ['Statutory Registrations (Trust/Society, 12A, 80G, CSR-1)', 'Registration numbers and official certificates are maintained on institutional record and provided directly during corporate CSR due-diligence onboarding (not approximated in this public edition).'],
      ['Reporting Standard Note', 'This publication is Garad Foundation\'s institutional NGO Annual Report informed by CSR transparency principles (it is not an MCA corporate Board Annexure II filing).'],
    ],
    [0.34, 0.66]
  );

  // 15. CONTACT INFORMATION AND CLOSING PAGE
  drawSectionHeading(doc, '14', 'Contact Information & Closing Note');
  drawParagraph(
    doc,
    'Garad Foundation welcomes dialogue with corporate CSR departments, institutional foundations, academic partners, and volunteers committed to grounded, transparent grassroots work in Maharashtra.'
  );
  drawDataTable(
    doc,
    ['Channel', 'Details'],
    [
      ['Organisation', 'Garad Foundation'],
      ['Location', 'Thane, Maharashtra, India'],
      ['Digital Activity Archive', '/activities (Official documented initiatives archive)'],
      ['Reports & Publications Portal', '/reports (Annual Reports and individual Activity Reports)'],
      ['Contribution & Support Portal', '/donate (Verified online contributions & 80G acknowledgement workflow)'],
    ],
    [0.32, 0.68]
  );

  applyRunningHeadersAndFooters(
    doc,
    'Annual Report 2020-21',
    'Garad Foundation  |  Annual Report 2020-21  |  FY 2020-21'
  );

  const stats = await writePdfToFile(doc, targetPath);
  return {
    id: 'annual-report-2020-21',
    fileUrl: `/assets/reports/annual/${fileName}`,
    downloadFilename: 'Garad-Foundation-Annual-Report-2020-21.pdf',
    ...stats,
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
