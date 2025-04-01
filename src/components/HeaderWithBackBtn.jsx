import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/theme';

const HeaderWithBtn = ({ title }) => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <Icon name="chevron-circle-left" size={28} color={COLORS.SecondaryColor} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 25,
        backgroundColor: COLORS.primaryColor,
    },
    backButton: {
        // padding: 8,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.SecondaryColor,
        flex: 1,
    },
    emptySpace: {
        width: 24, // Same width as the back button for symmetry
    },
});

export default HeaderWithBtn;
