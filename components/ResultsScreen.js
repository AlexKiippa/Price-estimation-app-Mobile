import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Input, Button, Text, ListItem } from "@rneui/themed";
import { FIREBASE_API_KEY } from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "ostoslista-firebase-c2a65.firebaseapp.com",
  databaseURL:
    "https://ostoslista-firebase-c2a65-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ostoslista-firebase-c2a65",
  storageBucket: "ostoslista-firebase-c2a65.appspot.com",
  messagingSenderId: "372232178586",
  appId: "1:372232178586:web:a96a69494902c02580c823",
  measurementId: "G-NGZWG22D1T",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const useSearchDatabase = (productTitle) => {
  console.log(productTitle);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const itemsRef = ref(database, "scraped_data/");
      onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const itemsArray = Object.entries(data)
            .map(([id, item]) => ({ id, ...item }))
            .filter((item) => {
              // Filter based on productTitle
              const titleMatch = productTitle
                ? item.title.toLowerCase().includes(productTitle.toLowerCase())
                : true;
              return titleMatch;
            });

          setItems(itemsArray);
        } else {
          setItems([]);
        }
      });
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      setError("An error occurred while fetching data. Please try again.");
    }
  }, [productTitle]);

  return { items, error };
};

const ResultScreen = ({ route, navigation }) => {
  const { productTitle } = route.params; // Update to use productTitle instead of title
  const { condition } = route.params;
  const { items, error } = useSearchDatabase(productTitle);

  const calculatePrices = () => {
    console.log("condition", condition);
    if (items.length > 0) {
      // Filter items based on the condition
      const filteredItems = items.filter(
        (item) => item.condition === condition
      );

      const prices = filteredItems.map((item) => item.price);
      console.log("Prices:", prices);

      const sortedPrices = prices.slice().sort((a, b) => a - b);
      const total = prices.reduce((sum, price) => sum + price, 0);
      const avg = total / prices.length;
      const highest = sortedPrices[sortedPrices.length - 1];
      const lowest = sortedPrices[0];

      return { highest, avg, lowest };
    }

    return { highest: 0, avg: 0, lowest: 0 };
  };

  const { highest, avg, lowest } = calculatePrices();

  const handleNewSearch = () => {
    navigation.navigate("Camera");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <>
          <Text style={{ marginBottom: 0 }} h3>
            Korkein hinta: {highest} €
          </Text>
          <Text style={{ marginTop: 20 }} h3>
            Normaali hinta: {parseInt(avg)} €
          </Text>
          <Text style={{ marginTop: 20 }} h3>
            Nopein hinta: {lowest} €
          </Text>

          <Button
            style={{ marginTop: 20 }}
            title="Uusi haku"
            onPress={handleNewSearch}
          />
        </>
      )}
    </View>
  );
};

export default ResultScreen;
