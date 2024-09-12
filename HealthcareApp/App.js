import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Image , Text, Animated} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons'; // Icons from @expo/vector-icons

const AI_ASSISTANT_URL = 'https://ddna-oncare360-inc3250--health-care-assistant.soului.dh.soulmachines.cloud/?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1NzA0NDMsImlzcyI6InNpZ25lZF91cmwtNzIwZTk5YjEtNDE0ZC00YTNhLWI5ZDktZGIyOGZmNTAzOTMwIiwiZXhwIjoxODExODg0MDQzLCJlbWFpbCI6Im9uY2FyZTM2MC1pbmMzMjUwLS1oZWFsdGgtY2FyZS1hc3Npc3RhbnRAZGRuYS5zdHVkaW8iLCJzb3VsSWQiOiJkZG5hLW9uY2FyZTM2MC1pbmMzMjUwLS1oZWFsdGgtY2FyZS1hc3Npc3RhbnQifQ.aVYVtV7bS0dluHbg84zsV20ZgSstotNUPnXj16YIG7s';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const titleAnimation = useRef(new Animated.Value(0)).current;


  useEffect(()=>{
    Animated.timing(titleAnimation,{
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  },[titleAnimation]);

  const openAIWebView = () => {
    setModalVisible(true);
  };

  const closeWebView = () => {
    setModalVisible(false);
  };

  const animationTitleStyle = {
    opacity: titleAnimation,
  };


  return (
    <View style={styles.container}>
      {/* Header with image */}
      <View style={styles.headerContainer}>
        <Image
          source={require('./assets/OnCare360.jpg')}
          style={styles.headerImage}
        />
      </View>

      {/* App description */}
      <View style={styles.descriptionContainer}>
        <Animated.View style={animationTitleStyle}>
        <Text style={styles.title}>Welcome To OnCare360!</Text>
        </Animated.View>
        <Text style={styles.subtitle}>About This App</Text>
        <Text style={styles.description}>
        OnCare360 is a comprehensive health care application designed to address all your health-related queries. Our platform provides reliable and up-to-date information to help you make informed decisions about your health. Explore our resources to get expert guidance and support anytime, anywhere.        </Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.subtitle}>Ai Assistant Instructions</Text>
        <Text style={styles.description}>
        Use our AI Assistant to get health-related advice, available 24/7. Tap the chatbot icon to start.
        </Text>
      </View>

      {/* Chatbot icon at the bottom */}
      <TouchableOpacity style={styles.iconButton} onPress={openAIWebView}>
        <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* WebView for AI assistant */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.webViewContainer}>
          <TouchableOpacity onPress={closeWebView} style={styles.closeButton}>
            <Ionicons name="close-outline" size={30} color="white" />
          </TouchableOpacity>
          <WebView source={{ uri: AI_ASSISTANT_URL }} style={styles.webview} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    top: 80,
  },
  headerContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#A1CEDC',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  descriptionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 1,
  },
  iconButton: {
    position: 'absolute',
    bottom: 95,
    right: 30,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 15,
    elevation: 8,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 50,
  },
  webview: {
    flex: 1,
    marginTop: 50,
  },
});

export default App;
