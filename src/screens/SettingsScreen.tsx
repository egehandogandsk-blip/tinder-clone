import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput, Switch, Divider } from 'react-native-paper';
import { AuthService } from '../services/AuthService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const SettingsScreen = ({ navigation }: any) => {
    const [distance, setDistance] = useState('50');
    const [minAge, setMinAge] = useState('18');
    const [maxAge, setMaxAge] = useState('30');
    const [showMen, setShowMen] = useState(true);
    const [showWomen, setShowWomen] = useState(true);

    const currentUser = AuthService.getCurrentUser();

    const handleSave = async () => {
        if (!currentUser) return;
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                preferences: {
                    distance: parseInt(distance),
                    ageRange: [parseInt(minAge), parseInt(maxAge)],
                    showMen,
                    showWomen
                }
            });
            Alert.alert('Settings Saved');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save settings');
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Discovery Settings</Text>

            <Divider style={styles.divider} />

            <Text variant="titleMedium">Maximum Distance (km)</Text>
            <TextInput
                mode="outlined"
                value={distance}
                onChangeText={setDistance}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text variant="titleMedium">Age Range</Text>
            <View style={styles.row}>
                <TextInput
                    mode="outlined"
                    value={minAge}
                    onChangeText={setMinAge}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    label="Min"
                />
                <TextInput
                    mode="outlined"
                    value={maxAge}
                    onChangeText={setMaxAge}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                    label="Max"
                />
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium">Show Me</Text>
            <View style={styles.row}>
                <Text>Men</Text>
                <Switch value={showMen} onValueChange={setShowMen} color="#fe3c72" />
            </View>
            <View style={styles.row}>
                <Text>Women</Text>
                <Switch value={showWomen} onValueChange={setShowWomen} color="#fe3c72" />
            </View>

            <Button mode="contained" onPress={handleSave} style={styles.button}>
                Save Settings
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginVertical: 10,
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    divider: {
        marginVertical: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#fe3c72',
    },
});
