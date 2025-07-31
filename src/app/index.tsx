import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OpenSpot</Text>
      <Text style={styles.subtitle}>
        あなたのための『開かれた場所』を見つけよう
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
