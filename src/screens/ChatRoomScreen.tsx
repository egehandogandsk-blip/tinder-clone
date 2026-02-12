import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { ChatService } from '../services/ChatService';
import { AuthService } from '../services/AuthService';
import { View, StyleSheet } from 'react-native';

export const ChatRoomScreen = ({ route, navigation }: any) => {
    const { matchId, otherUserName } = route.params;
    const [messages, setMessages] = useState<IMessage[]>([]);
    const currentUser = AuthService.getCurrentUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: otherUserName || 'Chat',
        });
    }, [navigation, otherUserName]);

    useEffect(() => {
        const unsubscribe = ChatService.subscribeToMessages(matchId, (newMessages) => {
            setMessages(newMessages.map(m => ({
                _id: m._id,
                text: m.text,
                createdAt: m.createdAt,
                user: {
                    _id: m.user._id,
                    name: m.user.name,
                }
            })));
        });

        return () => unsubscribe();
    }, [matchId]);

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        if (currentUser) {
            const { text } = messages[0];
            ChatService.sendMessage(matchId, text, {
                _id: currentUser.uid,
                name: currentUser.displayName || 'User',
            });
        }
    }, [matchId, currentUser]);

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: currentUser?.uid || '',
                    name: currentUser?.displayName || '',
                }}
                renderUsernameOnMessage
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});
