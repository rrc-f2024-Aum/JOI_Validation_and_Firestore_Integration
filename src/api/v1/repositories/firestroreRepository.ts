import { db } from "../config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";

const addDocument = async (): Promise<void> => {
    const docRef: DocumentReference = db.collection("users").doc("user1");

    await docRef.set({
        name: "John Doe",
        email: "john@example.com",
        age: 30,
    });
    console.log("Document added");
};
