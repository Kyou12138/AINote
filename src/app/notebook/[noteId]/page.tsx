import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/TiptapEditor";
import { ArrowLeft } from "lucide-react";
import DeleteButton from "@/components/DeleteButton";

type Props = {
    params: {
        noteId: string;
    };
};

const NotebookPage = async ({ params }: Props) => {
    const { noteId } = await params;
    const { userId } = await auth();
    if (!userId) {
        return redirect("/dashboard");
    }
    const user = await currentUser();
    if (!user) {
        return redirect("/dashboard");
    }
    const notes = await db
        .select()
        .from($notes)
        .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

    if (notes.length === 0) {
        return redirect("/dashboard");
    }

    const note = notes[0];

    return (
        <div className="min-h-screen grainy p-8">
            <div className="max-w-4xl mx-auto">
                <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center">
                    <Link href="/dashboard">
                        <Button className="bg-green-600" size="sm">
                            <ArrowLeft className="w-4 h-4" />
                            返回
                        </Button>
                    </Link>
                    <div className="w-3"></div>
                    <span className="font-semibold">
                        {user.firstName} {user.lastName}
                    </span>
                    <span className="inline-block mx-1">/</span>
                    <span className="text-stone-500 font-semibold">
                        {note.name}
                    </span>
                    <div className="ml-auto">
                        <DeleteButton noteId={note.id}></DeleteButton>
                    </div>
                </div>
                <div className="h-4"></div>
                <div className="border-stone-200 shadow-xl border round-lg px-16 py-8 w-full">
                    {/* Editor */}
                    <TiptapEditor note={note} />
                </div>
            </div>
        </div>
    );
};

export default NotebookPage;
