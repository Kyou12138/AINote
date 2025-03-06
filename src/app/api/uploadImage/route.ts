import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFileToSupabase } from "@/lib/supabase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { noteId } = await req.json();
        const notes = await db
            .select()
            .from($notes)
            .where(eq($notes.id, parseInt(noteId)));
        if (!notes[0].imgUrl) {
            return new NextResponse("no image url", { status: 400 });
        }

        const newImageUrl = await uploadFileToSupabase(
            notes[0].imgUrl,
            notes[0].name
        );

        await db
            .update($notes)
            .set({ imgUrl: process.env.SUPABASE_BASE_PATH! + newImageUrl })
            .where(eq($notes.id, parseInt(noteId)));
        return new NextResponse("ok", { status: 200 });
    } catch (error) {
        return new NextResponse("error", { status: 500 });
    }
}
