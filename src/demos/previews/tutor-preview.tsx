"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import { DemoCanvas } from "@/components/simulator/demo-canvas";

/**
 * Tutor 实例页（1:1 还原 Figma 1743:24075，393×852 设计稿）
 *
 * 结构（从下到上）：
 * 1. 渐变背景 #F6F8FA
 * 2. 椭圆光斑（蓝色，模糊扩散）
 * 3. 噪点矩形（白色 44% 不透明）
 * 4. 头像 + 名称 + 副标题
 * 5. 三个分页指示点
 * 6. 卡片 carousel（中央焦点 + 左右各露一半）
 * 7. 底部 CTA：键盘 / Snap a photo / 麦克风
 * 8. Tab Bar（Scan / Lecture Notes / Study(active) / Me）
 */

type TutorCarouselCard = {
  id: string;
  question: string;
  tagText: string;
  tagBg: string;
  tagColor: string;
};

type HistoryItem = {
  id: string;
  kind: "worksheet" | "article" | "text" | "equation" | "diagram";
  title: string;
  body?: string;
  accent?: string;
};

type HistorySection = {
  label: string;
  items: HistoryItem[];
};

const TUTOR_CAROUSEL_CARDS: TutorCarouselCard[] = [
  {
    id: "geometry",
    question: "Why do parallel lines create equal angles?",
    tagText: "Geometry",
    tagBg: "#ECF5FF",
    tagColor: "#007AFF",
  },
  {
    id: "rollercoaster",
    question: "Why doesn't a roller coaster loop fall?",
    tagText: "Algebra",
    tagBg: "#ECF5ED",
    tagColor: "#33A354",
  },
  {
    id: "gravity",
    question: "Why do astronauts float inside spacecraft?",
    tagText: "Physics",
    tagBg: "#EAF4F9",
    tagColor: "#0B99BC",
  },
  {
    id: "plant",
    question: "Why is this plant growing linearly?",
    tagText: "Biology",
    tagBg: "#FFF4EA",
    tagColor: "#FF9216",
  },
  {
    id: "history",
    question: "Why did this event change society?",
    tagText: "History",
    tagBg: "#FCEFF0",
    tagColor: "#E15C6C",
  },
];

type TutorTabId = "scan" | "tutor" | "study" | "me";

const TAB_ITEMS: { id: TutorTabId; label: string }[] = [
  { id: "scan", label: "Scan" },
  { id: "tutor", label: "Tutor" },
  { id: "study", label: "Study" },
  { id: "me", label: "Me" },
];

const HISTORY_SECTIONS: HistorySection[] = [
  {
    label: "Today",
    items: [
      {
        id: "quadratic-graph",
        kind: "worksheet",
        title: "Find the polynomial of degree 5 that matches the graph.",
        body: "10 points",
        accent: "#EEF3FF",
      },
      {
        id: "science-article",
        kind: "article",
        title: "Why would this article discuss products of biotechnology?",
        body: "National Academies of Science, Engineering, and Medicine",
        accent: "#EEF0EA",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "physics-loop",
        kind: "diagram",
        title: "Why does a roller coaster stay on the track in a loop?",
        body: "Centripetal force",
        accent: "#FDF3F3",
      },
      {
        id: "missing-text",
        kind: "text",
        title: "To get the best answer, please type the missing text below or retake the full question.",
      },
    ],
  },
  {
    label: "05/18",
    items: [
      {
        id: "radicals",
        kind: "equation",
        title: "Solve for x",
        body: "√(x + 7) + √(2x - 1) = 8",
        accent: "#F5F7F9",
      },
      {
        id: "plant-growth",
        kind: "text",
        title: "Explain why the plant height increases linearly over time.",
        body: "Use the data table to support your answer.",
      },
    ],
  },
  {
    label: "05/17",
    items: [
      {
        id: "fractions",
        kind: "equation",
        title: "Convert the fraction to a decimal",
        body: "7 / 16",
        accent: "#FFF5E8",
      },
      {
        id: "chemistry",
        kind: "diagram",
        title: "How does soap break down grease?",
        body: "Molecule structure",
        accent: "#ECF5ED",
      },
    ],
  },
];

const LOADING_STEPS = [
  "Analyzing the question thoroughly",
  "Working on a clear explanation",
  "Drawing on the whiteboard",
];

const SPEED_OPTIONS = ["0.50X", "0.75X", "1.00X", "1.25X", "1.50X"] as const;

const ANSWER_PREVIEW_PLACEHOLDER =
  "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.";

const EXPLANATION_MODULES = [
  { kind: "question" },
  { kind: "overview" },
  { kind: "formula" },
  { kind: "diagram" },
  { kind: "text-image" },
  { kind: "recap" },
] as const;

const TUTOR_PRELOAD_ASSETS = [
  "/figma/global/tabbar/scan-active.svg",
  "/figma/global/tabbar/scan-inactive.svg",
  "/figma/global/tabbar/tutor-active.svg",
  "/figma/global/tabbar/tutor-inactive.svg",
  "/figma/global/tabbar/study-active.svg",
  "/figma/global/tabbar/study-inactive.svg",
  "/figma/global/tabbar/me-active.svg",
  "/figma/global/tabbar/me-inactive.svg",
  "/figma/tutor/tutor-teacher-hero.png",
  "/figma/tutor/tutor-history-icon.png",
  "/figma/tutor/tutor-header-avatar.png",
  "/figma/tutor/tutor-history-back.png",
  "/figma/tutor/tutor-btn-keyboard.png",
  "/figma/tutor/tutor-btn-snap.png",
  "/figma/tutor/tutor-btn-mic.png",
  "/figma/tutor/voice-close.png",
  "/figma/tutor/voice-submit.png",
  "/figma/tutor/answer-pause-button.png",
  "/figma/tutor/answer-play-button.png",
  "/figma/tutor/answer-mic-button.png",
  "/figma/tutor/answer-keyboard-button.png",
  "/figma/tutor/loading/avatar.png",
  "/figma/tutor/loading/thinking-active.svg",
  "/figma/tutor/loading/thinking-inactive.svg",
  "/figma/tutor/loading/question-image.png",
  "/figma/tutor/explanation/diagram.png",
  "/figma/tutor/explanation/graph.png",
  "/figma/tutor/speed-menu/arrow.svg",
  "/figma/tutor/speed-menu/checkmark.svg",
];

