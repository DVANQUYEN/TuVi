import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import type { EarthlyBranch, MutagenType } from '@/lib/ziwei/types/enums';
import { getBranchLabel, getStemBranchLabel } from '@/lib/chart/display-helpers';
import { jsPDF } from 'jspdf';

const GOLD: [number, number, number] = [176, 132, 24];
const DARK_GOLD: [number, number, number] = [122, 88, 20];
const INK: [number, number, number] = [32, 28, 22];
const MUTED: [number, number, number] = [112, 104, 92];
const PAPER: [number, number, number] = [255, 253, 247];
const PANEL: [number, number, number] = [250, 244, 228];
const RULE: [number, number, number] = [220, 205, 165];

const MUTAGEN_LABELS: Readonly<Record<MutagenType, string>> = {
  hoaLoc: 'L',
  hoaQuyen: 'Q',
  hoaKhoa: 'K',
  hoaKy: 'Y',
};

const BRANCH_GRID: Readonly<Record<EarthlyBranch, { row: number; col: number }>> = {
  ti: { row: 0, col: 0 },
  ngo: { row: 0, col: 1 },
  mui: { row: 0, col: 2 },
  than: { row: 0, col: 3 },
  dau: { row: 1, col: 3 },
  tuat: { row: 2, col: 3 },
  hoi: { row: 3, col: 3 },
  ty: { row: 3, col: 2 },
  suu: { row: 3, col: 1 },
  dan: { row: 3, col: 0 },
  mao: { row: 2, col: 0 },
  thin: { row: 1, col: 0 },
};

