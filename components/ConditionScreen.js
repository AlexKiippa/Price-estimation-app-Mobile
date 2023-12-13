import React, { useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Input, Button, Text, ListItem } from "@rneui/themed";

const ConditionScreen = ({ route, navigation }) => {
  const conditions = [
    { title: "Uusi", description: "Tämä tuote on uusi.", value: 5 },
    {
      title: "Erinomainen",
      description: "Tämä tuote on melkein kuin uusi tai uudenveroinen",
      value: 4,
    },
    {
      title: "Hyvä",
      description: "Tuote on hyvässä kunnossa ja vähän käytön jälkiä.",
      value: 3,
    },
    {
      title: "Tyydyttävä",
      description: "Tuote on tyydyttävässä kunnossa ja enemmän käytön jälkiä",
      value: 2,
    },
    {
      title: "Huono",
      description: "Tuote on rikki tai huonossa kunnossa ja vaatii korjausta.",
      value: 1,
    },
  ];

  const [selectedCondition, setSelectedCondition] = useState(null);

  const handleConditionSelection = (condition) => {
    setSelectedCondition(condition.value);
    // You can navigate to the next screen or perform any other actions here
    console.log(route.params.productTitle);
    navigation.navigate("ResultScreen", {
      productTitle: route.params.productTitle,
      condition: condition.value,
    });
  };

  return (
    <View>
      <Text style={{ alignSelf: "center" }} h3>
        Valitse kuntoluokka:
      </Text>
      <FlatList
        data={conditions}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleConditionSelection(item)}>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ alignSelf: "center", fontSize: 18 }}>
                {item.title}
              </Text>
              <Text style={{ alignSelf: "center" }}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedCondition && <View></View>}
    </View>
  );
};

export default ConditionScreen;
