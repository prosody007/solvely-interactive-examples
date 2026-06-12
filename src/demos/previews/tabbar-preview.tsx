"use client";

import { useState } from "react";

const ACTIVE = "#007AFF";
const INACTIVE = "#989B9E";
const BG = "#FFFFFF";
const TOP_BORDER = "#F6F8FA";

type IconProps = { active?: boolean };

function tabIcon(activeSrc: string, inactiveSrc: string, w: number, h: number) {
  return function TabIcon({ active = false }: IconProps) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={active ? activeSrc : inactiveSrc}
        alt=""
        draggable={false}
        style={{
          width: w,
          height: h,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    );
  };
}

export const ScanIcon = tabIcon(
  "/tabbar-icons/scan-active.svg",
  "/tabbar-icons/scan-inactive.svg",
  23,
  21,
);
export const StudyIcon = tabIcon(
  "/tabbar-icons/study-active.svg",
  "/tabbar-icons/study-inactive.svg",
  18,
  22,
);
export const MeIcon = tabIcon(
  "/tabbar-icons/me-active.svg",
  "/tabbar-icons/me-inactive.svg",
  22,
  22,
);

const TABS = [
  { id: "scan",  label: "Scan",  Icon: ScanIcon },
  { id: "study", label: "Study", Icon: StudyIcon },
  { id: "me",    label: "Me",    Icon: MeIcon },
];

export function TabBarBouncePreview() {
  const [active, setActive] = useState(0);
  const [tapped, setTapped] = useState(-1);

  const tap = (i: number) => {
    setActive(i);
    setTapped(i);
    setTimeout(() => setTapped(-1), 140);
  };

  return (
    <div className="absolute inset-0 flex flex-col select-none">
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "#F6F8FA" }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            color: INACTIVE,
          }}
        >
          {TABS[active].label} Page
        </span>
      </div>

      <div
        className="w-full flex shrink-0"
        style={{
          background: BG,
          borderTop: `1px solid ${TOP_BORDER}`,
          paddingTop: 6,
          paddingBottom: 24,
        }}
      >
        {TABS.map((tab, i) => {
          const isActive = active === i;
          const isTapped = tapped === i;
          const color = isActive ? ACTIVE : INACTIVE;
          const Icon = tab.Icon;
          return (
            <button
              key={tab.id}
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
  );
}

export function TabBarBadgePreview() {
  const [count, setCount] = useState(3);
  const [pulse, setPulse] = useState(false);
  const BADGE_TAB_INDEX = 1;

  const increment = () => {
    setCount((c) => c + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
  };

  return (
    <div className="absolute inset-0 flex flex-col select-none">
      <div
        className="flex-1 flex flex-col items-center justify-center gap-4"
        style={{ background: "#F6F8FA" }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            color: INACTIVE,
          }}
        >
          Scan Page
        </span>
        <button
          className="px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.06)",
            color: "rgba(0,0,0,0.7)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            increment();
          }}
        >
          + New Message
        </button>
      </div>

      <div
        className="w-full flex shrink-0"
        style={{
          background: BG,
          borderTop: `1px solid ${TOP_BORDER}`,
          paddingTop: 6,
          paddingBottom: 24,
        }}
      >
        {TABS.map((tab, i) => {
          const isActive = i === 0;
          const color = isActive ? ACTIVE : INACTIVE;
          const Icon = tab.Icon;
          const showBadge = i === BADGE_TAB_INDEX;
          return (
            <div
              key={tab.id}
              className="flex-1 flex flex-col items-center pt-1 pb-1"
              style={{ gap: 3 }}
            >
              <span
                className="relative inline-flex items-center justify-center"
                style={{ width: 28, height: 28, color }}
              >
                <Icon active={isActive} />
                {showBadge && (
                  <span
                    className="absolute flex items-center justify-center rounded-full bg-red-500 text-white font-bold leading-none"
                    style={{
                      minWidth: 18,
                      height: 18,
                      padding: "0 5px",
                      fontSize: 11,
                      top: -6,
                      right: -12,
                      transformOrigin: "center",
                      transform: pulse ? "scale(1.18)" : "scale(1)",
                      transition:
                        "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: "0 0 0 2px #FFFFFF",
                    }}
                  >
                    {count}
                  </span>
                )}
              </span>
              <span
                style={{
                  fontSize: 10,
                  lineHeight: 1.21,
                  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                  fontWeight: isActive ? 600 : 500,
                  color,
                }}
              >
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

