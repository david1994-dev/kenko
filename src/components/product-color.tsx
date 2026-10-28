"use client";

import { createContext, useContext, useState } from "react";

type ColorState = { color: string | null; setColor: (c: string | null) => void };

const ColorContext = createContext<ColorState | null>(null);

// Màu đang chọn dùng chung giữa bộ ảnh và ô mua hàng để đổi màu là đổi ảnh.
export function ColorProvider({ initial, children }: { initial: string | null; children: React.ReactNode }) {
  const [color, setColor] = useState<string | null>(initial);
  return <ColorContext.Provider value={{ color, setColor }}>{children}</ColorContext.Provider>;
}

export function useColor() {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error("useColor must be used inside ColorProvider");
  return ctx;
}
