"use client";

import { useDevice, type DeviceKind } from "@/components/device-context";

/**
 * 各 demo 共用的响应式约定（断点 / 基准 / 安全区）
 *
 * 设计策略（"等比缩放 + 居中"）：
 *   - 所有 demo 仍以 iPhone 393×852 screen 作为基准设计稿
 *   - 通过 `<DemoCanvas>` 自动把内容等比 scale 到当前 device 的 screen 尺寸内
 *   - iPad 上是"按比例放大的 phone 视觉"（保持现有动画与视觉），
 *     未来某些 demo 需要专属 iPad layout 时再单独覆写
 *
 * 提供给 demo 的信息：
 *   - device kind（phone | ipad | ipad-portrait）
 *   - 该 device 的 screen 物理尺寸（与 cards-playground 中 preset 保持同步）
 *   - 安全区数值（status bar + home indicator）
 *   - 内边距（gutter，与 device 解耦的舒适内边距）
 */

export const BASE_SCREEN_W = 393;
export const BASE_SCREEN_H = 852;

export const SAFE_TOP = 14; // iOS status bar 高度（pt）
export const SAFE_BOTTOM = 9; // home indicator 上方呼吸距离（pt）

export type DeviceLayout = {
  device: DeviceKind;
  /** 当前 device screen 物理尺寸（pt，跟 PhoneFrame screen 一致） */
  screenW: number;
  screenH: number;
  /** 基准设计稿尺寸（永远是 393×852） */
  baseW: typeof BASE_SCREEN_W;
  baseH: typeof BASE_SCREEN_H;
  /** 安全区 */
  safeTop: number;
  safeBottom: number;
  /** 默认横向内边距（phone 16 / ipad 32） */
  gutter: number;
};

const SCREEN_SIZES: Record<DeviceKind, { w: number; h: number }> = {
  phone: { w: 393, h: 852 },
  ipad: { w: 1178, h: 818 },
  "ipad-portrait": { w: 818, h: 1178 },
};

export function useDeviceLayout(): DeviceLayout {
  const { device } = useDevice();
  const { w, h } = SCREEN_SIZES[device];
  const isPad = device === "ipad" || device === "ipad-portrait";
  return {
    device,
    screenW: w,
    screenH: h,
    baseW: BASE_SCREEN_W,
    baseH: BASE_SCREEN_H,
    safeTop: SAFE_TOP,
    safeBottom: SAFE_BOTTOM,
    gutter: isPad ? 32 : 16,
  };
}
