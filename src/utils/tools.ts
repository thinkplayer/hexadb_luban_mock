/**
 * 生成随机的十六进制颜色值。
 * @returns 随机的十六进制颜色字符串（例如 "#RRGGBB"）。
 */
export function getRandomColor(): string {
  // 可用的十六进制字符
  const letters = "0123456789ABCDEF";
  let color = "#";

  // 生成六位颜色代码
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

/**
 * 生成带有指定透明度的颜色值。
 * @param color 原始颜色，如 "#RRGGBB"。
 * @param alpha 透明度值（0-1），0 完全透明，1 完全不透明。
 * @returns 带有指定透明度的颜色，如 "rgba(R, G, B, A)"。
 */
export function adjustColorOpacity(color: string, alpha: number): string {
  // 提取原始颜色的红色、绿色和蓝色通道值
  const red = parseInt(color.slice(1, 3), 16);
  const green = parseInt(color.slice(3, 5), 16);
  const blue = parseInt(color.slice(5, 7), 16);

  // 确保 alpha 在 0 到 1 之间
  alpha = Math.min(1, Math.max(0, alpha));

  // 生成带有透明度的颜色字符串
  const rgbaColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  return rgbaColor;
}
