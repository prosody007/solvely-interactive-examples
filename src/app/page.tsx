"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HomePreview } from "@/components/preview/home-preview";
import {
  HomeV2Preview,
  type HomeExperimentVariant,
} from "@/components/preview/home-v2-preview";
import {
  StudyPreview,
  type StudyExperimentVariant,
} from "@/components/preview/study-preview";
import { TutorPreview } from "@/components/preview/tutor-preview";
import {
  FlashCardFlipSwipeAwayPreview,
  FlashCardTransitionPreview,
} from "@/components/preview/card-flip-preview";

type ScreenKey =
  | "home"
  | "solve"
  | "study"
  | "onboarding"
  | "tutor"
  | "flash-card-stack"
  | "flash-card-flip-swipe-away"
  | "paywall"
  | "practice-game";

type StudyExperiment = StudyExperimentVariant;
type HomeExperiment = HomeExperimentVariant;

const SCREENS: {
  key: ScreenKey;
  title: string;
  href: string;
}[] = [
  {
    key: "home",
    title: "Home",
    href: "/home",
  },
  {
    key: "solve",
    title: "Solve",
    href: "/solve",
  },
  {
    key: "study",
    title: "Study",
    href: "/study",
  },
  {
    key: "onboarding",
    title: "Onboarding",
    href: "/onboarding",
  },
  {
    key: "tutor",
    title: "Tutor",
    href: "/tutor",
  },
  {
    key: "flash-card-stack",
    title: "Flash Card Stack",
    href: "/flash-card-stack",
  },
  {
    key: "flash-card-flip-swipe-away",
    title: "Flash Card Flip Swipe Away",
    href: "/flash-card-flip-swipe-away",
  },
  {
    key: "paywall",
    title: "Paywall",
    href: "/paywall",
  },
  {
    key: "practice-game",
    title: "PRACTICE game",
    href: "/practice-game",
  },
];

const NAV_GROUPS: {
  label: string;
  keys: ScreenKey[];
}[] = [
  {
    label: "Solvely",
    keys: [
      "home",
      "solve",
      "study",
      "tutor",
      "flash-card-stack",
      "flash-card-flip-swipe-away",
      "practice-game",
    ],
  },
  {
    label: "商业化",
    keys: ["onboarding", "paywall"],
  },
];

const screenByKey = Object.fromEntries(
  SCREENS.map((screen) => [screen.key, screen]),
) as Record<ScreenKey, (typeof SCREENS)[number]>;

function getActiveScreen(pathname: string): (typeof SCREENS)[number] {
  return SCREENS.find((screen) => screen.href === pathname) ?? SCREENS[0];
}

const PHONE_DROP_SHADOW =
  "drop-shadow(20px 20px 60px rgba(251, 233, 217, 0.7)) drop-shadow(140px 100px 240px rgba(28, 19, 14, 0.4))";

const PHONE_PRESET = {
  W: 437,
  H: 890,
  SCREEN_OFFSET_X: 22,
  SCREEN_OFFSET_Y: 21,
  SCREEN_W: 393,
  SCREEN_H: 852,
  SCREEN_RADIUS: 54,
  VISUAL_PAD_TOP: 140,
  VISUAL_PAD_RIGHT: 320,
  VISUAL_PAD_BOTTOM: 260,
  VISUAL_PAD_LEFT: 140,
  SCALE_BOOST: 1.43,
  BODY_NUDGE_X: 0,
  FRAME_NUDGE_Y: 2,
  framePngSrc: "/figma/category/phone-frame.png",
  dropShadow: PHONE_DROP_SHADOW,
} as const;

const PHONE_PREVIEW_GAP = 6;
const STUDY_EXPERIMENT_ACTIVE_COLOR = "rgba(0,0,0,0.88)";
const STUDY_EXPERIMENT_INACTIVE_COLOR = "rgba(0,0,0,0.45)";
const STUDY_EXPERIMENT_INDICATOR_GAP = 8;
const STUDY_EXPERIMENT_INDICATOR_W = 12;
const STUDY_EXPERIMENT_INDICATOR_H = 2;
const STUDY_EXPERIMENT_INDICATOR_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

let cachedPhoneScale: number | undefined;

function CommonStatusBar() {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[80] h-[54px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/common/status-bar.png"
        alt=""
        draggable={false}
        className="block h-[54px] w-full object-contain"
      />
    </div>
  );
}

