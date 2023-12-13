import React, { useEffect, useState } from "react";
import { View } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { VISION_API_KEY, TRANSLATION_API_KEY } from "@env";
import { Input, Button, Text } from "@rneui/themed";

const visionApiKey = VISION_API_KEY;
const translationApiKey = TRANSLATION_API_KEY;

const ImageRecognitionScreen = ({ route }) => {
  const { imageBase64 } = route.params;
  const [recognizedItem, setRecognizedItem] = useState(null);
  const [productTitle, setProductTitle] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`;

    const requestData = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: "OBJECT_LOCALIZATION",
              maxResults: 1,
            },
          ],
        },
      ],
    };

    axios
      .post(visionApiUrl, requestData)
      .then((response) => {
        const recognizedObject =
          response.data.responses[0].localizedObjectAnnotations[0];
        const name = recognizedObject.name;

        setRecognizedItem(name);
      })
      .catch((error) => {
        console.error("Error making Vision API request:", error);
        console.error("Response data:", error.response?.data);
      });
  }, [imageBase64]);

  useEffect(() => {
    if (recognizedItem) {
      translateItem();
    }
  }, [recognizedItem]);

  const translateItem = async () => {
    // Replace with your translation API key
    try {
      const translationResponse = await axios.get(
        `https://translation.googleapis.com/language/translate/v2?key=${translationApiKey}&q=${recognizedItem}&target=fi`
      );
      const translatedItem =
        translationResponse.data.data.translations[0].translatedText;
      const TranslatedItemString = String(translatedItem);
      console.log("String", TranslatedItemString);
      setProductTitle(TranslatedItemString);

      console.log("Original Item:", recognizedItem);
      console.log("Translated Item:", translatedItem);

      // You can use the translatedItem as needed
    } catch (translationError) {
      console.error("Error making translation request:", translationError);
    }
  };

  const handleTryAgain = () => {
    // Navigate back to CameraScreen
    navigation.navigate("Camera");
  };

  const handleCorrect = () => {
    // Navigate to the next screen
    navigation.navigate("ConditionScreen", { productTitle: productTitle });
  };

  return (
    <View>
      {recognizedItem ? (
        <Text
          style={{ alignSelf: "center" }}
          h3
        >{`Tunnistettu huonekalu: ${productTitle}`}</Text>
      ) : (
        <Text style={{ alignSelf: "center" }} h3>
          Tunnistetaan...
        </Text>
      )}
      <Button
        color="error"
        style={{ width: "40%", alignSelf: "center", marginTop: 20 }}
        title="Yritä uudestaan"
        onPress={handleTryAgain}
      />
      <Button
        buttonStyle={{
          backgroundColor: "rgba(111, 202, 186, 1)",
          borderRadius: 5,
        }}
        style={{ width: "40%", alignSelf: "center", marginTop: 40 }}
        title="Jatka"
        onPress={handleCorrect}
      />
    </View>
  );
};

export default ImageRecognitionScreen;
