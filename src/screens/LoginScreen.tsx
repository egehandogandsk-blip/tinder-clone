import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { AuthService } from '../services/AuthService';

export const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await AuthService.login(email, password);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="displaySmall" style={styles.title}>Tinder Clone</Text>
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
                onPress={handleLogin}
                style={styles.button}
                loading={loading}
                disabled={loading}
            >
                Login
            </Button>
            <Button onPress={() => navigation.navigate('Signup')} style={styles.secondaryButton}>
                Create Account
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
        marginBottom: 40,
        color: '#fe3c72',
        fontWeight: 'bold',
    },
    input: {
        marginVertical: 10,
    },
    button: {
        marginVertical: 10,
        backgroundColor: '#fe3c72',
    },
    secondaryButton: {
        marginTop: 10,
    }
});
