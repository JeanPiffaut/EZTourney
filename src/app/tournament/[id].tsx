"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import LeagueTable from "@/components/LeagueTable";
import TournamentBracket from "@/components/TournamentBracket";
import {Tournament} from "@/types/tournament";

export default function TournamentPage() {
    const { id } = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchTournament = async () => {
            try {
                const docRef = doc(db, "tournaments", id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTournament({ id, ...docSnap.data() } as Tournament);
                } else {
                    console.error("No se encontró el torneo.");
                }
            } catch (error) {
                console.error("Error obteniendo el torneo:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTournament();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Cargando...</p>;
    if (!tournament) return <p className="text-center mt-10">Torneo no encontrado.</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-lg mt-10">
            <h1 className="text-2xl font-bold text-center mb-4">{tournament.name}</h1>

            {tournament.type === "league" ? (
                <LeagueTable
                    teams={tournament.teams}
                    tournamentId={tournament.id}
                    matches={tournament.matches || []}
                />
            ) : (
                <TournamentBracket
                    tournamentId={tournament.id}
                    rounds={tournament.bracket?.rounds || []}
                />
            )}

        </div>
    );
}
