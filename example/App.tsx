import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, DonutChart } from '@dansalomon/charty';

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const monthlyData = [
  { label: 'Jan', value: 42_000 },
  { label: 'Feb', value: 39_000 },
  { label: 'Mar', value: 54_500 },
  { label: 'Apr', value: 59_000 },
  { label: 'May', value: 55_000 },
  { label: 'Jun', value: 34_000 },
];

const spendingData = [
  { label: 'Housing', value: 1_200, color: '#0F6564' },
  { label: 'Food', value: 460, color: '#FD7119' },
  { label: 'Transport', value: 240, color: '#5A88FF' },
  { label: 'Leisure', value: 320, color: '#FC6AFF' },
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState<number>();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CHARTY EXAMPLE</Text>
        <Text style={styles.title}>A clear view of your money.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly spending</Text>
          <Text style={styles.cardCaption}>Tap a bar to highlight a month.</Text>
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
          <Text style={styles.cardTitle}>Spending breakdown</Text>
          <Text style={styles.cardCaption}>Percentages and values are available to screen readers.</Text>
          <DonutChart
            accessibilityLabel="Spending breakdown"
            data={spendingData}
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