function OnboardingScreen() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F6F8FA] select-none">
      <div className="absolute left-0 top-0 h-[552px] w-full overflow-hidden bg-[#F6F8FA]">
        <video
          className="h-full w-full object-cover"
          src="/videos/onboarding-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>

      <div className="absolute bottom-0 left-0 flex w-full flex-col items-start bg-white pt-[24px]">
        <div className="flex w-full flex-col items-center gap-[16px] px-[24px] pb-[16px] text-center">
          <h1 className="m-0 w-full font-[var(--font-poppins)] text-[24px] font-semibold leading-[1.4] text-[#111111]">
            Meet Your 1:1
            <br />
            Whiteboard Tutor
          </h1>
          <p className="m-0 w-full text-[16px] font-normal leading-[1.5] text-[#595C60]">
            Live visual lessons aligned with Common
            <br />
            Core. Ask anything as you learn.
          </p>
        </div>

        <div className="flex w-full flex-col items-start">
          <div className="flex w-full flex-col items-start px-[32px] pb-[16px] pt-[24px]">
            <AnimatedContinueButton />
          </div>

          <div className="relative h-[34px] w-full">
            <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#111111]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedContinueButton() {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className="flex h-[54px] w-full items-center justify-center rounded-full border-0 bg-[#007AFF] px-[16px] font-[var(--font-poppins)] text-[18px] font-semibold leading-[1.4] text-white"
      style={{
        transform: pressed ? "scale(0.965)" : "scale(1)",
        transition:
          "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 180ms ease",
        filter: pressed ? "brightness(0.94)" : "brightness(1)",
        transformOrigin: "center center",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      Continue
    </button>
  );
}

const FEATURE_ITEMS = [
  ["💎", "Professional, accurate problem solving"],
  ["🧠", "Flashcards & quizzes for QA and review"],
  ["🎙️", "Real-time class recording and notes"],
  ["🏆", "Exam prep with predictive practice"],
] as const;

const BENEFITS = [
  "Specialized Solvely AI",
  "Multi-Model Verified Answers",
  "Unlimited Access to Top Models",
  "Interactive Class Recording & AI Notes",
  "Practice Quizzes & Knowledge Check",
  "Smart Flashcards & Spaced Review",
  "Study Podcasts & Audio Summaries",
  "Master Exam Prep with Predictive Practice",
] as const;

const PLANS = [
  { count: "1", unit: "week", price: "$1.99/wk", original: "$6.99", active: true },
  { count: "1", unit: "month", price: "$8.99/mo", original: "$12.99", active: false },
  { count: "12", unit: "months", price: "$5.66/mo", original: "$67.99", active: false },
] as const;

const REVIEWS = [
  {
    text: "The accuracy is better than most of the other AI apps.",
    name: "@Aidan Walton",
    avatar: "/figma/paywall/avatar-aidan.png",
  },
  {
    text: "This app helps with a lot of different math word problems.",
    name: "@Sophia Campbell",
    avatar: "/figma/paywall/avatar-sophia.png",
  },
  {
    text: "Easily solves and explains college level calculus.",
    name: "@Joshua Blackburn",
    avatar: "/figma/paywall/avatar-joshua.png",
  },
] as const;

