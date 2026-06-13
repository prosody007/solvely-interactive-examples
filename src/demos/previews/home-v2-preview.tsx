"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { DemoCanvas } from "@/components/simulator/demo-canvas";
import { HomePreview } from "./home-preview";

export type HomeExperimentVariant = "version-1" | "version-2" | "version-3";
type HomeV2Tab = "study" | "solve";

const ASSET = "/figma/home-v2";
const SOLVE_CAPTURE_TABBAR_SPACER_H = 77;

const VERSION_ONE_CREATE_ITEMS = [
  {
    title: "Study Guide",
    subtitle: "Organize key ideas",
    icon: `${ASSET}/create-study-guide-new@3x.png`,
  },
  {
    title: "Quiz",
    subtitle: "Personalized practice",
    icon: `${ASSET}/create-quiz-new@3x.png`,
  },
  {
    title: "Flashcards",
    subtitle: "Spaced repetition",
    icon: `${ASSET}/create-flashcards-new@3x.png`,
  },
  {
    title: "Podcast",
    subtitle: "Study hands-free",
    icon: `${ASSET}/create-podcast-new@3x.png`,
  },
  {
    title: "Mock Exam",
    subtitle: "AI-powered exam prep",
    icon: `${ASSET}/create-mock-exam-new@3x.png`,
  },
  {
    title: "Mini Games",
    subtitle: "AI-powered exam prep",
    icon: `${ASSET}/create-mini-games-new@3x.png`,
  },
] as const;

const VERSION_TWO_CREATE_ITEMS = [
  {
    title: "Study Guide",
    subtitle: "Organize key ideas",
    icon: `${ASSET}/group2087325676.svg`,
  },
  {
    title: "Lecture Notes",
    subtitle: "Tap, record, summarize",
    icon: `${ASSET}/frame2147224848.svg`,
  },
  {
    title: "Flashcards",
    subtitle: "Spaced repetition",
    icon: `${ASSET}/frame2147224824.svg`,
  },
  {
    title: "Quiz",
    subtitle: "Personalized practice",
    icon: `${ASSET}/frame2147224825.svg`,
  },
  {
    title: "Mock Exam",
    subtitle: "Al-powered exam prep",
    icon: `${ASSET}/group2087325616.svg`,
  },
  {
    title: "Podcast",
    subtitle: "Study hands-free",
    icon: `${ASSET}/podcast.svg`,
  },
] as const;

const VERSION_THREE_CREATE_ITEMS = [
  {
    title: "Study Guide",
    subtitle: "Organize key ideas",
    icon: `${ASSET}/create-study-guide-new@3x.png`,
  },
  {
    title: "Quiz",
    subtitle: "Personalized practice",
    icon: `${ASSET}/create-quiz-new@3x.png`,
  },
  {
    title: "Flashcards",
    subtitle: "Spaced repetition",
    icon: `${ASSET}/create-flashcards-new@3x.png`,
  },
  {
    title: "Podcast",
    subtitle: "Study hands-free",
    icon: `${ASSET}/create-podcast-new@3x.png`,
  },
  {
    title: "Mock Exam",
    subtitle: "AI-powered exam prep",
    icon: `${ASSET}/create-mock-exam-new@3x.png`,
  },
  {
    title: "Mini Games",
    subtitle: "AI-powered exam prep",
    icon: `${ASSET}/create-mini-games-new@3x.png`,
  },
] as const;

const STUDY_SETS = [
  {
    title: "Creating a paywall with products and Components",
    icon: "mic",
    solvi: false,
  },
  {
    title: "Advanced Spanish Vocab",
    icon: "image",
    solvi: false,
  },
  {
    title: "How to Ace your Exam in 7 days",
    icon: "folder",
    solvi: true,
  },
  {
    title: "How to Ace your Exam in 7 days",
    icon: "folder",
    solvi: true,
  },
  {
    title: "How to Ace your Exam in 7 days",
    icon: "folder",
    solvi: true,
  },
  {
    title: "How to Ace your Exam in 7 days",
    icon: "folder",
    solvi: true,
  },
  {
    title: "How to Ace your Exam in 7 days",
    icon: "folder",
    solvi: true,
  },
] as const;

