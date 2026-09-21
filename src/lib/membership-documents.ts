import { readFile } from "fs/promises";
import path from "path";
import {
  PDFDocument,
  PDFPage,
  RGB,
  StandardFonts,
  degrees,
  rgb,
} from "pdf-lib";
import { MEMBERSHIP_PAYMENT, SITE_NAME, SITE_SHORT_NAME } from "@/lib/constants";
import {
  MEMBERSHIP_ID_CARD_TYPE,
  STAMPED_INVOICE_TYPE,
} from "@/lib/membership";
import type { DocumentInput, MembershipApplicationRecord } from "@/lib/membership-db";

const GOLD = rgb(0.773, 0.647, 0.353);
const CHARCOAL = rgb(0.102, 0.102, 0.102);
const WHITE = rgb(1, 1, 1);

async function readPublicFile(relativePath: string) {
  try {
    return await readFile(path.join(process.cwd(), relativePath));
  } catch {
    return null;
  }
}

async function embedImage(pdf: PDFDocument, bytes: Buffer, mimeType: string) {
  if (mimeType === "image/png") return pdf.embedPng(bytes);
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") return pdf.embedJpg(bytes);
  return null;
}

function drawCenteredText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  color: RGB
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: x - width / 2, y, size, font, color });
}

function drawStamp(
  page: PDFPage,
  cx: number,
  cy: number,
  membershipId: string,
  approvedOn: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  bold: Awaited<ReturnType<PDFDocument["embedFont"]>>
) {
  const radius = 52;
  page.drawCircle({ x: cx, y: cy, size: radius, borderColor: GOLD, borderWidth: 4, color: rgb(1, 1, 1), opacity: 0.12 });
  page.drawCircle({ x: cx, y: cy, size: radius - 8, borderColor: GOLD, borderWidth: 1.5 });
  drawCenteredText(page, SITE_SHORT_NAME, cx, cy + 16, 12, bold, GOLD);
  drawCenteredText(page, "APPROVED", cx, cy + 1, 11, bold, GOLD);
  drawCenteredText(page, membershipId, cx, cy - 14, 8, font, CHARCOAL);
  drawCenteredText(page, approvedOn, cx, cy - 26, 7, font, CHARCOAL);
}

async function embedSignature(pdf: PDFDocument) {
  const signatureBytes = await readPublicFile(MEMBERSHIP_PAYMENT.signaturePath);
  if (!signatureBytes) return null;
  try {
    return await pdf.embedPng(signatureBytes);
  } catch {
    try {
      return await pdf.embedJpg(signatureBytes);
    } catch {
      return null;
    }
  }
}

function drawFallbackSignature(
  page: PDFPage,
  x: number,
  y: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>
) {
  page.drawText(MEMBERSHIP_PAYMENT.officerName, {
    x,
    y: y + 18,
    size: 18,
    font,
    color: rgb(0.15, 0.18, 0.45),
    rotate: degrees(-8),
  });
}

export async function generateOfficialDocuments(params: {
  application: MembershipApplicationRecord;
  membershipId: string;
  invoice: { mimeType: string; fileData: Buffer };
  photo?: { mimeType: string; fileData: Buffer } | null;
}): Promise<DocumentInput[]> {
  const approvedOn = new Date().toISOString().slice(0, 10);
  const [idCard, stampedInvoice] = await Promise.all([
    createMembershipIdCard(params, approvedOn),
    createStampedInvoice(params, approvedOn),
  ]);

  return [
    {
      documentType: MEMBERSHIP_ID_CARD_TYPE,
      fileName: `${params.membershipId}-id-card.pdf`,
      mimeType: "application/pdf",
      fileSize: idCard.length,
      fileData: Buffer.from(idCard),
    },
    {
      documentType: STAMPED_INVOICE_TYPE,
      fileName: `${params.membershipId}-invoice.pdf`,
      mimeType: "application/pdf",
      fileSize: stampedInvoice.length,
      fileData: Buffer.from(stampedInvoice),
    },
  ];
}

