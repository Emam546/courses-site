import { onRequest } from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
const app = initializeApp();
const firebase = getFirestore(app);
export const addmessage = onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await firebase
        .collection("messages")
        .add({ original: original });
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
});
export const makeuppercase = onDocumentCreated(
    "/messages/{documentId}",
    (event) => {
        // Grab the current value of what was written to Firestore.
        const original = event.data!.data().original;

        // Access the parameter `{documentId}` with `event.params`
        // logger.log("Uppercasing", event.params.documentId, original);

        const uppercase = original.toUpperCase();

        // You must return a Promise when performing
        // asynchronous tasks inside a function
        // such as writing to Firestore.
        // Setting an 'uppercase' field in Firestore document returns a Promise.
        return event.data!.ref.set({ uppercase }, { merge: true });
    }
);
