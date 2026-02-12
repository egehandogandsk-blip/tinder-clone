import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '../services/AuthService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const GoldMembershipScreen = ({ navigation }: any) => {
    const currentUser = AuthService.getCurrentUser();

    const handleSubscribe = async () => {
        if (!currentUser) return;
        try {
            // In a real app, integrate Stripe/RevenueCat here
            await updateDoc(doc(db, 'users', currentUser.uid), {
                isGoldMember: true
            });
            alert('Welcome to Tinder Gold!');
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Ionicons name="flame" size={80} color="#fe3c72" style={styles.icon} />
            <Text variant="displaySmall" style={styles.title}>Tinder Gold</Text>
            <Text variant="bodyLarge" style={styles.subtitle}>Unlock exclusive features!</Text>

            <View style={styles.features}>
                <FeatureItem icon="heart" text="Unlimited Likes" />
                <FeatureItem icon="refresh" text="Rewind your last swipe" />
                <FeatureItem icon="location" text="Passport to any location" />
                <FeatureItem icon="star" text="5 Super Likes a day" />
                <FeatureItem icon="flash" text="1 Boost a month" />
                <FeatureItem icon="eye" text="See who likes you" />
            </View>

            <Button mode="contained" onPress={handleSubscribe} style={styles.button}>
                Subscribe for $14.99/mo
            </Button>
            <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
                No thanks
            </Button>
        </ScrollView>
    );
};

const FeatureItem = ({ icon, text }: { icon: string, text: string }) => (
    <View style={styles.featureRow}>
        <Ionicons name={icon as any} size={24} color="#d4af37" style={{ marginRight: 10 }} />
        <Text variant="titleMedium">{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexGrow: 1,
    },
    icon: {
        marginTop: 40,
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        color: '#d4af37', // Gold color
        marginBottom: 10,
    },
    subtitle: {
        marginBottom: 30,
        color: 'gray',
    },
    features: {
        width: '100%',
        marginBottom: 30,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#d4af37',
        paddingVertical: 5,
    },
});
