"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
    noteId: number;
};

const DeleteButton = ({ noteId }: Props) => {
    const router = useRouter();
    const deleteNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/deleteNoteBook", {
                noteId,
            });
            return response.data;
        },
    });
    return (
        <Button
            disabled={deleteNote.isPending}
            variant={"destructive"}
            size="sm"
            onClick={() => {
                const confirm = window.confirm("确认要删除该笔记吗？");
                if (!confirm) return;
                deleteNote.mutate(undefined, {
                    onSuccess: () => {
                        router.push("/dashboard");
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                });
            }}
        >
            <Trash />
        </Button>
    );
};

export default DeleteButton;
