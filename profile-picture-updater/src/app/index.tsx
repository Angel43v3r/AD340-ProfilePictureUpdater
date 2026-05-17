import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { User } from "lucide-react-native";

export default function HomeScreen() {
  // State to hold the selected image URI
  const [imageUri, setImageUri] = useState<string | null>(null);

  //Permission Hooks: Use the useCameraPermissions and useMediaLibraryPermissions hooks from expo-image-picker to manage permissions for camera and media library access.
  const [cameraPermission, setCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaPermission, setMediaPermission] = ImagePicker.useMediaLibraryPermissions();

  //A function that checks if permissions are granted. 
  // If not, request them before opening the picker.
  const checkPermissions = async (permissionType: "camera" | "media") => {
    if (permissionType === "camera") {
      if (!cameraPermission?.granted) {
        // Request camera permission if not granted
        const permission = await setCameraPermission();
        if (!permission.granted) {
          Alert.alert("Permission required", "Camera permission is required to take a photo.");
          return false;
        }
      }
    } else if (permissionType === "media") {
      if (!mediaPermission?.granted) {
        const permission = await setMediaPermission();
        if (!permission.granted) {
          Alert.alert("Permission required", "Media library permission is required to select a photo.");
          return false;
        }
      }
    }
    return true;
  };

  // Function to Pick Image from Library
  const pickImage = async () => {
    const hasPermission = await checkPermissions("media");
    if (!hasPermission) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // If the user didn't cancel the picker, update the state with the selected image URI
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to Take Photo using Camera
  const takePhoto = async () => {
    const hasPermission = await checkPermissions("camera");
    if (!hasPermission) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // If the user didn't cancel the camera, update the state with the captured image URI
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to Clear Image
  const clearImage = () => {
    setImageUri(null);
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Picture Updater</Text>

      {/* Display the selected image if available */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarContainer}>
          <User size={100} color="#97b2da" />
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}
      {/* Render X (clear button) ONLY when an image exists */}
      {imageUri && (
        <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
      )}


      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </Pressable>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#d7e1f5',
    overflow: 'hidden',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d7e1f5',
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#849ec6',
    marginTop: 16,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
    justifyContent: 'space-between',
    height: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  clearButton: {
    backgroundColor: '#849ec6',
    padding: 2,
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d7e1f5', 
    alignItems: 'center',
    justifyContent: 'center',
    right: 100,
  },
  clearButtonText: {
    color: '#272939',
    fontWeight: 'bold',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#849ec6',
  },
});