export function TutorPreview({
  embedded = false,
  hideBottomNav = false,
  onSubpageVisibilityChange,
  initialPreviewVisible = false,
  answerPreviewModules = EXPLANATION_MODULES,
}: {
  embedded?: boolean;
  hideBottomNav?: boolean;
  onSubpageVisibilityChange?: (visible: boolean) => void;
  initialPreviewVisible?: boolean;
  answerPreviewModules?: readonly (typeof EXPLANATION_MODULES)[number][];
} = {}) {
  const [activeIndex, setActiveIndex] = useState(1); // 中央卡（rollercoaster）选中
  const [activeTab, setActiveTab] = useState<TutorTabId>("tutor");
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyClosing, setHistoryClosing] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [loadingClosing, setLoadingClosing] = useState(false);
  const [loadingCloseMode, setLoadingCloseMode] = useState<"back" | "complete">("back");
  const [previewVisible, setPreviewVisible] = useState(initialPreviewVisible);
  const [previewClosing, setPreviewClosing] = useState(false);

  useEffect(() => {
    onSubpageVisibilityChange?.(
      historyVisible || loadingVisible || previewVisible,
    );
  }, [
    historyVisible,
    loadingVisible,
    onSubpageVisibilityChange,
    previewVisible,
  ]);

  useEffect(() => {
    const preloadedImages = TUTOR_PRELOAD_ASSETS.map((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    return () => {
      preloadedImages.forEach((image) => {
        image.src = "";
      });
    };
  }, []);

  const openHistory = () => {
    setHistoryClosing(false);
    setHistoryVisible(true);
  };

  const closeHistory = () => {
    setHistoryClosing(true);
  };

  const openLoading = () => {
    setPreviewVisible(false);
    setPreviewClosing(false);
    setLoadingClosing(false);
    setLoadingCloseMode("back");
    setLoadingVisible(true);
  };

  const closeLoading = () => {
    setLoadingCloseMode("back");
    setLoadingClosing(true);
    window.setTimeout(() => {
      setLoadingVisible(false);
      setLoadingClosing(false);
    }, 490);
  };

  const completeLoading = () => {
    setPreviewVisible(true);
    setLoadingCloseMode("complete");
    setLoadingClosing(true);
    window.setTimeout(() => {
      setLoadingVisible(false);
      setLoadingClosing(false);
    }, 420);
  };

  const closePreview = () => {
    setPreviewClosing(true);
    window.setTimeout(() => {
      setPreviewVisible(false);
      setPreviewClosing(false);
    }, 490);
  };

  const content = (
    <>
      <style>
        {`
          @keyframes tutor-history-enter {
            from {
              transform: translateX(100%);
              opacity: 0.98;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes tutor-history-exit {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0.98;
            }
          }

          @keyframes tutor-loading-complete-exit {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(10px) scale(0.992);
            }
          }

          @keyframes tutor-preview-header-enter {
            from {
              opacity: 0;
              transform: translateY(-24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes tutor-preview-bottom-enter {
            from {
              opacity: 0;
              transform: translateY(34px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes tutor-rating-sheet-enter {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes tutor-rating-backdrop-enter {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes tutor-rating-sheet-exit {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(100%);
            }
          }

          .tutor-rating-textarea {
            scrollbar-width: none;
          }

          .tutor-rating-textarea::-webkit-scrollbar {
            display: none;
          }

          @keyframes tutor-bottom-orb-center {
            0%, 100% {
              transform: translate3d(36px, -20px, 0);
            }
            24% {
              transform: translate3d(73px, -100px, 0);
            }
            53% {
              transform: translate3d(0px, -48px, 0);
            }
            77% {
              transform: translate3d(52px, 0px, 0);
            }
          }

          @keyframes tutor-bottom-orb-right {
            0%, 100% {
              transform: translate3d(153px, 0px, 0);
            }
            29% {
              transform: translate3d(0px, -84px, 0);
            }
            61% {
              transform: translate3d(120px, -24px, 0);
            }
            86% {
              transform: translate3d(36px, -100px, 0);
            }
          }

          @keyframes tutor-bottom-orb-left {
            0%, 100% {
              transform: translate3d(0px, -40px, 0);
            }
            22% {
              transform: translate3d(265px, -100px, 0);
            }
            56% {
              transform: translate3d(110px, 0px, 0);
            }
            81% {
              transform: translate3d(210px, -72px, 0);
            }
          }

          @keyframes tutor-bottom-orb-mint {
            0%, 100% {
              transform: translate3d(233px, -100px, 0);
            }
            27% {
              transform: translate3d(0px, -20px, 0);
            }
            59% {
              transform: translate3d(180px, 0px, 0);
            }
            88% {
              transform: translate3d(78px, -64px, 0);
            }
          }

          @keyframes tutor-voice-bar-size {
            0%, 100% {
              transform: scaleY(0.22);
            }
            50% {
              transform: scaleY(1);
            }
          }

          @keyframes tutor-loading-star-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes tutor-loading-text-shine {
            0% {
              background-position: 150% center;
            }
            100% {
              background-position: -50% center;
            }
          }

          @keyframes tutor-loading-border-grow {
            0% {
              stroke-dashoffset: 100;
            }
            20% {
              stroke-dashoffset: 80;
            }
            26% {
              stroke-dashoffset: 80;
            }
            34% {
              stroke-dashoffset: 64;
            }
            39% {
              stroke-dashoffset: 64;
            }
            47% {
              stroke-dashoffset: 50;
            }
            50% {
              stroke-dashoffset: 50;
            }
            100% {
              stroke-dashoffset: 2;
            }
          }

          @keyframes tutor-typewriter-preview-fade {
            from {
              opacity: 0;
            }
            to {
              opacity: 0.22;
            }
          }

          @keyframes tutor-speed-menu-pop {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            80% {
              opacity: 1;
              transform: scale(1.01);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes tutor-border-glow-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .tutor-history-page,
            .tutor-loading-page,
            .tutor-preview-page,
            .tutor-preview-enter,
            .tutor-rating-sheet {
              animation: none !important;
            }
          }
        `}
      </style>
      <div
        className="absolute inset-0 select-none overflow-hidden"
        style={{
          background: "#F6F8FA",
        }}
      >
        <TutorAmbientGlow />

        {/* 顶部 Title 区 — Figma node 2004:17288 */}
        <TutorTitleHeader onOpenHistory={openHistory} />

        {/* Hero + Carousel 组 — Figma node 1761:15434
            title 高 92，组距离 title top 外边距 40，因此 group top = 132；组内 gap = 48 */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: 132,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
            overflow: "visible",
          }}
        >
          <TutorHero />

          {/* 推荐卡片 carousel */}
          <TutorRingCarousel
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            autoPlay={!historyVisible && !loadingVisible && !previewVisible}
          />
        </div>

        {/* 底部 CTA */}
        <BottomCTA onSubmitVoice={openLoading} />

        {!hideBottomNav ? (
          <TutorBottomNav
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        ) : null}
      </div>
      {historyVisible ? (
        <div
          className="absolute inset-0 tutor-history-page"
          style={{
            zIndex: 80,
            animation: historyClosing
              ? "tutor-history-exit 490ms cubic-bezier(0.32, 0.72, 0, 1) both"
              : "tutor-history-enter 490ms cubic-bezier(0.32, 0.72, 0, 1) both",
            willChange: "transform, opacity",
          }}
          onAnimationEnd={() => {
            if (!historyClosing) return;
            setHistoryVisible(false);
            setHistoryClosing(false);
          }}
        >
          <TutorHistoryScreen onBack={closeHistory} />
        </div>
      ) : null}
      {loadingVisible ? (
        <div
          className="absolute inset-0 tutor-loading-page"
          style={{
            zIndex: 100,
            animation: loadingClosing
              ? loadingCloseMode === "back"
                ? "tutor-history-exit 490ms cubic-bezier(0.32, 0.72, 0, 1) both"
                : "tutor-loading-complete-exit 420ms cubic-bezier(0.16, 1, 0.3, 1) both"
              : "tutor-history-enter 490ms cubic-bezier(0.32, 0.72, 0, 1) both",
            willChange: "transform, opacity",
          }}
        >
          <TutorLoadingScreen
            onBack={closeLoading}
            onComplete={completeLoading}
          />
        </div>
      ) : null}
      {previewVisible ? (
        <div
          className="absolute inset-0 tutor-preview-page"
          style={{
            zIndex: 95,
            animation: previewClosing
              ? "tutor-history-exit 490ms cubic-bezier(0.32, 0.72, 0, 1) both"
              : undefined,
            willChange: previewClosing ? "transform, opacity" : undefined,
          }}
        >
          <TutorAnswerPreviewScreen
            onBack={closePreview}
            modules={answerPreviewModules}
          />
        </div>
      ) : null}
    </>
  );

  if (embedded) {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ background: "#F6F8FA" }}
      >
        {content}
      </div>
    );
  }

  return (
    <DemoCanvas mode="fill" background="#F6F8FA">
      {content}
    </DemoCanvas>
  );
}

export function TutorExplanationPreview() {
  return (
    <TutorPreview
      initialPreviewVisible
      hideBottomNav
      answerPreviewModules={[EXPLANATION_MODULES[0]]}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function TutorAmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 pointer-events-none"
      style={{
        width: 393,
        height: 200,
        isolation: "isolate",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 393,
          height: 200,
          background: "rgba(38, 92, 255, 0.7)",
          opacity: 0.44,
          filter: "blur(112px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#6EFF7F",
          filter: "blur(70px)",
          zIndex: 1,
        }}
      />
    </div>
  );
}

function TutorBottomAmbientGlow({ bottom = -119 }: { bottom?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 pointer-events-none"
      style={{
        width: 393,
        height: 260,
        isolation: "isolate",
        bottom,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 393,
          height: 100,
          left: 0,
          bottom: 0,
          background: "#265CFF",
          opacity: 0.44,
          filter: "blur(80px)",
        }}
      />
      <BottomAmbientOrb
        width={240}
        height={240}
        color="#4CC0FF"
        blur={80}
        duration={4875}
        initialX={72}
        initialY={20}
        minX={-39}
        maxX={433}
      />
      <BottomAmbientOrb
        width={201.6}
        height={201.6}
        color="#6E7AFF"
        blur={90}
        duration={4063}
        initialX={310}
        initialY={80}
        minX={-39}
        maxX={433}
      />
      <BottomAmbientOrb
        width={150}
        height={150}
        color="#83FF91"
        blur={100}
        duration={1885}
        initialX={24}
        initialY={64}
        minX={-39}
        maxX={433}
      />
      <BottomAmbientOrb
        width={134.4}
        height={134.4}
        color="#83FFE2"
        blur={80}
        duration={2275}
        initialX={236}
        initialY={30}
        minX={-39}
        maxX={433}
      />
      <BottomAmbientOrb
        width={130}
        height={130}
        color="#BB4CFF"
        blur={100}
        duration={2600}
        initialX={330}
        initialY={52}
        minX={-39}
        maxX={433}
      />
    </div>
  );
}