function CreateStudyCard({
  title,
  subtitle,
  icon,
  compact = false,
  figmaCard = false,
}: {
  title: string;
  subtitle: string;
  icon: string;
  compact?: boolean;
  figmaCard?: boolean;
}) {
  if (figmaCard) {
    return (
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[8px] rounded-[24px] bg-white px-[16px] py-[12px] shadow-[0_12px_16px_rgba(0,0,0,0.06)]">
        <div className="relative h-[44px] w-[44px] shrink-0 overflow-hidden rounded-[12px] bg-[#ECF5FF]">
          <img
            src={icon}
            alt=""
            draggable={false}
            className="absolute left-1/2 top-1/2 h-[24px] w-[24px] -translate-x-1/2 -translate-y-1/2 object-contain"
          />
        </div>
        <div className="flex w-full flex-col items-start gap-[2px] pl-[2px]">
          <div className="w-full truncate whitespace-nowrap text-left text-[16px] font-semibold leading-[1.4] text-[#111111]">
            {title}
          </div>
          <div className="w-full truncate whitespace-nowrap text-left text-[12px] font-normal leading-normal text-[#989B9E]">
            {subtitle}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-[96px] shrink-0 flex-col items-center justify-center gap-[8px] py-[12px] ${
        compact ? "w-max min-w-[148px]" : "min-w-0 flex-1"
      }`}
    >
      <img src={icon} alt="" draggable={false} className="h-[44px] w-[44px] shrink-0" />
      <div className="flex w-full flex-col items-center">
        <div className="w-full truncate whitespace-nowrap text-center text-[14px] font-medium leading-[14px] text-[#111111]">
          {title}
        </div>
      </div>
    </div>
  );
}

function VersionOneCreateStudySetSection() {
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
  } | null>(null);
  const columns = 3;
  const scrollRowSize = columns;
  const scrollRows = [
    VERSION_ONE_CREATE_ITEMS.slice(0, scrollRowSize),
    VERSION_ONE_CREATE_ITEMS.slice(scrollRowSize),
  ];

  return (
    <section className="flex w-full flex-col items-start gap-[12px]">
      <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
        Create Study Set
      </h2>
      <div
        className="phone-scrollbar-hidden -mx-[20px] -my-[20px] w-[393px] cursor-grab overflow-x-auto py-[20px] active:cursor-grabbing"
        onPointerDown={(event) => {
          const target = event.currentTarget;
          dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: target.scrollLeft,
          };
          target.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const dragState = dragStateRef.current;
          if (!dragState) return;
          const deltaX = event.clientX - dragState.startX;
          event.currentTarget.scrollLeft =
            dragState.startScrollLeft - deltaX;
        }}
        onPointerUp={(event) => {
          const dragState = dragStateRef.current;
          if (!dragState) return;
          if (event.currentTarget.hasPointerCapture(dragState.pointerId)) {
            event.currentTarget.releasePointerCapture(dragState.pointerId);
          }
          dragStateRef.current = null;
        }}
        onPointerCancel={(event) => {
          const dragState = dragStateRef.current;
          if (
            dragState &&
            event.currentTarget.hasPointerCapture(dragState.pointerId)
          ) {
            event.currentTarget.releasePointerCapture(dragState.pointerId);
          }
          dragStateRef.current = null;
        }}
      >
        <div className="flex w-full flex-col gap-[8px] px-[20px]">
          {scrollRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-full items-center gap-[8px]">
              {row.map((item) => (
                <CreateStudyCard key={item.title} {...item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VersionTwoCreateStudySetSection() {
  const columns = 2;

  return (
    <section className="flex w-full flex-col items-start gap-[12px]">
      <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
        Create Study Set
      </h2>
      <div className="flex w-full flex-col gap-[8px]">
        {Array.from({ length: Math.ceil(VERSION_TWO_CREATE_ITEMS.length / columns) }).map(
          (_, rowIndex) => (
            <div key={rowIndex} className="flex w-full items-center gap-[8px]">
              {VERSION_TWO_CREATE_ITEMS.slice(
                rowIndex * columns,
                rowIndex * columns + columns,
              ).map((item) => (
                <CreateStudyCard key={item.title} {...item} figmaCard />
              ))}
            </div>
          ),
        )}
      </div>
    </section>
  );
}

function VersionThreeCreateStudySetSection() {
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
  } | null>(null);
  const columns = 3;
  const scrollRowSize = columns;
  const scrollRows = [
    VERSION_THREE_CREATE_ITEMS.slice(0, scrollRowSize),
    VERSION_THREE_CREATE_ITEMS.slice(scrollRowSize),
  ];

  return (
    <section className="flex w-full flex-col items-start gap-[12px]">
      <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
        Create Study Set
      </h2>
      <div
        className="phone-scrollbar-hidden -mx-[20px] -my-[20px] w-[393px] cursor-grab overflow-x-auto py-[20px] active:cursor-grabbing"
        onPointerDown={(event) => {
          const target = event.currentTarget;
          dragStateRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: target.scrollLeft,
          };
          target.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const dragState = dragStateRef.current;
          if (!dragState) return;
          const deltaX = event.clientX - dragState.startX;
          event.currentTarget.scrollLeft =
            dragState.startScrollLeft - deltaX;
        }}
        onPointerUp={(event) => {
          const dragState = dragStateRef.current;
          if (!dragState) return;
          if (event.currentTarget.hasPointerCapture(dragState.pointerId)) {
            event.currentTarget.releasePointerCapture(dragState.pointerId);
          }
          dragStateRef.current = null;
        }}
        onPointerCancel={(event) => {
          const dragState = dragStateRef.current;
          if (
            dragState &&
            event.currentTarget.hasPointerCapture(dragState.pointerId)
          ) {
            event.currentTarget.releasePointerCapture(dragState.pointerId);
          }
          dragStateRef.current = null;
        }}
      >
        <div className="flex w-full flex-col gap-[8px] px-[20px]">
          {scrollRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-full items-center gap-[8px]">
              {row.map((item) => (
                <CreateStudyCard key={item.title} {...item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudySetIcon({ type }: { type: (typeof STUDY_SETS)[number]["icon"] }) {
  if (type === "mic") {
    return (
      <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden">
        <img
          src={`${ASSET}/group1000007367.svg`}
          alt=""
          draggable={false}
          className="absolute left-1/2 top-1/2 h-[25px] w-[19px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className="relative h-[40px] w-[40px] shrink-0">
        <div className="absolute left-[7px] top-[8px] h-[24px] w-[25px] rounded-[5.333px] bg-[#FFA006]" />
        <img
          src={`${ASSET}/group1000007568.svg`}
          alt=""
          draggable={false}
          className="absolute left-1/2 top-1/2 h-[16px] w-[19px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    );
  }

  return (
    <div className="relative h-[40px] w-[40px] shrink-0">
      <img
        src={`${ASSET}/group2087325584.svg`}
        alt=""
        draggable={false}
        className="absolute left-1/2 top-[6px] h-[27px] w-[27px] -translate-x-1/2"
      />
    </div>
  );
}

function StudySetRow({ item }: { item: (typeof STUDY_SETS)[number] }) {
  return (
    <div className="flex w-full items-center justify-center gap-[10px] rounded-[24px] border border-[#EEEEEE] bg-white p-[16px]">
      <StudySetIcon type={item.icon} />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[6px]">
        <p className="m-0 line-clamp-2 text-[16px] font-medium leading-[1.4] text-[#111111]">
          {item.title}
        </p>
        <div className="flex items-center gap-[6px] text-[13px] leading-none text-[#989B9E]">
          <span>2024/12/12, 20:39</span>
          {item.solvi ? (
            <span className="flex items-center gap-[4px]">
              <span className="relative h-[14px] w-[14px] overflow-hidden rounded-full">
                <img
                  src={`${ASSET}/ellipse1700.svg`}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </span>
              <span>Solvi</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function VersionOneHeader() {
  return (
    <div className="absolute left-0 right-0 top-[44px] z-20 flex h-[66px] items-center justify-between bg-[#F6F8FA] px-[20px] py-[16px]">
      <div className="flex flex-col items-start gap-[6px]">
        <h1 className="m-0 font-[var(--font-poppins)] text-[20px] font-bold leading-[18px] text-[#111111]">
          Solve. Study. Exam Prep
        </h1>
      </div>
      <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full bg-[#B1D5FF]">
        <img
          src={`${ASSET}/group1000007321.svg`}
          alt=""
          draggable={false}
          className="absolute left-[3px] top-[7px] h-[46px] w-[31px] -rotate-8"
        />
      </div>
    </div>
  );
}

function VersionTwoHeader() {
  return (
    <div className="absolute left-0 right-0 top-[54px] z-20 flex h-[56px] items-center justify-between bg-[#F6F8FA] px-[20px] py-[16px]">
      <div className="flex flex-col items-start gap-[6px]">
        <h1 className="m-0 font-[var(--font-poppins)] text-[20px] font-bold leading-[18px] text-[#111111]">
          Solve. Study. Master
        </h1>
        <p className="m-0 text-[12px] font-normal capitalize leading-[12px] text-[#989B9E]">
          Al notes from new recording are ready
        </p>
      </div>
      <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full bg-[#B1D5FF]">
        <img
          src={`${ASSET}/group1000007321.svg`}
          alt=""
          draggable={false}
          className="absolute left-[3px] top-[7px] h-[46px] w-[31px] -rotate-8"
        />
      </div>
    </div>
  );
}

function VersionThreeHeader() {
  return (
    <div className="absolute left-0 right-0 top-[44px] z-20 flex h-[66px] items-center justify-between bg-[#F6F8FA] px-[20px] py-[16px]">
      <div className="flex flex-col items-start gap-[6px]">
        <h1 className="m-0 font-[var(--font-poppins)] text-[20px] font-bold leading-[18px] text-[#111111]">
          Solve. Study. Exam Prep
        </h1>
      </div>
      <div className="relative h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full bg-[#B1D5FF]">
        <img
          src={`${ASSET}/group1000007321.svg`}
          alt=""
          draggable={false}
          className="absolute left-[3px] top-[7px] h-[46px] w-[31px] -rotate-8"
        />
      </div>
    </div>
  );
}

const UPLOAD_MENU_ITEMS = [
  { label: "Record", icon: `${ASSET}/menu-record@3x.png` },
  { label: "Camera", icon: `${ASSET}/menu-camera@3x.png` },
  { label: "Photos", icon: `${ASSET}/menu-photos@3x.png` },
  { label: "File upload", icon: `${ASSET}/menu-file-upload@3x.png` },
  { label: "Text", icon: `${ASSET}/menu-text@3x.png` },
  { label: "Link", icon: `${ASSET}/menu-link@3x.png` },
] as const;

function VersionOneTopStudyActions() {
  return (
    <div className="flex w-full items-center gap-[8px]">
      <img
        src={`${ASSET}/top-card-snap-solve@3x.png`}
        alt=""
        draggable={false}
        className="block h-[120px] min-w-0 flex-1 rounded-[20px] object-contain"
      />
      <img
        src={`${ASSET}/top-card-record@3x.png`}
        alt=""
        draggable={false}
        className="block h-[120px] w-[150px] shrink-0 rounded-[20px] object-contain"
      />
    </div>
  );
}

function VersionTwoTopStudyActions() {
  return (
    <div className="flex w-full items-center gap-[8px]">
      <div className="flex h-[160px] min-w-0 flex-1 flex-col items-start justify-between rounded-[24px] bg-[linear-gradient(124deg,#1D47FE_0%,#4A9DFC_100%)] px-[16px] py-[20px]">
        <div className="flex flex-col items-start gap-[8px] whitespace-nowrap">
          <div className="text-[22px] font-bold leading-[22px] text-white">
            Snap&amp;Solve
          </div>
          <div className="text-[16px] font-medium leading-[16px] text-white/60">
            Step by Step
          </div>
        </div>
        <div className="flex w-full items-end justify-end">
          <img
            src={`${ASSET}/frame2147226127.svg`}
            alt=""
            draggable={false}
            className="h-[56px] w-[56px]"
          />
        </div>
      </div>
      <div className="flex h-[160px] w-[150px] shrink-0 flex-col items-start justify-between rounded-[24px] bg-[linear-gradient(299deg,#7D74FB_0%,#4E0EFE_100%)] p-[20px]">
        <div className="flex flex-col items-start gap-[8px] whitespace-nowrap">
          <div className="text-[18px] font-bold leading-[22px] text-white">
            Record Class
          </div>
          <div className="text-[16px] font-medium leading-[16px] text-white/60">
            Lecture Note
          </div>
        </div>
        <div className="flex w-full items-center justify-end">
          <img
            src={`${ASSET}/frame2147226124.svg`}
            alt=""
            draggable={false}
            className="h-[56px] w-[56px]"
          />
        </div>
      </div>
    </div>
  );
}

function VersionThreeTopStudyActions() {
  return (
    <div className="flex w-full items-center gap-[8px]">
      <img
        src={`${ASSET}/top-card-snap-solve@3x.png`}
        alt=""
        draggable={false}
        className="block h-[120px] min-w-0 flex-1 rounded-[20px] object-contain"
      />
      <img
        src={`${ASSET}/top-card-record@3x.png`}
        alt=""
        draggable={false}
        className="block h-[120px] w-[150px] shrink-0 rounded-[20px] object-contain"
      />
    </div>
  );
}

function HomeUploadMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`absolute inset-0 z-[120] ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="Close upload menu"
        className="absolute inset-0 border-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_50%,#FFFFFF_100%)] p-0 backdrop-blur-[8px]"
        onClick={onClose}
        tabIndex={-1}
        style={{
          opacity: open ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "240ms",
          transitionTimingFunction: "ease-out",
          transitionDelay: open ? "60ms" : "0ms",
          willChange: "opacity",
          transform: "translateZ(0)",
        }}
      />
      <div className="pointer-events-none absolute bottom-[120px] right-[20px] flex w-[173px] flex-col items-end gap-[4px]">
        {UPLOAD_MENU_ITEMS.map((item, index) => (
          <div
            key={item.label}
            className="flex h-[64px] w-[173px] items-center justify-between rounded-full py-[8px] pl-[16px] pr-[8px]"
            style={{
              opacity: open ? 1 : 0,
              transform: open
                ? "translateY(0)"
                : "translateY(32px)",
              transitionProperty: "opacity, transform",
              transitionDuration: open ? "180ms, 260ms" : "80ms, 120ms",
              transitionTimingFunction: open
                ? "ease, cubic-bezier(0.34, 1.42, 0.64, 1)"
                : "ease, cubic-bezier(0.4, 0, 1, 1)",
              transitionDelay: open ? `${index * 26}ms` : "0ms",
            }}
          >
            <span className="text-center text-[16px] font-semibold leading-[16px] text-[#111111]">
              {item.label}
            </span>
            <img
              src={item.icon}
              alt=""
              draggable={false}
              className="h-[48px] w-[48px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeV2BottomBar({
  activeTab,
  onTabChange,
  uploadOpen,
  onToggleUpload,
}: {
  activeTab: HomeV2Tab;
  onTabChange: (tab: HomeV2Tab) => void;
  uploadOpen: boolean;
  onToggleUpload: () => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 z-[130] flex w-full flex-col items-start">
      <HomeV2BottomBarContent
        activeTab={activeTab}
        onTabChange={onTabChange}
        uploadOpen={uploadOpen}
        onToggleUpload={onToggleUpload}
      />
    </div>
  );
}

function HomeV2BottomBarContent({
  activeTab,
  onTabChange,
  uploadOpen = false,
  onToggleUpload,
}: {
  activeTab: HomeV2Tab;
  onTabChange: (tab: HomeV2Tab) => void;
  uploadOpen?: boolean;
  onToggleUpload?: () => void;
}) {
  const showPlus = activeTab === "study";
  const activeIsSolve = activeTab === "solve";

  return (
    <>
      <div
        className="flex w-full items-center justify-between px-[24px] pb-[8px] pt-[16px]"
      >
        <div
          className="relative z-0 flex h-[62px] w-[243px] items-center overflow-hidden rounded-full p-[4px] shadow-[0_12px_24px_rgba(0,0,0,0.12)] backdrop-blur-[6px]"
          style={{
            background: activeIsSolve
              ? "rgba(0, 0, 0, 0.3)"
              : "rgba(255, 255, 255, 0.6)",
            boxShadow: activeIsSolve
              ? "0px 12px 24px rgba(0, 0, 0, 0.12), inset 0.5px 0.5px 0px rgba(255, 255, 255, 0.6), inset -0.5px -0.5px 0px rgba(255, 255, 255, 0.6)"
              : "0px 12px 24px rgba(0, 0, 0, 0.12)",
            opacity: uploadOpen ? 0 : 1,
            transform: activeIsSolve
              ? "translate3d(51px, 0, 0)"
              : "translate3d(0, 0, 0)",
            transition:
              "opacity 120ms ease, transform 360ms cubic-bezier(0.32, 0.72, 0, 1)",
            willChange: "transform, opacity",
          }}
        >
          <span
            className="absolute bottom-[4px] left-[4px] top-[4px] rounded-full bg-black/5"
            style={{
              background: activeIsSolve
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
              width: "calc((100% - 8px) / 2)",
              transform: activeIsSolve ? "translateX(100%)" : "translateX(0)",
              transition:
                "background 180ms ease, transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
            }}
          />
          <button
            type="button"
            onClick={() => onTabChange("study")}
            className="relative z-10 flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-full border-0 bg-transparent px-[8px] py-[6px]"
          >
            <span className="relative h-[28px] w-[28px]">
              <img
                src={
                  activeIsSolve
                    ? `${ASSET}/tab-study-inactive-dark-figma.svg`
                    : `${ASSET}/tab-study-active-figma.svg`
                }
                alt=""
                draggable={false}
                className="absolute left-1/2 top-1/2 h-[24px] w-[24px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span
              className="text-center text-[10px] font-semibold leading-[12px]"
              style={{
                color: activeIsSolve ? "rgba(255, 255, 255, 0.6)" : "#007AFF",
                transition: "color 180ms ease",
              }}
            >
              Study
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("solve")}
            className="relative z-10 flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-full border-0 bg-transparent px-[8px] py-[6px]"
          >
            <span className="relative h-[28px] w-[28px]">
              <img
                src={
                  activeIsSolve
                    ? `${ASSET}/tab-solve-active-dark-figma.svg`
                    : `${ASSET}/tab-solve-inactive-figma.svg`
                }
                alt=""
                draggable={false}
                className="absolute left-1/2 top-1/2 h-[22px] w-[24px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span
              className="text-center text-[10px] font-semibold leading-[12px]"
              style={{
                color: activeIsSolve ? "#51A9FE" : "#989B9E",
                transition: "color 180ms ease",
              }}
            >
              Solve
            </span>
          </button>
        </div>
        <button
          type="button"
          onClick={onToggleUpload}
          className="relative h-[62px] w-[62px] overflow-hidden rounded-full border-0 bg-[#007AFF] p-0 shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
          style={{
            zIndex: uploadOpen ? 140 : 0,
            opacity: showPlus ? 1 : 0,
            pointerEvents: showPlus ? "auto" : "none",
            transform: showPlus ? "scale(1)" : "scale(0.72)",
            transition: showPlus
              ? "opacity 140ms ease, transform 220ms cubic-bezier(0.32, 0.72, 0, 1)"
              : "transform 120ms cubic-bezier(0.4, 0, 1, 1), opacity 90ms ease 70ms",
            willChange: "transform, opacity",
          }}
          tabIndex={showPlus ? 0 : -1}
        >
          <img
            src={`${ASSET}/plus.svg`}
            alt=""
            draggable={false}
            className="absolute left-1/2 top-1/2 h-[28px] w-[28px] transition-transform duration-240 ease-out"
            style={{
              transform: uploadOpen
                ? "translate(-50%, -50%) rotate(45deg)"
                : "translate(-50%, -50%) rotate(0deg)",
            }}
          />
          <div className="absolute inset-0 rounded-full shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_white]" />
        </button>
      </div>
      <div className="relative h-[34px] w-full">
        <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
      </div>
    </>
  );
}

function VersionThreeBottomBar({
  activeTab,
  onTabChange,
  uploadOpen,
  onToggleUpload,
}: {
  activeTab: HomeV2Tab;
  onTabChange: (tab: HomeV2Tab) => void;
  uploadOpen: boolean;
  onToggleUpload: () => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 z-[130] flex w-full flex-col items-start">
      <VersionThreeBottomBarContent
        activeTab={activeTab}
        onTabChange={onTabChange}
        uploadOpen={uploadOpen}
        onToggleUpload={onToggleUpload}
      />
    </div>
  );
}

function VersionThreeBottomBarContent({
  activeTab,
  onTabChange,
  uploadOpen,
  onToggleUpload,
}: {
  activeTab: HomeV2Tab;
  onTabChange: (tab: HomeV2Tab) => void;
  uploadOpen: boolean;
  onToggleUpload: () => void;
}) {
  const showPlus = activeTab === "study";
  const activeIsSolve = activeTab === "solve";

  return (
    <>
      <div className="flex w-full items-center justify-between px-[24px] pb-[8px] pt-[16px]">
        <div
          className="relative flex h-[62px] w-[243px] shrink-0 items-center overflow-hidden rounded-[100px] p-[4px] shadow-[0_8px_40px_rgba(0,0,0,0.14)]"
          style={{
            background: activeIsSolve ? "rgba(0, 0, 0, 0.3)" : undefined,
            backdropFilter: activeIsSolve ? "blur(6px)" : undefined,
            WebkitBackdropFilter: activeIsSolve ? "blur(6px)" : undefined,
            opacity: uploadOpen ? 0 : 1,
            transform: activeIsSolve
              ? "translate3d(51px, 0, 0)"
              : "translate3d(0, 0, 0)",
            transition:
              "opacity 120ms ease, transform 360ms cubic-bezier(0.32, 0.72, 0, 1), background 260ms ease, border-color 260ms ease",
            willChange: "transform, opacity",
          }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[100px]">
            {activeIsSolve ? (
              <div
                className="absolute inset-0 rounded-[100px]"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              />
            ) : (
              <>
                <div className="absolute inset-0 rounded-[100px] bg-white/[0.65]" />
                <div className="absolute inset-0 rounded-[100px] bg-[#DDDDDD] mix-blend-color-burn" />
                <div className="absolute inset-0 rounded-[100px] bg-[#F7F7F7] mix-blend-darken backdrop-blur-[6px]" />
              </>
            )}
          </div>
          {activeIsSolve ? (
            <span
              aria-hidden="true"
              className="absolute bottom-[4px] left-[calc(50%)] top-[4px] rounded-[100px] bg-[#121212] mix-blend-plus-lighter"
              style={{ width: "calc((100% - 8px) / 2)" }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="absolute bottom-[4px] left-[4px] top-[4px] rounded-[100px] bg-[#EDEDED]"
              style={{
                width: "calc((100% - 8px) / 2)",
              }}
            />
          )}
          <button
            type="button"
            onClick={() => onTabChange("study")}
            className="relative z-10 flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-[100px] border-0 bg-transparent px-[8px] py-[6px]"
          >
            <span className="relative h-[28px] w-[28px] shrink-0 overflow-hidden">
              <img
                src={
                  activeIsSolve
                    ? `${ASSET}/v3-tab-study-inactive-dark.svg`
                    : `${ASSET}/v3-tab-study-active.svg`
                }
                alt=""
                draggable={false}
                className="absolute left-1/2 top-1/2 h-[24px] w-[24px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span
              className="w-full text-center text-[10px] font-semibold leading-[12px] tracking-[-0.1px]"
              style={{
                color: activeIsSolve ? "#FFFFFF" : "#007AFF",
              }}
            >
              Study
            </span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange("solve")}
            className="relative z-10 flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-[100px] border-0 bg-transparent px-[8px] py-[6px]"
          >
            <span className="relative h-[28px] w-[28px] shrink-0 overflow-hidden">
              <img
                src={
                  activeIsSolve
                    ? `${ASSET}/v3-tab-solve-active-dark.svg`
                    : `${ASSET}/v3-tab-solve-inactive.svg`
                }
                alt=""
                draggable={false}
                className="absolute left-1/2 top-1/2 h-[22px] w-[24px] -translate-x-1/2 -translate-y-1/2"
              />
            </span>
            <span
              className="w-full text-center text-[10px] font-semibold leading-[12px] tracking-[-0.1px]"
              style={{
                color: activeIsSolve ? "#51A9FE" : "#111111",
              }}
            >
              Solve
            </span>
          </button>
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow: activeIsSolve
                ? "inset 1px 1px 0 rgba(255,255,255,0.6), inset -1px -1px 0 rgba(255,255,255,0.6)"
                : "inset 1px 1px 0 white, inset -1px -1px 0 white",
            }}
          />
        </div>
        <div
          className="relative flex h-[62px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-[100px] shadow-[0_8px_40px_rgba(0,0,0,0.14)]"
          style={{
            zIndex: uploadOpen ? 140 : 0,
            opacity: showPlus ? 1 : 0,
            pointerEvents: showPlus ? "auto" : "none",
            transform: showPlus ? "scale(1)" : "scale(0.72)",
            transition: showPlus
              ? "opacity 140ms ease, transform 220ms cubic-bezier(0.32, 0.72, 0, 1)"
              : "transform 120ms cubic-bezier(0.4, 0, 1, 1), opacity 90ms ease 70ms",
            willChange: "transform, opacity",
          }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[100px] bg-[#007AFF] backdrop-blur-[6px]" />
          <button
            type="button"
            onClick={onToggleUpload}
            className="relative z-10 flex h-[62px] w-[62px] items-center justify-center rounded-[100px] border-0 bg-transparent p-0"
            tabIndex={showPlus ? 0 : -1}
          >
            <img
              src={`${ASSET}/v3-plus.svg`}
              alt=""
              draggable={false}
              className="h-[28px] w-[28px] transition-transform duration-240 ease-out"
              style={{
                transform: uploadOpen ? "rotate(45deg)" : "rotate(0deg)",
              }}
            />
          </button>
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_1px_1px_0_#B3D7FF,inset_-1px_-1px_0_#B3D7FF]" />
        </div>
      </div>
      <div className="relative h-[34px] w-full">
        <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
      </div>
    </>
  );
}

export function HomeV2Preview({
  experiment = "version-1",
}: {
  experiment?: HomeExperimentVariant;
}) {
  if (experiment === "version-2") return <HomeVersionTwoPreview />;
  if (experiment === "version-3") return <HomeVersionThreePreview />;
  return <HomeVersionOnePreview />;
}

function HomeVersionOnePreview() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HomeV2Tab>("study");

  const changeTab = (tab: HomeV2Tab) => {
    setActiveTab(tab);
    setUploadOpen(false);
  };

  return (
    <DemoCanvas
      mode="fill"
      background={activeTab === "solve" ? "#FFFFFF" : "#F6F8FA"}
    >
      <div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ background: activeTab === "solve" ? "#FFFFFF" : "#F6F8FA" }}
      >
        {activeTab === "solve" ? (
          <HomePreview
            hideGuidedPopover
            showModeSegment={false}
            bottomBar={
              <div
                aria-hidden="true"
                style={{ height: SOLVE_CAPTURE_TABBAR_SPACER_H }}
              />
            }
          />
        ) : (
          <>
            <VersionOneHeader />
            <div className="phone-scrollbar-hidden absolute inset-x-0 bottom-0 top-[110px] overflow-y-auto pb-[160px]">
              <div className="flex w-full flex-col items-start gap-[24px] px-[20px] py-[8px]">
                <VersionOneTopStudyActions />

                <VersionOneCreateStudySetSection />

                <section className="flex w-full flex-col items-start gap-[12px]">
                  <div className="flex w-full items-center justify-between">
                    <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
                      All study sets
                    </h2>
                    <div className="flex items-center gap-[6px] text-[14px] font-medium leading-[24px] text-[#595C60]">
                      <span>Recent</span>
                      <img src={`${ASSET}/sort.svg`} alt="" draggable={false} className="h-[20px] w-[20px]" />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-[8px]">
                    {STUDY_SETS.map((item, index) => (
                      <StudySetRow key={`${item.title}-${index}`} item={item} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[160px] w-[393px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)] backdrop-blur-[4px]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.58) 62%, black 100%)",
                maskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.58) 62%, black 100%)",
              }}
            />
            <HomeUploadMenu
              open={uploadOpen}
              onClose={() => setUploadOpen(false)}
            />
          </>
        )}
        <HomeV2BottomBar
          activeTab={activeTab}
          onTabChange={changeTab}
          uploadOpen={uploadOpen}
          onToggleUpload={() => setUploadOpen((open) => !open)}
        />
      </div>
    </DemoCanvas>
  );
}