function PaywallScreen() {
  return (
    <div className="paywall absolute inset-0 select-none overflow-hidden">
      <div className="paywall-scroll h-full overflow-y-auto pb-[148px]">
        <PaywallTopBar />
        <PaywallHero />
        <section className="paywall-body relative z-10 -mt-[28px] rounded-t-[32px] px-[20px] pt-[24px]">
          <div className="flex flex-col items-center gap-[16px]">
            <h1 className="m-0 font-[var(--font-poppins)] text-[24px] font-bold leading-none text-[var(--paywall-text-strong)]">
              All-in-One Study Tool
            </h1>
            <div className="flex flex-col gap-[2px]">
              {FEATURE_ITEMS.map(([icon, text]) => (
                <div key={text} className="flex items-center gap-[4px] text-[14px] font-semibold leading-[1.3] text-[var(--paywall-text-strong)]">
                  <span className="flex h-[32px] w-[32px] items-center justify-center text-[18px]">
                    {icon}
                  </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <PlanCards />
          <BenefitsTable />
          <RatingBlock />
          <ReviewsBlock />
          <PaywallLinks />
        </section>
      </div>
      <PaywallBottomCta />
    </div>
  );
}

function PaywallTopBar() {
  return (
    <div className="paywall-top sticky top-0 z-30">
      <div className="relative h-[44px]" />
      <div className="flex h-[44px] items-center justify-between px-[24px] py-[6px]">
        <button className="border-0 bg-transparent p-0 text-[24px] leading-none text-[var(--paywall-text-strong)]" type="button">
          ‹
        </button>
        <button className="border-0 bg-transparent p-0 text-[12px] font-medium text-[var(--paywall-text-muted)]" type="button">
          Restore
        </button>
      </div>
    </div>
  );
}

function PaywallHero() {
  return (
    <section className="relative h-[200px] overflow-hidden">
      <Image
        src="/figma/paywall/banner-light.png"
        alt=""
        draggable={false}
        width={390}
        height={200}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
    </section>
  );
}

function PlanCards() {
  return (
    <div className="relative -mx-[12px] flex gap-[6px] px-[8px] py-[40px]">
      {PLANS.map((plan) => (
        <div
          key={plan.unit}
          className={`relative flex h-[170px] flex-1 flex-col items-center justify-center overflow-hidden rounded-[24px] px-[4px] pb-[4px] ${
            plan.active
              ? "border-2 border-[#007AFF] bg-[var(--paywall-plan-active)]"
              : "border border-[var(--paywall-border)] bg-[var(--paywall-card)]"
          }`}
        >
          <div className="flex h-[116px] flex-col items-center gap-[8px] py-[12px]">
            <div className="text-center text-[30px] font-semibold leading-none text-[var(--paywall-text-strong)]">
              {plan.count}
            </div>
            <div className="flex flex-col items-center gap-[6px]">
              <div className="text-[16px] font-medium leading-none text-[var(--paywall-text-muted)]">
                {plan.unit}
              </div>
              <div className={`rounded-[20px] px-[10px] py-[8px] text-[16px] font-bold leading-none ${
                plan.active
                  ? "bg-[#007AFF] text-[#EEF6FF]"
                  : "text-[#007AFF]"
              }`}>
                {plan.price}
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-[var(--paywall-border)]" />
          <div className="flex h-[50px] items-center justify-center text-[18px] font-bold leading-none text-[var(--paywall-text-strong)] line-through">
            {plan.original}
          </div>
        </div>
      ))}
      <div className="absolute right-[-4px] top-[52px] rotate-[15deg] rounded-full bg-gradient-to-r from-[#FF7700] to-[#FF0D00] px-[10px] py-[8px] text-[12px] font-bold leading-none text-white">
        SAVE 70%
      </div>
    </div>
  );
}

function BenefitsTable() {
  return (
    <section className="flex flex-col gap-[12px] pb-[40px]">
      <div className="flex items-center justify-between text-[16px] font-semibold text-[var(--paywall-text-muted)]">
        <span>Benefits</span>
        <div className="flex w-[110px] items-center justify-end gap-[16px]">
          <span>Free</span>
          <span className="text-[28px] font-bold leading-none text-[#FF6000]">∞</span>
        </div>
      </div>
      <div className="h-px w-full bg-[var(--paywall-border)]" />
      <div className="flex flex-col">
        {BENEFITS.map((benefit, index) => (
          <div
            key={benefit}
            className={`flex min-h-[56px] items-center gap-[8px] rounded-[12px] px-[12px] py-[14px] ${
              index % 2 === 0 ? "bg-[var(--paywall-benefit)]" : ""
            }`}
          >
            <div className="min-w-0 flex-1 text-[14px] font-medium leading-[1.5] text-[var(--paywall-text-strong)]">
              {benefit}
              {index === 2 ? (
                <div className="mt-[8px] flex gap-[4px] text-[10px] text-[var(--paywall-text-strong)]">
                  {["GPT-5", "Gemini", "Claude"].map((model) => (
                    <span key={model} className="rounded-full border border-[var(--paywall-border)] bg-[var(--paywall-card)] px-[8px] py-[4px]">
                      {model}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="flex w-[80px] items-center justify-between text-[20px] font-bold">
              <span className="text-[var(--paywall-text-muted)]">−</span>
              <span className="text-[#24D70D]">✓</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RatingBlock() {
  return (
    <section className="flex flex-col items-center gap-[20px] pb-[32px] text-center">
      <div className="relative h-[112px] w-[254px] text-[#FFA12B]">
        <div className="absolute left-0 top-[6px] text-[72px] leading-none">‹</div>
        <div className="absolute right-0 top-[6px] text-[72px] leading-none">›</div>
        <div className="pt-[4px] font-[var(--font-poppins)] text-[36px] font-bold leading-[1.2] text-[#FF9828]">
          4.8
        </div>
        <div className="text-[24px] leading-none">★★★★★</div>
        <div className="mt-[2px] text-[12px] font-semibold text-[var(--paywall-text-strong)]">
          Real App Store ratings
        </div>
      </div>
      <div className="text-[20px] font-bold leading-[1.4] text-[var(--paywall-title-brown)]">
        <p className="m-0">Trusted by 10,000,000+</p>
        <p className="m-0">students, parents and teachers</p>
      </div>
    </section>
  );
}

function ReviewsBlock() {
  return (
    <section className="-mx-[20px] flex gap-[10px] overflow-hidden px-[35px] pb-[24px] pt-[16px]">
      {REVIEWS.map((review) => (
        <article
          key={review.name}
          className="flex w-[320px] shrink-0 flex-col gap-[16px] rounded-[24px] border border-[var(--paywall-line)] bg-[var(--paywall-card)] p-[20px]"
        >
          <div className="text-[28px] font-bold leading-none text-[#FF7A00]">“</div>
          <div className="flex items-center justify-between gap-[12px]">
            <p className="m-0 flex-1 text-[14px] font-semibold leading-[1.5] text-[var(--paywall-text-strong)]">
              {review.text}
            </p>
            <Image
              src={review.avatar}
              alt=""
              width={72}
              height={72}
              draggable={false}
              className="h-[72px] w-[72px] rounded-[16px] object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[18px] tracking-[2px] text-[#FFCE4F]">★★★★★</span>
            <span className="text-[14px] text-[var(--paywall-text-muted)]">{review.name}</span>
          </div>
        </article>
      ))}
    </section>
  );
}

function PaywallLinks() {
  return (
    <div className="flex justify-center gap-[16px] px-[20px] pb-[120px] text-[12px] text-[var(--paywall-text-muted)] underline">
      <span>Terms & Conditions</span>
      <span>Privacy Policy</span>
      <span>Restore purchase</span>
    </div>
  );
}

function PaywallBottomCta() {
  return (
    <div className="paywall-bottom absolute bottom-0 left-0 z-40 flex w-full flex-col items-start">
      <div className="w-full px-[24px] pb-[8px] pt-[16px]">
        <div className="flex w-full flex-col items-center gap-[10px]">
          <PaywallContinueButton />
          <p className="m-0 text-center text-[12px] leading-[1.5] text-[var(--paywall-text-strong)]">
            Renews at $6.99 /wk, cancel anytime.
          </p>
        </div>
      </div>
      <div className="relative h-[34px] w-full">
        <div className="absolute bottom-[8px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[var(--paywall-home-indicator)]" />
      </div>
    </div>
  );
}

function PaywallContinueButton() {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className="flex h-[60px] w-full items-center justify-center rounded-full border-0 bg-[#FFCE4F] px-[70px] text-[20px] font-bold text-[#461702]"
      style={{
        transform: pressed ? "scale(0.965)" : "scale(1)",
        transition:
          "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 180ms ease",
        filter: pressed ? "brightness(0.95)" : "brightness(1)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      Continue
    </button>
  );
}

function PracticeGameScreen() {
  const [gameOpen, setGameOpen] = useState(false);
  const [gameClosing, setGameClosing] = useState(false);
  const openGame = () => {
    setGameClosing(false);
    setGameOpen(true);
  };
  const closeGame = () => {
    setGameClosing(true);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F5F7F9] text-[#111111] select-none">
      <div className="absolute inset-x-0 top-0 z-20 bg-[#F5F7F9]">
        <div className="relative h-[44px]" />
        <div className="flex h-[48px] items-center justify-center px-[16px] pb-[4px] pt-[12px]">
          <div className="flex min-w-0 flex-1 items-center gap-[40px]">
            <div className="flex min-w-0 flex-1 items-center gap-[12px]">
              <button className="relative h-[32px] w-[32px] shrink-0 border-0 bg-transparent p-0" type="button">
                <Image
                  src="/figma/practice-game/icons/back@3x.png"
                  alt=""
                  width={32}
                  height={32}
                  draggable={false}
                  className="h-[32px] w-[32px]"
                />
              </button>
              <div className="flex h-[32px] shrink-0 items-center gap-[8px] rounded-full bg-[#EDEEF3] px-[10px] py-[3px]">
                <span className="font-serif text-[20px] font-bold leading-[26px] tracking-[0.4px] text-[#007AFF]">
                  💎
                </span>
                <span className="font-[var(--font-poppins)] text-[16px] font-semibold leading-[1.3] text-[#111111]">
                  100
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-[16px]">
              <Image
                src="/figma/practice-game/icons/bookmark@3x.png"
                alt=""
                width={24}
                height={24}
                draggable={false}
                className="h-[24px] w-[24px]"
              />
              <Image
                src="/figma/practice-game/icons/share@3x.png"
                alt=""
                width={24}
                height={24}
                draggable={false}
                className="h-[24px] w-[24px]"
              />
            </div>
          </div>
        </div>
        <div className="flex h-[48px] items-end justify-between rounded-br-[16px] bg-[#F5F7F9] text-[16px] font-semibold">
          {["Answer", "Steps", "Video", "Practice"].map((tab) => (
            <div
              key={tab}
              className={`flex h-[40px] flex-1 items-center justify-center ${
                tab === "Practice" ? "rounded-t-[20px] bg-white" : ""
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      <div
        className="phone-scrollbar-hidden absolute inset-x-0 bottom-[145px] top-[140px] z-10 overflow-x-hidden overflow-y-scroll bg-[#F6F8FA]"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          touchAction: "pan-y",
        }}
      >
        <div className="min-h-[646px] pb-[40px]">
          <section className="overflow-hidden rounded-[16px] bg-white pb-[20px] pt-[24px]">
            <div className="mb-[12px] flex h-[32px] items-center gap-[16px]">
              <div className="h-[20px] w-[5px] shrink-0 rounded-br-[12px] rounded-tr-[12px] bg-[#007AFF]" />
              <div className="flex h-[27px] items-center">
                <h1 className="m-0 font-[var(--font-poppins)] text-[18px] font-bold uppercase leading-[1.5] text-[#007AFF]">
                  Practice
                </h1>
              </div>
            </div>

            <div className="px-[20px]">
              <div className="mb-[12px] flex w-full items-center justify-between">
                <div className="flex flex-col items-start gap-[4px] whitespace-nowrap">
                  <h2 className="m-0 text-[16px] font-semibold leading-[1.2] text-[#111111]">
                    Lock It In
                  </h2>
                  <p className="m-0 text-[12px] font-normal leading-[1.5] text-[#989B9E]">
                    Flip the cards to test your knowledge
                  </p>
                </div>
                <div className="flex shrink-0 items-start gap-[12px]">
                  <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-[12px] bg-[#EDEEF3]">
                    <Image
                      src="/figma/practice-game/icons/thumb-up.svg"
                      alt=""
                      width={20}
                      height={20}
                      draggable={false}
                      className="h-[20px] w-[20px]"
                    />
                  </div>
                  <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-[12px] bg-[#EDEEF3]">
                    <Image
                      src="/figma/practice-game/icons/thumb-down.svg"
                      alt=""
                      width={20}
                      height={20}
                      draggable={false}
                      className="h-[20px] w-[20px]"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-[20px] bg-white p-[16px] shadow-[0_24px_24px_rgba(0,0,0,0.08)] ring-1 ring-[#E6E8EA]">
                <div className="relative h-[140px] w-full overflow-hidden rounded-[12px]">
                  <Image
                    src="/figma/practice-game/skull-anatomy-cover-v2.png"
                    alt=""
                    width={321}
                    height={140}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-[8px] top-[8px] flex items-center justify-center rounded-full bg-[rgba(0,0,0,0.6)] px-[10px] py-[6px]">
                    <span className="whitespace-nowrap text-[13px] font-medium leading-[13px] text-white">
                      Medicine
                    </span>
                  </div>
                </div>
                <div className="mt-[16px] px-[4px]">
                  <div className="flex flex-col gap-[8px]">
                    <div>
                      <h3 className="m-0 text-[16px] font-semibold leading-[1.4]">
                        Skull Anatomy Challenge
                      </h3>
                  <p className="m-0 flex h-[22px] items-center overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-[1.4] text-[#595C60]">
                    Tap the correct spot on the skull diagram
                      </p>
                    </div>
                    <div className="flex items-center gap-[24px]">
                      <PracticeMetric
                        icon="/figma/practice-game/icons/like.svg"
                        value="321"
                      />
                      <PracticeMetric
                        icon="/figma/practice-game/icons/play-count.svg"
                        value="688"
                      />
                    </div>
                  </div>
                </div>
                <PracticePrimaryButton onPlay={openGame} />
              </div>
            </div>
            <div className="px-[20px] pt-[28px]">
              <h2 className="m-0 text-[16px] font-semibold leading-[1.4]">
                Explore More
              </h2>
              <p className="m-0 mt-[4px] text-[13px] leading-[1.5] text-[#989B9E]">
                Expand your practice with custom flashcards and quizzes
              </p>
              <div className="mt-[12px] flex gap-[8px]">
                <PracticeExploreCard
                  icon="/figma/practice-game/icons/flashcards@3x.png"
                  title="Flashcards"
                  subtitle="Spaced repetition"
                />
                <PracticeExploreCard
                  icon="/figma/practice-game/icons/quiz@3x.png"
                  title="Quiz"
                  subtitle="Personalized practice"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-[16px] bg-white px-[12px] pb-[8px] pt-[12px] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div className="mb-[8px] flex gap-[8px]">
          <button className="rounded-full border border-[#D8DCE2] bg-white px-[10px] py-[8px] text-[14px] font-medium text-[#595C60]" type="button">
            ⊕ Explain further
          </button>
          <button className="rounded-full border border-[#D8DCE2] bg-white px-[10px] py-[8px] text-[14px] font-medium text-[#595C60]" type="button">
            ▣ Simplify
          </button>
        </div>
        <div className="flex h-[48px] items-center rounded-[16px] bg-[#F3F4F9] px-[12px] text-[16px] text-[#989B9E]">
          <span className="flex-1">Ask follow-up...</span>
          <span className="text-[22px] text-[#595C60]">🎙</span>
        </div>
        <div className="relative h-[34px]">
          <div className="absolute bottom-[0px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>

      {gameOpen ? (
        <EmbeddedGame
          closing={gameClosing}
          onClose={closeGame}
          onClosed={() => {
            setGameOpen(false);
            setGameClosing(false);
          }}
        />
      ) : null}
    </div>
  );
}

function PracticePrimaryButton({ onPlay }: { onPlay: () => void }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onClick={onPlay}
      className="mt-[16px] flex h-[48px] w-full items-center justify-center rounded-full border-0 bg-[#E9F4FF] p-[16px] text-[16px] font-semibold leading-[16px] text-[#007AFF]"
      style={{
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      Play Now
    </button>
  );
}

function PracticeMetric({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex shrink-0 items-center gap-[4px]">
      <div className="relative h-[20px] w-[20px] overflow-hidden">
        <Image
          src={icon}
          alt=""
          width={17}
          height={17}
          draggable={false}
          className="absolute left-1/2 top-1/2 h-[16.667px] w-[16.667px] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium leading-[13px] text-[#989B9E]">
        {value}
      </div>
    </div>
  );
}

function PracticeExploreCard({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex h-[120px] min-w-0 flex-1 flex-col justify-center gap-[8px] rounded-[20px] border border-[#E6E8EA] bg-[#FBFCFF] p-[16px]">
      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ECF5FF]">
        <Image
          src={icon}
          alt=""
          width={24}
          height={24}
          draggable={false}
          className="h-[24px] w-[24px]"
        />
      </div>
      <div className="flex w-full flex-col items-start whitespace-nowrap">
        <div className="text-[15px] font-semibold leading-[1.4] text-[#111111]">
          {title}
        </div>
        <div className="text-[12px] font-normal leading-normal text-[#989B9E]">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function EmbeddedGame({
  closing,
  onClose,
  onClosed,
}: {
  closing: boolean;
  onClose: () => void;
  onClosed: () => void;
}) {
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    const rafId = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="absolute inset-0 z-50 overflow-hidden bg-white"
      style={{
        transform: closing || !entered ? "translateY(100%)" : "translateY(0)",
        opacity: closing || !entered ? 0.98 : 1,
        transition:
          "transform 490ms cubic-bezier(0.32, 0.72, 0, 1), opacity 490ms cubic-bezier(0.32, 0.72, 0, 1)",
        willChange: "transform, opacity",
      }}
      onTransitionEnd={(event) => {
        if (event.propertyName !== "transform") return;
        if (closing) onClosed();
      }}
    >
      <div className="absolute inset-x-0 top-0 z-20 h-[92px] bg-white">
        <div className="relative h-[44px] overflow-hidden" />
        <div className="relative flex h-[48px] items-center px-[16px] pb-[4px] pt-[12px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="relative h-[32px] w-[32px] border-0 bg-transparent p-0"
          >
            <span className="absolute left-[8px] top-[15px] h-[2.5px] w-[18px] rotate-45 rounded-full bg-black" />
            <span className="absolute left-[8px] top-[15px] h-[2.5px] w-[18px] -rotate-45 rounded-full bg-black" />
          </button>
          <div className="absolute left-1/2 top-[18px] -translate-x-1/2 whitespace-nowrap text-[17px] font-semibold leading-none text-[#111111]">
            🎮 Practice
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[92px] overflow-hidden bg-[#071329]">
        <iframe
          src="https://skull-hotspot-game.vercel.app/"
          title="Skull Anatomy Hotspot Game"
          scrolling="no"
          className="h-full w-full border-0"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}

function SiteHeader({
  menuOpen,
  onToggleMenu,
}: {
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-[rgba(5,5,5,0.06)] bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full w-full items-center px-4 lg:px-10">
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
          className="relative mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(5,5,5,0.06)] bg-white p-0 transition-colors active:bg-[rgba(0,0,0,0.04)] lg:hidden"
        >
          <span
            className={`absolute h-[2px] w-[18px] rounded-full bg-[#111111] transition-transform duration-200 ease-out ${
              menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[6px]"
            }`}
          />
          <span
            className={`absolute h-[2px] w-[18px] rounded-full bg-[#111111] transition-opacity duration-150 ease-out ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-[2px] w-[18px] rounded-full bg-[#111111] transition-transform duration-200 ease-out ${
              menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px]"
            }`}
          />
        </button>
        <div className="flex min-w-0 shrink-0 items-center lg:w-[304px]">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/brand/solvely-logo.png"
              alt="Solvely logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-[8px]"
            />
            <div className="min-w-0">
              <div className="truncate text-[15px] font-medium leading-6 text-[rgba(0,0,0,0.88)]">
                Solvely
              </div>
              <div className="truncate text-[12px] leading-4 text-[rgba(0,0,0,0.45)]">
                交互实例
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 pl-10" />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="relative left-1/2 mt-20 w-screen max-w-none -translate-x-1/2 border-t border-[rgba(5,5,5,0.06)] pt-8 text-sm text-[rgba(0,0,0,0.45)] lg:w-[calc(100vw-304px)]">
      <div className="flex flex-col gap-2 px-10 md:flex-row md:items-center md:justify-between">
        <p>Solvely ©2026</p>
        <span>@Eric</span>
      </div>
    </footer>
  );
}

function AppNavList({
  activeKey,
  onNavigate,
}: {
  activeKey: ScreenKey;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-6">
      {NAV_GROUPS.map((group, groupIndex) => (
        <section
          key={group.label}
          className={`px-1 ${
            groupIndex === 0 ? "" : "border-t border-[rgba(5,5,5,0.06)] pt-5"
          }`}
        >
          <div className="px-3">
            <div className="text-[14px] font-semibold leading-7 text-[rgba(0,0,0,0.88)]">
              {group.label}
            </div>
          </div>
          <ul className="mt-2.5 space-y-0">
            {group.keys.map((key) => {
              const screen = screenByKey[key];
              const isActive = screen.key === activeKey;
              return (
                <li key={screen.key}>
                  <Link
                    href={screen.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 transition-colors ${
                      isActive
                        ? "bg-[rgba(22,119,255,0.10)]"
                        : "hover:bg-[rgba(0,0,0,0.02)]"
                    }`}
                  >
                    <span
                      className={`text-[14px] leading-7 ${
                        isActive
                          ? "font-medium text-[#1677FF]"
                          : "font-normal text-[rgba(0,0,0,0.88)]"
                      }`}
                    >
                      {screen.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <div aria-hidden="true" style={{ height: 80 }} />
    </nav>
  );
}

function AppSidebar({ activeKey }: { activeKey: ScreenKey }) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-[304px] shrink-0 border-r border-[rgba(5,5,5,0.06)] bg-white lg:block">
      <div className="docs-sidebar-scrollbar h-full overflow-y-auto px-4 py-4">
        <AppNavList activeKey={activeKey} />
      </div>
    </aside>
  );
}

function MobileNavDrawer({
  activeKey,
  open,
  onClose,
}: {
  activeKey: ScreenKey;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className="lg:hidden">
      <div
        className={`fixed inset-0 top-16 z-30 bg-black/20 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed bottom-0 left-0 top-16 z-30 w-[304px] max-w-[82vw] border-r border-[rgba(5,5,5,0.06)] bg-white shadow-[24px_0_48px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="docs-sidebar-scrollbar h-full overflow-y-auto px-4 py-4">
          <AppNavList activeKey={activeKey} onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}

function IPhoneFrame({
  children,
}: {
  children: ReactNode;
}) {
  const preset = PHONE_PRESET;

  return (
    <div
      className="relative shrink-0"
      style={{
        width: preset.W,
        height: preset.H,
        filter: preset.dropShadow,
      }}
    >
      <div
        className="absolute flex items-center justify-center overflow-hidden"
        style={{
          left: preset.SCREEN_OFFSET_X,
          top: preset.SCREEN_OFFSET_Y,
          width: preset.SCREEN_W,
          height: preset.SCREEN_H,
          borderRadius: preset.SCREEN_RADIUS,
          zIndex: 3,
          isolation: "isolate",
          position: "absolute",
        }}
      >
        {children}
        <CommonStatusBar />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preset.framePngSrc}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
          transform: `translateY(${preset.FRAME_NUDGE_Y}px)`,
        }}
      />
    </div>
  );
}

function AutoScaledPhoneFrame({ children }: { children: ReactNode }) {
  const preset = PHONE_PRESET;
  const visualW = preset.W + preset.VISUAL_PAD_LEFT + preset.VISUAL_PAD_RIGHT;
  const visualH = preset.H + preset.VISUAL_PAD_TOP + preset.VISUAL_PAD_BOTTOM;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scaleState, setScaleState] = useState(() => ({
    scale: cachedPhoneScale ?? 1,
    ready: cachedPhoneScale !== undefined,
  }));

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let rafId = 0;
    const updateScale = () => {
      const availableWidth = Math.max(
        0,
        viewport.clientWidth - PHONE_PREVIEW_GAP * 2,
      );
      const availableHeight = Math.max(
        0,
        viewport.clientHeight - PHONE_PREVIEW_GAP * 2,
      );
      const nextScale = Math.min(
        1,
        availableWidth / visualW,
        availableHeight / visualH,
      );
      const boostedScale = Math.min(1, nextScale * preset.SCALE_BOOST);
      const resolvedScale = Number.isFinite(boostedScale)
        ? Math.max(0, boostedScale)
        : 1;

      cachedPhoneScale = resolvedScale;
      setScaleState((prev) => {
        if (prev.ready && Math.abs(prev.scale - resolvedScale) < 0.0005) {
          return prev;
        }
        return { scale: resolvedScale, ready: true };
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateScale);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(viewport);
    updateScale();
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [preset.SCALE_BOOST, visualW, visualH]);

  const scale = scaleState.scale;

  return (
    <div
      ref={viewportRef}
      className="flex h-full w-full items-center justify-center overflow-visible"
      style={{ padding: `${PHONE_PREVIEW_GAP}px`, pointerEvents: "none" }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: preset.W * scale,
          height: preset.H * scale,
          overflow: "visible",
          visibility: scaleState.ready ? "visible" : "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -preset.VISUAL_PAD_LEFT * scale + preset.BODY_NUDGE_X * scale,
            top: -preset.VISUAL_PAD_TOP * scale,
            width: visualW * scale,
            height: visualH * scale,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: visualW,
              height: visualH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              overflow: "visible",
              willChange: "transform",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: preset.VISUAL_PAD_LEFT,
                top: preset.VISUAL_PAD_TOP,
                width: preset.W,
                height: preset.H,
                pointerEvents: "auto",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperimentSwitch<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  const activeIndex = options.findIndex((option) => option.value === value);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({
    top: 0,
    left: 0,
    ready: false,
  });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const list = listRef.current;
      const button = buttonRefs.current[activeIndex];
      if (!list || !button) return;

      const listRect = list.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setIndicator({
        top: buttonRect.top - listRect.top + buttonRect.height / 2,
        left:
          buttonRect.right -
          listRect.left +
          STUDY_EXPERIMENT_INDICATOR_GAP,
        ready: true,
      });
    };

    const rafId = window.requestAnimationFrame(updateIndicator);
    const observer = new ResizeObserver(updateIndicator);

    if (listRef.current) observer.observe(listRef.current);
    buttonRefs.current.forEach((button) => {
      if (button) observer.observe(button);
    });

    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeIndex, options.length]);

  return (
    <div className="pointer-events-auto fixed right-3 top-1/2 z-30 flex min-h-0 w-[112px] -translate-y-1/2 items-center justify-end sm:right-5 sm:w-[160px] xl:right-[40px] xl:w-[260px]">
      <ul
        ref={listRef}
        className="relative flex w-full flex-col items-end gap-6 sm:gap-8 xl:gap-10"
        style={{
          zIndex: 30,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden xl:block"
          style={{
            top: indicator.top,
            left: indicator.left,
            width: STUDY_EXPERIMENT_INDICATOR_W,
            height: STUDY_EXPERIMENT_INDICATOR_H,
            background: STUDY_EXPERIMENT_ACTIVE_COLOR,
            opacity: indicator.ready ? 1 : 0,
            transform: "translateY(-50%)",
            transition: [
              `top 320ms ${STUDY_EXPERIMENT_INDICATOR_EASE}`,
              `left 320ms ${STUDY_EXPERIMENT_INDICATOR_EASE}`,
              "opacity 160ms ease",
            ].join(", "),
          }}
        />
        {options.map((option, i) => {
          const active = i === activeIndex;
        return (
          <li key={option.value} className="block">
            <button
              ref={(node) => {
                buttonRefs.current[i] = node;
              }}
              type="button"
              onClick={() => onChange(option.value)}
              className="bg-transparent border-none p-0 text-right cursor-pointer transition-colors"
              style={{
                fontFamily:
                  "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                fontSize: 14,
                lineHeight: 1.5,
                fontWeight: 500,
                color: active
                  ? STUDY_EXPERIMENT_ACTIVE_COLOR
                  : STUDY_EXPERIMENT_INACTIVE_COLOR,
              }}
            >
              {option.label}
            </button>
          </li>
        );
        })}
      </ul>
    </div>
  );
}

function SimulatorPreview({
  activeKey,
  homeExperiment,
  studyExperiment,
  onHomeExperimentChange,
  onStudyExperimentChange,
}: {
  activeKey: ScreenKey;
  homeExperiment: HomeExperiment;
  studyExperiment: StudyExperiment;
  onHomeExperimentChange: (value: HomeExperiment) => void;
  onStudyExperimentChange: (value: StudyExperiment) => void;
}) {
  return (
    <div className="relative h-full min-h-0 w-full">
      <div className="flex h-full min-h-0 min-w-0 items-center justify-center overflow-visible px-6 py-2">
        <AutoScaledPhoneFrame>
          <IPhoneFrame>
            <ScreenPreview
              activeKey={activeKey}
              homeExperiment={homeExperiment}
              studyExperiment={studyExperiment}
            />
          </IPhoneFrame>
        </AutoScaledPhoneFrame>
      </div>
      {activeKey === "study" ? (
        <ExperimentSwitch
          value={studyExperiment}
          onChange={onStudyExperimentChange}
          options={[
            { value: "experiment-1", label: "实验组1" },
            { value: "experiment-2", label: "实验组2" },
          ]}
        />
      ) : null}
      {activeKey === "home" ? (
        <ExperimentSwitch
          value={homeExperiment}
          onChange={onHomeExperimentChange}
          options={[
            { value: "version-1", label: "版本一" },
            { value: "version-2", label: "版本二" },
          ]}
        />
      ) : null}
    </div>
  );
}

function ScreenPreview({
  activeKey,
  homeExperiment = "version-1",
  studyExperiment = "experiment-1",
}: {
  activeKey: ScreenKey;
  homeExperiment?: HomeExperiment;
  studyExperiment?: StudyExperiment;
}) {
  if (activeKey === "home") return <HomeV2Preview experiment={homeExperiment} />;
  if (activeKey === "solve") return <HomePreview />;
  if (activeKey === "study") return <StudyPreview experiment={studyExperiment} />;
  if (activeKey === "tutor") return <TutorPreview />;
  if (activeKey === "flash-card-stack") return <FlashCardTransitionPreview />;
  if (activeKey === "flash-card-flip-swipe-away") {
    return <FlashCardFlipSwipeAwayPreview />;
  }
  if (activeKey === "paywall") return <PaywallScreen />;
  if (activeKey === "practice-game") return <PracticeGameScreen />;
  return <OnboardingScreen />;
}

export default function Home() {
  const pathname = usePathname();
  const activeScreen = getActiveScreen(pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [homeExperiment, setHomeExperiment] =
    useState<HomeExperiment>("version-1");
  const [studyExperiment, setStudyExperiment] =
    useState<StudyExperiment>("experiment-1");

  return (
    <>
      <SiteHeader
        menuOpen={mobileNavOpen}
        onToggleMenu={() => setMobileNavOpen((open) => !open)}
      />
      <MobileNavDrawer
        activeKey={activeScreen.key}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <div className="mt-16 flex h-[calc(100svh-4rem)] w-full">
        <AppSidebar activeKey={activeScreen.key} />
        <main className="flex min-w-0 flex-1 justify-center overflow-hidden">
          <div className="flex h-full min-h-0 w-full max-w-[1280px] flex-col px-10 pb-8 pt-10">
            <div className="min-h-0 flex-1">
              <SimulatorPreview
                activeKey={activeScreen.key}
                homeExperiment={homeExperiment}
                studyExperiment={studyExperiment}
                onHomeExperimentChange={setHomeExperiment}
                onStudyExperimentChange={setStudyExperiment}
              />
            </div>
            <SiteFooter />
          </div>
        </main>
      </div>
    </>
  );
}