function BottomAmbientOrb({
  width,
  height,
  color,
  blur,
  duration,
  initialX,
  initialY,
  minX,
  maxX,
}: {
  width: number;
  height: number;
  color: string;
  blur: number;
  duration: number;
  initialX: number;
  initialY: number;
  minX: number;
  maxX: number;
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  useEffect(() => {
    const nextPosition = () => {
      setPosition({
        x: minX + Math.random() * (maxX - minX),
        y: Math.random() * 100,
      });
    };

    const timeout = window.setTimeout(nextPosition, 120);
    const interval = window.setInterval(nextPosition, duration);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [duration, maxX, minX]);

  return (
    <div
      className="tutor-bottom-orb"
      style={{
        position: "absolute",
        width,
        height,
        left: 0,
        bottom: 0,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        transform: `translate3d(${position.x - width / 2}px, -${position.y}px, 0)`,
        transition: `transform ${duration}ms linear`,
        willChange: "transform",
      }}
    />
  );
}

function TutorHero() {
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        width: 393,
        paddingLeft: 40,
        paddingRight: 40,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{ width: 393, flexShrink: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/tutor-teacher-hero.png"
          alt=""
          draggable={false}
          style={{
            width: 393,
            height: "auto",
            display: "block",
          }}
        />
      </div>
      <p
        style={{
          margin: 0,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          fontWeight: 700,
          fontSize: 24,
          lineHeight: "24px",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        Your tutor for any subject
      </p>
    </div>
  );
}

function TutorRingCarousel({
  activeIndex,
  setActiveIndex,
  autoPlay,
}: {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  autoPlay: boolean;
}) {
  const pointerStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);
  const [trackIndex, setTrackIndex] = useState(
    TUTOR_CAROUSEL_CARDS.length + activeIndex,
  );
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const count = TUTOR_CAROUSEL_CARDS.length;
  const CARD_W = 184;
  const CARD_H = 174;
  // Figma Frame 2147226036 子卡坐标：left -91 / 105 / 301，中心间距 196px。
  const CARD_STEP = 196;
  const tripledCards = [
    ...TUTOR_CAROUSEL_CARDS,
    ...TUTOR_CAROUSEL_CARDS,
    ...TUTOR_CAROUSEL_CARDS,
  ];
  const logicalIndex = ((trackIndex % count) + count) % count;
  // 连续虚拟位置：track 本身在拖动时用 dragOffset 平移，
  // 每张卡片的 rotate / scale / y 也必须使用同一个连续位置计算，
  // 否则拖动过程中只有位置变，旋转会等松手后才跳变。
  const visualTrackIndex = trackIndex - dragOffset / CARD_STEP;

  useEffect(() => {
    setActiveIndex(logicalIndex);
  }, [logicalIndex, setActiveIndex]);

  useEffect(() => {
    if (!autoPlay) return;
    if (dragging) return;
    const id = window.setInterval(() => {
      setTransitionEnabled(true);
      setTrackIndex((prev) => prev + 1);
    }, 2500);
    return () => window.clearInterval(id);
  }, [autoPlay, dragging]);

  const setByDirection = (direction: -1 | 1) => {
    setTransitionEnabled(true);
    setTrackIndex((prev) => prev + direction);
  };

  const snapLoopBoundary = () => {
    setTrackIndex((prev) => {
      if (prev < count || prev >= count * 2) {
        const normalized = count + (((prev % count) + count) % count);
        if (normalized !== prev) {
          setTransitionEnabled(false);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setTransitionEnabled(true));
          });
          return normalized;
        }
      }
      return prev;
    });
  };

  return (
    <div
      className="relative w-full"
      style={{
        // 对齐 Figma：Frame 2147226036 是 176px 高。
        // 由父级 Frame 2147226037 负责与 hero 形成 gap 48 的组。
        height: 176,
        overflow: "visible",
        touchAction: "pan-y",
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        pointerStartX.current = event.clientX;
        dragDeltaX.current = 0;
        setDragging(true);
        setTransitionEnabled(false);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (pointerStartX.current === null) return;
        const delta = event.clientX - pointerStartX.current;
        dragDeltaX.current = delta;
        setDragOffset(delta);
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return;
        event.currentTarget.releasePointerCapture(event.pointerId);
        const delta = dragDeltaX.current;
        pointerStartX.current = null;
        dragDeltaX.current = 0;
        setDragOffset(0);
        setDragging(false);
        setTransitionEnabled(true);
        if (Math.abs(delta) < CARD_STEP * 0.18) return;
        // 左滑看下一张，右滑看上一张
        setByDirection(delta < 0 ? 1 : -1);
      }}
      onPointerCancel={() => {
        pointerStartX.current = null;
        dragDeltaX.current = 0;
        setDragOffset(0);
        setDragging(false);
        setTransitionEnabled(true);
      }}
    >
      <div
        className="absolute top-0 left-1/2 will-change-transform"
        style={{
          transform: `translate(calc(-${CARD_W / 2}px - ${trackIndex * CARD_STEP}px + ${dragOffset}px), 0px)`,
          transition: transitionEnabled
            ? "transform 1.512s cubic-bezier(0.32, 0.72, 0, 1)"
            : "none",
        }}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform") snapLoopBoundary();
        }}
      >
        {tripledCards.map((card, index) => {
          const offset = index - visualTrackIndex;
          const distance = Math.abs(offset);
          const clamped = Math.max(-2, Math.min(2, offset));
          const scale =
            distance <= 1
              ? 1 - distance * 0.04
              : Math.max(0.9, 0.96 - (distance - 1) * 0.06);
          const rotate = clamped * 4;
          const y = Math.min(10, distance * 10);

          return (
            <button
              key={`${card.id}-${index}`}
              type="button"
              aria-label={`Tutor card ${index + 1}`}
              onClick={() => {
                setTransitionEnabled(true);
                setTrackIndex(index);
              }}
              style={{
                position: "absolute",
                left: index * CARD_STEP,
                top: 0,
                width: CARD_W,
                height: CARD_H,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transform: `translateY(${y}px) rotate(${rotate}deg) scale(${scale})`,
                opacity: 1,
                transformOrigin: "center center",
                transition: transitionEnabled
                  ? "transform 1.512s cubic-bezier(0.32, 0.72, 0, 1)"
                  : "none",
                willChange: "transform",
              }}
            >
              <TutorCarouselCardView card={card} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TutorCarouselCardView({ card }: { card: TutorCarouselCard }) {
  return (
    <div
      style={{
        width: 184,
        height: 174,
        borderRadius: 24,
        background: "#FFFFFF",
        boxShadow: "0px 16px 32px rgba(0, 0, 0, 0.04)",
        padding: 12,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: 0,
        }}
      >
        <SubjectIcon subject={card.tagText} color={card.tagColor} />
        <p
          style={{
            margin: 0,
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "16.8px",
            color: "#111111",
            textAlign: "left",
            whiteSpace: "pre-line",
          }}
        >
          {card.question}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            padding: "6px 8px",
            borderRadius: 100,
            background: card.tagBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 500,
              fontSize: 10,
              lineHeight: "10px",
              color: card.tagColor,
            }}
          >
            {card.tagText}
          </span>
        </div>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 100,
            background: "#EDEEF3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SmallChevronRight />
        </div>
      </div>
    </div>
  );
}

function SubjectIcon({ subject, color }: { subject: string; color: string }) {
  const assetSubject = subject.toLowerCase();
  if (
    assetSubject === "geometry" ||
    assetSubject === "algebra" ||
    assetSubject === "physics" ||
    assetSubject === "history" ||
    assetSubject === "biology"
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/figma/tutor/subject-icons/${assetSubject}@3x.png`}
        alt=""
        draggable={false}
        className="h-[40px] w-[40px]"
      />
    );
  }

  const iconProps = {
    width: 40,
    height: 40,
    viewBox: "0 0 120 120",
    fill: "none",
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": true,
  } as const;
  const strokeProps = {
    stroke: color,
    strokeWidth: 7.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  if (subject === "Geometry") {
    return (
      <svg {...iconProps}>
        <circle
          cx="60"
          cy="44"
          r="18"
          {...strokeProps}
        />
        <path
          d="M60 18V28"
          {...strokeProps}
        />
        <path
          d="M50 60L24 102"
          {...strokeProps}
        />
        <path
          d="M70 60L96 102"
          {...strokeProps}
        />
        <path
          d="M36 75C52 84 72 84 88 75C97 68 102 57 102 44"
          {...strokeProps}
        />
      </svg>
    );
  }

  if (subject === "Biology") {
    return (
      <svg {...iconProps}>
        <path
          d="M25 76C25 45 53 22 91 25C95 63 72 94 33 95"
          {...strokeProps}
        />
        <path
          d="M34 91C47 72 65 53 88 29"
          {...strokeProps}
        />
      </svg>
    );
  }

  if (subject === "Algebra") {
    return (
      <svg {...iconProps}>
        <path
          d="M26 36L56 84M56 36L26 84"
          {...strokeProps}
        />
        <path
          d="M73 47H98M85.5 34.5V59.5"
          {...strokeProps}
        />
        <path
          d="M73 82H98"
          {...strokeProps}
        />
      </svg>
    );
  }

  if (subject === "Chemistry") {
    return (
      <svg {...iconProps}>
        <path
          d="M43 22H77M52 22V50L28 88C24 96 30 103 39 103H81C90 103 96 96 92 88L68 50V22"
          {...strokeProps}
        />
        <path
          d="M39 80H81"
          {...strokeProps}
        />
      </svg>
    );
  }

  if (subject === "Physics") {
    return (
      <svg {...iconProps}>
        <circle cx="60" cy="60" r="10" fill={color} />
        <ellipse
          cx="60"
          cy="60"
          rx="48"
          ry="18"
          stroke={color}
          strokeWidth="7.5"
          transform="rotate(45 60 60)"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="48"
          ry="18"
          stroke={color}
          strokeWidth="7.5"
          transform="rotate(-45 60 60)"
        />
      </svg>
    );
  }

  if (subject === "History") {
    return (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
        <path
          d="M8 7.5H15.5C17.8 7.5 19.2 8.2 20 9.2C20.8 8.2 22.2 7.5 24.5 7.5H32C34.2 7.5 36 9.3 36 11.5V27.5C36 29.7 34.2 31.5 32 31.5H25.8C24.3 31.5 22.8 31.9 21.6 32.8L20 34L18.4 32.8C17.2 31.9 15.7 31.5 14.2 31.5H8C5.8 31.5 4 29.7 4 27.5V11.5C4 9.3 5.8 7.5 8 7.5Z"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 9.2V34M11 16H16M12 21H16"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (subject === "Math") {
    return (
      <svg {...iconProps}>
        <path
          d="M28 38H92"
          {...strokeProps}
        />
        <path
          d="M46 38C46 60 42 80 33 96"
          {...strokeProps}
        />
        <path
          d="M74 38C74 60 78 80 87 96"
          {...strokeProps}
        />
        <path
          d="M37 76H83"
          {...strokeProps}
        />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <circle cx="60" cy="60" r="43" stroke={color} strokeWidth="10" />
      <path
        d="M17 60H103M60 17C47 30 40 45 40 60C40 75 47 90 60 103M60 17C73 30 80 45 80 60C80 75 73 90 60 103"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SmallChevronRight() {
  return (
    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" aria-hidden>
      <path
        d="M2 1.5L5.5 4.5L2 7.5"
        stroke="#111111"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TutorTitleHeader({ onOpenHistory }: { onOpenHistory: () => void }) {
  return (
    <div
      className="absolute left-0 right-0 top-0"
      style={{
        height: 92,
        zIndex: 20,
      }}
    >
      {/* 工具栏 — Figma node 2004:17308 / Title */}
      <div
        className="absolute left-0 right-0 flex items-stretch"
        style={{
          top: 44,
          height: 48,
          padding: "12px 16px 4px",
          boxSizing: "border-box",
          gap: 10,
        }}
      >
        {/* 左侧占位，与右侧 Share and More Icons 等宽逻辑保持中心 Tutor */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* 中间 Model selection：Tutor */}
        <div
          className="flex items-center justify-center"
          style={{
            height: 32,
            borderRadius: 100,
            padding: "0 2px",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "16px",
              color: "#111111",
            }}
          >
            Tutor
          </span>
        </div>

        {/* 右侧 history icon */}
        <div
          className="flex items-center justify-end"
          style={{
            flex: 1,
            minWidth: 0,
            gap: 8,
          }}
        >
          <PressableImageButton
            src="/figma/tutor/tutor-history-icon.png"
            label="History"
            width={32}
            height={32}
            onClick={onOpenHistory}
          />
        </div>
      </div>
    </div>
  );
}

function TutorHistoryScreen({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{ background: "#F6F8FA" }}
    >
      <TutorHistoryHeader onBack={onBack} />
      <div
        className="absolute left-0 right-0"
        style={{
          top: 92,
          bottom: 0,
          overflowY: "auto",
          paddingBottom: 54,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {HISTORY_SECTIONS.map((section) => (
          <HistorySectionView key={section.label} section={section} />
        ))}
      </div>
    </div>
  );
}

function TutorLoadingScreen({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete: () => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setActiveStep(1), 4000),
      window.setTimeout(() => setActiveStep(2), 8000),
      window.setTimeout(() => onCompleteRef.current(), 13200),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{
        zIndex: 90,
        background: "#F6F8FA",
      }}
    >
      <TutorLoadingHeader onBack={onBack} />
      <div
        className="absolute left-0"
        style={{
          top: 124,
          width: 393,
          padding: "40px 24px",
          boxSizing: "border-box",
        }}
      >
        <LoadingAvatar />
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          {LOADING_STEPS.map((step, index) => (
            <div key={step}>
              <LoadingStep title={step} active={activeStep === index} />
              {index < LOADING_STEPS.length - 1 ? <LoadingConnector /> : null}
            </div>
          ))}
        </div>
      </div>
      <LoadingQuestionCard top={459} />
      <HomeIndicator />
    </div>
  );
}

function TutorAnswerPreviewScreen({
  onBack,
  modules,
}: {
  onBack: () => void;
  modules: readonly (typeof EXPLANATION_MODULES)[number][];
}) {
  const [paused, setPaused] = useState(false);
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [ratingSheetVisible, setRatingSheetVisible] = useState(false);

  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{ zIndex: 95, background: "#FFFFFF" }}
    >
      <TutorAnswerPreviewHeader onBack={() => setRatingSheetVisible(true)} />
      <ExplanationContentStream
        paused={paused || voiceInputActive}
        modules={modules}
      />
      <div
        className="tutor-preview-enter"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 393,
          height: 256,
          animation:
            "tutor-preview-bottom-enter 620ms cubic-bezier(0.16, 1, 0.3, 1) 130ms both",
          willChange: "transform, opacity",
          zIndex: 10,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 393,
            height: 80,
            left: 0,
            bottom: 176,
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 393,
            height: 176,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 393,
              height: 100,
              left: 0,
              bottom: 0,
              background: "rgba(38, 92, 255, 0.8)",
              opacity: 0.44,
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 80,
              height: 80,
              left: "calc(50% - 40px - 0.5px)",
              bottom: -33,
              borderRadius: "50%",
              background: "#6E90FF",
              filter: "blur(45px)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 100,
            width: 393,
            height: 76,
            padding: "8px 24px 24px",
            boxSizing: "border-box",
            opacity: voiceInputActive ? 0 : 1,
            transform: voiceInputActive ? "translateY(10px)" : "translateY(0)",
            transition:
              "opacity 220ms cubic-bezier(0.4, 0, 0.2, 1), transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: voiceInputActive ? "none" : "auto",
            zIndex: 2,
          }}
        >
          <TypewriterTwoLineText
            text={ANSWER_PREVIEW_PLACEHOLDER}
            paused={paused || voiceInputActive}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 176,
            opacity: voiceInputActive ? 1 : 0,
            transform: voiceInputActive ? "translateY(0)" : "translateY(24px)",
            transition:
              "opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: "0ms",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <TutorBottomAmbientGlow />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 100,
            opacity: voiceInputActive ? 0 : 1,
            transform: voiceInputActive ? "translateY(24px)" : "translateY(0)",
            transition:
              "opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDelay: voiceInputActive ? "0ms" : "220ms",
            pointerEvents: voiceInputActive ? "none" : "auto",
            zIndex: 2,
          }}
        >
          <TutorAnswerInputBar
            paused={paused}
            onTogglePause={() => setPaused((value) => !value)}
            onVoiceInput={() => setVoiceInputActive(true)}
          />
        </div>
        <VoiceInputBar
          active={voiceInputActive}
          onCancel={() => setVoiceInputActive(false)}
          onSubmit={() => setVoiceInputActive(false)}
          topOffset={156}
          zIndex={4}
        />
      </div>
      <HomeIndicator />
      {ratingSheetVisible ? (
        <RatingBottomSheet
          onSubmit={onBack}
        />
      ) : null}
    </div>
  );
}

function RatingBottomSheet({ onSubmit }: { onSubmit: () => void }) {
  const [rating, setRating] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [tappedStar, setTappedStar] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const ratingLabels = [
    "",
    "“Very unsatisfied”",
    "Unsatisfied",
    "“Okay”",
    "“Satisfied”",
    "“Very satisfied”",
  ];
  const showTags = rating > 0 && rating < 5;
  const canSubmit = feedback.trim().length > 0 || (showTags && selectedTag !== null);
  const tagAreaHeight = expanded && showTags ? 200 : 0;
  const sheetHeight = expanded ? 392 + tagAreaHeight : 244;
  const ratingTags = [
    "Hard to follow",
    "Wrong explanation",
    "Messy whiteboard",
    "Misunderstands me",
    "Slow response",
    "Got stuck",
    "Graph errors",
    "Too fast",
  ];

  const selectRating = (value: number) => {
    setRating(value);
    setSelectedTag(null);
    setExpanded(true);
    setTappedStar(value);
    window.setTimeout(() => setTappedStar(null), 180);
  };

  const closeWithTransition = (callback: () => void) => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(callback, 380);
  };

  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 120 }}
    >
      <button
        type="button"
        aria-label="Rating backdrop"
        style={{
          position: "absolute",
          inset: 0,
          border: "none",
          padding: 0,
          background: "rgba(17, 17, 17, 0.5)",
          cursor: "default",
          animation: "tutor-rating-backdrop-enter 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
          opacity: closing ? 0 : 1,
          transition: "opacity 320ms cubic-bezier(0.4, 0, 0.2, 1)",
          WebkitTapHighlightColor: "transparent",
        }}
      />
      <div
        className="tutor-rating-sheet"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 393,
          height: sheetHeight,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          background: "#FFFFFF",
          overflow: "hidden",
          animation:
            closing
              ? "tutor-rating-sheet-exit 320ms cubic-bezier(0.4, 0, 0.2, 1) both"
              : "tutor-rating-sheet-enter 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
          transition:
            "height 520ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ width: 393, height: 32, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 12,
              width: 32,
              height: 4,
              borderRadius: 2,
              background: "#C4C6C9",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px 8px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "30px",
              color: "#111111",
            }}
          >
            How was this session?
          </p>
          <button
            type="button"
            aria-label="Close rating"
            onClick={() => closeWithTransition(onSubmit)}
            style={{
              width: 28,
              height: 28,
              padding: 0,
              border: "none",
              borderRadius: 15,
              background: "rgba(120, 120, 128, 0.12)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/tutor/rating/close.svg"
              alt=""
              draggable={false}
              style={{ width: 10, height: 10, display: "block" }}
            />
          </button>
        </div>
        <div
          style={{
            minHeight: expanded ? 56 : 80,
            padding: expanded ? "8px 20px 0" : "0 24px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: expanded ? "flex-start" : "center",
            justifyContent: "center",
            gap: expanded ? 8 : 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: expanded ? "flex-start" : "center",
              gap: expanded ? 12 : 16,
              width: "100%",
            }}
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const selected = value <= rating;
              const tapped = tappedStar === value;
              const size = expanded ? 32 : 40;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star rating`}
                  onClick={() => selectRating(value)}
                  style={{
                    width: size,
                    height: size,
                    padding: 0,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    transform: tapped ? "scale(1.22)" : "scale(1)",
                    transition:
                      "width 520ms cubic-bezier(0.16, 1, 0.3, 1), height 520ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected ? "/figma/tutor/rating/star-active.svg" : "/figma/tutor/rating/star-inactive.svg"}
                    alt=""
                    draggable={false}
                    style={{ width: size, height: size, display: "block" }}
                  />
                </button>
              );
            })}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "14px",
              color: "#989B9E",
              opacity: expanded ? 1 : 0,
              transform: expanded ? "translateY(0)" : "translateY(-4px)",
              transition:
                "opacity 360ms cubic-bezier(0.16, 1, 0.3, 1), transform 360ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {ratingLabels[rating]}
          </p>
        </div>
        <div
          style={{
            height: tagAreaHeight,
            padding: showTags ? "8px 20px 0" : "0 20px",
            boxSizing: "border-box",
            overflow: "hidden",
            transition:
              "height 520ms cubic-bezier(0.16, 1, 0.3, 1), padding 520ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              paddingTop: 8,
              paddingBottom: 16,
              boxSizing: "border-box",
              opacity: showTags ? 1 : 0,
              transform: showTags ? "translateY(0)" : "translateY(-8px)",
              transition:
                "opacity 320ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: showTags ? "auto" : "none",
            }}
          >
            {ratingTags.map((tag) => {
              const selected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  style={{
                    height: 36,
                    padding: 8,
                    borderRadius: 12,
                    border: selected ? "1px solid #007AFF" : "1px solid #E6E8EA",
                    background: selected ? "#ECF5FF" : "#FFFFFF",
                    color: selected ? "#007AFF" : "#111111",
                    fontFamily:
                      "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: "19.6px",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            height: expanded ? 172 : 0,
            padding: expanded ? "16px 20px" : "0 20px",
            boxSizing: "border-box",
            overflow: "hidden",
            transition:
              "height 520ms cubic-bezier(0.16, 1, 0.3, 1), padding 520ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 140,
              borderRadius: 16,
              background: "#F3F4F9",
              padding: "12px 16px 32px",
              boxSizing: "border-box",
              opacity: expanded ? 1 : 0,
              transition: "opacity 360ms ease",
            }}
          >
            <textarea
              className="tutor-rating-textarea"
              value={feedback}
              maxLength={500}
              placeholder="Tell us what you liked!"
              onChange={(event) => setFeedback(event.target.value)}
              style={{
                width: "100%",
                height: "100%",
                padding: 0,
                border: "none",
                outline: "none",
                resize: "none",
                background: "transparent",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#111111",
                caretColor: "#007AFF",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                display: "flex",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "16.8px",
                letterSpacing: -0.6,
              }}
            >
              <span style={{ color: "#007AFF" }}>{feedback.length}</span>
              <span style={{ color: "#C4C6C9" }}>/500</span>
            </div>
          </div>
        </div>
        <div style={{ padding: "8px 20px 0", background: "#FFFFFF" }}>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) return;
              closeWithTransition(onSubmit);
            }}
            style={{
              width: "100%",
              height: 52,
              border: "none",
              borderRadius: 100,
              background: canSubmit ? "#007AFF" : "#EEEEEE",
              color: canSubmit ? "#FFFFFF" : "#C4C6C9",
              cursor: canSubmit ? "pointer" : "default",
              fontFamily:
                "Poppins, Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "24px",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            Submit
          </button>
        </div>
        <div style={{ height: 34 }} />
      </div>
    </div>
  );
}

function TutorAnswerPreviewHeader({ onBack }: { onBack: () => void }) {
  const [selectedSpeed, setSelectedSpeed] =
    useState<(typeof SPEED_OPTIONS)[number]>("1.00X");
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [speedButtonPressed, setSpeedButtonPressed] = useState(false);

  return (
    <div
      className="absolute left-0 top-0 tutor-preview-enter"
      style={{
        width: 393,
        height: 92,
        background: "#FFFFFF",
        zIndex: 5,
        animation:
          "tutor-preview-header-enter 620ms cubic-bezier(0.16, 1, 0.3, 1) both",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          top: 56,
          height: 32,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            style={{
              width: 32,
              height: 32,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <LoadingBackArrowIcon />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TutorAvatar />
          <span
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "16px",
              color: "#111111",
              whiteSpace: "nowrap",
            }}
          >
            AI Tutor
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            aria-label="Select playback speed"
            aria-expanded={speedMenuOpen}
            onPointerDown={() => setSpeedButtonPressed(true)}
            onPointerUp={() => setSpeedButtonPressed(false)}
            onPointerLeave={() => setSpeedButtonPressed(false)}
            onPointerCancel={() => setSpeedButtonPressed(false)}
            onClick={() => setSpeedMenuOpen((open) => !open)}
            style={{
              height: 24,
              padding: "6px 10px",
              border: "none",
              borderRadius: 100,
              background: speedButtonPressed ? "#DDE0E4" : "#EDEEF3",
              boxSizing: "border-box",
              cursor: "pointer",
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              lineHeight: "12px",
              color: "#111111",
              transform: speedButtonPressed ? "scale(0.94)" : "scale(1)",
              transformOrigin: "center center",
              transition:
                "transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1), background 120ms ease",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {selectedSpeed}
          </button>
        </div>
      </div>
      {speedMenuOpen ? (
        <>
          <button
            type="button"
            aria-label="Close playback speed menu"
            onClick={() => setSpeedMenuOpen(false)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 393,
              height: 852,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "default",
              zIndex: 30,
              WebkitTapHighlightColor: "transparent",
            }}
          />
          <SpeedSelectionMenu
            selectedSpeed={selectedSpeed}
            onSelect={(speed) => {
              setSelectedSpeed(speed);
              setSpeedMenuOpen(false);
            }}
          />
        </>
      ) : null}
    </div>
  );
}

function SpeedSelectionMenu({
  selectedSpeed,
  onSelect,
}: {
  selectedSpeed: (typeof SPEED_OPTIONS)[number];
  onSelect: (speed: (typeof SPEED_OPTIONS)[number]) => void;
}) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: 261,
        top: 90,
        zIndex: 40,
        transformOrigin: "top center",
        animation:
          "tutor-speed-menu-pop 240ms cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/tutor/speed-menu/arrow.svg"
        alt=""
        draggable={false}
        style={{ width: 37, height: 6, display: "block", flexShrink: 0 }}
      />
      <div
        style={{
          width: 120,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 24,
          borderRadius: 12,
          background: "#FFFFFF",
          boxShadow: "0px 0px 60px rgba(0, 0, 0, 0.16)",
          boxSizing: "border-box",
        }}
      >
        {SPEED_OPTIONS.map((speed) => {
          const selected = speed === selectedSpeed;
          return (
            <button
              key={speed}
              type="button"
              onClick={() => onSelect(speed)}
              style={{
                width: "100%",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "left",
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "14px",
                color: selected ? "#007AFF" : "#111111",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <span>{speed}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/figma/tutor/speed-menu/checkmark.svg"
                alt=""
                draggable={false}
                style={{
                  width: 12,
                  height: 12,
                  display: "block",
                  opacity: selected ? 1 : 0,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExplanationContentStream({
  paused,
  modules,
}: {
  paused: boolean;
  modules: readonly (typeof EXPLANATION_MODULES)[number][];
}) {
  const [visibleCount, setVisibleCount] = useState(1);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paused) return;
    if (visibleCount >= modules.length) return;

    const delays = [0, 3300, 4100, 3600, 4700, 3900];
    const timer = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(count + 1, modules.length));
    }, delays[visibleCount] ?? 4000);

    return () => window.clearTimeout(timer);
  }, [modules.length, paused, visibleCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [visibleCount]);

  return (
    <div
      ref={viewportRef}
      style={{
        position: "absolute",
        left: 0,
        top: 92,
        width: 393,
        bottom: 176,
        overflowY: "auto",
        overflowX: "hidden",
        zIndex: 0,
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
      }}
    >
      <div
        style={{
          width: 393,
          padding: "16px 24px 80px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {modules.slice(0, visibleCount).map((module, index) => (
          <div
            key={`${module.kind}-${index}`}
            style={{
              animation:
                "tutor-preview-bottom-enter 520ms cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            <ExplanationModule kind={module.kind} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExplanationModule({
  kind,
}: {
  kind: (typeof EXPLANATION_MODULES)[number]["kind"];
}) {
  if (kind === "question") {
    return (
      <div
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 20,
          border: "1px solid #E6E8EA",
          background: "#FFFFFF",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <p style={explanationTitleStyle}>Your question</p>
        <p style={explanationBodyStyle}>
          Solve for all real values of <strong style={{ fontFamily: "serif", fontSize: 22 }}>x</strong>
        </p>
        <p style={{ ...explanationBodyStyle, fontFamily: "serif" }}>
          √(x + 7) + √(2x − 1) = 8
        </p>
      </div>
    );
  }

  if (kind === "overview") {
    return (
      <section style={sectionStyle}>
        <p style={explanationTitleStyle}>Overview</p>
        <div style={{ ...cardStyle, background: "#F2F6FF" }}>
          <ul style={{ ...explanationBodyStyle, margin: 0, paddingLeft: 24 }}>
            <li style={{ marginBottom: 4 }}>Identify the domain for both radicals.</li>
            <li style={{ marginBottom: 4 }}>Isolate one radical before squaring.</li>
            <li>Check the final solution in the original equation.</li>
          </ul>
        </div>
      </section>
    );
  }

  if (kind === "formula") {
    return (
      <section style={sectionStyle}>
        <p style={explanationTitleStyle}>Step 1</p>
        <div style={cardStyle}>
          <p style={{ ...explanationBodyStyle, margin: 0, fontFamily: "serif" }}>
            √(2x − 1) = 8 − √(x + 7)
          </p>
        </div>
      </section>
    );
  }

  if (kind === "diagram") {
    return (
      <section style={sectionStyle}>
        <p style={explanationTitleStyle}>Key idea</p>
        <div style={cardStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/tutor/explanation/diagram.png"
            alt=""
            draggable={false}
            style={{ width: "100%", display: "block", borderRadius: 16 }}
          />
        </div>
      </section>
    );
  }

  if (kind === "text-image") {
    return (
      <section style={sectionStyle}>
        <p style={explanationTitleStyle}>Check</p>
        <p style={{ ...explanationBodyStyle, margin: 0 }}>
          Squaring can introduce extraneous answers, so substitute candidates back into the original expression.
        </p>
        <div style={cardStyle}>
          <div style={{ border: "1px solid #E6E8EA", borderRadius: 16, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/figma/tutor/explanation/graph.png"
              alt=""
              draggable={false}
              style={{ width: "100%", display: "block" }}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <div style={{ ...cardStyle, background: "#F2F6FF", gap: 16 }}>
      <p style={{ ...explanationTitleStyle, color: "#007AFF" }}>RECAP</p>
      <p style={{ ...explanationBodyStyle, margin: 0 }}>
        The solution depends on isolating radicals carefully and verifying the result in the original equation.
      </p>
    </div>
  );
}

const explanationTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
  fontWeight: 700,
  fontSize: 16,
  lineHeight: "22.4px",
  color: "#111111",
};

const explanationBodyStyle: CSSProperties = {
  margin: 0,
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "24px",
  color: "#111111",
};

const sectionStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const cardStyle: CSSProperties = {
  width: "100%",
  padding: 16,
  borderRadius: 20,
  background: "#F5F7F9",
  boxSizing: "border-box",
};

function TutorAnswerInputBar({
  paused,
  onTogglePause,
  onVoiceInput,
}: {
  paused: boolean;
  onTogglePause: () => void;
  onVoiceInput: () => void;
}) {
  return (
    <div
      style={{
        height: 100,
        padding: "0 24px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 58,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <AnswerImageButton
          src={paused ? "/figma/tutor/answer-play-button.png" : "/figma/tutor/answer-pause-button.png"}
          label={paused ? "Resume explanation" : "Pause explanation"}
          width={58}
          height={58}
          onClick={onTogglePause}
        />
        <AnswerImageButton
          src="/figma/tutor/answer-mic-button.png"
          label="Voice input"
          width="flex"
          height={58}
          onClick={onVoiceInput}
          borderGlow
        />
        <AnswerImageButton
          src="/figma/tutor/answer-keyboard-button.png"
          label="Keyboard"
          width={58}
          height={58}
        />
      </div>
      <div style={{ height: 8, flexShrink: 0 }} />
      <div
        style={{
          position: "relative",
          width: 393,
          height: 34,
          flexShrink: 0,
        }}
      />
    </div>
  );
}

function AnswerImageButton({
  src,
  label,
  width,
  height,
  onClick,
  borderGlow = false,
}: {
  src: string;
  label: string;
  width: number | "flex";
  height: number;
  onClick?: () => void;
  borderGlow?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const numericWidth = width === "flex" ? undefined : width;
  const borderGlowGradient =
    "conic-gradient(from 0deg, #FFD60A 0deg, #FF9F0A 72deg, #FF375F 144deg, #BF5AF2 216deg, #0A84FF 288deg, #FFD60A 360deg)";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      style={{
        position: borderGlow ? "relative" : undefined,
        width: numericWidth,
        height,
        flex: width === "flex" ? 1 : undefined,
        flexShrink: width === "flex" ? undefined : 0,
        padding: 0,
        border: borderGlow ? 0 : "none",
        borderRadius: borderGlow ? 999 : undefined,
        background: "transparent",
        cursor: "pointer",
        transform: pressed ? "scale(0.95)" : "scale(1)",
        transition: "transform 0.1s ease-in-out",
        transformOrigin: "center center",
        isolation: borderGlow ? "isolate" : undefined,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {borderGlow ? (
        <>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: -16,
              borderRadius: 999,
              overflow: "hidden",
              opacity: 0.105,
              filter: "blur(16px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -80,
                background: borderGlowGradient,
                animation: "tutor-border-glow-spin 3.75s linear infinite",
              }}
            />
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              padding: 4,
              borderRadius: 999,
              overflow: "hidden",
              opacity: 0.7,
              filter: "blur(6px)",
              pointerEvents: "none",
              zIndex: 1,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -80,
                background: borderGlowGradient,
                animation: "tutor-border-glow-spin 3.75s linear infinite",
              }}
            />
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              padding: 2,
              borderRadius: 999,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 3,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: -80,
                background: borderGlowGradient,
                animation: "tutor-border-glow-spin 3.75s linear infinite",
              }}
            />
          </span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 3,
              zIndex: 2,
              borderRadius: "inherit",
              border: 0,
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1))",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{ display: "block" }}
            >
              <path
                d="M12 3.75C10.62 3.75 9.5 4.87 9.5 6.25V11C9.5 12.38 10.62 13.5 12 13.5C13.38 13.5 14.5 12.38 14.5 11V6.25C14.5 4.87 13.38 3.75 12 3.75Z"
                fill="#111111"
              />
              <path
                d="M6.75 10.75C6.75 13.65 9.1 16 12 16C14.9 16 17.25 13.65 17.25 10.75"
                fill="none"
                stroke="#111111"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M12 16V20.25M9.25 20.25H14.75"
                fill="none"
                stroke="#111111"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              width: width === "flex" ? "100%" : width,
              height,
              display: "block",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </>
      )}
    </button>
  );
}

function TypewriterTwoLineText({ text, paused }: { text: string; paused: boolean }) {
  const words = text.split(" ");
  const [visibleWordCount, setVisibleWordCount] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLParagraphElement | null>(null);
  const visibleText = words.slice(0, visibleWordCount).join(" ");
  const previewWord = words[visibleWordCount];

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => setVisibleWordCount(1));
    return () => window.cancelAnimationFrame(rafId);
  }, [text]);

  useEffect(() => {
    if (paused) return;
    if (visibleWordCount >= words.length) return;
    const word = words[visibleWordCount] || "";
    const pausePoints = new Set([
      Math.floor(words.length * 0.25),
      Math.floor(words.length * 0.5),
      Math.floor(words.length * 0.75),
    ]);
    const delay =
      (72 + Math.min(word.length, 10) * 8) * 1.95 +
      (pausePoints.has(visibleWordCount) ? 420 : 0);
    const timer = window.setTimeout(() => {
      setVisibleWordCount((count) => Math.min(count + 1, words.length));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [paused, visibleWordCount, words]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const nextOffset = Math.max(0, content.scrollHeight - container.clientHeight);
    setOffsetY(nextOffset);
  }, [visibleText]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: 44.8,
        overflow: "hidden",
      }}
    >
      <p
        ref={contentRef}
        style={{
          margin: 0,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "22.4px",
          color: "#595C60",
          wordBreak: "break-word",
          transform: `translateY(-${offsetY}px)`,
          transition: "transform 420ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {visibleText}
        {previewWord ? (
          <span
            key={`${visibleWordCount}-${previewWord}`}
            style={{
              opacity: 0,
              animation: "tutor-typewriter-preview-fade 220ms linear forwards",
            }}
          >
            {` ${previewWord}`}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function TutorLoadingHeader({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="absolute left-0 top-0"
      style={{ width: 393, height: 92, zIndex: 5 }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 56,
          width: 32,
          height: 32,
        }}
      >
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          style={{
            width: 32,
            height: 32,
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <LoadingBackArrowIcon />
        </button>
      </div>
    </div>
  );
}

function LoadingBackArrowIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.0713 16.1997L10.0713 16.1997"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M14.1211 11.1211L8.99979 16.2424L14.1211 21.3637"
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingAvatar() {
  return (
    <div
      style={{
        position: "relative",
        width: 64,
        height: 64,
        borderRadius: 1000,
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/tutor/loading/avatar.png"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          width: 140.8,
          height: 93.867,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -28%)",
          objectFit: "cover",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}

function LoadingStep({
  title,
  active = false,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 24 }}>
      <div
        style={{
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition:
            "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: active ? 1 : 0.65,
          transform: active ? "translateY(0)" : "translateY(1px)",
        }}
      >
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/figma/tutor/loading/thinking-active.svg"
            alt=""
            draggable={false}
            style={{
              width: 24,
              height: 24,
              display: "block",
              animation: "tutor-loading-star-spin 2.2s linear infinite",
            }}
          />
        ) : (
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#595C60",
            }}
          />
        )}
      </div>
      <span
        style={{
          position: "relative",
          display: "inline-block",
          transform: active ? "translateY(0)" : "translateY(1px)",
          transition:
            "transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span
          style={{
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
            fontWeight: active ? 700 : 400,
            fontSize: active ? 18 : 14,
            lineHeight: active ? "24px" : "20px",
            color: active ? "#000000" : "#595C60",
          opacity: active ? 1 : 0.78,
            whiteSpace: "nowrap",
            transition:
              "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), color 800ms cubic-bezier(0.16, 1, 0.3, 1), font-size 800ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {title}
        </span>
        {active ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              backgroundImage:
                "linear-gradient(90deg, rgba(255, 255, 255, 0) calc(50% - 50px), rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) calc(50% + 50px))",
              backgroundSize: "calc(100% + 200px) auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "tutor-loading-text-shine 2.8s linear infinite",
              pointerEvents: "none",
            }}
          >
            {title}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function LoadingConnector() {
  return (
    <div
      style={{
        height: 32,
        paddingLeft: 11.5,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 1,
          height: 32,
          borderRadius: 100,
          background: "#E6E8EA",
        }}
      />
    </div>
  );
}

function LoadingQuestionCard({ top }: { top: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top,
        width: 273,
        height: 160,
        borderRadius: 16,
        background: "rgba(255, 255, 255, 0.01)",
        boxShadow: "0px 32px 64px rgba(26, 38, 54, 0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          overflow: "hidden",
          clipPath: "inset(0 round 16px)",
          transform: "translateZ(0)",
          background: "#FFFFFF",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/loading/question-image.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 16,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            background: "rgba(0, 0, 0, 0.16)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/loading/question-image.png"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 203,
            height: "100%",
            transform: "translate(-50%, -50%)",
            objectFit: "contain",
            borderRadius: 16,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 273,
          height: 160,
          pointerEvents: "none",
        }}
      >
        <svg width="273" height="160" viewBox="0 0 273 160" fill="none">
          <rect
            x="3"
            y="3"
            width="267"
            height="154"
            rx="13"
            stroke="#FFFFFF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100,
              animation:
                "tutor-loading-border-grow 12s linear forwards",
            }}
          />
        </svg>
      </div>
    </div>
  );
}

function TutorHistoryHeader({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="absolute left-0 right-0 top-0"
      style={{
        height: 92,
        zIndex: 20,
        background: "#F6F8FA",
      }}
    >
      <div
        className="absolute left-0 right-0 flex items-stretch"
        style={{
          top: 44,
          height: 48,
          padding: "12px 16px 4px",
          boxSizing: "border-box",
          gap: 40,
        }}
      >
        <div className="flex items-center" style={{ flex: 1, minWidth: 0 }}>
          <button
            type="button"
            aria-label="Back to Tutor"
            onClick={onBack}
            style={{
              width: 32,
              height: 32,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <LoadingBackArrowIcon />
          </button>
        </div>
        <div
          className="flex items-center"
          style={{
            height: 32,
            gap: 6,
            borderRadius: 100,
            whiteSpace: "nowrap",
          }}
        >
          <TutorAvatar />
          <span
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "16px",
              color: "#111111",
            }}
          >
            AI Tutor
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }} />
      </div>
    </div>
  );
}

function HistorySectionView({ section }: { section: HistorySection }) {
  return (
    <section
      style={{
        width: "100%",
        padding: "16px 16px 8px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "12px",
          color: "#989B9E",
        }}
      >
        {section.label}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 174.5px)",
          gap: 12,
          height: 180,
        }}
      >
        {section.items.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  return (
    <button
      type="button"
      aria-label={item.title}
      style={{
        width: 174.5,
        height: 180,
        padding: 0,
        border: "none",
        borderRadius: 24,
        background: "#FFFFFF",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 159,
          height: 164,
          transform: "translate(-50%, -50%)",
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <HistoryCardContent item={item} />
      </div>
    </button>
  );
}

function HistoryCardContent({ item }: { item: HistoryItem }) {
  if (item.kind === "worksheet") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 8,
          boxSizing: "border-box",
          background: item.accent,
          color: "#111111",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        }}
      >
        <p style={{ margin: "0 0 6px", fontSize: 6, lineHeight: "8px" }}>
          ({item.body}) Polynomial. {item.title}
        </p>
        <MiniGraph />
      </div>
    );
  }

  if (item.kind === "article") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 8,
          boxSizing: "border-box",
          background: item.accent,
          color: "#111111",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        }}
      >
        <p style={{ margin: "0 0 6px", fontSize: 6, fontWeight: 700, lineHeight: "7px" }}>
          2016-2017: {item.body}
        </p>
        <p style={{ margin: 0, fontSize: 6, lineHeight: "7.5px" }}>
          &quot;{item.title}&quot; Use evidence from the passage to explain your answer.
        </p>
      </div>
    );
  }

  if (item.kind === "equation") {
    return (
      <div
        className="flex flex-col justify-center"
        style={{
          width: "100%",
          height: "100%",
          padding: 16,
          boxSizing: "border-box",
          background: item.accent,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          color: "#111111",
          textAlign: "left",
        }}
      >
        <p style={{ margin: "0 0 14px", fontSize: 12, lineHeight: "15px", color: "#6B7075" }}>
          {item.title}
        </p>
        <p style={{ margin: 0, fontSize: 18, lineHeight: "24px", fontWeight: 600 }}>
          {item.body}
        </p>
      </div>
    );
  }

  if (item.kind === "diagram") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: 14,
          boxSizing: "border-box",
          background: item.accent,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          color: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <SimpleDiagram />
        <div>
          <p style={{ margin: "0 0 5px", fontSize: 13, lineHeight: "16px", fontWeight: 600 }}>
            {item.title}
          </p>
          <p style={{ margin: 0, fontSize: 10, lineHeight: "12px", color: "#6B7075" }}>
            {item.body}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center"
      style={{
        width: "100%",
        height: "100%",
        padding: 16,
        boxSizing: "border-box",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        color: "#111111",
        textAlign: "left",
      }}
    >
      <p
        style={{
          margin: 0,
          fontWeight: 400,
          fontSize: 16,
          lineHeight: "24px",
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.title}
      </p>
      {item.body ? (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 12,
            lineHeight: "16px",
            color: "#6B7075",
          }}
        >
          {item.body}
        </p>
      ) : null}
    </div>
  );
}

