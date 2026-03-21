import React, { useEffect, useRef } from 'react'
import { View, Image, StyleSheet, Animated, Easing } from 'react-native'

export function GlobeGraphic() {
    const pulse1 = useRef(new Animated.Value(0)).current
    const pulse2 = useRef(new Animated.Value(0)).current
    const pulse3 = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const makePulse = (anim: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 1400,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        }

        makePulse(pulse1, 0)
        makePulse(pulse2, 500)
        makePulse(pulse3, 1000)
    }, [])

    const pulseStyle = (anim: Animated.Value) => ({
        opacity: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.9, 0.4, 0],
        }),
        transform: [{
            scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2.8],
            }),
        }],
    })

    return (
        <View style={styles.globeWrapper}>
            <View style={styles.globeCircle}>
                <Image
                    source={require('../../assets/images/earth.webp')}
                    style={styles.earthImage}
                    resizeMode="cover"
                />
                <View style={styles.tintOverlay} />
            </View>

            {/* <View style={[styles.pin, styles.pin1]}>
                <View style={styles.pinDot} />
            </View>
            <Animated.View style={[styles.pulseRing, styles.pin1, pulseStyle(pulse1)]} />

            <View style={[styles.pin, styles.pin2]}>
                <View style={styles.pinDot} />
            </View>
            <Animated.View style={[styles.pulseRing, styles.pin2, pulseStyle(pulse2)]} />

            <View style={[styles.pin, styles.pin3]}>
                <View style={styles.pinDot} />
            </View>
            <Animated.View style={[styles.pulseRing, styles.pin3, pulseStyle(pulse3)]} /> */}

            {/* Pin 1 */}
            <View style={[styles.pinContainer, styles.pin1]}>
                <View style={styles.pinHead}>
                    <View style={styles.pinDot} />
                </View>
                <View style={styles.pinStem} />
            </View>
            <Animated.View style={[styles.pulseRing, styles.pin1, pulseStyle(pulse1)]} />

            {/* Pin 2 */}
            <View style={[styles.pinContainer, styles.pin2]}>
                <View style={styles.pinHead}>
                    <View style={styles.pinDot} />
                </View>
                <View style={styles.pinStem} />
            </View>
            <Animated.View style={[styles.pulseRing, styles.pin2, pulseStyle(pulse2)]} />

            {/* Pin 3 */}
            <View style={[styles.pinContainer, styles.pin3]}>
                <View style={styles.pinHead}>
                    <View style={styles.pinDot} />
                </View>
                <View style={styles.pinStem} />
            </View>
            <Animated.View style={[styles.pulseRing, styles.pin3, pulseStyle(pulse3)]} />
        </View>
    )
}

const GLOBE_SIZE = 220

const styles = StyleSheet.create({
    globeWrapper: {
        width: GLOBE_SIZE,
        height: GLOBE_SIZE,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    globeCircle: {
        width: GLOBE_SIZE + 5, //Adjust the Oval Shape of earth
        height: GLOBE_SIZE - 10, //Adjust the Oval Shape of earth
        borderRadius: GLOBE_SIZE / 2,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    earthImage: {
        width: '100%',
        height: '100%',
    },
    tintOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(76, 29, 149, 0.35)',
    },
    pin: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7C3AED',
    },
    pulseRing: {
        position: 'absolute',
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
        backgroundColor: 'transparent',
    },
    pin1: { top: 55, left: 68 },
    pin2: { top: 70, left: 148 },
    pin3: { top: 152, left: 118 },
    pinContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    pinHead: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinStem: {
        width: 2,
        height: 15,          // length of the stem
        backgroundColor: 'white',
        opacity: 0.9,
    },
})