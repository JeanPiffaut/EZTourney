"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const Form = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("league");
    const [teams, setTeams] = useState<string[]>([]);
    const [teamInput, setTeamInput] = useState("");

    // Agregar equipo a la lista
    const addTeam = () => {
        if (teamInput.trim() !== "" && !teams.includes(teamInput.trim())) {
            setTeams([...teams, teamInput.trim()]);
            setTeamInput("");
        }
    };

    // Guardar torneo en Firestore
    const saveTournament = async () => {
        if (!name || teams.length < 2) {
            alert("Ingresa un nombre y al menos dos equipos.");
            return;
        }

        try {
            await addDoc(collection(db, "tournaments"), {
                name,
                type,
                teams,
                createdAt: new Date().toISOString(),
            });
            alert("Torneo creado con éxito.");
            setName("");
            setType("league");
            setTeams([]);
        } catch (error) {
            console.error("Error al guardar el torneo:", error);
            alert("Error al guardar el torneo.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Crear Torneo</h2>

            {/* Nombre del Torneo */}
            <input
                type="text"
                placeholder="Nombre del torneo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            />

            {/* Tipo de Torneo */}
            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        value="league"
                        checked={type === "league"}
                        onChange={() => setType("league")}
                    />
                    Liga
                </label>
                <label>
                    <input
                        type="radio"
                        value="elimination"
                        checked={type === "elimination"}
                        onChange={() => setType("elimination")}
                    />
                    Eliminación
                </label>
            </div>

            {/* Equipos */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Nombre del equipo"
                    value={teamInput}
                    onChange={(e) => setTeamInput(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={addTeam}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Agregar Equipo
                </button>
            </div>

            {/* Lista de Equipos */}
            <ul className="mb-4">
                {teams.map((team, index) => (
                    <li key={index} className="p-1 border-b">
                        {team}
                    </li>
                ))}
            </ul>

            {/* Botón de Guardar */}
            <button
                onClick={saveTournament}
                className="w-full bg-green-500 text-white px-4 py-2 rounded"
            >
                Guardar Torneo
            </button>
        </div>
    );
};

export default Form;