function MiniGraph() {
  return (
    <svg width="143" height="118" viewBox="0 0 143 118" fill="none" aria-hidden>
      <rect width="143" height="118" fill="#E7E5DA" />
      {Array.from({ length: 15 }).map((_, index) => (
        <line key={`v-${index}`} x1={index * 10} y1="0" x2={index * 10} y2="118" stroke="#C9C6B8" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 13 }).map((_, index) => (
        <line key={`h-${index}`} x1="0" y1={index * 10} x2="143" y2={index * 10} stroke="#C9C6B8" strokeWidth="0.5" />
      ))}
      <path d="M72 0V118M0 58H143" stroke="#676767" strokeWidth="1" />
      <path d="M10 86C30 78 33 21 52 35C69 48 61 96 82 82C97 72 91 34 111 39C125 43 126 72 137 68" stroke="#111111" strokeWidth="1.5" fill="none" />
      <path d="M102 31L123 43M117 28L133 55" stroke="#111111" strokeWidth="1" />
    </svg>
  );
}

function SimpleDiagram() {
  return (
    <svg width="131" height="56" viewBox="0 0 131 56" fill="none" aria-hidden>
      <circle cx="30" cy="28" r="24" fill="#FFFFFF" />
      <circle cx="101" cy="28" r="24" fill="#FFFFFF" />
      <path d="M54 28H77" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M72 21L79 28L72 35" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="30" y="31" textAnchor="middle" fontSize="9" fontWeight="700" fill="#111111">Force</text>
      <text x="101" y="31" textAnchor="middle" fontSize="9" fontWeight="700" fill="#111111">Motion</text>
    </svg>
  );
}

