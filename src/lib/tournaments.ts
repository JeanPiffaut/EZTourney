import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Tournament } from "@/types/tournament";
import { Match } from "@/types/match";

const TOURNAMENTS_COLLECTION = "tournaments";

// Obtener un torneo por ID
export const getTournament = async (id: string): Promise<Tournament | null> => {
    try {
        const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? ({ id, ...docSnap.data() } as Tournament) : null;
    } catch (error) {
        console.error("Error obteniendo el torneo:", error);
        return null;
    }
};

// Obtener todos los torneos
export const getAllTournaments = async (): Promise<Tournament[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, TOURNAMENTS_COLLECTION));
        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Tournament));
    } catch (error) {
        console.error("Error obteniendo torneos:", error);
        return [];
    }
};

// Crear un nuevo torneo
export const createTournament = async (tournament: Omit<Tournament, "id">): Promise<string | null> => {
    try {
        const docRef = await addDoc(collection(db, TOURNAMENTS_COLLECTION), tournament);
        return docRef.id;
    } catch (error) {
        console.error("Error creando el torneo:", error);
        return null;
    }
};

// Actualizar un torneo por ID
export const updateTournament = async (id: string, updatedData: Partial<Tournament>): Promise<boolean> => {
    try {
        const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
        await updateDoc(docRef, updatedData);
        return true;
    } catch (error) {
        console.error("Error actualizando el torneo:", error);
        return false;
    }
};

// Actualizar los resultados de un partido en una liga
export const updateMatchResults = async (tournamentId: string, matches: Match[]) => {
    try {
        const docRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
        await updateDoc(docRef, { matches });
    } catch (error) {
        console.error("Error actualizando los resultados del partido:", error);
    }
};

// Actualizar el bracket de un torneo eliminatorio
export const updateBracket = async (tournamentId: string, bracket: { rounds: Match[][] }) => {
    try {
        const docRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
        await updateDoc(docRef, { bracket });
    } catch (error) {
        console.error("Error actualizando el bracket:", error);
    }
};

// Eliminar un torneo por ID
export const deleteTournament = async (id: string): Promise<boolean> => {
    try {
        const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error eliminando el torneo:", error);
        return false;
    }
};