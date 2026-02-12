import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { TinderCard } from '../components/TinderCard';
import { User } from '../types/User';
import { MatchService } from '../services/MatchService';
import { AuthService } from '../services/AuthService';

export const HomeScreen = ({ navigation }: any) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = AuthService.getCurrentUser();

    const fetchUsers = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const potentialMatches = await MatchService.getPotentialMatches(currentUser.uid);
            setUsers(potentialMatches);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSwipeLeft = async (user: User) => {
        if (!currentUser) return;
        setUsers((current) => current.filter((u) => u.uid !== user.uid));
        try {
            await MatchService.recordSwipe(currentUser.uid, user.uid, 'left');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSwipeRight = async (user: User) => {
        if (!currentUser) return;
        setUsers((current) => current.filter((u) => u.uid !== user.uid));
        try {
            const isMatch = await MatchService.recordSwipe(currentUser.uid, user.uid, 'right');
            if (isMatch) {
                Alert.alert("It's a Match!", `You and ${user.displayName} liked each other!`);
                // In a real app, show a cool modal here
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#fe3c72" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cardContainer}>
                {users.length > 0 ? (
                    users.map((user) => (
                        <TinderCard
                            key={user.uid}
                            user={user}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    )).reverse()
                ) : (
                    <View style={styles.noMoreCards}>
                        <Text variant="headlineSmall" style={{ marginBottom: 10 }}>No more profiles</Text>
                        <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
                            Check back later or expand your discovery settings.
                        </Text>
                        <Button mode="contained" onPress={fetchUsers} buttonColor="#fe3c72">
                            Refresh
                        </Button>
                        <Button onPress={() => AuthService.logout().then(() => navigation.navigate('Login'))} style={{ marginTop: 20 }}>
                            Logout
                        </Button>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noMoreCards: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