function TutorAvatar() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/figma/tutor/tutor-header-avatar.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        width: 28,
        height: 28,
        display: "block",
        flexShrink: 0,
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}

function HomeIndicator() {
  return (
    <div
      className="absolute left-0 bottom-0 pointer-events-none"
      style={{ width: 393, height: 34, zIndex: 999 }}
    />
  );
}

function TutorBottomNav({
  activeTab,
  onChange,
}: {
  activeTab: TutorTabId;
  onChange: (tab: TutorTabId) => void;
}) {
  const [tappedTab, setTappedTab] = useState<TutorTabId | null>(null);

  const handleTabClick = (tab: TutorTabId) => {
    onChange(tab);
    setTappedTab(tab);
    window.setTimeout(() => setTappedTab(null), 140);
  };

  return (
    <div
      className="absolute left-0 bottom-0"
      style={{
        width: 393,
        height: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 56,
          paddingLeft: 16,
          paddingRight: 16,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {TAB_ITEMS.map((item) => (
          <TutorBottomNavItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            tapped={tappedTab === item.id}
            onClick={() => handleTabClick(item.id)}
          />
        ))}
      </div>
      <HomeIndicator />
    </div>
  );
}

function TutorBottomNavItem({
  item,
  active,
  tapped,
  onClick,
}: {
  item: { id: TutorTabId; label: string };
  active: boolean;
  tapped: boolean;
  onClick: () => void;
}) {
  const color = active ? "#007AFF" : "rgba(20, 30, 43, 0.3)";
  const iconSrc = `/figma/global/tabbar/${item.id}-${active ? "active" : "inactive"}.svg`;

  return (
    <button
      type="button"
      aria-label={item.label}
      aria-pressed={active}
      onClick={onClick}
      style={{
        position: "relative",
        width: "25%",
        height: 56,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        paddingTop: 12,
        boxSizing: "border-box",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          transform: tapped ? "scale(0.88)" : "scale(1)",
          transition: tapped
            ? "transform 0.07s ease-in"
            : "transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt=""
          draggable={false}
          style={{
            width: 24,
            height: 24,
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </span>
      <span
        style={{
          width: 56,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
          fontWeight: active && item.id === "tutor" ? 600 : 500,
          fontSize: 10,
          lineHeight: "normal",
          color,
          textAlign: "center",
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

function BottomCTA({ onSubmitVoice }: { onSubmitVoice: () => void }) {
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const submitVoice = () => {
    setVoiceInputActive(false);
    onSubmitVoice();
  };

  return (
    <div
      className="absolute"
      style={{
        bottom: 119,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 58,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 260,
          opacity: voiceInputActive ? 1 : 0,
          transform: voiceInputActive ? "translateY(0)" : "translateY(24px)",
          transition:
            "opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDelay: "0ms",
          pointerEvents: "none",
        }}
      >
        <TutorBottomAmbientGlow />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          paddingLeft: 24,
          paddingRight: 24,
          opacity: voiceInputActive ? 0 : 1,
          transform: voiceInputActive ? "translateY(24px)" : "translateY(0)",
          transition:
            "opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDelay: voiceInputActive ? "0ms" : "220ms",
          pointerEvents: voiceInputActive ? "none" : "auto",
        }}
      >
        {/* 三个按钮均为项目原图直接渲染，不做二次处理 */}
        <PressableImageButton
          src="/figma/tutor/tutor-btn-keyboard.png"
          label="Keyboard"
          width={58}
          height={58}
        />
        <PressableImageButton
          src="/figma/tutor/tutor-btn-snap.png"
          label="Snap a photo"
          width={197}
          height={58}
        />
        <PressableImageButton
          src="/figma/tutor/tutor-btn-mic.png"
          label="Microphone"
          width={58}
          height={58}
          onClick={() => setVoiceInputActive(true)}
          pressScale={1}
        />
      </div>
      <VoiceInputBar
        active={voiceInputActive}
        onCancel={() => setVoiceInputActive(false)}
        onSubmit={submitVoice}
      />
    </div>
  );
}

function VoiceInputBar({
  active,
  onCancel,
  onSubmit,
  topOffset = 0,
  zIndex,
}: {
  active: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  topOffset?: number;
  zIndex?: number;
}) {
  return (
    <div
      aria-hidden={!active}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topOffset,
        height: 58,
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(24px)",
        transition:
          "opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), transform 240ms cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: active ? "220ms" : "0ms",
        pointerEvents: active ? "auto" : "none",
        zIndex,
      }}
    >
      <button
        type="button"
        aria-label="Cancel voice input"
        onClick={onCancel}
        style={{
          position: "absolute",
          left: 24,
          top: 0,
          width: 58,
          height: 58,
          padding: 0,
          border: "none",
          borderRadius: "50%",
          background: "#F1F3F6",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/voice-close.png"
          alt=""
          draggable={false}
          style={{
            width: 58,
            height: 58,
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </button>
      <VoiceWaveform />
      <button
        type="button"
        aria-label="Submit voice input"
        onClick={onSubmit}
        style={{
          position: "absolute",
          left: 311,
          top: 0,
          width: 58,
          height: 58,
          padding: 0,
          border: "none",
          borderRadius: "50%",
          background: "#F1F3F6",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/figma/tutor/voice-submit.png"
          alt=""
          draggable={false}
          style={{
            width: 58,
            height: 58,
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </button>
    </div>
  );
}

function VoiceWaveform() {
  const bars = Array.from({ length: 40 }, (_, index) => index);

  return (
    <div
      style={{
        position: "absolute",
        left: 94,
        top: 19,
        width: 205,
        height: 20,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {bars.map((index) => {
        const duration = 760 + (index % 7) * 80;
        const delay = -((index * 97) % 920);
        const initialScale = [0.52, 0.22, 0.84, 0.32, 0.64, 1, 0.42][
          index % 7
        ];

        return (
        <div
          key={index}
          style={{
            width: 3,
            height: 19.2,
            borderRadius: 100,
            background: "#FFFFFF",
            flexShrink: 0,
            transform: `scaleY(${initialScale})`,
            transformOrigin: "center center",
            animation: `tutor-voice-bar-size ${duration}ms ease-in-out ${delay}ms infinite`,
          }}
        />
        );
      })}
    </div>
  );
}

function PressableImageButton({
  src,
  label,
  width,
  height,
  onClick,
  pressScale = 0.95,
}: {
  src: string;
  label: string;
  width: number;
  height: number;
  onClick?: () => void;
  pressScale?: number;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onClick={onClick}
      style={{
        width,
        height,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        flexShrink: 0,
        transform: pressed ? `scale(${pressScale})` : "scale(1)",
        transition: "transform 0.1s ease-in-out",
        transformOrigin: "center center",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          width,
          height,
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </button>
  );
}

