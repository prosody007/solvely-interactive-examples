"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { BASE_SCREEN_W, BASE_SCREEN_H } from "./device-layout";

/**
 * DemoCanvas — demo 自适应外壳。两种模式：
 *
 * mode = "fit"（默认，最简易、适合复杂动画 demo）：
 *   children 仍按 baseW × baseH（默认 393×852）设计稿写，由 DemoCanvas 等比 scale 居中
 *   到当前 device screen 内，不裁切、不变形。所有动画 transform 数值不需要改。
 *
 * mode = "fill"（真自适应，适合用百分比 / flex 重新布局过的 demo）：
 *   不做 transform 缩放，children 直接挂载到 device screen 等大的容器里，
 *   内部布局自行响应（百分比、flex、clamp、left/right、translateX(-50%) 居中等）。
 */
export function DemoCanvas({
  children,
  mode = "fit",
  baseW = BASE_SCREEN_W,
  baseH = BASE_SCREEN_H,
  background,
  className,
  style,
}: {
  children: ReactNode;
  mode?: "fit" | "fill";
  baseW?: number;
  baseH?: number;
  background?: CSSProperties["background"];
  className?: string;
  style?: CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (mode !== "fit") return;
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      const next = Math.min(w / baseW, h / baseH);
      if (Number.isFinite(next) && next > 0) setScale(next);
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [mode, baseW, baseH]);

  if (mode === "fill") {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden ${className ?? ""}`.trim()}
        style={{ background, ...style }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className ?? ""}`.trim()}
      style={{ background, ...style }}
    >
      <div
        style={{
          width: baseW,
          height: baseH,
          flexShrink: 0,
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
