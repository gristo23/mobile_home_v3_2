// screens/AuthScreen.tsx (Täiendatud fail)
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext'; // IMPORDI Context
import type { DrawerParamList } from "../navigation/DrawerStack";

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  // Impordi login funktsioon Context'ist
  const { login, register } = useAuth();
  const navigation = useNavigation<NavigationProp<DrawerParamList>>();

  // ... (Jäta need muud muutujad samaks)
  const [email, setEmail] = useState("user@user.ee");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>('login');

  const isLogin = mode === 'login';
  // ...

  const handleSubmit = () => {
    if (isLogin) {
      //  SISSELOGIMISE LOOGIKA
      const success = login(email, password);
      if (success) {
        navigation.navigate("Avaleht"); // Navigate to home page
      } else {
        // Ebaõnnestunud sisselogimine
        Alert.alert("Sisselogimine ebaõnnestus", "Vale parool või e-posti aadress.");
      }
    } else {
      // Registreerimise loogika
      if (password !== confirmPassword) {
         Alert.alert("Viga", "Paroolid ei ühti!");
         return;
      }
      if (!email || !password) {
         Alert.alert("Viga", "Palun täida kõik väljad!");
         return;
      }
      // Registreeri kasutaja
      register(email, password);
      navigation.navigate("Avaleht"); // Navigate to home page
    }
  };

  // ... (Jäta return osa samaks)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Logi sisse' : 'Registreeri'}</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-post"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Parool"
        secureTextEntry
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Kinnita parool"
          secureTextEntry
        />
      )}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit} // Kasuta handleSubmit
      >
        <Text style={styles.submitButtonText}>{isLogin ? 'Logi sisse' : 'Registreeri'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(isLogin ? 'register' : 'login')} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>{isLogin ? 'Loo konto' : 'Juba konto? Logi sisse'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007AFF',
  },
});