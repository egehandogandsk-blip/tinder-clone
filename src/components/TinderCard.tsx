import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { User } from '../types/User';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface TinderCardProps {
    user: User;
    onSwipeLeft: (user: User) => void;
    onSwipeRight: (user: User) => void;
}

export const TinderCard = ({ user, onSwipeLeft, onSwipeRight }: TinderCardProps) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, { startX: number, startY: number }>({
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            translateX.value = ctx.startX + event.translationX;
            translateY.value = ctx.startY + event.translationY;
        },
        onEnd: (event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                // Swipe detected
                const direction = event.translationX > 0 ? 'right' : 'left';

                translateX.value = withSpring(
                    direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
                    {},
                    (finished) => {
                        if (finished) {
                            if (direction === 'left') {
                                runOnJS(onSwipeLeft)(user);
                            } else {
                                runOnJS(onSwipeRight)(user);
                            }
                        }
                    }
                );
            } else {
                // Return to original position
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-10, 0, 10] + 'deg'
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: rotate },
            ],
        };
    });

    return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.card, animatedStyle]}>
                <Image
                    source={{ uri: user.photoURLs[0] || 'https://via.placeholder.com/400x600' }}
                    style={styles.image}
                />
                <View style={styles.infoContainer}>
                    <Text variant="headlineSmall" style={styles.name}>
                        {user.displayName}, {user.age}
                    </Text>
                    <Text variant="bodyMedium" style={styles.bio}>
                        {user.bio}
                    </Text>
                </View>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '95%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        position: 'absolute',
        alignSelf: 'center',
        top: 50,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
    },
    bio: {
        color: 'white',
    },
});
