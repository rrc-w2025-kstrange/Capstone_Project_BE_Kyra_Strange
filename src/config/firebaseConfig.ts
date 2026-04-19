import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

import * as serviceAccount from "./servicekey.json";

// Initialize the Firebase app with the service account credentials
initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
});

const auth: Auth = getAuth();

const db: Firestore = getFirestore();
db.settings({ ignoreUndefinedProperties: true }); 

export { auth, db };