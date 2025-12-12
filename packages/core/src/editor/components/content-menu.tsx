import type { Editor } from '@tiptap/core';
import { useCallback, useEffect, useState } from 'react';

import type { NodeSelection } from '@tiptap/pm/state';

import type { Node } from '@tiptap/pm/model';
import { Copy, Move, Plus, Trash2 } from 'lucide-react';
import { BaseButton } from './base-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Divider } from './ui/divider';
import { DragHandle } from '../plugins/drag-handle/drag-handle';
import { cn } from '../utils/classname';

export type ContentMenuProps = {
  editor: Editor;
};

export function ContentMenu(props: ContentMenuProps) {
  const { editor } = props;

  const [menuOpen, setMenuOpen] = useState(false);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [currentNodePos, setCurrentNodePos] = useState<number>(-1);

  const handleNodeChange = useCallback(
    (data: { node: Node | null; editor: Editor; pos: number }) => {
      if (data.node) {
        setCurrentNode(data.node);
      }

      setCurrentNodePos(data.pos);
    },
    [setCurrentNodePos, setCurrentNode]
  );

  function duplicateNode() {
    editor.commands.setNodeSelection(currentNodePos);
    const { $anchor } = editor.state.selection;
    const selectedNode =
      $anchor.node(1) || (editor.state.selection as NodeSelection).node;
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .insertContentAt(
        currentNodePos + (currentNode?.nodeSize || 0),
        selectedNode.toJSON()
      )
      .run();

    setMenuOpen(false);
  }

  function deleteCurrentNode() {
    editor
      .chain()
      .setMeta('hideDragHandle', true)
      .setNodeSelection(currentNodePos)
      .deleteSelection()
      .run();

    setMenuOpen(false);
  }

  function handleAddNewNode() {
    if (currentNodePos !== -1) {
      const currentNodeSize = currentNode?.nodeSize || 0;
      const insertPos = currentNodePos + currentNodeSize;
      const currentNodeIsEmptyParagraph =
        currentNode?.type.name === 'paragraph' &&
        currentNode?.content?.size === 0;
      const focusPos = currentNodeIsEmptyParagraph
        ? currentNodePos + 2
        : insertPos + 2;
      editor
        .chain()
        .command(({ dispatch, tr, state }) => {
          if (dispatch) {
            if (currentNodeIsEmptyParagraph) {
              tr.insertText('/', currentNodePos, currentNodePos + 1);
            } else {
              tr.insert(
                insertPos,
                state.schema.nodes.paragraph.create(null, [
                  state.schema.text('/'),
                ])
              );
            }

            return dispatch(tr);
          }

          return true;
        })
        .focus(focusPos)
        .run();
    }
  }

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true);
    } else {
      editor.commands.setMeta('lockDragHandle', false);
    }

    return () => {
      editor.commands.setMeta('lockDragHandle', false);
    };
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentMenu"
      editor={editor}
      tippyOptions={{
        offset: [2, 0],
        zIndex: 99,
      }}
      onNodeChange={handleNodeChange}
      className={cn(editor.isEditable ? 'mly:visible' : 'mly:hidden')}
    >
      <TooltipProvider>
        <div className="mly:flex mly:flex-col mly:items-center mly:gap-1  mly:bg-white mly:rounded-full mly:p-1 mly:mr-1">
          {/* Drag handle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="icon"
                className="mly:size-7! mly:cursor-grab mly:text-gray-500 mly:hover:text-black mly:bg-white mly:rounded-full"
                type="button"
                data-drag-handle
              >
                <Move className="mly:size-3.5 mly:shrink-0" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>Drag to move</TooltipContent>
          </Tooltip>
          {/* Delete node button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="icon"
                className="mly:size-7! mly:cursor-pointer mly:text-gray-500 mly:hover:text-black mly:bg-white mly:rounded-full"
                onClick={deleteCurrentNode}
                type="button"
              >
                <Trash2 className="mly:size-3.5 mly:shrink-0" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>Delete</TooltipContent>
          </Tooltip>
          {/* Duplicate node button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="icon"
                className="mly:size-7! mly:cursor-pointer mly:text-gray-500 mly:hover:text-black mly:bg-white mly:rounded-full"
                onClick={duplicateNode}
                type="button"
              >
                <Copy className="mly:size-3.5 mly:shrink-0" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>Duplicate</TooltipContent>
          </Tooltip>
          {/* Add new node */}
          <Tooltip>
            <TooltipTrigger asChild>
              <BaseButton
                variant="ghost"
                size="icon"
                className="mly:size-7! mly:cursor-grab mly:text-gray-500 mly:hover:text-black mly:bg-white mly:rounded-full"
                onClick={handleAddNewNode}
                type="button"
              >
                <Plus className="mly:size-3.5 mly:shrink-0" />
              </BaseButton>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>Add Element</TooltipContent>
          </Tooltip>

        </div>
      </TooltipProvider>
    </DragHandle>
  );
}
