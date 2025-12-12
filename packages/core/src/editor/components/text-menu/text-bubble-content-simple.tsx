import { Editor } from '@tiptap/core';
import { ClipboardPaste, Copy } from 'lucide-react';
import { useTextMenuState } from './use-text-menu-state';
import { LinkInputPopover } from '../ui/link-input-popover';
import { Divider } from '../ui/divider';
import { BaseButton } from '../base-button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type TextBubbleContentSimpleProps = {
  editor: Editor;
};

export function TextBubbleContentSimple(props: TextBubbleContentSimpleProps) {
  const { editor } = props;

  const state = useTextMenuState(editor);

  function copySelectedText() {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    }
  }

  function pasteSelectedText() {
    navigator.clipboard.readText().then((text) => {
      editor.chain().focus().insertContent(text).run();
    });
  }

  return (
    <>
      <LinkInputPopover
        defaultValue={state?.linkUrl ?? ''}
        onValueChange={(value, isVariable) => {
          if (!value) {
            editor
              ?.chain()
              .focus()
              .extendMarkRange('link')
              .unsetLink()
              .unsetUnderline()
              .run();
            return;
          }

          editor
            ?.chain()
            .extendMarkRange('link')
            .setLink({ href: value })
            .setIsUrlVariable(isVariable ?? false)
            .setUnderline()
            .run()!;
        }}
        tooltip="External URL"
        editor={editor}
        isVariable={state.isUrlVariable}
      />

      <Divider />

      <Tooltip>
        <TooltipTrigger asChild>
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            onClick={copySelectedText}
            className="mly:h-7 mly:w-7 mly:shrink-0 mly:p-0"
          >
            <Copy className="mly:size-3.5 mly:shrink-0" />
          </BaseButton>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>Copy</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <BaseButton
            variant="ghost"
            size="sm"
            type="button"
            onClick={pasteSelectedText}
            className="mly:h-7 mly:w-7 mly:shrink-0 mly:p-0"
          >
            <ClipboardPaste className="mly:size-3.5 mly:shrink-0" />
          </BaseButton>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>Paste</TooltipContent>
      </Tooltip>
    </>
  );
}