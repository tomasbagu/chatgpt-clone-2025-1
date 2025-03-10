export const firebaseTimestampToDate = (firebaseTimestamp: any): Date => {
    if (!firebaseTimestamp) {
        throw new Error("Invalid value provided");
    }

    if (firebaseTimestamp instanceof Date) {
        return firebaseTimestamp; // Si ya es un Date, lo retorna directamente
    }

    if (firebaseTimestamp.seconds && typeof firebaseTimestamp.seconds === "number") {
        return new Date(firebaseTimestamp.seconds * 1000); // Convierte un Timestamp de Firebase
    }

    throw new Error("Invalid Firebase Timestamp or Date");
}