/**
 * QuickAccessActionCards.tsx
 *
 * Desktop-specific replacement for the mobile QuickAccessGrid.
 * Only imported from Home.web.tsx — never used in mobile files.
 *
 * Design:
 *   - 4-column grid at >= xl (1280px), 2-column otherwise
 *   - Each card: icon (top-left), title, short description
 *   - Hover: border accent + subtle background shift
 *   - Transition: 150ms ease-out
 *   - Cursor: pointer
 *   - No circular floating icons
 */

import { Platform, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/src/contexts/ThemeContext';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

import { type MenuItem } from './QuickAccessGrid';

interface QuickAccessActionCardsProps {
  items: MenuItem[];
  onItemPress: (itemId: string) => void;
}

// Converts a 6-digit hex colour to an rgba() string.
function toRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function QuickAccessActionCards({
  items,
  onItemPress,
}: QuickAccessActionCardsProps) {
  const { colors, isDark } = useTheme();
  const { isXl } = useBreakpoint();

  const columns = isXl ? 4 : 2;

  // Web-only CSS Grid — falls back to ordinary flex on native (safety net only;
  // this component is never rendered on native).
  const gridStyle: object =
    Platform.OS === 'web'
      ? ({
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 12,
        } as any)
      : {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        };

  return (
    <View className="mb-1">
      <Text className="text-[15px] text-text mb-[14px] tracking-[-0.1px] font-sans-semi">
        Quick Access
      </Text>

      <View style={gridStyle}>
        {items.map((item) => {
          const iconBg = toRgba(item.color, isDark ? 0.2 : 0.1);
          const iconBorder = toRgba(item.color, isDark ? 0.3 : 0.18);

          return (
            <Pressable
              key={item.id}
              onPress={() => onItemPress(item.id)}
              style={({ hovered, pressed }: any) => {
                const isInteracted = hovered || pressed;
                return {
                  backgroundColor: isInteracted
                    ? isDark
                      ? colors.elevated
                      : colors.surface + 'f0'
                    : colors.surface,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  ...(Platform.OS === 'web'
                    ? ({
                        cursor: 'pointer',
                        transition: 'background-color 150ms ease-out',
                      } as any)
                    : {}),
                };
              }}
              accessibilityRole="button"
              accessibilityLabel={item.title}
            >
              <View
                style={{
                  backgroundColor: iconBg,
                  borderWidth: 1,
                  borderColor: iconBorder,
                }}
                className="w-10 h-10 rounded-[10px] mb-3.5 items-center justify-center"
              >
                <item.icon size={20} color={item.color} strokeWidth={1.8} />
              </View>

              <Text className="text-[14px] text-text mb-1 leading-5 font-sans-semi">
                {item.title}
              </Text>

              {item.description ? (
                <Text
                  style={{
                    fontSize: 12,

                    color: colors.textSecondary,
                    lineHeight: 17,
                  }}
                  numberOfLines={2}
                  className="font-sans"
                >
                  {item.description}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
