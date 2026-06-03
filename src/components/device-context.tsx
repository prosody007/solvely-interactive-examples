"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DeviceKind = "phone" | "ipad" | "ipad-portrait";

type DeviceContextValue = {
  device: DeviceKind;
  setDevice: (next: DeviceKind) => void;
  toggleDevice: () => void;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

/**
 * 切换动画期间，"正在显示中的设备"（外观 / 尺寸 / 内部 demo 都基于它）。
 * 由 cards-playground 的 AutoScaledPhoneFrame 在飞出/飞入动画过程中提供，
 * 飞出阶段一直是旧 device，snap + 飞入开始才切到新 device。
 *
 * demo 内部应该消费 useDisplayDevice() 而不是 useDevice()，
 * 否则切换瞬间 demo 立即按新 device 渲染，但模拟器还在飞出动画显示旧外观，
 * 视觉上"旧模拟器里的内容跟着新 device 变了"，会出现错位。
 */
export const DisplayDeviceContext = createContext<DeviceKind | null>(null);

export function DeviceProvider({
  children,
  initial = "phone",
}: {
  children: ReactNode;
  initial?: DeviceKind;
}) {
  const [device, setDevice] = useState<DeviceKind>(initial);

  // 循环切换：phone → ipad → ipad-portrait → phone
  const toggleDevice = useCallback(() => {
    setDevice((prev) =>
      prev === "phone" ? "ipad" : prev === "ipad" ? "ipad-portrait" : "phone",
    );
  }, []);

  const value = useMemo(
    () => ({ device, setDevice, toggleDevice }),
    [device, toggleDevice],
  );

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
}

export function useDevice(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    // 提供安全 fallback 而不是 throw，避免在未包 Provider 的边缘场景下渲染崩溃
    return {
      device: "phone",
      setDevice: () => {},
      toggleDevice: () => {},
    };
  }
  return ctx;
}

/**
 * Hook：拿到"正在显示中的 device"。优先返回 DisplayDeviceContext 的值，
 * 没有时 fallback 到全局 device。demo 内部应该一律用这个，避免切换动画错位。
 */
export function useDisplayDevice(): DeviceKind {
  const display = useContext(DisplayDeviceContext);
  const { device } = useDevice();
  return display ?? device;
}
