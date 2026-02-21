import { Platform, StyleSheet } from 'react-native';

/* Below are the colors used in the app. */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    link: '#0A7EA4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    link: '#0A7EA4',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/* Below are the custom styles that are used in the app. */

export const spacing = {
  screenPadding: 24,
  screenGap: 12,
};

export const typography = {
  titleSize: 28,
  titleWeight: '700' as const,
  bodySize: 16,
};

export const base = StyleSheet.create({
  container: {
    //flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPadding,
    gap: spacing.screenGap,
  },
  title: {
    fontSize: typography.titleSize,
    fontWeight: typography.titleWeight,
  },
  subtitle: {
    fontSize: typography.bodySize,
  },
  paragraph: {
    fontSize: typography.bodySize,
    lineHeight: typography.bodySize * 1.5,
  },
  comments: {
    fontSize: typography.bodySize - 2,
    fontStyle: 'italic',
  },
  link: {
    marginTop: 8,
    fontSize: typography.bodySize,
  },
});

export const form = StyleSheet.create({
  inputGroup: {
    width: '100%',
    gap: 10,
  },
  // Standard row layout for profile fields like: Label + input on one line.
  inlineFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  // Shared label style for inline profile fields.
  inlineFieldLabel: {
    minWidth: 90,
  },
  // Lets inline text inputs fill remaining row space.
  inlineFieldInput: {
    flex: 1,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: typography.bodySize,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  error: {
    width: '100%',
    color: '#C62828',
    fontSize: 14,
  },
});

export const buttons = StyleSheet.create({
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
  },
  secondary: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: typography.bodySize,
    fontWeight: '600',
  },
});

export const menu = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  card: {
    position: 'absolute',
    top: 56,
    right: 12,
    minWidth: 170,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});

export const list = StyleSheet.create({
  // Outer wrapper for FlatList sections.
  container: {
    width: '100%',
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.screenPadding,
  },

  // Applied to FlatList `contentContainerStyle`.
  contentContainer: {
    gap: spacing.screenGap,
    paddingBottom: spacing.screenPadding,
  },

  // Used when rendering empty-state content centered in the list area.
  contentContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Base item layout (theme-neutral).
  itemBase: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  itemLight: {
    borderColor: Colors.light.tabIconDefault,
    backgroundColor: Colors.light.background,
  },
  itemDark: {
    borderColor: Colors.dark.tabIconDefault,
    backgroundColor: Colors.dark.background,
  },

  itemTitle: {
    fontSize: typography.bodySize,
    fontWeight: '600',
  },
  itemTitleLight: {
    color: Colors.light.text,
  },
  itemTitleDark: {
    color: Colors.dark.text,
  },

  itemMeta: {
    fontSize: typography.bodySize - 2,
  },
  itemMetaLight: {
    color: Colors.light.icon,
  },
  itemMetaDark: {
    color: Colors.dark.icon,
  },

  separatorBase: {
    height: spacing.screenGap,
  },
  separatorLight: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault,
  },
  separatorDark: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tabIconDefault,
  },

  emptyMessageBase: {
    textAlign: 'center',
    fontSize: typography.bodySize,
    fontStyle: 'italic',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  emptyMessageLight: {
    color: Colors.light.icon,
  },
  emptyMessageDark: {
    color: Colors.dark.icon,
  },

  header: {
    paddingVertical: 8,
  },
  footer: {
    paddingVertical: 12,
  },
  loader: {
    padding: 16,
  },
});
