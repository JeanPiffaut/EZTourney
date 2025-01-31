"use client";

import Form from "@/components/Form";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <main className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <Form onTournamentCreated={(id) => router.push(`/tournament/${id}`)} />
        </main>
    );
}
