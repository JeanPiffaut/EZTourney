"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const Form = ({ onTournamentCreated }: { onTournamentCreated?: (id: string) => void }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("league");
    const [teams, setTeams] = useState<string[]>([]);
    const [teamInput, setTeamInput] = useState("");

    const addTeam = () => {
        if (teamInput.trim() !== "" && !teams.includes(teamInput.trim())) {
            setTeams([...teams, teamInput.trim()]);
            setTeamInput("");
        }
    };

    const saveTournament = async () => {
        if (!name || teams.length < 2) {
            alert("Please enter a name and at least two teams.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, "tournaments"), {
                name,
                type,
                teams,
                createdAt: new Date().toISOString(),
            });
            alert("Tournament created successfully!");
            setName("");
            setType("league");
            setTeams([]);
            if (onTournamentCreated) {
                onTournamentCreated(docRef.id);
            }
        } catch (error) {
            console.error("Error saving tournament:", error);
            alert("Error saving the tournament.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Tournament</h2>

            {/* Tournament Name */}
            <label className="block text-sm font-medium mb-1">Tournament Name</label>
            <input
                type="text"
                placeholder="Enter tournament name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            {/* Tournament Type */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tournament Type</label>
                <div className="flex items-center gap-4">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            value="league"
                            checked={type === "league"}
                            onChange={() => setType("league")}
                            className="form-radio text-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2">League</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            value="elimination"
                            checked={type === "elimination"}
                            onChange={() => setType("elimination")}
                            className="form-radio text-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2">Elimination</span>
                    </label>
                </div>
            </div>

            {/* Add Teams */}
            <label className="block text-sm font-medium mb-1">Add Team</label>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Enter team name"
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value)}
                    className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={addTeam}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
                >
                    Add
                </button>
            </div>

            {/* Team List */}
            <ul className="space-y-2 mb-4">
                {teams.map((team, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-800 border border-gray-700 rounded-md"
                    >
                        {team}
                        <button
                            onClick={() => setTeams(teams.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 transition"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            {/* Save Button */}
            <button
                onClick={saveTournament}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-200"
            >
                Save Tournament
            </button>
        </div>
    );
};

export default Form;
