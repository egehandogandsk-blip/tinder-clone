import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Avatar, TextInput, Divider } from 'react-native-paper';
import { AuthService } from '../services/AuthService';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/User';

export const ProfileScreen = ({ navigation }: any) => {
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState('');
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        if (currentUser) {
            const docRef = doc(db, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as User;
                setUserProfile(data);
                setBio(data.bio);
            }
        }
    };

    const handleSave = async () => {
        if (currentUser) {
            try {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    bio: bio
                });
                setEditing(false);
                fetchProfile();
                Alert.alert('Success', 'Profile updated!');
            } catch (error) {
                Alert.alert('Error', 'Failed to update profile');
            }
        }
    };

    const handleLogout = async () => {
        await AuthService.logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    if (!userProfile) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Avatar.Image
                    size={120}
                    source={{ uri: userProfile.photoURLs[0] || 'https://via.placeholder.com/150' }}
                />
                <Text variant="headlineMedium" style={styles.name}>{userProfile.displayName}, {userProfile.age}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
                <Text variant="titleMedium" style={styles.label}>Bio</Text>
                {editing ? (
                    <TextInput
                        mode="outlined"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />
                ) : (
                    <Text variant="bodyLarge">{userProfile.bio || "No bio yet."}</Text>
                )}
            </View>

            <View style={styles.actions}>
                {editing ? (
                    <Button mode="contained" onPress={handleSave} style={styles.button}>
                        Save Profile
                    </Button>
                ) : (
                    <Button mode="outlined" onPress={() => setEditing(true)} style={styles.button}>
                        Edit User Info
                    </Button>
                )}

                <Button mode="contained" buttonColor="#fe3c72" onPress={() => navigation.navigate('GoldMembership')} style={styles.button}>
                    Get Tinder Gold
                </Button>

                <Button mode="outlined" onPress={() => navigation.navigate('Settings')} style={styles.button}>
                    Discovery Settings
                </Button>

                <Button mode="text" onPress={handleLogout} textColor="red" style={{ marginTop: 20 }}>
                    Logout
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    name: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: 20,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#fe3c72',
    },
    input: {
        backgroundColor: 'white',
    },
    actions: {
        marginTop: 10,
    },
    button: {
        marginVertical: 5,
    },
});
