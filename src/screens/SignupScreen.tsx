import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { AuthService } from '../services/AuthService';

export const SignupScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !name) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await AuthService.signup(email, password, name);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
            <TextInput
                label="Full Name"
                mode="outlined"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                label="Email"
                mode="outlined"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                label="Password"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            <Button
                mode="contained"
                onPress={handleSignup}
                style={styles.button}
                loading={loading}
                disabled={loading}
            >
                Sign Up
            </Button>
            <Button onPress={() => navigation.goBack()}>
                Back to Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginVertical: 10,
    },
    button: {
        marginVertical: 10,
        backgroundColor: '#fe3c72',
    },
});
