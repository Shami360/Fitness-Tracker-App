import { useExercises } from "@/hooks/use-exercises";
import { toggleCompleted } from "@/store/exercises";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIES = ["All", "Chest", "Legs", "Core", "Cardio", "Full Body"];

const CATEGORY_COLORS: Record<string, string> = {
  Chest: "#FF6B6B",
  Legs: "#4ECDC4",
  Core: "#45B7D1",
  Cardio: "#FFA07A",
  "Full Body": "#98D8C8",
  Custom: "#C3A6FF",
};

export default function HomeScreen() {
  const router = useRouter();
  const exercises = useExercises();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completedCount = exercises.filter((ex) => ex.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Fitness Tracker</Text>
          <Text style={styles.headerSubtitle}>
            {completedCount}/{exercises.length} exercises completed today
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-exercise")}
          accessibilityLabel="Add new exercise"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  exercises.length > 0
                    ? `${(completedCount / exercises.length) * 100}%`
                    : "0%",
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {exercises.length > 0
            ? Math.round((completedCount / exercises.length) * 100)
            : 0}
          % done
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search exercises"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              selectedCategory === item && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(item)}
            accessibilityLabel={`Filter by ${item}`}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === item && styles.categoryChipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={60} color="#444" />
            <Text style={styles.emptyText}>No exercises found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.completed && styles.cardCompleted]}
            onPress={() => router.push(`/exercise/${item.id}`)}
            accessibilityLabel={`View details for ${item.name}`}
            accessibilityRole="button"
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.categoryDot,
                  {
                    backgroundColor:
                      CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.Custom,
                  },
                ]}
              />
              <View style={styles.cardText}>
                <Text
                  style={[styles.cardTitle, item.completed && styles.cardTitleDone]}
                >
                  {item.name}
                </Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              {item.custom && (
                <View style={styles.customBadge}>
                  <Text style={styles.customBadgeText}>Custom</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => toggleCompleted(item.id)}
                style={[
                  styles.checkButton,
                  item.completed && styles.checkButtonDone,
                ]}
                accessibilityLabel={
                  item.completed
                    ? `Mark ${item.name} as incomplete`
                    : `Mark ${item.name} as complete`
                }
                accessibilityRole="checkbox"
              >
                <Ionicons
                  name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                  size={26}
                  color={item.completed ? "#4ECDC4" : "#555"}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
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
  addButton: {
    backgroundColor: "#4ECDC4",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#2d2d44",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ECDC4",
    borderRadius: 3,
  },
  progressText: {
    color: "#4ECDC4",
    fontSize: 12,
    fontWeight: "600",
    minWidth: 48,
    textAlign: "right",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213e",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  categoryList: {
    maxHeight: 44,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#16213e",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#4ECDC4",
  },
  categoryChipText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#1a1a2e",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#16213e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCompleted: {
    opacity: 0.6,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  cardTitleDone: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  cardCategory: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customBadge: {
    backgroundColor: "#2d2d44",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  customBadgeText: {
    color: "#C3A6FF",
    fontSize: 10,
    fontWeight: "600",
  },
  checkButton: {
    padding: 2,
  },
  checkButtonDone: {},
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
  },
});
