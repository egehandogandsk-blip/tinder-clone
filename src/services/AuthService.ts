import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const AuthService = {
    signup: async (email: string, pass: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: name,
                email: email,
                photoURLs: [],
                bio: "",
                age: 18,
                gender: "Not Specified",
                createdAt: new Date(),
                isGoldMember: false,
                preferences: {
                    distance: 50,
                    ageRange: [18, 30]
                }
            });

            return user;
        } catch (error) {
            throw error;
        }
    },

    login: async (email: string, pass: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: (): User | null => {
        return auth.currentUser;
    }
};
