import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Header from "../../../components/HeaderComp";
import { COLORS } from "../../../theme/theme";

const mainTabs = ["Data Entry", "Data Entry History"];
const subCategories = ["Poultry", "Aqua", "Livestock", "Agriculture"];

const dataMap = {
    Poultry: {
        Laying: [
            { batchNo: "B001-Poultry", startDate: "12-Jan-2021", lastEntryDate: "20-Feb-2021" },
            { batchNo: "B002-Poultry", startDate: "15-Feb-2021", lastEntryDate: "25-Mar-2021" }
        ],
        Hatching: [
            { batchNo: "H001-Poultry", startDate: "10-Feb-2021", lastEntryDate: "22-Apr-2021" }
        ]
    },
    Aqua: {
        "Fish Farming": [
            { batchNo: "F001-Aqua", startDate: "05-Mar-2021", lastEntryDate: "10-May-2021" }
        ],
        "Shrimp Farming": [
            { batchNo: "S001-Aqua", startDate: "08-Apr-2021", lastEntryDate: "15-Jun-2021" }
        ]
    },
    Livestock: {
        Dairy: [
            { batchNo: "D001-Livestock", startDate: "02-May-2021", lastEntryDate: "10-Jul-2021" }
        ],
        Meat: [
            { batchNo: "M001-Livestock", startDate: "06-Jun-2021", lastEntryDate: "12-Aug-2021" }
        ]
    },
    Agriculture: {
        "Crop Production": [
            { batchNo: "C001-Agriculture", startDate: "01-Jul-2021", lastEntryDate: "15-Sep-2021" }
        ],
        "Organic Farming": [
            { batchNo: "O001-Agriculture", startDate: "05-Aug-2021", lastEntryDate: "20-Oct-2021" }
        ]
    }
};

const DataEntryScreen = () => {
    const navigation = useNavigation();
    const [activeMainTab, setActiveMainTab] = useState("Data Entry");
    const [activeSubTab, setActiveSubTab] = useState("Poultry");
    const [expanded, setExpanded] = useState("");

    return (
        <View style={styles.container}>
            {/* Status Bar */}
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />

            {/* Header Component */}
            <Header onFilterPress={() => navigation.openDrawer()} />
            {/* Main Tabs */}
            <View style={styles.tabsContainer}>
                {mainTabs.map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setActiveMainTab(tab)}>
                        <Text style={[styles.tab, activeMainTab === tab && styles.activeTab]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeMainTab === "Data Entry" && (
                <>
                    {/* Subcategory Tabs */}
                    <View style={styles.tabsContainer}>
                        {subCategories.map((category) => (
                            <TouchableOpacity key={category} onPress={() => setActiveSubTab(category)}>
                                <Text style={[styles.tab, activeSubTab === category && styles.activeTab]}>{category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Accordion Sections */}
                    {Object.keys(dataMap[activeSubTab]).map((section) => (
                        <View key={section}>
                            <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(expanded === section ? "" : section)}>
                                <Text style={styles.accordionTitle}>{section}</Text>
                                <Icon name={expanded === section ? "chevron-up" : "chevron-down"} size={16} color="black" style={styles.icon} />
                            </TouchableOpacity>
                            {expanded === section && (
                                <View style={styles.tableContainer}>
                                    {/* Table Header */}
                                    <View style={styles.tableHeader}>
                                        <Text style={styles.headerText}>Batch No.</Text>
                                        <Text style={styles.headerText}>Start Date</Text>
                                        <Text style={styles.headerText}>Last Entry Date</Text>
                                    </View>
                                    {/* Table Rows */}
                                    <FlatList
                                        data={dataMap[activeSubTab][section]}
                                        keyExtractor={(item) => item.batchNo}
                                        renderItem={({ item }) => (
                                            <View style={styles.tableRow}>
                                                <Text style={styles.rowText}>{item.batchNo}</Text>
                                                <Text style={styles.rowText}>{item.startDate}</Text>
                                                <Text style={styles.rowText}>{item.lastEntryDate}</Text>
                                                <TouchableOpacity onPress={() => navigation.navigate("editDataEntry", { batchNo: item.batchNo })}>
                                                    <Icon name="edit" size={16} color="blue" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </View>
                            )}
                        </View>
                    ))}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    tabsContainer: { backgroundColor:COLORS.primaryColor, flexDirection: "row", justifyContent: "space-around" },
    tab: { padding: 10, fontSize: 16, color: "#fff" },
    activeTab: { borderBottomWidth: 3, borderBottomColor: COLORS.SecondaryColor, color: "#fff" },
    accordionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#eee", padding: 10, marginTop: 10 },
    accordionTitle: { fontSize: 18, fontWeight: "bold" },
    icon: { marginLeft: 10 },
    tableContainer: { marginTop: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 },
    tableHeader: { flexDirection: "row", backgroundColor: "#ddd", padding: 10, justifyContent: "space-between" },
    headerText: { fontWeight: "bold", flex: 1, textAlign: "center" },
    tableRow: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc", justifyContent: "space-between", alignItems: "center" },
    rowText: { flex: 1, textAlign: "center" }
});

export default DataEntryScreen;
