// screens/AdsListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { fetchVans } from "../utils/api";
import type { van } from "../types/van";
import { useRoute, useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import type { DrawerParamList } from "../navigation/DrawerStack";
import { useTheme } from "../context/ThemeContext";

type AdsRoute = RouteProp<DrawerParamList, "Kuulutused">;

export default function AdsListScreen() {
  const [ads, setAds] = useState<van[]>([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute<AdsRoute>();
  const navigation = useNavigation<NavigationProp<DrawerParamList>>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const filters = route.params || {};

  const handleBooking = (van: van) => {
    console.log("Filters received:", filters);
    const start = filters.startDate || "valimata";
    const end = filters.endDate || "valimata";
    
    if (!filters.startDate || !filters.endDate) {
      Alert.alert("Kuupäevad puuduvad", "Palun vali otsingu lehel algus- ja lõppkuupäev.");
      return;
    }

    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const total = days * van.price;

    Alert.alert(
      "Broneering kinnitatud! ✓",
      `${van.title}\n${van.location}\n\n${start} → ${end}\n${days} päeva × €${van.price} = €${total}\n\nBroneering on edukalt tehtud!`,
      [{ text: "OK" }]
    );
  };

  useEffect(() => {
    const loadAds = async () => {
      try {
        const data = await fetchVans();
        let filtered = data;

        // Asukoht
        if (filters.location) {
          filtered = filtered.filter((v) => v.location === filters.location);
        }

        // Sõiduki tüüp
        if (filters.vehicleType) {
          const vehicleType = filters.vehicleType;
          filtered = filtered.filter((v) => {
            if ((v as any).vehicleType) {
              return (v as any).vehicleType === vehicleType;
            }
            // fallback: kontrollime pealkirja
            return v.title.toLowerCase().includes(vehicleType.toLowerCase());
          });
        }

        // Istekohtade arv
        if (filters.seats) {
          filtered = filtered.filter((v) => (v as any).seats === filters.seats);
        }

        // Käigukast
        if (filters.gearbox) {
          filtered = filtered.filter((v) => (v as any).gearbox === filters.gearbox);
        }

        // Lemmikloomad
        if (filters.petsAllowed) {
          filtered = filtered.filter((v) => (v as any).petsAllowed);
        }

        setAds(filtered);
      } catch (err) {
        console.error("Vans fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [filters]);

  if (loading) {
    return (
      <View style={[styles.center, isDark && styles.centerDark]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#1a1a1a" : "#fff" }}>
      {/* Aktiivsete filtrite kuvamine */}
      {(filters.location || filters.gearbox || filters.seats || filters.startDate) && (
        <View style={styles.filtersBar}>
          <Text style={styles.filtersText}>
            {filters.location ? `${filters.location}` : ""}
            {filters.gearbox ? ` • ${filters.gearbox}` : ""}
            {filters.seats ? ` • ${filters.seats} istekohta` : ""}
            {filters.startDate && filters.endDate ? `\n${filters.startDate} → ${filters.endDate}` : ""}
          </Text>
        </View>
      )}

      <FlatList
        data={ads}
        keyExtractor={(item, index) => item.id + "-" + index}
        renderItem={({ item }) => (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => navigation.navigate("Auto detailid", { van: item })}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.info}>
                <Text style={[styles.title, isDark && styles.textDark]}>{item.title}</Text>
                <Text style={[styles.location, isDark && styles.textLight]}>{item.location}</Text>
                <Text style={styles.price}>€{item.price}/päev</Text>
                <Text style={[styles.description, isDark && styles.textLight]} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
            
            {filters.startDate && filters.endDate && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => handleBooking(item)}
              >
                <Text style={styles.bookButtonText}>Broneeri</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  centerDark: { backgroundColor: "#1a1a1a" },
  filtersBar: {
    padding: 8,
    backgroundColor: "rgba(0,122,255,0.1)",
    alignItems: "center",
  },
  filtersText: { fontSize: 14, color: "#007AFF", fontWeight: "600", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    padding: 12,
  },
  cardDark: {
    backgroundColor: "#2a2a2a",
  },
  cardContent: {
    flexDirection: "row",
  },
  thumbnail: {
    width: 100,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#000" },
  textDark: { color: "#fff" },
  textLight: { color: "#ccc" },
  location: { fontSize: 14, color: "#555" },
  price: { fontSize: 14, color: "#007AFF", fontWeight: "600", marginTop: 4 },
  description: { fontSize: 12, color: "#666", marginTop: 4 },
  meta: { fontSize: 12, color: "#333", marginTop: 4 },
  bookButton: {
    marginTop: 12,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
