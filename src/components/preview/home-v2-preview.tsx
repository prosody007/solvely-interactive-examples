"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { DemoCanvas } from "./demo-canvas";

const ASSET = "/figma/home-v2";

const CREATE_ITEMS = [
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
    subtitle: "AI-powered exam prep",
    icon: `${ASSET}/group2087325616.svg`,
  },
  {
    title: "Podcast",
    subtitle: "Study hands-free",
    icon: `${ASSET}/podcast.svg`,
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
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="flex min-h-[118px] min-w-0 flex-1 flex-col justify-center gap-[8px] rounded-[24px] bg-white px-[16px] py-[12px] shadow-[0_12px_16px_rgba(0,0,0,0.06)]">
      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ECF5FF]">
        <img src={icon} alt="" draggable={false} className="h-[24px] w-[24px]" />
      </div>
      <div className="flex w-full flex-col items-start gap-[2px] pl-[2px]">
        <div className="text-[16px] font-semibold leading-[1.4] text-[#111111]">
          {title}
        </div>
        <div className="whitespace-nowrap text-[12px] leading-none text-[#989B9E]">
          {subtitle}
        </div>
      </div>
    </div>
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
        <p className="m-0 line-clamp-2 text-[16px] font-semibold leading-[1.4] text-[#111111]">
          {item.title}
        </p>
        <div className="flex items-center gap-[6px] text-[13px] leading-none text-[#989B9E]">
          <span>2024/12/12, 20:39</span>
          {item.solvi ? (
            <span className="flex items-center gap-[4px]">
              <span className="relative h-[14px] w-[14px] overflow-hidden rounded-full">
                <img
                  src={`${ASSET}/32.png`}
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

function HomeV2Header() {
  return (
    <div className="absolute left-0 right-0 top-[44px] z-20 flex h-[66px] items-center justify-between bg-[#F6F8FA] px-[20px] py-[16px]">
      <div className="flex flex-col items-start gap-[6px]">
        <h1 className="m-0 font-[var(--font-poppins)] text-[20px] font-bold leading-[18px] text-[#111111]">
          Solve. Study. Master
        </h1>
        <p className="m-0 text-[12px] leading-[12px] text-[#989B9E]">
          AI notes from new recording are ready
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

const UPLOAD_MENU_ITEMS = [
  { label: "Record", icon: `${ASSET}/menu-record@3x.png` },
  { label: "Camera", icon: `${ASSET}/menu-camera@3x.png` },
  { label: "Photos", icon: `${ASSET}/menu-photos@3x.png` },
  { label: "File upload", icon: `${ASSET}/menu-file-upload@3x.png` },
  { label: "Text", icon: `${ASSET}/menu-text@3x.png` },
  { label: "Link", icon: `${ASSET}/menu-link@3x.png` },
] as const;

function HomeUploadMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`absolute inset-0 z-[120] transition-opacity duration-240 ease-out ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close upload menu"
        className="absolute inset-0 border-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_50%,#FFFFFF_100%)] p-0 backdrop-blur-[8px]"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="pointer-events-none absolute bottom-[64px] right-[40px] flex w-[173px] flex-col items-end gap-[4px]">
        {UPLOAD_MENU_ITEMS.map((item, index) => (
          <div
            key={item.label}
            className="flex w-[173px] items-center justify-between rounded-full py-[8px] pl-[16px] pr-[8px]"
            style={{
              opacity: open ? 1 : 0,
              transform: open
                ? "translateY(0) scale(1)"
                : "translateY(14px) scale(0.94)",
              transitionProperty: "opacity, transform",
              transitionDuration: "180ms, 260ms",
              transitionTimingFunction: "ease, cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: open
                ? `${index * 26}ms`
                : `${(UPLOAD_MENU_ITEMS.length - 1 - index) * 14}ms`,
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
  uploadOpen,
  onToggleUpload,
}: {
  uploadOpen: boolean;
  onToggleUpload: () => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 z-[130] flex w-full flex-col items-start">
      <div className="flex w-full items-center justify-between px-[24px] pb-[8px] pt-[16px]">
        <div className="flex w-[243px] items-center overflow-hidden rounded-full border border-white bg-white/60 p-[4px] shadow-[0_12px_24px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-full bg-black/5 px-[8px] py-[6px]">
            <img
              src={`${ASSET}/tabIconHistorySele.svg`}
              alt=""
              draggable={false}
              className="h-[28px] w-[28px]"
            />
            <span className="text-center text-[10px] font-semibold leading-[12px] text-[#007AFF]">
              Study
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[2px] rounded-full px-[8px] py-[6px]">
            <span className="relative h-[28px] w-[28px]">
              <img
                src={`${ASSET}/scanIconContainer.svg`}
                alt=""
                draggable={false}
                className="absolute left-[4px] top-[5px] h-[18px] w-[20px]"
              />
            </span>
            <span className="text-center text-[10px] font-semibold leading-[12px] text-[#989B9E]">
              Solve
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleUpload}
          className="relative h-[62px] w-[62px] overflow-hidden rounded-full border-0 bg-white/60 p-0 shadow-[0_12px_24px_rgba(0,0,0,0.12)] backdrop-blur-[6px]"
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
    </div>
  );
}

export function HomeV2Preview() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <DemoCanvas mode="fill" background="#F6F8FA">
      <div className="absolute inset-0 select-none overflow-hidden bg-[#F6F8FA]">
        <HomeV2Header />
        <div className="phone-scrollbar-hidden absolute inset-x-0 bottom-0 top-[110px] overflow-y-auto pb-[160px]">
          <div className="flex w-full flex-col items-start gap-[24px] px-[20px] py-[8px]">
            <div className="flex w-full items-center gap-[8px]">
              <div className="flex h-[160px] min-w-0 flex-1 flex-col justify-between rounded-[24px] bg-[linear-gradient(124deg,#1D47FE_0%,#4A9DFC_100%)] px-[16px] py-[20px]">
                <div className="flex flex-col items-start gap-[8px] whitespace-nowrap">
                  <div className="text-[22px] font-bold leading-[22px] text-white">
                    Snap&amp;Solve
                  </div>
                  <div className="text-[16px] font-medium leading-[16px] text-white/60">
                    Step by Step
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  <img
                    src={`${ASSET}/frame2147226127.svg`}
                    alt=""
                    draggable={false}
                    className="h-[56px] w-[56px]"
                  />
                </div>
              </div>
              <div className="flex h-[160px] w-[154px] shrink-0 flex-col justify-between rounded-[24px] bg-[linear-gradient(119deg,#4E0EFE_0%,#7D74FB_100%)] p-[20px]">
                <div className="flex flex-col items-start gap-[8px] whitespace-nowrap">
                  <div className="text-[18px] font-bold leading-[22px] text-white">
                    Record Class
                  </div>
                  <div className="text-[16px] font-medium leading-[16px] text-white/60">
                    Lecture Note
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  <img
                    src={`${ASSET}/frame2147226124.svg`}
                    alt=""
                    draggable={false}
                    className="h-[56px] w-[56px]"
                  />
                </div>
              </div>
            </div>

            <section className="flex w-full flex-col items-start gap-[12px]">
              <h2 className="m-0 font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.3] text-[#111111]">
                Create Study Set
              </h2>
              <div className="flex w-full flex-col gap-[8px]">
                {[0, 2, 4].map((start) => (
                  <div key={start} className="flex w-full items-center gap-[8px]">
                    <CreateStudyCard {...CREATE_ITEMS[start]} />
                    <CreateStudyCard {...CREATE_ITEMS[start + 1]} />
                  </div>
                ))}
              </div>
            </section>

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
        <HomeV2BottomBar
          uploadOpen={uploadOpen}
          onToggleUpload={() => setUploadOpen((open) => !open)}
        />
      </div>
    </DemoCanvas>
  );
}
