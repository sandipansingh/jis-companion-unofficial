import { processColor } from 'react-native';

/**
 * Converts a color string to an rgba string with the given alpha value.
 * Returns "transparent" if the color cannot be processed.
 */
export function withAlpha(color: string, alpha: number): string {
  try {
    const processed = processColor(color);
    if (typeof processed !== 'number') {
      return 'transparent';
    }

    const colorInt = processed >>> 0;
    const red = (colorInt >> 16) & 255;
    const green = (colorInt >> 8) & 255;
    const blue = colorInt & 255;
    const clampedAlpha = Math.max(0, Math.min(1, alpha));

    return `rgba(${red}, ${green}, ${blue}, ${clampedAlpha})`;
  } catch {
    return 'transparent';
  }
}
