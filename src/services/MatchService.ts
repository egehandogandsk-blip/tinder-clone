import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/User';

export const MatchService = {
    // Fetch users that the current user hasn't swiped on yet
    getPotentialMatches: async (currentUserId: string): Promise<User[]> => {
        // 1. Get all IDs the user has already swiped
        const swipesSnapshot = await getDocs(collection(db, 'users', currentUserId, 'swipes'));
        const swipedUserIds = new Set(swipesSnapshot.docs.map(doc => doc.id));

        // 2. Fetch all users (In a real app, use geo-queries and pagination)
        const usersSnapshot = await getDocs(collection(db, 'users'));

        const potentialMatches: User[] = [];
        usersSnapshot.forEach((doc) => {
            if (doc.id !== currentUserId && !swipedUserIds.has(doc.id)) {
                potentialMatches.push(doc.data() as User);
            }
        });

        return potentialMatches;
    },

    recordSwipe: async (currentUserId: string, targetUserId: string, direction: 'left' | 'right') => {
        try {
            // 1. Record the swipe
            await setDoc(doc(db, 'users', currentUserId, 'swipes', targetUserId), {
                direction,
                timestamp: serverTimestamp()
            });

            // 2. Check for match if swipe was 'right'
            if (direction === 'right') {
                const targetSwipeSnapshot = await getDoc(doc(db, 'users', targetUserId, 'swipes', currentUserId));

                if (targetSwipeSnapshot.exists()) {
                    const data = targetSwipeSnapshot.data();
                    if (data.direction === 'right') {
                        // It's a match!
                        await MatchService.createMatch(currentUserId, targetUserId);
                        return true; // Match found
                    }
                }
            }
            return false; // No match
        } catch (error) {
            console.error("Error recording swipe:", error);
            throw error;
        }
    },

    createMatch: async (user1Id: string, user2Id: string) => {
        // Create a match document
        const matchRef = await addDoc(collection(db, 'matches'), {
            users: [user1Id, user2Id],
            timestamp: serverTimestamp(),
            lastMessage: "Start the conversation!"
        });
        console.log("Match created with ID:", matchRef.id);
    }
};
