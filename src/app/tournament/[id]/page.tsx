"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTournament } from "@/lib/tournaments";
import LeagueTable from "@/components/LeagueTable";
import TournamentBracket from "@/components/TournamentBracket";
import { Tournament } from "@/types/tournament";

export default function TournamentPage() {
    const { id } = useParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchTournament = async () => {
            setLoading(true);
            const data = await getTournament(id as string);
            setTournament(data);
            setLoading(false);
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
                    teams={tournament.teams || []}
                    tournamentId={tournament.id}
                    matches={tournament.matches ?? []}
                />
            ) : (
                <TournamentBracket
                    tournamentId={tournament.id}
                    rounds={tournament.bracket?.rounds ?? []}
                />
            )}
        </div>
    );
}
