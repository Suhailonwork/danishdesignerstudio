"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton({ phone }: { phone: string }) {
  const [showLabel, setShowLabel] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLabel(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  if (!phone || dismissed) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 flex items-center gap-2 lg:bottom-7 lg:right-7">
      {showLabel ? (
        <div className="hidden items-center gap-2 border border-line bg-white px-3.5 py-2 text-xs shadow-[0_14px_40px_-22px_rgba(0,0,0,0.5)] sm:flex">
          <span className="text-ash">Need help?</span>
          <span className="font-medium text-ink">Chat with us</span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss chat prompt"
            className="text-ash-light transition-colors hover:text-ink"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}

      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Danish Designer Studio on WhatsApp"
        className="grid h-13 w-13 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_-14px_rgba(37,211,102,0.8)] transition-transform duration-300 hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
      </a>
    </div>
  );
}
