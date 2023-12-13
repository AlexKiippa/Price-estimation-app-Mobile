import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Input, Button } from '@rneui/themed';




const CameraScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const [productTitle, setProductTitle] = useState("");

  useEffect(() => {
        // Request camera permission when the component mounts

    const requestCameraPermission = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();

        // Check if the URI is not null or undefined
        if (uri) {
          console.log("Image URI:", uri);

          // Read the image file and convert to Base64
          const base64Image = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log("Base64 image: ", base64Image);

          // Send the Base64-encoded image to the next screen
          navigation.navigate("ImageRecognition", { imageBase64: base64Image });
        } else {
          console.warn("Error: Image URI is null or undefined.");
        }
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    } else {
      console.warn("Camera is not ready.");
    }
  };

  const choosePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: false, // Do not use base64 in ImagePicker
      });

      if (!result.cancelled) {
        console.log("Image URI from gallery:", result.uri);

        // Read the image file and convert to Base64
        const base64Image = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("Base64 image from gallery: ", base64Image);

        // Send the Base64-encoded image to the next screen
        navigation.navigate("ImageRecognition", { imageBase64: base64Image });
      }
    } catch (error) {
      console.error("Error choosing picture from gallery:", error);
    }
  };

  const startCamera = async () => {
    if (hasPermission) {
      setCameraReady(true);
    } else {
      console.error("Camera permission not granted.");
    }
  };

  const handleInputSubmit = () => {
    // Save the product title to state (or use a global state management solution)
    setProductTitle(productTitle);

    // Navigate to the ConditionScreen and pass the productTitle
    navigation.navigate("ConditionScreen", { productTitle: productTitle });
  };

  return (

    
    <View style={{ flex: 1 }}>
        
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Hinta Arvio App</Text>
      </View>

      <Input
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginTop: 10,
          alignSelf: "center",
        }}
        placeholder="Syötä huonekalun nimi"
        onChangeText={(text) => setProductTitle(text)}
        value={productTitle}
      />
      <TouchableOpacity
          onPress={handleInputSubmit}
          style={{ position: "absolute", marginTop: 110, alignSelf: "center" }}
        >
          <Button
            on
            onPress={handleInputSubmit}
            title="Submit"
          ></Button>
        </TouchableOpacity>
      {!isCameraReady && (
        <TouchableOpacity
          onPress={startCamera}
          style={{ position: "absolute", marginTop: 170, alignSelf: "center" }}
        >
          <Button
            on
            onPress={startCamera}
            title="Käynnistä Kamera"
          ></Button>
        </TouchableOpacity>
      )}
      {isCameraReady && (
        <>

          <Camera
            ref={cameraRef}
            style={{ flex: 1, marginTop: 20}}
            type={Camera.Constants.Type.back}
            ratio="16:9"
            onCameraReady={() => setCameraReady(true)}
          />
          <TouchableOpacity
            onPress={takePicture}
            style={{ position: "absolute", bottom: 80, alignSelf: "center" }}
          >
            <Button onPress={takePicture} title="Ota Kuva" style={{ fontSize: 18, color: "white" }}></Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={choosePicture}
            style={{ position: "absolute", bottom: 30, alignSelf: "center" }}
          >
            <Button onPress={choosePicture} title= "Valitse Kuva" style={{ fontSize: 18, color: "white" }}></Button>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CameraScreen;