function HomeVersionTwoPreview() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HomeV2Tab>("study");

  const changeTab = (tab: HomeV2Tab) => {
    setActiveTab(tab);
    setUploadOpen(false);
  };

  return (
    <DemoCanvas
      mode="fill"
      background={activeTab === "solve" ? "#FFFFFF" : "#F6F8FA"}
    >
      <div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ background: activeTab === "solve" ? "#FFFFFF" : "#F6F8FA" }}
      >
        {activeTab === "solve" ? (
          <HomePreview
            hideGuidedPopover
            showModeSegment={false}
            bottomBar={
              <div
                aria-hidden="true"
                style={{ height: SOLVE_CAPTURE_TABBAR_SPACER_H }}
              />
            }
          />
        ) : (
          <>
            <VersionTwoHeader />
            <div className="phone-scrollbar-hidden absolute inset-x-0 bottom-0 top-[110px] overflow-y-auto pb-[160px]">
              <div className="flex w-full flex-col items-start gap-[24px] px-[20px] py-[8px]">
                <VersionTwoTopStudyActions />

                <VersionTwoCreateStudySetSection />

                <section className="flex w-full flex-col items-start gap-[12px]">
                  <div className="flex w-full items-center justify-between">
                    <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
                      All study sets
                    </h2>
                    <div className="flex items-center gap-[6px] text-[14px] font-medium leading-[24px] text-[#595C60]">
                      <span>Recent</span>
                      <img src={`${ASSET}/sort.svg`} alt="" draggable={false} className="h-[20px] w-[20px]" />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-[8px]">
                    {STUDY_SETS.map((item, index) => (
                      <StudySetRow key={`${item.title}-${index}`} item={item} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[160px] w-[393px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)] backdrop-blur-[4px]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.58) 62%, black 100%)",
                maskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.58) 62%, black 100%)",
              }}
            />
            <HomeUploadMenu
              open={uploadOpen}
              onClose={() => setUploadOpen(false)}
            />
          </>
        )}
        <HomeV2BottomBar
          activeTab={activeTab}
          onTabChange={changeTab}
          uploadOpen={uploadOpen}
          onToggleUpload={() => setUploadOpen((open) => !open)}
        />
      </div>
    </DemoCanvas>
  );
}

