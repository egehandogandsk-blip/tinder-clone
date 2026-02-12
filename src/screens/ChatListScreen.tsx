import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Avatar, Divider, Text } from 'react-native-paper';
import { ChatService, ChatRoom } from '../services/ChatService';
import { AuthService } from '../services/AuthService';

export const ChatListScreen = ({ navigation }: any) => {
    const [matches, setMatches] = useState<ChatRoom[]>([]);
    const currentUser = AuthService.getCurrentUser();

    useEffect(() => {
        if (currentUser) {
            const loadMatches = async () => {
                const data = await ChatService.getMatches(currentUser.uid);
                setMatches(data);
            };
            loadMatches();
        }
    }, []);

    const renderItem = ({ item }: { item: ChatRoom }) => (
        <List.Item
            title={item.otherUser?.displayName || 'Unknown User'}
            description={item.lastMessage || 'Start conversation...'}
            left={props => (
                <Avatar.Image
                    {...props}
                    size={50}
                    source={{ uri: item.otherUser?.photoURLs[0] || 'https://via.placeholder.com/150' }}
                />
            )}
            onPress={() => navigation.navigate('ChatRoom', { matchId: item.id, otherUserName: item.otherUser?.displayName })}
        />
    );

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>Matches</Text>
            <FlatList
                data={matches}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={Divider}
                ListEmptyComponent={<Text style={styles.empty}>No matches yet. Keep swiping!</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 20,
        fontWeight: 'bold',
        color: '#fe3c72',
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: 'gray',
    },
});
