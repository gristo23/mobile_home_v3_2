// screens/SearchScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import type { DrawerParamList } from "../navigation/DrawerStack";
import { useTheme } from "../context/ThemeContext";

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<DrawerParamList>>();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const locations = ["Tallinn", "Tartu", "Pärnu", "Ülejäänud Eesti"];
  const seatOptions = [1, 2, 3, 4, 5, 6];
  const gearboxOptions: ("Automaat" | "Manuaal")[] = ["Automaat", "Manuaal"];

  const [location, setLocation] = useState<string>("");
  const [gearbox, setGearbox] = useState<"Automaat" | "Manuaal" | "">("");
  const [seats, setSeats] = useState<number | undefined>(undefined);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSearch = () => {
    console.log("Search params:", { location, gearbox, seats, startDate, endDate });
    navigation.navigate("Kuulutused", {
      location: location || undefined,
      gearbox: gearbox === "" ? undefined : gearbox,
      seats: seats,
      petsAllowed,
      startDate: startDate && startDate !== "" ? startDate : undefined,
      endDate: endDate && endDate !== "" ? endDate : undefined,
    });
  };

  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate("");
    } else {
      setEndDate(day.dateString);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    if (startDate) {
      marked[startDate] = { 
        startingDay: true, 
        color: "#50cebb", 
        textColor: "white" 
      };
    }
    if (endDate) {
      marked[endDate] = { 
        endingDay: true, 
        color: "#50cebb", 
        textColor: "white" 
      };
    }
    
    // Fill in the days between start and end
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + 1);
      
      while (currentDate < end) {
        const dateString = currentDate.toISOString().split('T')[0];
        marked[dateString] = { 
          color: "#70d7c7", 
          textColor: "white" 
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return marked;
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.heading, isDark && styles.textDark]}>Otsi kuulutusi</Text>

      <View style={{ marginBottom: 16 }}>
        <Button
          title="Kõik kuulutused"
          onPress={() => navigation.navigate("Kuulutused", {})}
        />
      </View>

      <Text style={[styles.label, isDark && styles.textDark]}>Vali kuupäevad:</Text>
      <Calendar
        onDayPress={onDayPress}
        markingType="period"
        markedDates={getMarkedDates()}
      />

      <Text style={[styles.label, isDark && styles.textDark]}>Asukoht:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc}
            style={[styles.filterChip, location === loc && styles.filterChipActive]}
            onPress={() => setLocation(loc)}
          >
            <Text style={[styles.filterChipText, location === loc && styles.filterChipTextActive]}>{loc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.label, isDark && styles.textDark]}>Istekohtade arv:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {seatOptions.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.filterChip, seats === num && styles.filterChipActive]}
            onPress={() => setSeats(num)}
          >
            <Text style={[styles.filterChipText, seats === num && styles.filterChipTextActive]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.label, isDark && styles.textDark]}>Käigukast:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {gearboxOptions.map((gear) => (
          <TouchableOpacity
            key={gear}
            style={[styles.filterChip, gearbox === gear && styles.filterChipActive]}
            onPress={() => setGearbox(gear)}
          >
            <Text style={[styles.filterChipText, gearbox === gear && styles.filterChipTextActive]}>{gear}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.switchRow}>
        <Text style={isDark && styles.textDark}>Lemmikloomad lubatud</Text>
        <Switch value={petsAllowed} onValueChange={setPetsAllowed} />
      </View>

      <Button title="Otsi" onPress={handleSearch} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  containerDark: { backgroundColor: "#1a1a1a" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#000" },
  textDark: { color: "#fff" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16, color: "#000" },
  filterRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 14,
    color: "#333",
  },
  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#2a2a2a",
    borderColor: "#444",
    color: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
});
