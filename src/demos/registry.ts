import type { HomeExperimentVariant } from "@/demos/previews/home-v2-preview";
import type { StudyExperimentVariant } from "@/demos/previews/study-preview";

export type ScreenKey =
  | "home"
  | "solve"
  | "study"
  | "onboarding"
  | "tutor"
  | "flash-card-stack"
  | "flash-card-flip-swipe-away"
  | "paywall"
  | "practice-game";

export type StudyExperiment = StudyExperimentVariant;
export type HomeExperiment = HomeExperimentVariant;

export const SCREENS: {
  key: ScreenKey;
  title: string;
  href: string;
}[] = [
  { key: "home", title: "Home", href: "/home" },
  { key: "solve", title: "Solve", href: "/solve" },
  { key: "study", title: "Study", href: "/study" },
  { key: "onboarding", title: "Onboarding", href: "/onboarding" },
  { key: "tutor", title: "Tutor", href: "/tutor" },
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
  { key: "paywall", title: "Paywall", href: "/paywall" },
  { key: "practice-game", title: "PRACTICE game", href: "/practice-game" },
];

export const NAV_GROUPS: {
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

export const screenByKey = Object.fromEntries(
  SCREENS.map((screen) => [screen.key, screen]),
) as Record<ScreenKey, (typeof SCREENS)[number]>;

export function getActiveScreen(pathname: string): (typeof SCREENS)[number] {
  return SCREENS.find((screen) => screen.href === pathname) ?? SCREENS[0];
}

export function isHomeExperiment(value: string | null): value is HomeExperiment {
  return value === "experiment-a" || value === "experiment-b";
}

export function isStudyExperiment(
  value: string | null,
): value is StudyExperiment {
  return (
    value === "experiment-1" ||
    value === "experiment-1-no-image" ||
    value === "experiment-2" ||
    value === "experiment-2-no-image"
  );
}