async function createMembershipIdCard(
  params: {
    application: MembershipApplicationRecord;
    membershipId: string;
    photo?: { mimeType: string; fileData: Buffer } | null;
  },
  approvedOn: string
) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([540, 340]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const script = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  page.drawRectangle({ x: 0, y: 0, width: 540, height: 340, color: CHARCOAL });
  page.drawRectangle({ x: 16, y: 16, width: 508, height: 308, borderColor: GOLD, borderWidth: 2 });
  page.drawRectangle({ x: 16, y: 268, width: 508, height: 56, color: GOLD });
  page.drawText(SITE_SHORT_NAME, { x: 36, y: 292, size: 22, font: bold, color: CHARCOAL });
  page.drawText("MEMBERSHIP IDENTITY CARD", { x: 36, y: 276, size: 10, font, color: CHARCOAL });

  const logoBytes = await readPublicFile("public/images/eboa-logo.png");
  if (logoBytes) {
    const logo = await embedImage(pdf, logoBytes, "image/png");
    if (logo) {
      page.drawImage(logo, { x: 430, y: 274, width: 44, height: 44 });
    }
  }

  if (params.photo) {
    const photo = await embedImage(pdf, params.photo.fileData, params.photo.mimeType);
    if (photo) {
      page.drawImage(photo, { x: 36, y: 110, width: 110, height: 130 });
    }
  } else {
    page.drawRectangle({ x: 36, y: 110, width: 110, height: 130, color: rgb(0.2, 0.2, 0.2) });
    page.drawText("PHOTO", { x: 64, y: 168, size: 10, font, color: GOLD });
  }

  const lines = [
    ["Name", params.application.fullName],
    ["Membership ID", params.membershipId],
    ["Type", params.application.applicantType === "owner" ? "Barbershop Owner" : "Barber"],
    ["Level", params.application.membershipLevel.toUpperCase()],
    ["Issued", approvedOn],
  ];
  lines.forEach((line, index) => {
    const y = 220 - index * 24;
    page.drawText(line[0], { x: 168, y, size: 9, font, color: GOLD });
    page.drawText(line[1], { x: 168, y: y - 12, size: 12, font: bold, color: WHITE });
  });

  const signature = await embedSignature(pdf);
  if (signature) {
    page.drawImage(signature, { x: 360, y: 42, width: 120, height: 42 });
  } else {
    drawFallbackSignature(page, 360, 42, script);
  }
  page.drawText(MEMBERSHIP_PAYMENT.officerTitle, { x: 360, y: 30, size: 8, font, color: GOLD });
  page.drawText(SITE_NAME, { x: 36, y: 30, size: 8, font, color: rgb(0.75, 0.75, 0.75) });

  return pdf.save();
}

async function createStampedInvoice(
  params: {
    application: MembershipApplicationRecord;
    membershipId: string;
    invoice: { mimeType: string; fileData: Buffer };
  },
  approvedOn: string
) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const script = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  if (params.invoice.mimeType === "application/pdf") {
    try {
      const source = await PDFDocument.load(params.invoice.fileData);
      const pages = await pdf.copyPages(source, source.getPageIndices());
      pages.forEach((copied) => pdf.addPage(copied));
    } catch {
      const page = pdf.addPage([595, 842]);
      page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: WHITE });
      page.drawText("Original payment receipt is on file with EBOA.", {
        x: 36,
        y: 420,
        size: 12,
        font: bold,
        color: CHARCOAL,
      });
    }
  } else {
    const page = pdf.addPage([595, 842]);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: WHITE });
    const image = await embedImage(pdf, params.invoice.fileData, params.invoice.mimeType);
    if (image) {
      const maxWidth = 520;
      const maxHeight = 640;
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      page.drawImage(image, { x: (595 - width) / 2, y: 140, width, height });
    } else {
      page.drawText("Original payment receipt is on file with EBOA.", {
        x: 36,
        y: 420,
        size: 12,
        font: bold,
        color: CHARCOAL,
      });
    }
  }

  if (pdf.getPageCount() === 0) {
    const page = pdf.addPage([595, 842]);
    page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: WHITE });
  }

  const page = pdf.getPage(0);
  const { width, height } = page.getSize();
  drawStamp(page, width - 90, height - 90, params.membershipId, approvedOn, font, bold);

  page.drawText("Official payment confirmation", {
    x: 36,
    y: 64,
    size: 10,
    font: bold,
    color: CHARCOAL,
  });
  page.drawText(`${params.application.fullName}  ·  ${params.membershipId}`, {
    x: 36,
    y: 50,
    size: 9,
    font,
    color: CHARCOAL,
  });

  const signature = await embedSignature(pdf);
  if (signature) {
    page.drawImage(signature, { x: width - 180, y: 36, width: 130, height: 46 });
  } else {
    drawFallbackSignature(page, width - 180, 36, script);
  }
  page.drawText(MEMBERSHIP_PAYMENT.officerTitle, {
    x: width - 180,
    y: 24,
    size: 8,
    font,
    color: CHARCOAL,
  });

  return pdf.save();
}
