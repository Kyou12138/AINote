import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const DashboardPage = (props: Props) => {
    return (
        <>
            <div className="grainy min-h-screen">
                <div className="max-w-7xl mx-auto px-10">
                    <div className="h-14"></div>
                    <div className="flex justify-between items-center md:flex-row flex-col">
                        <div className="flex items-center">
                            <Link href="/">
                                <Button
                                    className="bg-green-600 cursor-pointer"
                                    size={"sm"}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    返回
                                </Button>
                            </Link>
                            <div className="w-4"></div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                我的笔记
                            </h1>
                            <div className="w-4"></div>
                            <UserButton />
                        </div>
                    </div>
                    <div className="h-8"></div>
                    <Separator />
                    <div className="h-8"></div>
                    {/* list all notes */}
                    <div className="text-center">
                        <h2 className="text-xl text-gray-500">备忘录为空</h2>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
