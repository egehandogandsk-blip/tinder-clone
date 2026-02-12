import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/User';

export interface Message {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: string;
        name: string;
    };
}

export interface ChatRoom {
    id: string;
    users: string[]; // UIDs
    lastMessage?: string;
    timestamp?: any;
    otherUser?: User; // Hydrated for UI
}

export const ChatService = {
    // Fetch list of matches for the current user
    getMatches: async (userId: string): Promise<ChatRoom[]> => {
        const q = query(collection(db, 'matches'), where('users', 'array-contains', userId));
        const snapshot = await getDocs(q);

        const matches: ChatRoom[] = [];

        for (const docSnapshot of snapshot.docs) {
            const data = docSnapshot.data();
            const otherUserId = data.users.find((uid: string) => uid !== userId);

            // Fetch other user details
            let otherUser: User | undefined;
            if (otherUserId) {
                const userDoc = await getDoc(doc(db, 'users', otherUserId));
                if (userDoc.exists()) {
                    otherUser = userDoc.data() as User;
                }
            }

            matches.push({
                id: docSnapshot.id,
                users: data.users,
                lastMessage: data.lastMessage,
                timestamp: data.timestamp,
                otherUser
            });
        }

        return matches;
    },

    // Send a message
    sendMessage: async (matchId: string, text: string, user: { _id: string, name: string }) => {
        await addDoc(collection(db, 'matches', matchId, 'messages'), {
            text,
            createdAt: serverTimestamp(),
            user
        });

        // Update last message in match doc
        // Note: In a real app, update this atomically
    },

    // Subscribe to messages in a chat room
    subscribeToMessages: (matchId: string, callback: (messages: Message[]) => void) => {
        const q = query(
            collection(db, 'matches', matchId, 'messages'),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                _id: doc.id,
                text: doc.data().text,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                user: doc.data().user
            }));
            callback(messages);
        });
    }
};
