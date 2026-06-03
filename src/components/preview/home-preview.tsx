"use client";

import { useEffect, useRef, useState } from "react";
import { ScanIcon, StudyIcon, MeIcon } from "./tabbar-preview";
import { DemoCanvas } from "./demo-canvas";
import { useDisplayDevice } from "@/components/device-context";

const HOME_INDICATOR_H = 34;
const CAPTURE_MODE_PANEL_H = 160;

const TAB_ACTIVE = "#007AFF";
const TAB_INACTIVE = "#989B9E";
const TAB_BG =
  "linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, #111111 100%)";

const TABS = [
  { id: "scan", label: "Scan", Icon: ScanIcon },
  { id: "study", label: "Study", Icon: StudyIcon },
  { id: "me", label: "Me", Icon: MeIcon },
];

export function HomePreview() {
  const [active, setActive] = useState(0);
  const [tapped, setTapped] = useState(-1);
  const [captureMode, setCaptureMode] = useState(0);
  const [popoverKey, setPopoverKey] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(true);
  const replayPopover = () => {
    setPopoverOpen(true);
    setPopoverKey((k) => k + 1);
  };
  const closePopover = () => setPopoverOpen(false);

  const tap = (i: number) => {
    setActive(i);
    setTapped(i);
    setTimeout(() => setTapped(-1), 140);
  };

  return (
    <DemoCanvas mode="fill" background="#FFFFFF">
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/home/camera.png"
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ objectFit: "cover", objectPosition: "center center" }}
      />

      {/* 全屏蒙层 — 纯黑 10% 透明度，叠在背景图片之上 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0, 0, 0, 0.1)" }}
      />

      {/* 顶部蒙层 — 与底部蒙层方向相反，叠在背景图片之上 */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: 320,
          background:
            "linear-gradient(to bottom, rgba(17, 17, 17, 0.75) 0%, rgba(34, 34, 34, 0) 100%)",
        }}
      />

      {/* Tool bar — 1:1 与 Figma 节点 1465:13774 对齐 */}
      <div
        className="absolute left-0 right-0 flex items-center justify-between"
        style={{
          top: 50,
          height: 48,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <div className="flex items-center" style={{ gap: 24 }}>
          <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
                border: "2px dashed #FFFFFF",
                borderRadius: 6,
              }}
            />
          </div>
          <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
                border: "2px dashed #FFFFFF",
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/history.svg"
            alt=""
            draggable={false}
            style={{ width: 32, height: 32, flexShrink: 0 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/lightning.svg"
            alt=""
            draggable={false}
            style={{ width: 32, height: 32, flexShrink: 0 }}
          />
          <div
            style={{
              position: "relative",
              width: 32,
              height: 32,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 6,
                top: 4,
                width: 20,
                height: 24,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/home/calculator.svg"
                alt=""
                draggable={false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      <InfoModule mode={captureMode} />

      {/* Capture mode panel + Bottom Tab Bar */}
      <div className="absolute left-0 right-0 bottom-0 flex flex-col">
        <CaptureMode
          mode={captureMode}
          setMode={setCaptureMode}
          popoverKey={popoverKey}
          popoverOpen={popoverOpen}
          onReplayPopover={replayPopover}
          onClosePopover={closePopover}
        />

        <div
          className="flex"
          style={{
            background: TAB_BG,
            paddingTop: 6,
            paddingBottom: 24,
            position: "relative",
            zIndex: 20,
          }}
        >
          {TABS.map((tab, i) => {
            const isActive = active === i;
            const isTapped = tapped === i;
            const color = isActive ? TAB_ACTIVE : TAB_INACTIVE;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.id}
                type="button"
                className="flex-1 flex flex-col items-center border-none bg-transparent cursor-pointer pt-1 pb-1"
                style={{ gap: 3 }}
                onClick={(e) => {
                  e.stopPropagation();
                  tap(i);
                }}
              >
                <span
                  className="inline-flex items-center justify-center"
                  style={{
                    width: 28,
                    height: 28,
                    color,
                    transform: isTapped ? "scale(0.88)" : "scale(1)",
                    transition: isTapped
                      ? "transform 0.07s ease-in, color 0.18s ease"
                      : "transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), color 0.18s ease",
                  }}
                >
                  <Icon active={isActive} />
                </span>
                <span
                  style={{
                    fontSize: 10,
                    lineHeight: 1.21,
                    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    color,
                    transition: "color 0.18s ease",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Home indicator 已统一由 PhoneFrame 渲染，这里不再重复 */}
    </div>
    </DemoCanvas>
  );
}

const CAPTURE_LABEL_FONT = {
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
  fontWeight: 600,
  fontSize: 12,
  color: "#FFFFFF",
  opacity: 0.8,
  textAlign: "center" as const,
};

const SEGMENT_TEXT_BASE = {
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
  fontSize: 13,
  lineHeight: "18px",
  color: "#111111",
  whiteSpace: "nowrap" as const,
};

function CaptureMode({
  mode,
  setMode,
  popoverKey,
  popoverOpen,
  onReplayPopover,
  onClosePopover,
}: {
  mode: number;
  setMode: (n: number) => void;
  popoverKey: number;
  popoverOpen: boolean;
  onReplayPopover: () => void;
  onClosePopover: () => void;
}) {
  return (
    <div
      className="relative w-full"
      style={{ height: CAPTURE_MODE_PANEL_H, pointerEvents: "none" }}
    >
      {/* 底部蒙层 — Figma node 1467:14077 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 160,
          background:
            "linear-gradient(to top, rgba(17, 17, 17, 0.75) 0%, rgba(34, 34, 34, 0) 100%)",
        }}
      />

      {/* Photos — Figma node 1467:14083 */}
      <div
        style={{
          position: "absolute",
          // 19% 对应 phone 393 内 left=75（width 41 居中于 75 处）；fill 模式下随 device 比例展开
          left: "19%",
          transform: "translateX(-50%)",
          bottom: 20,
          width: 41,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}
        >
          <div
            style={{
              position: "absolute",
              top: "20.31%",
              right: "10.94%",
              bottom: "20.31%",
              left: "14.06%",
              border: "2.5px solid #FFFFFF",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "35.94%",
              right: "11.83%",
              bottom: "20.31%",
              left: "17.19%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/capture-photo-mountain.svg"
              alt=""
              draggable={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "29.69%",
              right: "57.81%",
              bottom: "57.81%",
              left: "29.69%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/capture-photo-dot.svg"
              alt=""
              draggable={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
        <span style={CAPTURE_LABEL_FONT}>Photos</span>
      </div>

      {/* Text — Figma node 1467:14078 */}
      <div
        style={{
          position: "absolute",
          // 81% 对应 phone 393 内 left=318；fill 模式下随 device 比例展开
          left: "81%",
          transform: "translateX(-50%)",
          bottom: 20,
          width: 41,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          pointerEvents: "auto",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/home/capture-text.svg"
          alt=""
          draggable={false}
          style={{ width: 32, height: 32, flexShrink: 0 }}
        />
        <span style={CAPTURE_LABEL_FONT}>Text</span>
      </div>

      {/* 中央按钮 — Figma node 1467:14086 (home_btn_normal)，整体导出图片
          fill 模式下用 left:50% + translateX(-50%) 居中，宽容 device screen 比例变化 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/home/capture-btn.png"
        alt=""
        draggable={false}
        onClick={onReplayPopover}
        style={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          transform: "translateX(-50%)",
          width: 90,
          height: 90,
          pointerEvents: "auto",
          userSelect: "none",
          cursor: "pointer",
        }}
      />

      {/* 顶部 Segmented (Quick Solve / Guided Solve) — Figma node 1467:14119
          交互动画与 Segmented Control 共用：滑动指示器 + 按压 0.96 缩放 */}
      <SegmentedControl
        selected={mode}
        setSelected={setMode}
        popoverKey={popoverKey}
        popoverOpen={popoverOpen}
        onClosePopover={onClosePopover}
      />
    </div>
  );
}

const SEGMENT_OPTIONS = [
  {
    label: "Quick Solve",
    icon: "/figma/home/seg-quick-icon.svg",
    activeColor: "#F6A507",
  },
  {
    label: "Guided Solve",
    icon: "/figma/home/seg-guided-icon.svg",
    activeColor: "#007AFF",
  },
];
const SEGMENT_SPRING = "cubic-bezier(0.32, 0.72, 0, 1)";
const SEGMENT_ICON_INACTIVE = "rgba(255, 255, 255, 0.9)";

function SegmentedControl({
  selected,
  setSelected,
  popoverKey,
  popoverOpen,
  onClosePopover,
}: {
  selected: number;
  setSelected: (n: number) => void;
  popoverKey: number;
  popoverOpen: boolean;
  onClosePopover: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{ left: number; width: number }[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const buttons = Array.from(
      container.querySelectorAll("button"),
    ) as HTMLElement[];
    const measure = () => {
      setBounds(
        buttons.map((el) => ({ left: el.offsetLeft, width: el.offsetWidth })),
      );
      setContainerWidth(container.offsetWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    buttons.forEach((b) => ro.observe(b));
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const activeBounds = bounds[selected];
  const thumbLeft = activeBounds?.left ?? 0;
  const thumbWidth = activeBounds?.width ?? 0;

  const guidedBounds = bounds[1];
  const guidedCenter = guidedBounds
    ? guidedBounds.left + guidedBounds.width / 2
    : null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 124,
        transform: "translateX(-50%)",
        padding: 2,
        borderRadius: 100,
        background: "rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        pointerEvents: "auto",
      }}
    >
      {guidedCenter !== null && containerWidth > 0 && popoverOpen ? (
        <CapturePopover
          key={popoverKey}
          guidedCenter={guidedCenter}
          containerWidth={containerWidth}
          onClose={onClosePopover}
        />
      ) : null}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: thumbLeft,
          width: thumbWidth,
          borderRadius: 100,
          background: "#FFFFFF",
          border: "0.5px solid #FFFFFF",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.24)",
          transform: `scale(${pressed ? 0.96 : 1})`,
          transformOrigin: "center",
          transition: `left 0.34s ${SEGMENT_SPRING}, width 0.3s ${SEGMENT_SPRING}, transform 0.15s ease-out`,
          pointerEvents: "none",
        }}
      />
      {SEGMENT_OPTIONS.map((opt, i) => {
        const isActive = selected === i;
        return (
          <button
            key={opt.label}
            type="button"
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerCancel={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            onClick={() => setSelected(i)}
            style={{
              position: "relative",
              zIndex: 1,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              height: 32,
              paddingLeft: 12,
              paddingRight: 12,
              gap: 4,
              borderRadius: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ...SEGMENT_TEXT_BASE,
              color: isActive ? "#111111" : "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                flexShrink: 0,
                backgroundColor: isActive
                  ? opt.activeColor
                  : SEGMENT_ICON_INACTIVE,
                maskImage: `url(${opt.icon})`,
                WebkitMaskImage: `url(${opt.icon})`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const INFO_TEXTS = [
  "Get the full step-by-step solution",
  "Answers hidden, reveal step by step",
];

function InfoModule({ mode }: { mode: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: 258,
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 48,
      }}
    >
      <p
        style={{
          margin: 0,
          minWidth: "max-content",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.3,
          color: "#FFFFFF",
          textAlign: "center",
          textShadow: "0px 0px 3px rgba(17, 17, 17, 0.8)",
        }}
      >
        {INFO_TEXTS[mode]}
      </p>
      <div style={{ position: "relative", width: 52, height: 52 }}>
        <div style={{ position: "absolute", inset: "-5.77%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/home/info-icon.svg"
            alt=""
            draggable={false}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

// Popover content layout (Figma 节点 1500:17811)：
// 白色主体 + 单独箭头 + 整组投影；箭头中心对齐 Guided Solve 中心。
const POPOVER_W = 353;
// popover 主体高度由内容自适应（不再写死），避免内容比固定高度矮时底部留出空白
const POPOVER_RADIUS = 24;
const POPOVER_ARROW_W = 56;
const POPOVER_ARROW_H = 13;
const POPOVER_SEGMENT_GAP = 8;
const POPOVER_BG = "#F0F1F4";
const POPOVER_SHADOW = "0px 20px 50px rgba(0, 0, 0, 0.3)";
function CapturePopover({
  guidedCenter,
  containerWidth,
  onClose,
}: {
  guidedCenter: number;
  containerWidth: number;
  onClose: () => void;
}) {
  const [entered, setEntered] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setEntered(true);
      setContentVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // 子内容入场 stagger 工具：在 wrapper 入场（0.69s）进行到一半（≈0.34s）后开始，
  // 从上到下逐个 translateY(10)+opacity 0 → translateY(0)+opacity 1，柔和减速曲线。
  // 关闭时不反向触发（外层 wrapper 整体缩回带走），所以只看 contentVisible
  const childStyle = (index: number) => {
    const delay = 0.06 + index * 0.07;
    return {
      opacity: contentVisible ? 1 : 0,
      transform: contentVisible ? "translateY(0)" : "translateY(10px)",
      transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      willChange: "transform, opacity" as const,
    };
  };

  // 点击关闭按钮：先反向动画（visible -> hidden），动画完成后再让父级卸载
  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setEntered(false);
    // 关闭动画时长（与下方 closing 分支 transition 保持一致）
    window.setTimeout(() => onClose(), 180);
  };

  // popover 宽度：仅 iPad 竖屏放大 20%（phone / iPad 横屏保持 353）
  // 注意用 useDisplayDevice：切换设备时 demo 仍按"正在显示中的"device 渲染，
  // 等飞入新模拟器后才切换到新 device，避免旧模拟器还在动画就被改尺寸
  const device = useDisplayDevice();
  const popoverW = device === "ipad-portrait" ? Math.round(POPOVER_W * 1.2) : POPOVER_W;
  // popover 在屏幕水平居中，转换到 SegmentedControl 容器的本地坐标系
  const popoverLeftInContainer = (containerWidth - popoverW) / 2;
  // 箭头中心在 popover 内部的横向位置（对齐 Guided Solve 中心）
  const arrowCenterInPopover = guidedCenter - popoverLeftInContainer;
  const originX = (arrowCenterInPopover / popoverW) * 100;

  return (
    <div
      style={{
        position: "absolute",
        // 用 bottom 锚定到 SegmentedControl 容器顶部 + gap，再让 popover 自身高度自适应
        bottom: `calc(100% + ${POPOVER_SEGMENT_GAP}px)`,
        left: popoverLeftInContainer,
        width: popoverW,
        // 给底部箭头预留位置（箭头 absolute 在 wrapper 底部）
        paddingBottom: POPOVER_ARROW_H,
        boxSizing: "content-box",
        pointerEvents: "auto",
        transformOrigin: `${originX}% 100%`,
        transform: entered ? "scale(1)" : "scale(0.2)",
        opacity: entered ? 1 : 0,
        transition: closing
          ? "transform 0.18s cubic-bezier(0.4, 0, 1, 1), opacity 0.14s cubic-bezier(0.4, 0, 1, 1)"
          : "transform 0.55s cubic-bezier(0.34, 1.36, 0.4, 1), opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        // 把投影统一放在 wrapper 上：基于「主体 + 箭头」合并形状一次性生成，
        // 避免主体 boxShadow 与箭头独立 drop-shadow 在交界处双倍叠加形成暗缝
        filter: "drop-shadow(0px 20px 50px rgba(0, 0, 0, 0.3))",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "relative",
          width: popoverW,
          overflow: "hidden",
          borderRadius: POPOVER_RADIUS,
        }}
      >
        {/* 毛玻璃层：单独的合成层，专门承载 backdrop-filter */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: POPOVER_BG,
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            transform: "translateZ(0)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            padding: "16px 16px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
              ...childStyle(0),
            }}
          >
            {/* 标题组 — Figma 节点 1559:15029：column gap 6 items-start
                主标题 Guided Solve（Inter SemiBold 16 / line 16 / #111）
                副标题 Answers hidden first…（Inter Regular 12 / line 14 / #595C60） */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 6,
                flex: "1 1 auto",
                minWidth: 0,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: "16px",
                  color: "#111111",
                  width: "100%",
                }}
              >
                Guided Solve
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: "14px",
                  color: "#595C60",
                  width: "100%",
                }}
              >
                Answers hidden first. Reveal each step to learn as you go.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 15,
                background: "rgba(120, 120, 128, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/home/popover/close.svg"
                alt=""
                draggable={false}
                style={{ width: 10, height: 10 }}
              />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
              paddingTop: 8,
              boxSizing: "border-box",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/home/popover/bubble.png"
              alt=""
              draggable={false}
              style={{
                width: "calc(100% - 6px)",
                height: "auto",
                display: "block",
                marginLeft: 3,
                marginRight: 3,
                flexShrink: 0,
                ...childStyle(1),
              }}
            />

            {/* Video Explanation 区（节点 1559:15066）：1:1 复刻
                整体 column gap 4 items-start width 100%（标题与卡片间 gap 4） */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
                width: "100%",
                ...childStyle(2),
              }}
            >
              {/* 标题区（节点 1559:15067）：flex items-center, padding-left 8 padding-top 8 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 8,
                  paddingTop: 8,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: "#007AFF",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Video Explanation
                </span>
              </div>

              {/* 卡片（节点 1559:15070 导出图片1）：bg #FBFCFF, border 0.5 #E6E8EA, drop-shadow 0 12 12 rgba(0,0,0,0.06),
                  rounded 20, padding 8, gap 8, items-center, width 100% */}
              <div
                style={{
                  width: "100%",
                  borderRadius: 20,
                  padding: 8,
                  boxSizing: "border-box",
                  background: "#FBFCFF",
                  border: "0.5px solid #E6E8EA",
                  boxShadow: "0px 12px 12px rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {/* 缩略图容器（节点 1559:15071）：phone 时 width 321 / height 100；
                    用 aspect-ratio 321:100 让 popover 加宽时缩略图等比例放大（不再写死高度） */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "321 / 100",
                    borderRadius: 16,
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {/* 图片用 object-fit cover 充满容器，object-position center
                      模拟 Figma 设计稿 (-33, -41) 偏移裁切位置（中央偏上） */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/figma/home/popover/video-thumb.png"
                    alt=""
                    draggable={false}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      pointerEvents: "none",
                    }}
                  />
                </div>

                {/* 文案行（节点 1559:15073）：column items-start justify-center px 8 width 100%
                    单行文字（节点 1559:15074）：Inter SemiBold 12 #111 line 1.4 ellipsis nowrap */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingLeft: 8,
                    paddingRight: 8,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      overflow: "hidden",
                      maxWidth: "100%",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                        fontWeight: 600,
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "#111111",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Guided, step-by-step solution
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solving steps 区（标题 + Step 1 卡片）—— 包装为一组以便整组 stagger 入场 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                ...childStyle(3),
              }}
            >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                paddingLeft: 8,
                paddingTop: 8,
              }}
            >
              <span
                style={{
                  fontFamily:
                    "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "#007AFF",
                  textTransform: "uppercase",
                }}
              >
                Solving steps
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/home/popover/eyes.svg"
                alt=""
                draggable={false}
                style={{ width: 16, height: 16 }}
              />
            </div>

            {/* Step 1 卡片 — Figma 节点 1559:15125（导出图片2）：1:1 复刻
                总尺寸 313×118（由父容器宽度决定），padding 8，gap 8，bg #FFFFFF，圆角 16，无 boxShadow。
                结构：tittle 区（STEP 1 标签 + 隐藏的 "2 of 3" + 标题） / 占位文本（underline ellipsis）/ 底部按钮组（绝对定位） */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 118,
                borderRadius: 16,
                padding: 8,
                boxSizing: "border-box",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                overflow: "hidden",
                alignItems: "flex-start",
              }}
            >
              {/* tittle 区（节点 1559:15126）：gap 8 column，width 100% */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  width: "100%",
                  flexShrink: 0,
                }}
              >
                {/* STEP 1 行（节点 1559:15127）：flex justify-between */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {/* STEP 1 标签（节点 1559:15128）：bg rgba(0,0,0,0.06)、px 12 py 4、圆角 100 */}
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: "rgba(0, 0, 0, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                        fontWeight: 600,
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "#111111",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Step 1
                    </span>
                  </div>
                  {/* 2 of 3（节点 1559:15130）：opacity 0 — 设计稿保留占位但不可见 */}
                  <span
                    style={{
                      fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                      fontWeight: 400,
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "#989B9E",
                      opacity: 0,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    2 of 3
                  </span>
                </div>

                {/* 标题（节点 1559:15131）：Inter SemiBold 14 / line 1.4 / #111 / width 100% */}
                <p
                  style={{
                    margin: 0,
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: 1.4,
                    color: "#111111",
                    width: "100%",
                  }}
                >
                  Isolate the absolute value first.
                </p>
              </div>

              {/* 内容区（节点 1559:15132 -> 1559:15133 bottom_bar）：占位文本 underline ellipsis
                  Inter Regular 16 / line 1.5 / #111 / underline / single line ellipsis */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  overflow: "hidden",
                  width: "100%",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      flex: "1 0 0",
                      minWidth: 1,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontFamily:
                          "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: 1.5,
                        color: "#111111",
                        textDecoration: "underline solid",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      This is a sample placeholder text designed to fill space
                      and help visualize how the final content might look.This
                      is a sample placeholder text designed to fill space and
                      help visualize how the final content might look.
                    </p>
                  </div>
                </div>
              </div>

              {/* 底部按钮蒙层（节点 1559:15135）：左右贴卡片边缘 / height 57，bottom 0，
                  bg rgba(245,247,249,0.2)、backdrop-blur 5、底部圆角 16 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 57,
                  background: "rgba(245, 247, 249, 0.2)",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
              >
                {/* 按钮组（节点 1559:15136）：absolute、left calc(50% + 0.5px)、top calc(50% + 0.5px)、translate(-50%,-50%)、gap 24 items-start */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(50% + 0.5px)",
                    top: "calc(50% + 0.5px)",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 24,
                  }}
                >
                  {/* Hint 按钮（节点 1559:15137）：107×36, padding 16/8, gap 6, 圆角 100, bg rgba(255,219,134,0.6), border 1 #FFFFFF, blur 10 */}
                  <div
                    style={{
                      width: 107,
                      height: 36,
                      borderRadius: 100,
                      padding: "8px 16px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      background: "rgba(255, 219, 134, 0.6)",
                      border: "1px solid #FFFFFF",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/figma/home/popover/hint.svg"
                      alt=""
                      draggable={false}
                      style={{ width: 20, height: 20, flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily:
                          "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: "14px",
                        letterSpacing: "-0.14px",
                        color: "#733700",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Hint
                    </span>
                  </div>

                  {/* Reveal 按钮（节点 1559:15138）：height 36, pl 16 pr 18, gap 6, 圆角 100, bg rgba(197,253,175,0.6), border 1 #FFFFFF, blur 10 */}
                  <div
                    style={{
                      height: 36,
                      borderRadius: 100,
                      paddingLeft: 16,
                      paddingRight: 18,
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(197, 253, 175, 0.6)",
                      border: "1px solid #FFFFFF",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      flexShrink: 0,
                    }}
                  >
                    {/* reveal 图标外层 size 20×20 overflow-clip，内部图标 18.4×17.62 居中（节点 I1559:15138;16991:7593） */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/figma/home/popover/reveal.svg"
                        alt=""
                        draggable={false}
                        style={{
                          position: "absolute",
                          width: 18.398,
                          height: 17.62,
                          left: "calc(50% - 1.7px)",
                          top: "calc(50% - 2.09px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily:
                          "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: "14px",
                        letterSpacing: "-0.14px",
                        color: "#155800",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Reveal
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/home/popover-arrow.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position: "absolute",
          bottom: 0.5,
          left: arrowCenterInPopover - POPOVER_ARROW_W / 2,
          width: POPOVER_ARROW_W,
          height: POPOVER_ARROW_H,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