/**
 * Remove Vietnamese diacritics so text renders correctly with jsPDF's
 * built-in Latin-1 fonts (Helvetica/Times).
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function starLabel(star: Star): string {
  const parts = [normalizeText(star.name)];
  if (star.brightnessLabel) parts.push(`(${normalizeText(star.brightnessLabel)})`);
  if (star.mutagen) parts.push(MUTAGEN_LABELS[star.mutagen]);
  return parts.join(' ');
}

function drawCoverPage(
  doc: jsPDF,
  chart: ZiweiChart,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  const center = pageWidth / 2;
  const { birthInfo, heavenPlate } = chart;
  const name = normalizeText(birthInfo.name?.trim() || 'Duong so');

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(margin, margin + 6, pageWidth - margin, margin + 6);

  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...DARK_GOLD);
  doc.text('LA SO TU VI', center, margin + 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text('Sao Menh - Tu Vi Dau So Viet Nam', center, margin + 24, { align: 'center' });

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(margin + 35, margin + 28, pageWidth - margin - 35, margin + 28);

  doc.setFont('times', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...INK);
  doc.text(name, center, margin + 42, { align: 'center', maxWidth: pageWidth - 2 * margin });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...DARK_GOLD);
  doc.text(normalizeText(heavenPlate.yinYangGenderLabel), center, margin + 49, {
    align: 'center',
  });

  const boxTop = margin + 58;
  const boxWidth = (pageWidth - 2 * margin - 6) / 2;
  const boxHeight = 62;

  const drawBox = (x: number, y: number, w: number, h: number, title: string): void => {
    doc.setFillColor(...PANEL);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.rect(x, y, w, h, 'FD');
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...DARK_GOLD);
    doc.text(normalizeText(title), x + 4, y + 7);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.2);
    doc.line(x + 4, y + 9.5, x + w - 4, y + 9.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...INK);
  };

  const drawRows = (x: number, y: number, w: number, rows: [string, string][]): void => {
    let rowY = y;
    for (const [label, value] of rows) {
      doc.setTextColor(...MUTED);
      doc.text(normalizeText(label), x, rowY);
      doc.setTextColor(...INK);
      doc.text(normalizeText(value), x + w * 0.38, rowY, { maxWidth: w * 0.6 });
      rowY += 5.5;
    }
  };

  const leftX = margin;
  const rightX = margin + boxWidth + 6;

  drawBox(leftX, boxTop, boxWidth, boxHeight, 'Thong tin sinh');
  drawRows(leftX + 4, boxTop + 15, boxWidth - 8, [
    ['Duong lich', `${birthInfo.day}/${birthInfo.month}/${birthInfo.year}`],
    [
      'Am lich',
      `${heavenPlate.effectiveLunarDate.day}/${heavenPlate.effectiveLunarDate.month}/${heavenPlate.effectiveLunarDate.year}`,
    ],
    ['Gio sinh', `${String(birthInfo.hour).padStart(2, '0')}:${String(birthInfo.minute).padStart(2, '0')}`],
    ['Gioi tinh', birthInfo.gender === 'nam' ? 'Nam' : 'Nu'],
    [
      'Noi sinh',
      birthInfo.location?.provinceName ??
        (birthInfo.location?.region === 'south' ? 'Mien Nam' : 'Mien Bac'),
    ],
  ]);

  drawBox(rightX, boxTop, boxWidth, boxHeight, 'Thien ban');
  drawRows(rightX + 4, boxTop + 15, boxWidth - 8, [
    ['Nap am', heavenPlate.napAm.name],
    ['Cuc', heavenPlate.fiveElementsClass.name],
    ['Chu Menh', `${heavenPlate.soulLord} (${getBranchLabel(heavenPlate.soulPalaceBranch)})`],
    ['Chu Than', `${heavenPlate.bodyLord} (${getBranchLabel(heavenPlate.bodyPalaceBranch)})`],
    ['Menh than', heavenPlate.bodyPalaceName],
  ]);

  const pillarsTop = boxTop + boxHeight + 10;
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK_GOLD);
  doc.text('TU TRU', margin, pillarsTop);

  const pillarWidth = (pageWidth - 2 * margin) / 4;
  const pillars: [string, string][] = [
    ['Nam', heavenPlate.fourPillars.year.label],
    ['Thang', heavenPlate.fourPillars.month.label],
    ['Ngay', heavenPlate.fourPillars.day.label],
    ['Gio', heavenPlate.fourPillars.hour.label],
  ];

  pillars.forEach(([label, value], index) => {
    const x = margin + index * pillarWidth;
    doc.setFillColor(...PANEL);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.3);
    doc.rect(x, pillarsTop + 4, pillarWidth - 3, 18, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(normalizeText(label), x + pillarWidth / 2 - 1.5, pillarsTop + 10, {
      align: 'center',
    });
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(normalizeText(value), x + pillarWidth / 2 - 1.5, pillarsTop + 17, {
      align: 'center',
    });
  });

  if (chart.warnings.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    const warnings = chart.warnings
      .slice(0, 3)
      .map((warning) => `- ${normalizeText(warning.message)}`);
    doc.text(warnings, margin, pillarsTop + 34);
  }

  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Sao Menh - saomenh.vercel.app', center, pageHeight - 10, { align: 'center' });
}

function drawPalaceCell(
  doc: jsPDF,
  palace: Palace,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const pad = 1.6;
  const centerX = x + width / 2;
  const contentWidth = width - 2 * pad;

  doc.setFillColor(...PAPER);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.rect(x, y, width, height, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text(normalizeText(palace.name), centerX, y + 4.4, {
    align: 'center',
    maxWidth: contentWidth,
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(...MUTED);
  doc.text(normalizeText(getStemBranchLabel(palace.stem, palace.branch)), x + pad, y + 8);
  doc.text(`${palace.majorPeriod.startAge}-${palace.majorPeriod.endAge}`, x + width - pad, y + 8, {
    align: 'right',
  });

  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.15);
  doc.line(x + pad, y + 9.6, x + width - pad, y + 9.6);

  const majorLines = palace.majorStars.flatMap((star) =>
    doc.splitTextToSize(starLabel(star), contentWidth)
  );

  let textY = y + 13.4;
  if (majorLines.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.4);
    doc.setTextColor(...MUTED);
    doc.text('Vo Chinh Dieu', centerX, textY, { align: 'center' });
  } else {
    doc.setFont('times', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...INK);
    for (const line of majorLines.slice(0, 3)) {
      doc.text(line, centerX, textY, { align: 'center', maxWidth: contentWidth });
      textY += 3.1;
    }
  }

  const columnWidth = contentWidth / 2;
  const auxTop = Math.max(textY + 1.5, y + 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.6);
  doc.setTextColor(...INK);

  palace.auspiciousStars.slice(0, 5).forEach((star, index) => {
    doc.text(normalizeText(starLabel(star)), x + pad, auxTop + index * 2.7, {
      maxWidth: columnWidth - 1,
    });
  });

  palace.maleficStars.slice(0, 5).forEach((star, index) => {
    doc.text(normalizeText(starLabel(star)), x + width - pad, auxTop + index * 2.7, {
      align: 'right',
      maxWidth: columnWidth - 1,
    });
  });

  const footerY = y + height - 2;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.15);
  doc.line(x + pad, footerY - 3.2, x + width - pad, footerY - 3.2);

  const badges = [];
  if (palace.hasTuan) badges.push('Tuan');
  if (palace.hasTriet) badges.push('Triet');
  const footer = [
    palace.boshi12,
    palace.changsheng12,
    palace.suiqian12,
    getBranchLabel(palace.branch),
    ...badges,
  ]
    .map(normalizeText)
    .join(' | ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.2);
  doc.setTextColor(...MUTED);
  const footerLines = doc.splitTextToSize(footer, contentWidth);
  doc.text(footerLines[0] ?? '', centerX, footerY, { align: 'center' });
}

function drawCenterPanel(
  doc: jsPDF,
  chart: ZiweiChart,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const { birthInfo, heavenPlate } = chart;
  const centerX = x + width / 2;

  doc.setFillColor(...PANEL);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.9);
  doc.rect(x, y, width, height, 'FD');

  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.2);
  doc.rect(x + 2, y + 2, width - 4, height - 4);

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...DARK_GOLD);
  doc.text(normalizeText(birthInfo.name?.trim() || 'Duong so'), centerX, y + 9, {
    align: 'center',
    maxWidth: width - 10,
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(normalizeText(heavenPlate.yinYangGenderLabel), centerX, y + 15, {
    align: 'center',
  });

  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.2);
  doc.line(x + 10, y + 19, x + width - 10, y + 19);

  const leftX = x + 8;
  const rightX = x + width / 2 + 4;
  const labelValue = (label: string, value: string, lx: number, ly: number): void => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(...MUTED);
    doc.text(normalizeText(label), lx, ly);
    doc.setFont('times', 'bold');
    doc.setFontSize(8.6);
    doc.setTextColor(...INK);
    doc.text(normalizeText(value), lx, ly + 4.4, { maxWidth: width / 2 - 12 });
  };

  labelValue('Tu tru nam', heavenPlate.fourPillars.year.label, leftX, y + 25);
  labelValue('Tu tru thang', heavenPlate.fourPillars.month.label, rightX, y + 25);
  labelValue('Tu tru ngay', heavenPlate.fourPillars.day.label, leftX, y + 35);
  labelValue('Tu tru gio', heavenPlate.fourPillars.hour.label, rightX, y + 35);

  doc.setDrawColor(...RULE);
  doc.line(x + 10, y + 44, x + width - 10, y + 44);

  labelValue('Nap am', heavenPlate.napAm.name, leftX, y + 50);
  labelValue('Cuc', heavenPlate.fiveElementsClass.name, rightX, y + 50);

  doc.setDrawColor(...RULE);
  doc.line(x + 10, y + 59, x + width - 10, y + 59);

  labelValue('Chu Menh', `${heavenPlate.soulLord} - ${getBranchLabel(heavenPlate.soulPalaceBranch)}`, leftX, y + 65);
  labelValue('Chu Than', `${heavenPlate.bodyLord} - ${getBranchLabel(heavenPlate.bodyPalaceBranch)}`, rightX, y + 65);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.4);
  doc.setTextColor(...MUTED);
  doc.text(`Menh: ${normalizeText(heavenPlate.bodyPalaceName)}`, centerX, y + height - 6, {
    align: 'center',
    maxWidth: width - 12,
  });
}

function drawBoardPage(
  doc: jsPDF,
  chart: ZiweiChart,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...DARK_GOLD);
  doc.text('BAN LA SO TU VI', pageWidth / 2, margin + 6, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `${normalizeText(chart.birthInfo.name?.trim() || 'Duong so')} - ${chart.birthInfo.day}/${chart.birthInfo.month}/${chart.birthInfo.year}`,
    pageWidth / 2,
    margin + 12,
    { align: 'center' }
  );

  const boardTop = margin + 18;
  const boardSize = Math.min(pageWidth - 2 * margin, pageHeight - boardTop - 18);
  const cellSize = boardSize / 4;
  const palaceByBranch = new Map<EarthlyBranch, Palace>(
    chart.palaces.map((palace) => [palace.branch, palace])
  );

  for (const branch of Object.keys(BRANCH_GRID) as EarthlyBranch[]) {
    const palace = palaceByBranch.get(branch);
    if (!palace) continue;

    const { row, col } = BRANCH_GRID[branch];
    drawPalaceCell(
      doc,
      palace,
      margin + col * cellSize,
      boardTop + row * cellSize,
      cellSize,
      cellSize
    );
  }

  drawCenterPanel(
    doc,
    chart,
    margin + cellSize,
    boardTop + cellSize,
    cellSize * 2,
    cellSize * 2
  );

  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Sao Menh - saomenh.vercel.app', pageWidth / 2, pageHeight - 10, { align: 'center' });
}

export function generateChartPdf(chart: ZiweiChart): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  drawCoverPage(doc, chart, pageWidth, pageHeight, margin);

  doc.addPage();
  drawBoardPage(doc, chart, pageWidth, pageHeight, margin);

  return doc.output('blob');
}
