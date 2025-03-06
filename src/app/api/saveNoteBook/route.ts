import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { noteId, editorState } = body;
        if (!noteId || !editorState) {
            return new NextResponse("noteId or editorState are required", {
                status: 400,
            });
        }

        noteId = parseInt(noteId);
        const notes = await db
            .select()
            .from($notes)
            .where(eq($notes.id, noteId));

        if (notes.length != 1) {
            return new NextResponse("更新失败", { status: 404 });
        }

        const note = notes[0];
        if (note.editorState !== editorState) {
            await db
                .update($notes)
                .set({ editorState })
                .where(eq($notes.id, noteId));
        }
        return NextResponse.json({
            success: true,
            code: 200,
            message: "更新成功",
        });
    } catch (error) {
        console.log("更新失败", error);
        return NextResponse.json({
            success: false,
            code: 500,
            message: "服务器错误",
        });
    }
}
