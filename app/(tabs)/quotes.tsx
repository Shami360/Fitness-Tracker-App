import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Quote = {
  q: string;
  a: string;
};

const FALLBACK_QUOTES: Quote[] = [
  { q: "The only bad workout is the one that didn't happen.", a: "Unknown" },
  { q: "Take care of your body. It's the only place you have to live.", a: "Jim Rohn" },
  { q: "Fitness is not about being better than someone else. It's about being better than you used to be.", a: "Unknown" },
  { q: "The pain you feel today will be the strength you feel tomorrow.", a: "Unknown" },
  { q: "Success usually comes to those who are too busy to be looking for it.", a: "Henry David Thoreau" },
  { q: "All progress takes place outside the comfort zone.", a: "Michael John Bobak" },
  { q: "If something stands between you and your success, move it. Never be denied.", a: "Dwayne Johnson" },
  { q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
];

export default function QuotesScreen() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsedFallback(false);

    try {
      const response = await fetch("https://zenquotes.io/api/random", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: Quote[] = await response.json();
      if (data && data[0]) {
        setQuote(data[0]);
      } else {
        throw new Error("Empty response");
      }
    } catch {
      const random = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(random);
      setUsedFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Motivation</Text>
        <Text style={styles.headerSubtitle}>
          Get inspired to crush your workout
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.quoteCard}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={36}
            color="#4ECDC4"
            style={styles.quoteIcon}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#4ECDC4" style={{ marginVertical: 40 }} />
          ) : quote ? (
            <>
              <Text style={styles.quoteText}>"{quote.q}"</Text>
              <Text style={styles.quoteAuthor}>— {quote.a}</Text>
              {usedFallback && (
                <View style={styles.offlineBadge}>
                  <Ionicons name="wifi-outline" size={12} color="#888" />
                  <Text style={styles.offlineBadgeText}>Offline quote</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Tap the button below to get your daily dose of motivation!
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.fetchButton, loading && styles.fetchButtonDisabled]}
          onPress={fetchQuote}
          disabled={loading}
          accessibilityLabel="Get a new motivational quote"
          accessibilityRole="button"
        >
          <Ionicons
            name={loading ? "hourglass-outline" : "refresh-outline"}
            size={20}
            color="#1a1a2e"
          />
          <Text style={styles.fetchButtonText}>
            {loading ? "Loading..." : quote ? "New Quote" : "Get Quote"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Today's Fitness Tips</Text>
        {FITNESS_TIPS.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: tip.color + "22" }]}>
              <Ionicons name={tip.icon as any} size={20} color={tip.color} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const FITNESS_TIPS = [
  {
    icon: "water-outline",
    color: "#45B7D1",
    title: "Stay Hydrated",
    text: "Drink at least 8 glasses of water daily. Hydration improves performance and recovery.",
  },
  {
    icon: "moon-outline",
    color: "#C3A6FF",
    title: "Rest & Recover",
    text: "Muscles grow during rest. Aim for 7–9 hours of sleep each night.",
  },
  {
    icon: "nutrition-outline",
    color: "#98D8C8",
    title: "Fuel Your Body",
    text: "Eat a balanced diet rich in protein, complex carbs, and healthy fats.",
  },
  {
    icon: "trending-up-outline",
    color: "#FFA07A",
    title: "Progressive Overload",
    text: "Gradually increase intensity over time to keep making gains.",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#aaa",
    marginTop: 2,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  quoteCard: {
    backgroundColor: "#16213e",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  quoteIcon: {
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    lineHeight: 28,
    fontStyle: "italic",
    marginBottom: 16,
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#4ECDC4",
    fontWeight: "600",
    textAlign: "center",
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
    backgroundColor: "#2d2d44",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  offlineBadgeText: {
    color: "#888",
    fontSize: 11,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  emptyText: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  fetchButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  fetchButtonDisabled: {
    opacity: 0.6,
  },
  fetchButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  tipText: {
    fontSize: 13,
    color: "#aaa",
    lineHeight: 20,
  },
});