function HomeVersionThreePreview() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HomeV2Tab>("study");

  const changeTab = (tab: HomeV2Tab) => {
    setActiveTab(tab);
    setUploadOpen(false);
  };

  return (
    <DemoCanvas
      mode="fill"
      background={activeTab === "solve" ? "#FFFFFF" : "#F6F8FA"}
    >
      <div
        className="absolute inset-0 select-none overflow-hidden"
        style={{ background: activeTab === "solve" ? "#FFFFFF" : "#F6F8FA" }}
      >
        {activeTab === "solve" ? (
          <HomePreview
            hideGuidedPopover
            showModeSegment={false}
            bottomBar={
              <div
                aria-hidden="true"
                style={{ height: SOLVE_CAPTURE_TABBAR_SPACER_H }}
              />
            }
          />
        ) : (
          <>
            <VersionThreeHeader />
            <div className="phone-scrollbar-hidden absolute inset-x-0 bottom-0 top-[110px] overflow-y-auto pb-[160px]">
              <div className="flex w-full flex-col items-start gap-[24px] px-[20px] py-[8px]">
                <VersionThreeTopStudyActions />

                <VersionThreeCreateStudySetSection />

                <section className="flex w-full flex-col items-start gap-[12px]">
                  <div className="flex w-full items-center justify-between">
                    <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
                      All study sets
                    </h2>
                    <div className="flex items-center gap-[6px] text-[14px] font-medium leading-[24px] text-[#595C60]">
                      <span>Recent</span>
                      <img src={`${ASSET}/sort.svg`} alt="" draggable={false} className="h-[20px] w-[20px]" />
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-[8px]">
                    {STUDY_SETS.map((item, index) => (
                      <StudySetRow key={`${item.title}-${index}`} item={item} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[160px] w-[393px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.8)_100%)] backdrop-blur-[4px]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.58) 62%, black 100%)",
                maskImage:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.58) 62%, black 100%)",
              }}
            />
            <HomeUploadMenu
              open={uploadOpen}
              onClose={() => setUploadOpen(false)}
            />
          </>
        )}
        <VersionThreeBottomBar
          activeTab={activeTab}
          onTabChange={changeTab}
          uploadOpen={uploadOpen}
          onToggleUpload={() => setUploadOpen((open) => !open)}
        />
      </div>
    </DemoCanvas>
  );
}
