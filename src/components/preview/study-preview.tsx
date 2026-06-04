"use client";

/* eslint-disable @next/next/no-img-element */

import { DemoCanvas } from "./demo-canvas";
import { MeIcon, ScanIcon, StudyIcon } from "./tabbar-preview";

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

const DASH_ANIMATION_MS = 1950;
const OUTLINE_DASHES = buildRoundedRectDashes();

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
    return { index, p1, p2, delay: (index / count) * DASH_ANIMATION_MS };
  });
}

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
        `}</style>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 190 260"
          fill="none"
          aria-hidden="true"
          style={{
            animation:
              "study-outline-breathe 1.86s ease-in-out 2.2s infinite",
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
              strokeWidth="5"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              opacity="0"
              style={{
                animation:
                  "study-dash-piece-appear 360ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
                animationDelay: `${delay}ms`,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function PreparingBottomSheet() {
  return (
    <>
      <div className="absolute inset-0 z-50 bg-[rgba(17,17,17,0.5)]" />
      <div className="absolute bottom-0 left-0 z-[60] flex h-[495px] w-full flex-col items-start rounded-t-[30px] bg-white">
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

        <div className="flex w-full flex-col items-start gap-[16px] px-[20px]">
          <div className="flex h-[93px] w-full flex-col items-start gap-[8px] text-center text-[#111111]">
            <h2 className="m-0 w-full text-[30px] font-bold leading-[1.5]">
              Preparing
            </h2>
            <div className="w-full text-[16px] font-medium leading-[1.5]">
              <p className="m-0">Building your review flashcards. This</p>
              <p className="m-0">only takes a moment.</p>
            </div>
          </div>

          <PreparingProgressGraphic />
        </div>

        <div className="flex w-full flex-col items-start">
          <div className="flex w-[375px] flex-col items-center overflow-hidden">
            <div className="relative h-[34px] w-full">
              <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function StudyPreview() {
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
        <PreparingBottomSheet />
      </div>
    </DemoCanvas>
  );
}
