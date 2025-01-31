"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {Match} from "@/types/match";

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
                        pointsMap[teamA] += 3; // Gana teamA
                    } else if (scoreA < scoreB) {
                        pointsMap[teamB] += 3; // Gana teamB
                    } else {
                        pointsMap[teamA] += 1; // Empate
                        pointsMap[teamB] += 1;
                    }
                }
            });

            const sortedStandings = Object.entries(pointsMap)
                .map(([team, points]) => ({ team, points }))
                .sort((a, b) => b.points - a.points);

            setStandings(sortedStandings);
        };

        calculateStandings();
    }, [updatedMatches, teams]);

    // Función para actualizar los resultados en Firestore
    const updateMatch = async (index: number, scoreA: number, scoreB: number) => {
        const newMatches = [...updatedMatches];
        newMatches[index] = { ...newMatches[index], scoreA, scoreB };
        setUpdatedMatches(newMatches);

        try {
            const docRef = doc(db, "tournaments", tournamentId);
            await updateDoc(docRef, { matches: newMatches });
        } catch (error) {
            console.error("Error al actualizar resultados:", error);
        }
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

            <h3 className="text-lg font-semibold mt-4">Resultados</h3>
            <ul>
                {updatedMatches.map((match, index) => (
                    <li key={index} className="mb-2 flex gap-2">
                        <span>{match.teamA}</span>
                        <input
                            type="number"
                            className="w-12 border p-1"
                            value={match.scoreA || ""}
                            onChange={(e) => updateMatch(index, Number(e.target.value), match.scoreB || 0)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            className="w-12 border p-1"
                            value={match.scoreB || ""}
                            onChange={(e) => updateMatch(index, match.scoreA || 0, Number(e.target.value))}
                        />
                        <span>{match.teamB}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeagueTable;
