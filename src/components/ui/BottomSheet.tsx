"use client";

import { useEffect, useRef } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
    const delta = currentY.current - startY.current;
    if (delta > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  };
  const handleTouchEnd = () => {
    const delta = currentY.current - startY.current;
    if (delta > 100) onClose();
    else if (sheetRef.current) sheetRef.current.style.transform = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={sheetRef}
        className="absolute inset-0 md:inset-auto md:bottom-0 md:left-0 md:right-0 bg-white md:rounded-t-3xl md:max-h-[85vh] overflow-y-auto scrollbar-hidden animate-slide-up"
        style={{ transition: "transform 0ms" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E6F4EA] rounded-full" />
        </div>
        {title && (
          <div className="px-5 py-4 border-b border-[#E6F4EA] flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-[#0B3C26]">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center md:hidden">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#1C2833" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
        <div className="px-5 py-5 pb-10">{children}</div>
      </div>
    </div>
  );
}
