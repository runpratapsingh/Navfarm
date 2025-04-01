import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../../theme/theme';
import CustomInput from '../../../components/CustumInputField';
import HeaderWithBtn from '../../../components/HeaderWithBackBtn';

const BatchCreation = () => {
    const [formState, setFormState] = useState({
        isHeaderVisible: true,
        isLineVisible: true,
        natureOfBusiness: 'Aqua',
        lineOfBusiness: 'Aqua Rearing',
        remainingQty: '0',
        breedName: 'HAMOOR',
        templateName: 'HAMOOR-1 DEMO',
        postingDate: '03-Aug-2022',
        mortality: { itemName: 'Commercial Fish', totalUnits: '0.0' },
        feedInput1: { itemName: 'Feed 1.9mm', totalUnits: '0.0' },
        feedInput2: { itemName: 'Feed 4.5mm', totalUnits: '0.0' },
    });

    const handleSave = () => {
        // Implement save functionality
        console.log('Data saved:', formState);
    };

    const handlePost = () => {
        // Implement post functionality
        console.log('Data posted:', formState);
    };

    const handleEyePress = (section) => {
        // Implement functionality for eye press
        console.log(`Eye pressed in ${section} section`);
    };

    const updateFormState = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    return (
        <>
            <HeaderWithBtn title="Data Entry" />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>HEADER (B00010-RECEIVED G...)</Text>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => updateFormState('isHeaderVisible', !formState.isHeaderVisible)}
                    >
                        <Icon
                            name={formState.isHeaderVisible ? 'minus' : 'plus'}
                            size={16}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>

                {formState.isHeaderVisible && (
                    <View style={styles.headerDetails}>
                        <CustomInput
                            label="Nature Of Business"
                            value={formState.natureOfBusiness}
                            onChangeText={(text) => updateFormState('natureOfBusiness', text)}
                            editable={false} // Disable the input field
                            style={styles.disabledInput} // Apply disabled background color
                        />
                        <CustomInput
                            label="Line Of Business"
                            value={formState.lineOfBusiness}
                            onChangeText={(text) => updateFormState('lineOfBusiness', text)}
                            editable={false} // Disable the input field
                            style={styles.disabledInput} // Apply disabled background color
                        />
                        <CustomInput
                            label="Remaining Qty"
                            value={formState.remainingQty}
                            onChangeText={(text) => updateFormState('remainingQty', text)}
                            editable={false} // Disable the input field
                            style={styles.disabledInput} // Apply disabled background color
                        />
                        <CustomInput
                            label="Breed Name"
                            value={formState.breedName}
                            onChangeText={(text) => updateFormState('breedName', text)}
                            editable={false} // Disable the input field
                            style={styles.disabledInput} // Apply disabled background color
                        />
                        <CustomInput
                            label="Template Name"
                            value={formState.templateName}
                            onChangeText={(text) => updateFormState('templateName', text)}
                            editable={false} // Disable the input field
                            style={styles.disabledInput} // Apply disabled background color
                        />
                        <CustomInput
                            label="Posting Date"
                            value={formState.postingDate}
                            onChangeText={(text) => updateFormState('postingDate', text)}
                            editable={false} // Disable the input field
                            style={styles.disabledInput} // Apply disabled background color
                        />
                        <View style={styles.sectionTitleHeader}>
                            <Text style={styles.sectionTitle}></Text>
                            <TouchableOpacity onPress={() => handleEyePress('Header')}>
                                <Icon name="eye" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}


                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>LINE DETAIL</Text>
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => updateFormState('isLineVisible', !formState.isLineVisible)}
                    >
                        <Icon
                            name={formState.isLineVisible ? 'minus' : 'plus'}
                            size={16}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.lineDetail}>
                    <View style={styles.section}>
                        <View style={styles.sectionTitleHeader}>
                            <Text style={styles.sectionTitle}>MORTALITY</Text>
                            <TouchableOpacity onPress={() => handleEyePress('Mortality')}>
                                <Icon name="eye" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <CustomInput
                            label="Item Name"
                            value={formState.mortality.itemName}
                            onChangeText={(text) => updateFormState('mortality', { ...formState.mortality, itemName: text })}
                        />
                        <CustomInput
                            label="Total Units (PCS)"
                            value={formState.mortality.totalUnits}
                            onChangeText={(text) => updateFormState('mortality', { ...formState.mortality, totalUnits: text })}
                        />
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionTitleHeader}>
                            <Text style={styles.sectionTitle}>FEED-INPUT</Text>
                            <TouchableOpacity onPress={() => handleEyePress('FeedInput1')}>
                                <Icon name="eye" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <CustomInput
                            label="Item Name"
                            value={formState.feedInput1.itemName}
                            onChangeText={(text) => updateFormState('feedInput1', { ...formState.feedInput1, itemName: text })}
                        />
                        <CustomInput
                            label="Total Units (KG)"
                            value={formState.feedInput1.totalUnits}
                            onChangeText={(text) => updateFormState('feedInput1', { ...formState.feedInput1, totalUnits: text })}
                        />
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionTitleHeader}>
                            <Text style={styles.sectionTitle}>FEED-INPUT</Text>
                            <TouchableOpacity onPress={() => handleEyePress('FeedInput2')}>
                                <Icon name="eye" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <CustomInput
                            label="Item Name"
                            value={formState.feedInput2.itemName}
                            onChangeText={(text) => updateFormState('feedInput2', { ...formState.feedInput2, itemName: text })}
                        />
                        <CustomInput
                            label="Total Units (KG)"
                            value={formState.feedInput2.totalUnits}
                            onChangeText={(text) => updateFormState('feedInput2', { ...formState.feedInput2, totalUnits: text })}
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handlePost}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.SecondaryColor,
    },
    toggleButton: {
        backgroundColor: COLORS.SecondaryColor,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerDetails: {
        // backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    lineDetail: {
        marginBottom: 20,
        padding: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginHorizontal: 16,
        paddingBottom: 20,
    },
    button: {
        backgroundColor: COLORS.SecondaryColor,
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    sectionTitleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    disabledInput: {
        backgroundColor: '#f0f0f0', // Light gray background color for disabled inputs
    },
});

export default BatchCreation;
