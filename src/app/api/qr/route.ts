import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  try {
    const qr = await QRCode.toDataURL(text, { errorCorrectionLevel: "M", width: 256 });
    return NextResponse.json({ qr });
  } catch (e) {
    return NextResponse.json({ qr: null, error: "Failed to generate QR" }, { status: 500 });
  }
}
