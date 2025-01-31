"use client";

import { useState } from "react";
import { updateBracket } from "@/lib/tournaments";
import { Match } from "@/types/match";

interface TournamentBracketProps {
    tournamentId: string;
    rounds: Match[][];
}

const TournamentBracket = ({ tournamentId, rounds }: TournamentBracketProps) => {
    const [updatedRounds, setUpdatedRounds] = useState(rounds);

    const updateMatch = async (roundIndex: number, matchIndex: number, scoreA: number, scoreB: number) => {
        const newRounds = [...updatedRounds];
        newRounds[roundIndex][matchIndex] = { ...newRounds[roundIndex][matchIndex], scoreA, scoreB };

        setUpdatedRounds(newRounds);
        await updateBracket(tournamentId, { rounds: newRounds });
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
