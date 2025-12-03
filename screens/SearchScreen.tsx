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
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import type { DrawerParamList } from "../navigation/DrawerStack";

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<DrawerParamList>>();

  const [location, setLocation] = useState<string>("");
  const [gearbox, setGearbox] = useState<"Automaat" | "Manuaal" | "">("");
  const [seats, setSeats] = useState<string>("");
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleSearch = () => {
    navigation.navigate("Kuulutused", {
      location: location || undefined,
      gearbox: gearbox === "" ? undefined : gearbox,
      seats: seats ? Number(seats) : undefined,
      petsAllowed,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
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
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Otsi kuulutusi</Text>

      <View style={{ marginBottom: 16 }}>
        <Button
          title="Kõik kuulutused"
          onPress={() => navigation.navigate("Kuulutused", {})}
        />
      </View>

      <Text style={styles.label}>Vali kuupäevad:</Text>
      <Calendar
        onDayPress={onDayPress}
        markingType="period"
        markedDates={getMarkedDates()}
      />

      <TextInput
        style={styles.input}
        placeholder="Asukoht (nt Tallinn)"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Istekohtade arv"
        keyboardType="numeric"
        value={seats}
        onChangeText={setSeats}
      />

      <TextInput
        style={styles.input}
        placeholder="Käigukast (Automaat/Manuaal)"
        value={gearbox}
        onChangeText={(val) =>
          val === "Automaat" || val === "Manuaal"
            ? setGearbox(val)
            : setGearbox("")
        }
      />

      <View style={styles.switchRow}>
        <Text>Lemmikloomad lubatud</Text>
        <Switch value={petsAllowed} onValueChange={setPetsAllowed} />
      </View>

      <Button title="Otsi" onPress={handleSearch} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
});
