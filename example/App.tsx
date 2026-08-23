import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, DonutChart } from '@dansalomon/charty';

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const categories = [
  { label: 'Housing', color: '#0F6564' },
  { label: 'Food', color: '#FD7119' },
  { label: 'Transport', color: '#5A88FF' },
  { label: 'Leisure', color: '#FC6AFF' },
] as const;

type SpendingShares = readonly [number, number, number, number];

function createBreakdown(total: number, shares: SpendingShares) {
  let allocated = 0;

  return categories.map((category, index) => {
    const value = index === categories.length - 1 ? total - allocated : Math.round(total * shares[index]);
    allocated += value;
    return { ...category, value };
  });
}

const monthlyData = [
  { label: 'Jan', value: 42_000, breakdown: createBreakdown(42_000, [0.45, 0.23, 0.12, 0.2]) },
  { label: 'Feb', value: 39_000, breakdown: createBreakdown(39_000, [0.42, 0.25, 0.13, 0.2]) },
  { label: 'Mar', value: 54_500, breakdown: createBreakdown(54_500, [0.48, 0.18, 0.14, 0.2]) },
  { label: 'Apr', value: 59_000, breakdown: createBreakdown(59_000, [0.51, 0.19, 0.11, 0.19]) },
  { label: 'May', value: 55_000, breakdown: createBreakdown(55_000, [0.46, 0.21, 0.15, 0.18]) },
  { label: 'Jun', value: 34_000, breakdown: createBreakdown(34_000, [0.44, 0.24, 0.17, 0.15]) },
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedMonth = monthlyData[selectedIndex];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CHARTY EXAMPLE</Text>
        <Text style={styles.title}>A clear view of your money.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly spending</Text>
          <Text style={styles.cardCaption}>Tap a bar to update the spending breakdown.</Text>
          <BarChart
            accessibilityLabel="Monthly spending compared with a fifty thousand dollar budget"
            data={monthlyData}
            formatValue={currency.format}
            onBarPress={(_, index) => setSelectedIndex(index)}
            referenceLine={{ label: 'Budget', value: 50_000 }}
            selectedIndex={selectedIndex}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending breakdown · {selectedMonth.label}</Text>
          <Text style={styles.cardCaption}>
            {currency.format(selectedMonth.value)} total. Percentages and values are available to screen readers.
          </Text>
          <DonutChart
            accessibilityLabel={`Spending breakdown for ${selectedMonth.label}`}
            data={selectedMonth.breakdown}
            formatValue={currency.format}
            style={styles.donut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    boxShadow: '0px 8px 20px rgba(15, 101, 100, 0.08)',
    marginTop: 20,
    padding: 20,
  },
  cardCaption: {
    color: '#6A777C',
    fontSize: 13,
    marginBottom: 12,
    marginTop: 4,
  },
  cardTitle: {
    color: '#183C3B',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  donut: {
    marginTop: 8,
    width: '100%',
  },
  eyebrow: {
    color: '#12888F',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  screen: {
    backgroundColor: '#F0F7F7',
    flex: 1,
  },
  title: {
    color: '#0F6564',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 38,
    marginTop: 8,
    maxWidth: 320,
  },
});
