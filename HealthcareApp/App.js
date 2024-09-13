import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons from @expo/vector-icons
import Header from './components/Header';
import DescriptionSection from './components/DescriptionSection';
import AIWebViewModal from './components/AIWebViewModal';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const titleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [titleAnimation]);

  const openAIWebView = () => setModalVisible(true);
  const closeWebView = () => setModalVisible(false);

  const animationTitleStyle = {
    opacity: titleAnimation,
  };

  return (
    <View style={styles.container}>
      {/* Header with image */}
      <Header />

      {/* App description */}
      <View style={styles.descriptionContainer}>
        <Animated.View style={animationTitleStyle}>
          <Text style={styles.title}>Welcome To OnCare360!</Text>
        </Animated.View>
        <DescriptionSection
          subtitle="About This App"
          description="OnCare360 is a comprehensive health care application designed to address all your health-related queries. Our platform provides reliable and up-to-date information to help you make informed decisions about your health. Explore our resources to get expert guidance and support anytime, anywhere."
        />
      </View>

      <View style={styles.descriptionContainer}>
        <DescriptionSection
          subtitle="AI Assistant Instructions"
          description="Use our AI Assistant to get health-related advice, available 24/7. Tap the chatbot icon to start."
        />
      </View>

      {/* Chatbot icon at the bottom */}
      <TouchableOpacity style={styles.iconButton} onPress={openAIWebView}>
        <Ionicons name="chatbubble-ellipses-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* AI Assistant Modal */}
      <AIWebViewModal modalVisible={modalVisible} closeWebView={closeWebView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    top: 80,
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
  iconButton: {
    position: 'absolute',
    bottom: 95,
    right: 30,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 15,
    elevation: 8,
  },
});

export default App;
