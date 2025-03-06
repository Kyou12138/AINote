"use client";
import React, { useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TiptapMenuBar from "./TiptapMenuBar";
import { Button } from "./ui/button";
import useDebounce from "@/lib/useDebounce";
import { NoteType } from "@/lib/db/schema";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";
import { Loader2 } from "lucide-react";

type Props = { note: NoteType };

const TiptapEditor = ({ note }: Props) => {
    const [editorState, setEditorState] = React.useState(
        note.editorState || `<h1>${note.name}</h1>`
    );
    const { complete, completion } = useCompletion({
        api: "/api/completion",
    });
    const saveNoteBook = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/saveNoteBook", {
                noteId: note.id,
                editorState,
            });
            return response.data;
        },
    });
    const debounceEditorState = useDebounce(editorState, 500);

    React.useEffect(() => {
        //save to db
        if (debounceEditorState === "") return;
        saveNoteBook.mutate(undefined, {
            onSuccess: (data) => {
                console.log("保存成功", data);
            },
            onError: (error) => {
                console.log("保存失败", error);
            },
        });
        console.log("Editor State: ", debounceEditorState);
    }, [debounceEditorState]);

    const lastCompletion = React.useRef("");
    const isGenerating = useRef(false);
    const token = React.useMemo(() => {
        if (!completion) return;
        const diff = completion.slice(lastCompletion.current.length);
        lastCompletion.current = completion;
        isGenerating.current = false;
        return diff;
    }, [completion]);

    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                "Shift-a": () => {
                    console.log("Activate AI");
                    isGenerating.current = true;
                    const prompt = this.editor.getText().slice(-50);
                    complete(prompt);
                    return true;
                },
            };
        },
    });

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML());
        },
    });

    React.useEffect(() => {
        if (!editor || !token) return;
        editor.commands.insertContent(token);
    }, [token, editor]);

    return (
        <>
            <div className="flex">
                {editor && <TiptapMenuBar editor={editor} />}
                <Button disabled variant={"outline"} className="ml-auto">
                    {saveNoteBook.isPending ? "保存中..." : "已保存"}
                </Button>
            </div>
            <div className="prose max-w-none prose-sm w-full mt-4">
                <EditorContent editor={editor} />
            </div>
            <div className="cursor-default">
                <div className="h-4"></div>
                <span className="text-sm inline-flex items-center">
                    提示：同时按{" "}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                        shift + a
                    </kbd>{" "}
                    自动补全句子
                    {isGenerating.current && (
                        <span className="text-gray-500 pl-2">
                            <Loader2 className="w-4 h-4 inline-block animate-spin mb-0.5" />{" "}
                            DeepSeek-R1模型运行中
                        </span>
                    )}
                </span>
            </div>
        </>
    );
};

export default TiptapEditor;
