"use client";

import { useState, useEffect } from "react";
import { updateMatchResults } from "@/lib/tournaments";
import { Match } from "@/types/match";

interface LeagueTableProps {
    teams: string[];
    tournamentId: string;
    matches: Match[];
}

const LeagueTable = ({ teams, tournamentId, matches }: LeagueTableProps) => {
    const [updatedMatches, setUpdatedMatches] = useState(matches);
    const [standings, setStandings] = useState<{ team: string; points: number }[]>([]);

    // Función para calcular la tabla de posiciones
    useEffect(() => {
        const calculateStandings = () => {
            const pointsMap: Record<string, number> = {};

            teams.forEach((team) => (pointsMap[team] = 0));

            updatedMatches.forEach(({ teamA, teamB, scoreA, scoreB }) => {
                if (scoreA !== undefined && scoreB !== undefined) {
                    if (scoreA > scoreB) {
                        pointsMap[teamA] += 3;
                    } else if (scoreA < scoreB) {
                        pointsMap[teamB] += 3;
                    } else {
                        pointsMap[teamA] += 1;
                        pointsMap[teamB] += 1;
                    }
                }
            });

            setStandings(Object.entries(pointsMap).map(([team, points]) => ({ team, points })));
        };

        calculateStandings();
    }, [updatedMatches, teams]);

    // Actualizar resultados de Firestore usando la función centralizada
    const updateMatch = async (index: number, scoreA: number, scoreB: number) => {
        const newMatches = [...updatedMatches];
        newMatches[index] = { ...newMatches[index], scoreA, scoreB };
        setUpdatedMatches(newMatches);

        await updateMatchResults(tournamentId, newMatches);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Tabla de Posiciones</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Equipo</th>
                    <th className="border p-2">Puntos</th>
                </tr>
                </thead>
                <tbody>
                {standings.map(({ team, points }, index) => (
                    <tr key={index} className="border">
                        <td className="border p-2">{team}</td>
                        <td className="border p-2">{points}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeagueTable;
