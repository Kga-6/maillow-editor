import './styles/index.css';

export * from './editor/index';

// Text menu exports for toolbar integration - Kevin
export { useTextMenuState, DEFAULT_TEXT_COLOR } from './editor/components/text-menu/use-text-menu-state';
export { TextBubbleContent } from './editor/components/text-menu/text-bubble-content';
export { isTextSelected } from './editor/utils/is-text-selected';
export { isCustomNodeSelected } from './editor/utils/is-custom-node-selected';

// UI components for toolbar
export { AlignmentSwitch } from './editor/components/alignment-switch';
export { BubbleMenuButton } from './editor/components/bubble-menu-button';
export { Divider } from './editor/components/ui/divider';
export { ColorPicker } from './editor/components/ui/color-picker';
export { LinkInputPopover } from './editor/components/ui/link-input-popover';
export { BaseButton } from './editor/components/base-button';
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './editor/components/ui/tooltip';

// Turn into block (paragraph, headings, lists dropdown)
export { TurnIntoBlock } from './editor/components/text-menu/turn-into-block';
export { useTurnIntoBlockOptions } from './editor/components/text-menu/use-turn-into-block-options';
export type { TurnIntoBlockOptions, TurnIntoBlockCategory, TurnIntoOptions } from './editor/components/text-menu/use-turn-into-block-options';

// Simplified text bubble menu (link + delete/duplicate only) - for toolbar integration
export { TextBubbleMenuSimple } from './editor/components/text-menu/text-bubble-menu-simple';
export { TextBubbleContentSimple } from './editor/components/text-menu/text-bubble-content-simple';

// Types
export type { BubbleMenuItem, EditorBubbleMenuProps } from './editor/components/text-menu/text-bubble-menu';