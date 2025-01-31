"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {Match} from "@/types/match";

interface TournamentBracketProps {
    tournamentId: string;
    rounds: Match[][];
}

const TournamentBracket = ({ tournamentId, rounds }: TournamentBracketProps) => {
    const [updatedRounds, setUpdatedRounds] = useState(rounds);

    const updateMatch = async (roundIndex: number, matchIndex: number, scoreA: number, scoreB: number) => {
        const newRounds = [...updatedRounds];
        newRounds[roundIndex][matchIndex] = { ...newRounds[roundIndex][matchIndex], scoreA, scoreB };

        // Determinar ganador
        if (scoreA !== scoreB) {
            const winner = scoreA > scoreB ? newRounds[roundIndex][matchIndex].teamA : newRounds[roundIndex][matchIndex].teamB;

            // Si hay una siguiente ronda, agregar ganador
            if (newRounds[roundIndex + 1]) {
                newRounds[roundIndex + 1].push({ teamA: winner, teamB: "" });
            } else {
                newRounds.push([{ teamA: winner, teamB: "" }]);
            }
        }

        setUpdatedRounds(newRounds);

        try {
            const docRef = doc(db, "tournaments", tournamentId);
            await updateDoc(docRef, { bracket: newRounds });
        } catch (error) {
            console.error("Error al actualizar bracket:", error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Bracket de Eliminación</h2>
            {updatedRounds.map((round, roundIndex) => (
                <div key={roundIndex} className="mb-4">
                    <h3 className="text-lg font-semibold">Ronda {roundIndex + 1}</h3>
                    {round.map((match, matchIndex) => (
                        <div key={matchIndex} className="flex items-center gap-2 mb-2">
                            <span>{match.teamA}</span>
                            <input
                                type="number"
                                className="w-12 border p-1"
                                value={match.scoreA || ""}
                                onChange={(e) => updateMatch(roundIndex, matchIndex, Number(e.target.value), match.scoreB || 0)}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                className="w-12 border p-1"
                                value={match.scoreB || ""}
                                onChange={(e) => updateMatch(roundIndex, matchIndex, match.scoreA || 0, Number(e.target.value))}
                            />
                            <span>{match.teamB}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TournamentBracket;
