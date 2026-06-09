"use client";

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import { DemoCanvas } from "./demo-canvas";
import { MeIcon, ScanIcon, StudyIcon } from "./tabbar-preview";

export type StudyExperimentVariant = "experiment-1" | "experiment-2";

const BLUE = "#007AFF";
const BG = "#F6F8FA";
const MUTED = "#989B9E";
const ASSET = "/figma/study";

const CREATE_ITEMS = [
  {
    title: "Study Guide",
    subtitle: "Focused summary",
    icon: `${ASSET}/frame2147226005.svg`,
  },
  {
    title: "Flashcards",
    subtitle: "Spaced repetition",
    icon: `${ASSET}/flashcardsIcon1.svg`,
  },
  {
    title: "Quiz",
    subtitle: "Custom questions",
    icon: `${ASSET}/quizIcon1.svg`,
  },
  {
    title: "Podcast",
    subtitle: "Study hands-free",
    icon: `${ASSET}/frame2147226007.svg`,
  },
] as const;

const TABS = [
  { id: "scan", label: "Scan", Icon: ScanIcon },
  { id: "study", label: "Study", Icon: StudyIcon },
  { id: "me", label: "Me", Icon: MeIcon },
] as const;

const STUDY_SCAN_BLOCKS = [
  { color: "#E3F5E5", angle: 0 },
  { color: "#E3F4F5", angle: 21 },
  { color: "#E4E3F5", angle: 42 },
  { color: "#DAECFF", angle: 63 },
  { color: "#FBE3E5", angle: 84 },
] as const;

const DASH_ANIMATION_MS = 2000;
const DASH_PIECE_ANIMATION_MS = 340;
const OUTLINE_BREATHE_DURATION_MS = 3600;
const CARD_GROUP_START_MS = DASH_ANIMATION_MS + OUTLINE_BREATHE_DURATION_MS - 1000;
const CARD_GROUP_DURATION_MS = 2400;
const FINAL_CARD_FLIP_START_MS = CARD_GROUP_START_MS + CARD_GROUP_DURATION_MS;
const FINAL_CARD_FLIP_DURATION_MS = 600;
const FINAL_REVEAL_START_MS = FINAL_CARD_FLIP_START_MS;
const FINAL_CARD_EASE = "cubic-bezier(0.45, 0.05, 0.25, 1)";
const FINAL_BACK_CARD_DURATION_MS = 600;
const FINAL_BACK_LEFT_START_MS = FINAL_REVEAL_START_MS + 420;
const FINAL_BACK_RIGHT_START_MS = FINAL_REVEAL_START_MS + 560;
const FINAL_SHEET_REVEAL_DURATION_MS = 520;
const FINAL_CONTENT_REVEAL_DURATION_MS = 360;
const FINAL_SHEET_REVEAL_START_MS = FINAL_REVEAL_START_MS;
const FINAL_BUBBLE_START_MS =
  FINAL_SHEET_REVEAL_START_MS +
  Math.max(FINAL_SHEET_REVEAL_DURATION_MS, FINAL_CONTENT_REVEAL_DURATION_MS);

