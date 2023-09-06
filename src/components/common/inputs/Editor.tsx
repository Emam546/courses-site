import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ContentState, EditorProps } from "react-draft-wysiwyg";
import {
    BlockMap,
    BlockMapBuilder,
    ContentBlock,
    EditorState,
    Modifier,
    RawDraftContentState,
    convertFromRaw,
} from "draft-js";
const Editor = dynamic<EditorProps>(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);

type Props = {
    defaultValue?: RawDraftContentState;
} & EditorProps;

const toolbar = {
    options: [
        "inline",
        "list",
        "textAlign",
        "colorPicker",
        "link",
        "emoji",
        "image",
        "remove",
        "history",
    ],
};


const FinalEditor = React.forwardRef<HTMLInputElement, Props>(
    ({ defaultValue, placeholder, ...props }, ref) => {
        return (
            <div className="tw-bg-neutral-100">
                <Editor
                    editorClassName="tw-min-h-[10rem] tw-px-3 tw-max-w-full"
                    defaultEditorState={
                        defaultValue &&
                        EditorState.createWithContent(
                            convertFromRaw(defaultValue)
                        )
                    }
                    placeholder={placeholder}
                    toolbar={toolbar}
                    {...props}
                />
            </div>
        );
    }
);

export default FinalEditor;
