import {Match} from "@/types/match";
import {Bracket} from "@/types/bracket";

export interface Tournament {
    id: string;
    name: string;
    type: "league" | "elimination";
    teams: string[];
    matches?: Match[]; // Solo para ligas
    bracket?: Bracket; // Solo para torneos eliminatorios
}