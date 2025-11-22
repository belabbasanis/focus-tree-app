/**
 * Centralized UI Design System
 * 
 * All styling primitives for the app. Components should compose these tokens
 * rather than defining inline Tailwind classes.
 * 
 * Rules:
 * - One file, one namespace
 * - Semantic naming (BTN.square, not BTN_48PX)
 * - Components compose, don't define (except layout-specific classes)
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const COLOR = {
  white: "text-white",
  black: "text-black",
  bgDark: "bg-black",
  bgWhite: "bg-white",
  border: "border-white",
  border2: "border-2 border-white",
  hoverOrange: "hover:bg-[rgba(255,140,0,0.2)]",
  hoverWhite: "hover:bg-white",
  hoverTextBlack: "hover:text-black",
  overlay: "bg-black/50", // Selection indicator overlay
};

// ============================================================================
// ICON TOKENS
// ============================================================================

export const ICON = {
  tiny: "w-3 h-3",        // Default CustomIcon
  small: "w-4 h-4",       // Close button, small icons
  nav: "w-5 h-5",         // Navigation icons
  stats: "w-6 h-6",       // Top stats bar icons
  indicator: "w-2 h-2",   // Selection indicator dot
  pixel: { imageRendering: "pixelated" as const },
  lucideWhite: { filter: 'brightness(0) invert(1)' as const }, // For lucide-react icons
  playOffset: "ml-1",     // Visual adjustment for play triangle
};

// ============================================================================
// BUTTON TOKENS
// ============================================================================

export const BTN = {
  // Base primitives
  base: "flex items-center justify-center transition-none",
  square: "w-12 h-12",      // Standard nav button size
  border: "border-2 border-white",
  bgDark: "bg-black",
  bgWhite: "bg-white",
  hover: "hover:bg-[rgba(255,140,0,0.2)]",
  active: "active:bg-white/20",
  
  // Composed variants
  nav: "bg-black border-2 border-white w-12 h-12 flex items-center justify-center transition-none hover:bg-[rgba(255,140,0,0.2)]",
  play: "bg-white border-2 border-white w-12 h-12 flex items-center justify-center transition-none hover:bg-[rgba(255,140,0,0.2)]",
  preset: "px-4 py-2 border-2 border-white font-retro text-xs uppercase transition-none bg-black text-white hover:bg-white hover:text-black",
  presetSelected: "px-4 py-2 border-2 border-white font-retro text-xs uppercase transition-none bg-white text-black",
  close: "p-2 border-2 border-white bg-black hover:bg-white hover:text-black transition-none",
};

// ============================================================================
// CARD TOKENS
// ============================================================================

export const CARD = {
  sprite: "relative aspect-square border-2 transition-none overflow-hidden bg-black border-white hover:bg-white",
  spriteSelected: "relative aspect-square border-2 transition-none overflow-hidden bg-white border-white",
  headerPreview: "w-10 h-10 bg-black border-2 border-white flex items-center justify-center overflow-hidden",
};

// ============================================================================
// DRAWER TOKENS
// ============================================================================

export const DRAWER = {
  container: "fixed bottom-0 left-0 right-0 z-[60] bg-black border-t-2 border-white shadow-none transition-transform duration-300 ease-in-out flex flex-col",
  open: "translate-y-0",
  closed: "translate-y-full",
  borderTop: "border-t-2 border-white",
  borderBottom: "border-b-2 border-white",
  headerPadding: "px-4 py-3",
  content: "flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4",
};

// ============================================================================
// TEXT TOKENS
// ============================================================================

export const TEXT = {
  retro: "font-retro",
  xs: "text-xs",
  sm: "text-sm",
  lg: "text-lg",
  timer: "text-8xl md:text-9xl font-retro",
  timerShadow: { 
    textShadow: '4px 4px 0px #000000', 
    letterSpacing: '0.1em' 
  },
  uppercase: "uppercase",
  tileLabel: "opacity-30", // Tile coordinate label opacity
};

// ============================================================================
// LAYOUT TOKENS
// ============================================================================

export const LAYOUT = {
  // Flex layouts
  centeredFlex: "flex items-center justify-center",
  centeredColumn: "flex flex-col items-center space-y-4",
  columnFlex: "flex flex-col",
  spaceBetween: "flex items-center justify-between",
  
  // Container layouts
  fullScreen: "h-screen w-screen",
  fixedFull: "fixed inset-0",
  absoluteFull: "absolute inset-0",
  relative: "relative",
  relativeZ10: "relative z-10",
  overflowHidden: "overflow-hidden",
  
  // Navigation containers
  navContainer: "fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4",
  statsContainer: "fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2",
  statsItem: "bg-black border-2 border-white px-3 py-1 flex items-center gap-2",
  
  // Content containers
  timerContainer: "h-screen w-screen flex flex-col fixed inset-0 relative overflow-hidden bg-black",
  contentContainer: "relative z-10 flex-1 flex flex-col items-center px-4",
  presetContainer: "flex gap-3 mt-6",
  scrollContainer: "relative w-full h-full",
  
  // Flex utilities
  flex1: "flex-1",
  flexShrink0: "flex-shrink-0",
  
  // Z-index tokens
  zStats: "z-50",
  zNav: "z-40",
};

// ============================================================================
// SPRITE TOKENS
// ============================================================================

export const SPRITE = {
  thumbnail: {
    width: '80%',
    height: 'auto',
    maxHeight: '80%',
    objectFit: 'contain' as const,
    imageRendering: 'pixelated' as const,
  },
  shadow: "drop-shadow-lg",
};

// ============================================================================
// TILE TOKENS
// ============================================================================

export const TILE = {
  base: "absolute cursor-pointer transition-all duration-200",
  selected: "scale-105",
  inner: "relative transition-none",
  label: "absolute inset-0 flex items-center justify-center text-xs font-retro text-white opacity-30",
};

// ============================================================================
// EFFECT TOKENS
// ============================================================================

export const EFFECT = {
  dropShadow: "drop-shadow-lg",
  noPointerEvents: "pointer-events-none",
};

