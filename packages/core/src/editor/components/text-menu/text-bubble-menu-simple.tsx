import { ColumnExtension } from '@/editor/nodes/columns/column';
import { ColumnsExtension } from '@/editor/nodes/columns/columns';
import { SectionExtension } from '@/editor/nodes/section/section';
import { isCustomNodeSelected } from '@/editor/utils/is-custom-node-selected';
import { isTextSelected } from '@/editor/utils/is-text-selected';
import { BubbleMenu, BubbleMenuProps } from '@tiptap/react';
import { TooltipProvider } from '../ui/tooltip';
import { TextBubbleContentSimple } from './text-bubble-content-simple';
import { RepeatExtension } from '@/editor/nodes/repeat/repeat';

export type EditorBubbleMenuSimpleProps = Omit<BubbleMenuProps, 'children'> & {
  appendTo?: React.RefObject<any>;
};

export function TextBubbleMenuSimple(props: EditorBubbleMenuSimpleProps) {
  const { editor, appendTo } = props;

  if (!editor) {
    return null;
  }

  const bubbleMenuProps: EditorBubbleMenuSimpleProps = {
    ...props,
    ...(appendTo ? { appendTo: appendTo.current } : {}),
    pluginKey: 'text-menu-simple',
    shouldShow: ({ editor, from, view }) => {
      if (!view || editor.view.dragging) {
        return false;
      }

      const domAtPos = view.domAtPos(from || 0).node as HTMLElement;
      const nodeDOM = view.nodeDOM(from || 0) as HTMLElement;
      const node = nodeDOM || domAtPos;

      if (isCustomNodeSelected(editor, node) || !editor.isEditable) {
        return false;
      }

      const nestedNodes = [
        RepeatExtension.name,
        SectionExtension.name,
        ColumnsExtension.name,
        ColumnExtension.name,
      ];

      const isNestedNodeSelected =
        nestedNodes.some((name) => editor.isActive(name)) &&
        node?.classList?.contains('ProseMirror-selectednode');
      return isTextSelected(editor) && !isNestedNodeSelected;
    },
    tippyOptions: {
      popperOptions: {
        placement: 'top-start',
        modifiers: [
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: 8,
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-end', 'bottom-end'],
            },
          },
        ],
      },
      maxWidth: '100%',
    },
  };

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className="mly:flex mly:gap-0.5 mly:rounded-lg mly:border mly:border-gray-200 mly:bg-white mly:p-0.5 mly:shadow-md"
    >
      <TooltipProvider>
        <TextBubbleContentSimple editor={editor} />
      </TooltipProvider>
    </BubbleMenu>
  );
}
