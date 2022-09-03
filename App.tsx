import React from "react";
import { SafeAreaView, ScrollView, View, StatusBar, StyleSheet } from "react-native";
import { BarChart, PieChart } from "@components";
import { Colors } from "@utils";

const budget_items = [
    {
        title: "Household",
        amount: 35000,
        color: Colors.danger,
        iconColor: Colors.white,
    },
    {
        title: "Food dining",
        amount: 15000,
        color: Colors.orange,
        iconColor: Colors.primary_900,
    },
    {
        title: "Leisure and travel",
        amount: 20000,
        color: Colors.yellow,
        iconColor: Colors.primary_900,
    },
    {
        title: "Loan",
        amount: 30000,
        color: Colors.green_light,
        iconColor: Colors.primary_900,
    },
    {
        title: "Education",
        amount: 35000,
        color: Colors.blue_light,
        iconColor: Colors.primary_900,
    },
    {
        title: "Utilities",
        amount: 12000,
        color: Colors.purple,
        iconColor: Colors.white,
    },
    { title: "Others", amount: 31000, color: Colors.pink, iconColor: Colors.white },
];

const App = () => {
    return (
        <SafeAreaView style={{ backgroundColor: "#FFF", padding: 16 }}>
            <StatusBar barStyle={"dark-content"} />

            <ScrollView>
                <View style={{ height: 250 }}>
                    <BarChart
                        labels={["Juin", "Apr", "May", "Jun", "jul", "Aug"]}
                        values={[10000, 39000, 54500, 59000, 55000, 34000]}
                        budget={40000}
                        scale={1000}
                    />
                </View>
                <View style={{ height: 300 }}>
                    <PieChart data={budget_items} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
    },
    highlight: {
        fontWeight: "700",
    },
});

export default App;
