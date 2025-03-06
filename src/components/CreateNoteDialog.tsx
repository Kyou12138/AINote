"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const CreateNoteDialog = (props: Props) => {
    const router = useRouter();
    const [input, setInput] = React.useState("");
    const uploadImage = useMutation({
        mutationFn: async (noteId: string) => {
            const response = await axios.post("/api/uploadImage", {
                noteId,
            });
        },
    });
    const createNoteBook = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/createNoteBook", {
                name: input,
            });
            return response.data;
        },
    });
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim() === "") {
            window.alert("请输入笔记名称");
            return;
        }
        createNoteBook.mutate(undefined, {
            onSuccess: ({ noteId }) => {
                console.log("创建成功, noteId: ", noteId);
                //调用图片保存接口
                uploadImage.mutate(noteId);
                router.push(`/notebook/${noteId}`);
            },
            onError: (error) => {
                console.error("创建失败", error);
                window.alert("创建失败");
            },
        });
    };
    return (
        <Dialog>
            <DialogTrigger className="cursor-pointer border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
                <Plus className="w-6 h-6 text-green-600" strokeWidth="3" />
                <h2 className="font-semibold text-green-600 sm:mt-2">
                    创建新笔记
                </h2>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>创建新笔记</DialogTitle>
                    <DialogDescription>
                        输入笔记名称，AI会根据该词创建笔记封面
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="请输入笔记名称..."
                    />
                    <div className="h-4"></div>
                    <div className="flex items-center gap-2 flex-row-reverse">
                        <Button
                            className="cursor-pointer min-w-20"
                            type="reset"
                            variant={"secondary"}
                        >
                            取消
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer bg-green-600 min-w-20"
                            disabled={createNoteBook.isPending}
                        >
                            {createNoteBook.isPending && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            创建
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateNoteDialog;
