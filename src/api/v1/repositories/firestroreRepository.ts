import { db } from "../../../../config/firebaseConfig";
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

const getDocument = async (): Promise<void> => {
    
    const docRef: DocumentReference = db.collection("users").doc("user1");
    const doc = await docRef.get();

    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        console.log("No such document!");
    }
};

const getCollection = async (): Promise<void> => {

    const snapshot: QuerySnapshot = await db.collection("users").get();
    snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
    });
};
