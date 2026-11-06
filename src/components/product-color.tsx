"use client";

import { createContext, useContext, useState } from "react";

type ColorState = {
  color: string | null;
  setColor: (c: string | null) => void;
  // Ảnh chung đang được chọn ở dải ảnh nhỏ; chọn màu thì bỏ, chọn ảnh thì ô màu hết nổi bật.
  pickedId: string | null;
  setPickedId: (id: string | null) => void;
};

const ColorContext = createContext<ColorState | null>(null);

// Màu đang chọn dùng chung giữa bộ ảnh và ô mua hàng để đổi màu là đổi ảnh.
export function ColorProvider({ initial, children }: { initial: string | null; children: React.ReactNode }) {
  const [color, setColorState] = useState<string | null>(initial);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const setColor = (c: string | null) => {
    setColorState(c);
    setPickedId(null);
  };
  return <ColorContext.Provider value={{ color, setColor, pickedId, setPickedId }}>{children}</ColorContext.Provider>;
}

export function useColor() {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error("useColor must be used inside ColorProvider");
  return ctx;
}
