"use client";
import React from "react";
import TypeWriter from "typewriter-effect";
import GraphemeSplitter from "grapheme-splitter";

type Props = {};
const stringSplitter = (string: string) => {
    const splitter = new GraphemeSplitter();
    return splitter.splitGraphemes(string) as any as string;
};
const TypeWriterTitle = (props: Props) => {
    return (
        <TypeWriter
            options={{
                loop: true,
                autoStart: true,
                stringSplitter,
                strings: [
                    "🤖 AI Powered.",
                    "🚀🚀🚀 Supercharged Productivity.",
                ],
            }}
        />
    );
};

export default TypeWriterTitle;
