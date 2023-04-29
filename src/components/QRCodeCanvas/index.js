import React from "react";
import QRCode from "react-qr-code";
export default function QRCodeCanvas({ value }) {
  return (
    <div className="qr-container bg-slate-500 h-10 w-10">
      <QRCode level="H" size={300} value={value} />
    </div>
  );
}
