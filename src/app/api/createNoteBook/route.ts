// /api/createNoteBook

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import {
    generateImagePrompt,
    generateImage,
    generateImageTencent,
} from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = body;
    let image_description = await generateImagePrompt(name);

    if (!image_description) {
        return new NextResponse("failed to generate image description", {
            status: 500,
        });
    }
    console.log({ image_description });

    //限制字数
    image_description =
        image_description.length > 200
            ? image_description.substring(0, 200)
            : image_description;

    // const image_url = await generateImage(image_description);
    const image_url = await generateImageTencent(image_description);
    if (!image_url) {
        return new NextResponse("failed to generate image", { status: 500 });
    }
    console.log({ image_url });

    const note_ids = await db
        .insert($notes)
        .values({
            name,
            imgUrl: image_url,
            userId,
        })
        .returning({ insertedId: $notes.id });

    return NextResponse.json({ noteId: note_ids[0].insertedId });
}