function roundedRectPointAt(distance: number) {
  const x = 2.5;
  const y = 2.5;
  const width = 185;
  const height = 255;
  const radius = 29.5;
  const top = width - radius * 2;
  const right = height - radius * 2;
  const arc = (Math.PI * radius) / 2;
  const perimeter = top * 2 + right * 2 + arc * 4;
  let d = ((distance % perimeter) + perimeter) % perimeter;

  if (d <= top) return { x: x + radius + d, y };
  d -= top;
  if (d <= arc) {
    const angle = -Math.PI / 2 + d / radius;
    return {
      x: x + width - radius + Math.cos(angle) * radius,
      y: y + radius + Math.sin(angle) * radius,
    };
  }
  d -= arc;
  if (d <= right) return { x: x + width, y: y + radius + d };
  d -= right;
  if (d <= arc) {
    const angle = d / radius;
    return {
      x: x + width - radius + Math.cos(angle) * radius,
      y: y + height - radius + Math.sin(angle) * radius,
    };
  }
  d -= arc;
  if (d <= top) return { x: x + width - radius - d, y: y + height };
  d -= top;
  if (d <= arc) {
    const angle = Math.PI / 2 + d / radius;
    return {
      x: x + radius + Math.cos(angle) * radius,
      y: y + height - radius + Math.sin(angle) * radius,
    };
  }
  d -= arc;
  if (d <= right) return { x, y: y + height - radius - d };
  d -= right;
  const angle = Math.PI + d / radius;
  return {
    x: x + radius + Math.cos(angle) * radius,
    y: y + radius + Math.sin(angle) * radius,
  };
}

function buildRoundedRectDashes() {
  const width = 185;
  const height = 255;
  const radius = 29.5;
  const top = width - radius * 2;
  const right = height - radius * 2;
  const arc = (Math.PI * radius) / 2;
  const perimeter = top * 2 + right * 2 + arc * 4;
  const dashLength = 14;
  const gapLength = 16;
  const step = dashLength + gapLength;
  const count = Math.floor(perimeter / step);

  return Array.from({ length: count }, (_, index) => {
    const start = index * step;
    const p1 = roundedRectPointAt(start);
    const p2 = roundedRectPointAt(start + dashLength);
    const t = count <= 1 ? 0 : index / (count - 1);
    const easedDelay = Math.pow(t, 1.8);

    return {
      index,
      p1,
      p2,
      delay: easedDelay * (DASH_ANIMATION_MS - DASH_PIECE_ANIMATION_MS),
    };
  });
}

const OUTLINE_DASHES = buildRoundedRectDashes();

function HeroPreview() {
  return (
    <img
      src={`${ASSET}/study-hero.png`}
      alt=""
      draggable={false}
      className="h-[209px] w-full object-cover"
    />
  );
}

function CreateCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="flex h-[70px] items-center gap-[8px] rounded-[16px] border border-[#EEEEEE] bg-white px-[12px] py-[16px]">
      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[#ECF5FF]">
        <img src={icon} alt="" draggable={false} className="h-[24px] w-[24px]" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[14px] font-semibold leading-[24px] text-[#111111]">
          {title}
        </div>
        <div className="truncate text-[12px] leading-[18px] text-[#989B9E]">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function StudySetCard() {
  return (
    <div className="flex w-full items-center gap-[10px] rounded-[16px] border border-[#EEEEEE] bg-white py-[20px] pl-[16px] pr-[20px]">
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center">
        <img
          src={`${ASSET}/group2087325584.svg`}
          alt=""
          draggable={false}
          className="h-[27px] w-[27px]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[16px] font-semibold leading-[22px] text-[#111111]">
          How to Ace your Exam in 7 days
        </div>
        <div className="mt-[6px] flex items-center gap-[10px] text-[13px] leading-[18px] text-[#989B9E]">
          <span>2024/12/12, 20:39</span>
          <span className="flex min-w-0 items-center gap-[4px]">
            <span className="relative h-[14px] w-[14px] overflow-hidden rounded-full bg-[#E9E0FF]">
              <img
                src={`${ASSET}/32.png`}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </span>
            <span>Solvi</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function BottomTabBar() {
  return (
    <div className="absolute bottom-0 left-0 z-30 w-full bg-white">
      <div className="flex h-[56px] w-full border-t border-[#F6F8FA]">
        {TABS.map((tab) => {
          const active = tab.id === "study";
          const Icon = tab.Icon;
          return (
            <div
              key={tab.id}
              className="flex flex-1 flex-col items-center justify-center gap-[2px]"
            >
              <span className="flex h-[24px] w-[24px] items-center justify-center">
                <Icon active={active} />
              </span>
              <span
                className="text-[10px] leading-none"
                style={{
                  color: active ? BLUE : MUTED,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-[34px] w-full">
        <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

function FloatingUpload() {
  return (
    <div className="absolute bottom-[100px] left-0 z-40 flex w-full items-center justify-center gap-[8px] px-[16px]">
      <div className="flex h-[56px] items-center rounded-full bg-white pl-[10px] pr-[6px] shadow-[0_10px_20px_rgba(90,105,131,0.16)]">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full">
          <img
            src={`${ASSET}/floating-camera-icon@3x.png`}
            alt=""
            draggable={false}
            className="h-[20px] w-[20px]"
          />
        </div>
        <div className="h-[26px] w-px bg-[#E0E0E0]" />
        <div className="flex h-[44px] items-center gap-[4px] rounded-full px-[16px]">
          <img
            src={`${ASSET}/floating-upload-icon@3x.png`}
            alt=""
            draggable={false}
            className="h-[20px] w-[20px]"
          />
          <span className="font-[var(--font-poppins)] text-[16px] font-medium text-[#111111]">
            Upload File
          </span>
        </div>
      </div>
      <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white shadow-[0_10px_40px_rgba(90,105,131,0.16)]">
        <img
          src={`${ASSET}/floating-mic-icon@3x.png`}
          alt=""
          draggable={false}
          className="h-[18px] w-[14px]"
        />
      </div>
    </div>
  );
}

function FinalStackCard({
  className,
  imageSrc,
  style,
}: {
  className: string;
  imageSrc: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`${className} flex flex-col items-center rounded-[20px] bg-white px-[8px] pb-[12px] pt-[8px] shadow-[0_8px_30px_rgba(0,0,0,0.16)]`}
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        ...style,
      }}
    >
      <div className="flex min-h-0 flex-1 w-full flex-col items-center justify-center gap-[16px]">
        <div className="h-[120px] w-full shrink-0 rounded-[12px]">
          <img
            src={imageSrc}
            alt=""
            draggable={false}
            className="h-full w-full rounded-[12px] object-cover"
          />
        </div>
        <div className="flex min-h-0 flex-1 items-start justify-center text-center text-[12px] font-semibold leading-[1.3] text-[#111111]">
          Reduction means gaining or losing electrons?
        </div>
        <div className="flex h-[24px] shrink-0 items-center justify-center text-[10px] font-bold leading-[10px] text-[#007AFF]">
          Tap to reveal
        </div>
      </div>
    </div>
  );
}

function StudyTopicBubble({
  className,
  label,
  color,
  bg,
  border,
  rotate,
  delay,
  floatDuration,
}: {
  className: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  rotate: number;
  delay: number;
  floatDuration: number;
}) {
  return (
    <div
      className={`${className} absolute`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="rounded-full border px-[12px] py-[8px] text-[14px] font-semibold leading-[14px] whitespace-nowrap"
        style={{
          color,
          backgroundColor: bg,
          borderColor: border,
          opacity: 0,
          animation:
            "study-bubble-pop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) var(--bubble-delay) forwards, study-bubble-float var(--bubble-float) ease-in-out calc(var(--bubble-delay) + 520ms) infinite",
          ["--bubble-delay" as string]: `${delay}ms`,
          ["--bubble-float" as string]: `${floatDuration}ms`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PreparingProgressGraphic() {
  return (
    <div className="flex w-full items-center justify-center py-[24px]">
      <div className="relative h-[260px] w-[190px]">
        <style>{`
          @keyframes study-dash-piece-appear {
            from {
              opacity: 0;
              stroke-dashoffset: 1;
            }
            to {
              opacity: 1;
              stroke-dashoffset: 0;
            }
          }

          @keyframes study-outline-breathe {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
          }

          @keyframes study-outline-once-breathe {
            0%, 50% {
              transform: scale(1);
              opacity: 1;
            }
            25%, 75%, 100% {
              transform: scale(1.14);
              opacity: 0;
            }
          }

          @keyframes study-outline-fade-out {
            from { opacity: 1; }
            to { opacity: 0; }
          }

          @keyframes study-card-fan-spin {
            0% {
              opacity: 0;
              transform: rotate(18deg);
            }
            10% {
              opacity: 1;
            }
            100% {
              opacity: 1;
              transform: rotate(-84deg);
            }
          }

          @keyframes study-final-card-flip {
            from {
              transform: rotateY(0deg);
            }
            to {
              transform: rotateY(180deg);
            }
          }

          @keyframes study-side-card-exit {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          @keyframes study-back-card-left-enter {
            from {
              visibility: visible;
              transform: translate(-50%, -50%) rotate(0deg) scale(0.92);
            }
            to {
              visibility: visible;
              transform: translate(calc(-50% - 61px), calc(-50% - 13px)) rotate(-26deg) scale(1);
            }
          }

          @keyframes study-back-card-right-enter {
            from {
              visibility: visible;
              transform: translate(-50%, -50%) rotate(0deg) scale(0.92);
            }
            to {
              visibility: visible;
              transform: translate(calc(-50% + 60px), calc(-50% - 13px)) rotate(26deg) scale(1);
            }
          }

          @keyframes study-bubble-pop {
            0% {
              opacity: 0;
              transform: scale(0.2);
            }
            68% {
              opacity: 1;
              transform: scale(1.12);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes study-bubble-float {
            0%, 100% {
              translate: 0 0;
            }
            50% {
              translate: 0 -3px;
            }
          }
        `}</style>
        <div className="absolute inset-0 z-20 overflow-visible">
          <div
            className="absolute opacity-0"
            style={{
              left: "50%",
              top: 770,
              width: 0,
              height: 0,
              animationName: "study-card-fan-spin",
              animationDuration: `${CARD_GROUP_DURATION_MS}ms`,
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              animationDelay: `${CARD_GROUP_START_MS}ms`,
              animationFillMode: "forwards",
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          >
            {STUDY_SCAN_BLOCKS.map((block, index) => {
              const radius = 640;
              const angleRad = (-90 + block.angle) * (Math.PI / 180);
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;
              const isFinalCard = index === STUDY_SCAN_BLOCKS.length - 1;
              const left = x - (isFinalCard ? 100 : 87);
              const top = y - (isFinalCard ? 130 : 122);

              return (
                <div
                  key={`${block.color}-${index}`}
                  className={`absolute ${isFinalCard ? "h-[260px] w-[200px]" : "h-[244px] w-[174px]"}`}
                  style={{
                    left: `${left.toFixed(3)}px`,
                    top: `${top.toFixed(3)}px`,
                    transform: `rotate(${block.angle}deg)`,
                    transformOrigin: "center center",
                    perspective: "1000px",
                    animationName: !isFinalCard
                      ? "study-side-card-exit"
                      : undefined,
                    animationDuration: !isFinalCard ? "260ms" : undefined,
                    animationTimingFunction: !isFinalCard
                      ? "ease-out"
                      : undefined,
                    animationDelay: !isFinalCard
                      ? `${FINAL_CARD_FLIP_START_MS}ms`
                      : undefined,
                    animationFillMode: !isFinalCard ? "forwards" : undefined,
                  }}
                >
                  {isFinalCard ? (
                    <>
                      <FinalStackCard
                        className="invisible absolute left-1/2 top-1/2 h-[240px] w-[160px]"
                        imageSrc={`${ASSET}/final-back-card-left.png`}
                        style={{
                          animationName: "study-back-card-left-enter",
                          animationDuration: `${FINAL_BACK_CARD_DURATION_MS}ms`,
                          animationTimingFunction: FINAL_CARD_EASE,
                          animationDelay: `${FINAL_BACK_LEFT_START_MS}ms`,
                          animationFillMode: "forwards",
                          zIndex: 1,
                        }}
                      />
                      <FinalStackCard
                        className="invisible absolute left-1/2 top-1/2 h-[240px] w-[160px]"
                        imageSrc={`${ASSET}/final-back-card-right.png`}
                        style={{
                          animationName: "study-back-card-right-enter",
                          animationDuration: `${FINAL_BACK_CARD_DURATION_MS}ms`,
                          animationTimingFunction: FINAL_CARD_EASE,
                          animationDelay: `${FINAL_BACK_RIGHT_START_MS}ms`,
                          animationFillMode: "forwards",
                          zIndex: 1,
                        }}
                      />
                    </>
                  ) : null}
                  <div
                    className="relative h-full w-full"
                    style={{
                      transformStyle: "preserve-3d",
                      WebkitTransformStyle: "preserve-3d",
                      animationName: isFinalCard
                        ? "study-final-card-flip"
                        : undefined,
                      animationDuration: isFinalCard
                        ? `${FINAL_CARD_FLIP_DURATION_MS}ms`
                        : undefined,
                      animationTimingFunction: isFinalCard
                        ? FINAL_CARD_EASE
                        : undefined,
                      animationDelay: isFinalCard
                        ? `${FINAL_CARD_FLIP_START_MS}ms`
                        : undefined,
                      animationFillMode: isFinalCard ? "forwards" : undefined,
                      zIndex: 20,
                    }}
                  >
                    <div
                      className={
                        isFinalCard
                          ? "absolute left-1/2 top-1/2 h-[244px] w-[174px] rounded-[32px]"
                          : "absolute inset-0 rounded-[32px]"
                      }
                      style={{
                        backgroundColor: block.color,
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        zIndex: 1,
                        transform: isFinalCard
                          ? "translate(-50%, -50%)"
                          : undefined,
                      }}
                    />
                    {isFinalCard ? (
                      <FinalStackCard
                        className="absolute inset-0 h-[260px] w-[200px]"
                        imageSrc={`${ASSET}/final-front-card.png`}
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          zIndex: 30,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <svg
          className="absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 190 260"
          fill="none"
          aria-hidden="true"
          style={{
            animation:
              `study-outline-once-breathe ${OUTLINE_BREATHE_DURATION_MS}ms cubic-bezier(0.34, 0, 0.2, 1) ${DASH_ANIMATION_MS}ms forwards`,
            transformOrigin: "center center",
          }}
        >
          {OUTLINE_DASHES.map(({ index, p1, p2, delay }) => (
            <line
              key={index}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#E6E8EA"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              opacity="0"
              style={{
                animation:
                  "study-dash-piece-appear 340ms cubic-bezier(0.45, 0, 0.75, 0.2) forwards",
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function PreparingBottomSheet({
  experiment = "experiment-1",
}: {
  experiment?: StudyExperimentVariant;
}) {
  const finalHint =
    experiment === "experiment-2"
      ? "Generated for you . from topics you ask about most"
      : "Generated for you · powered by 10M+ student insights";

  return (
    <>
      <div className="absolute inset-0 z-50 bg-[rgba(17,17,17,0.5)]" />
      <style>{`
        @keyframes study-sheet-grow {
          from { height: 495px; }
          to { height: 668px; }
        }

        @keyframes study-preparing-copy-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-8px); }
        }

        @keyframes study-final-content-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes study-preparing-home-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes study-progress-stage-move {
          from { top: 109px; }
          to { top: 174px; }
        }
      `}</style>
      <div
        className="absolute bottom-0 left-0 z-[60] flex h-[495px] w-full flex-col items-start rounded-t-[30px] bg-white"
        style={{
          animation: `study-sheet-grow 520ms cubic-bezier(0.32, 0.72, 0, 1) ${FINAL_SHEET_REVEAL_START_MS}ms forwards`,
        }}
      >
        <div className="flex w-full flex-col items-start">
          <div className="flex w-full items-center justify-center overflow-hidden pb-[3px] pt-[6px]">
            <div className="h-[5px] w-[36px] rounded-[2.5px] bg-[#E6E8EA]" />
          </div>
          <div className="flex w-full items-start justify-end px-[16px]">
            <img
              src={`${ASSET}/bottom-sheet-close@3x.png`}
              alt=""
              draggable={false}
              className="h-[30px] w-[30px]"
            />
          </div>
        </div>

        <div className="relative w-full">
          <div
            className="flex w-full flex-col items-start px-[20px]"
          >
            <div
              className="flex h-[93px] w-full flex-col items-start gap-[8px] text-center text-[#111111]"
              style={{
                animation:
                  `study-preparing-copy-out 240ms ease-out ${FINAL_SHEET_REVEAL_START_MS}ms forwards`,
              }}
            >
              <h2 className="m-0 w-full text-[30px] font-bold leading-[1.5]">
                Preparing
              </h2>
              <div className="w-full text-[16px] font-medium leading-[1.5]">
                <p className="m-0">Building your review flashcards. This</p>
                <p className="m-0">only takes a moment.</p>
              </div>
            </div>
          </div>

          <div
            className="absolute left-0 top-[109px] w-full px-[20px]"
            style={{
              animation: `study-progress-stage-move 520ms cubic-bezier(0.32, 0.72, 0, 1) ${FINAL_SHEET_REVEAL_START_MS}ms forwards`,
            }}
          >
            <PreparingProgressGraphic />
          </div>

          <div className="absolute left-0 top-0 flex w-full flex-col items-start px-[20px]">
            <div className="relative h-[158px] w-full text-center text-[#111111]">
            <div
              className="absolute left-0 top-0 flex w-full flex-col items-start opacity-0"
              style={{
                animation:
                  `study-final-content-in 360ms ease-out ${FINAL_SHEET_REVEAL_START_MS}ms forwards`,
              }}
            >
              <div className="flex w-full items-center justify-center py-[16px]">
                <p className="m-0 text-center text-[16px] font-bold leading-[16px] text-[#111111]">
                  Today&apos;s Exam Prep Topic · Chemistry
                </p>
              </div>
              <div className="w-full pb-[16px]">
                <div className="flex w-full flex-col items-center gap-[4px] rounded-[16px] bg-[#ECF5FF] py-[12px] text-center leading-[1.5]">
                  <p className="m-0 w-full text-[16px] font-bold leading-[24px] text-[#007AFF]">
                    Redox Reaction
                  </p>
                  <p className="m-0 w-full text-[14px] font-medium leading-[21px] text-[#111111]">
                    “A reaction where electrons move between substances,
                    changing oxidation states”
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 flex w-full flex-col items-start bg-white opacity-0"
          style={{
            animation: `study-final-content-in 360ms ease-out ${FINAL_SHEET_REVEAL_START_MS}ms forwards`,
          }}
        >
          <div className="flex w-full flex-col items-center bg-white px-[20px] pt-[8px]">
            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center rounded-full border-0 bg-[#007AFF] font-[var(--font-poppins)] text-[16px] font-semibold leading-[1.5] text-white"
            >
              Start Flashcards
            </button>
          </div>
          <div className="flex w-full items-center justify-center py-[8px]">
            <p className="m-0 flex-1 text-center text-[12px] font-normal leading-[1.3] text-[#989B9E]">
              {finalHint}
            </p>
          </div>
          <div className="flex h-[34px] w-full flex-col items-center overflow-hidden">
            <div className="relative h-[34px] w-full">
              <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[80] overflow-visible">
          <StudyTopicBubble
            className="left-[11px] top-[332px]"
            label="AP Chemistry"
            color="#007AFF"
            bg="#ECF5FF"
            border="#007AFF"
            rotate={6}
            delay={FINAL_BUBBLE_START_MS}
            floatDuration={2300}
          />
          <StudyTopicBubble
            className="left-[236px] top-[239px]"
            label="High-Frequency"
            color="#E15C6C"
            bg="#FCEFF0"
            border="#E15C6C"
            rotate={-10}
            delay={FINAL_BUBBLE_START_MS + 170}
            floatDuration={2600}
          />
          <StudyTopicBubble
            className="left-[244px] top-[416px]"
            label="Common Mistake"
            color="#33A354"
            bg="#ECF5ED"
            border="#33A354"
            rotate={8}
            delay={FINAL_BUBBLE_START_MS + 340}
            floatDuration={2100}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 flex w-full flex-col items-start"
          style={{
            animation: `study-preparing-home-out 160ms ease-out ${FINAL_SHEET_REVEAL_START_MS}ms forwards`,
          }}
        >
          <div className="flex h-[34px] w-full flex-col items-center overflow-hidden">
            <div className="relative h-[34px] w-full">
              <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function StudyPreview({
  experiment = "experiment-1",
}: {
  experiment?: StudyExperimentVariant;
}) {
  return (
    <DemoCanvas mode="fill" background={BG}>
      <div className="absolute inset-0 select-none overflow-hidden bg-[#F6F8FA]">
        <header className="absolute left-0 right-0 top-[44px] z-20 flex h-[66px] items-center justify-between bg-[#F6F8FA] px-[20px] pb-[10px] pt-[10px]">
          <h1 className="m-0 font-[var(--font-poppins)] text-[24px] font-bold leading-[31px] text-[#111111]">
            Study
          </h1>
          <div className="flex items-center gap-[10px]">
            <button className="flex h-[40px] w-[40px] items-center justify-center rounded-[14px] border-0 bg-[#EDEEF3]">
              <img
                src={`${ASSET}/frame2087328854.svg`}
                alt=""
                draggable={false}
                className="h-[24px] w-[24px]"
              />
            </button>
            <button className="flex h-[40px] w-[40px] items-center justify-center rounded-[14px] border-0 bg-[#EDEEF3]">
              <img
                src={`${ASSET}/language.svg`}
                alt=""
                draggable={false}
                className="h-[24px] w-[24px]"
              />
            </button>
          </div>
        </header>

        <main className="absolute left-0 right-0 top-[110px] bottom-[90px] overflow-hidden px-[20px] pb-[20px]">
          <div className="flex flex-col gap-[20px]">
            <HeroPreview />
            <section className="flex flex-col gap-[10px]">
              <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[23px] text-[#111111]">
                Create
              </h2>
              <div className="grid grid-cols-2 gap-[8px]">
                {CREATE_ITEMS.map((item) => (
                  <CreateCard key={item.title} {...item} />
                ))}
              </div>
              <div className="flex h-[76px] items-center rounded-[16px] border border-[#EEEEEE] bg-white pl-[12px] pr-[16px]">
                <div className="flex min-w-0 flex-1 items-center gap-[8px]">
                  <img
                    src={`${ASSET}/lecture-notes-icon.png`}
                    alt=""
                    draggable={false}
                    className="h-[28px] w-[28px] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold leading-[24px] text-[#111111]">
                      Lecture Notes
                    </div>
                    <div className="text-[12px] leading-[18px] text-[#989B9E]">
                      Tap, record, summarize
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[23px] text-[#111111]">
                  My Study Sets
                </h2>
                <div className="flex items-center gap-[6px] text-[14px] font-medium leading-[24px] text-[#595C60]">
                  <span>All Sets</span>
                  <img
                    src={`${ASSET}/sort.svg`}
                    alt=""
                    draggable={false}
                    className="h-[20px] w-[20px]"
                  />
                </div>
              </div>
              <StudySetCard />
            </section>
          </div>
        </main>

        <FloatingUpload />
        <BottomTabBar />
        <PreparingBottomSheet experiment={experiment} />
      </div>
    </DemoCanvas>
  );
}
