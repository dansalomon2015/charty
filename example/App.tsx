import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  darkChartTheme,
} from '@dansalomon/charty';
import {
  aggregateBreakdowns,
  monthlyData,
  resolveSelectionIndices,
  savingsData,
} from './data';

const currency = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

export default function App() {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0]);
  const effectiveIndices = resolveSelectionIndices(selectedIndices);
  const selectedMonths = effectiveIndices
    .map((index) => monthlyData[index])
    .filter((month): month is (typeof monthlyData)[number] => month !== undefined);
  const selectionLabel =
    selectedIndices.length === 0
      ? 'All months'
      : selectedMonths.map(({ label }) => label).join(' + ');
  const selectedTotal = selectedMonths.reduce((total, month) => total + month.value, 0);
  const selectedBreakdown = aggregateBreakdowns(effectiveIndices);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>CHARTY EXAMPLE</Text>
        <Text style={styles.title}>A clear view of your money.</Text>

        <View style={[styles.card, styles.darkCard]}>
          <Text style={[styles.cardTitle, styles.darkCardTitle]}>Spending trend</Text>
          <Text style={[styles.cardCaption, styles.darkCardCaption]}>
            The line chart shares the controlled month selection with the charts below.
          </Text>
          <LineChart
            accessibilityLabel="Monthly spending trend"
            data={monthlyData}
            formatValue={currency.format}
            lineGradient={{ startColor: '#4FD1DA', endColor: '#7EA6FF' }}
            onSelectionChange={setSelectedIndices}
            selectedIndices={selectedIndices}
            selectionBehavior="multiple"
            theme={darkChartTheme}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Savings balance</Text>
          <Text style={styles.cardCaption}>
            A vertical gradient emphasizes growth without hiding the grid.
          </Text>
          <AreaChart
            accessibilityLabel="Savings balance by month"
            data={savingsData}
            fillGradient={{
              startColor: '#5A88FF',
              endColor: '#5A88FF',
              startOpacity: 0.42,
              endOpacity: 0.04,
            }}
            formatValue={currency.format}
            lineColor="#5A88FF"
            onSelectionChange={setSelectedIndices}
            selectedIndices={selectedIndices}
            selectionBehavior="multiple"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly spending</Text>
          <Text style={styles.cardCaption}>
            Long press on touch, or use Ctrl/Command + click on web, to start multiple selection.
          </Text>
          <BarChart
            accessibilityLabel="Monthly spending compared with a fifty thousand dollar budget"
            data={monthlyData}
            formatValue={currency.format}
            onSelectionChange={setSelectedIndices}
            referenceLine={{ label: 'Budget', value: 50_000 }}
            selectedIndices={selectedIndices}
            selectionBehavior="multiple"
          />
        </View>

        <View style={styles.card}>
          <Text testID="breakdown-title" style={styles.cardTitle}>
            Spending breakdown · {selectionLabel}
          </Text>
          <Text style={styles.cardCaption}>
            {currency.format(selectedTotal)} total. Percentages and values are available to screen readers.
          </Text>
          <DonutChart
            accessibilityLabel={`Spending breakdown for ${selectionLabel}`}
            data={selectedBreakdown}
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
  darkCard: {
    backgroundColor: '#17343D',
  },
  darkCardCaption: {
    color: '#AFC5C9',
  },
  darkCardTitle: {
    color: '#F3FAFA',
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
