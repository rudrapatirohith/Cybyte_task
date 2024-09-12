
import { Image, StyleSheet, Platform, View, Modal } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {WebView} from 'react-native-webview';

export default function HomeScreen() {
  const [isChatBotVisible,setChatBotVisible] = useState(false);

  return (
    <GestureHandlerRootView style={{flex:1}}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/OnCare360.jpg')}
          style={styles.reactLogo}
        />
      }>

        {/* Welcome message */}

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome To OnCare360!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">About This App</ThemedText>
        <ThemedText>
          This is a Health Care Application Named OnCare360 where you can Clear All Your doubts Regarding Health Issues.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">AI Assistant Intructions</ThemedText>
        <ThemedText>
        Use our AI Assistant to get health-related advice, available 24/7. Tap the chatbot icon to start.
        </ThemedText>
      </ThemedView>

    </ParallaxScrollView>

    {/* Floating Chatbox Icon */}
    <TouchableOpacity 
      style={styles.chatbotButton}
      onPress={()=>setChatBotVisible(true)}>

      <Ionicons name="chatbubble-ellipses-outline" size={30} color='white'/>
    </TouchableOpacity>
    
    <Modal
    animationType='slide'
    transparent={true}
    visible={isChatBotVisible}
    onRequestClose={()=>setChatBotVisible(false)}
    >

      <View style={styles.modalContainer}>
        <TouchableOpacity
        style={styles.closeButton}
        onPress={()=> setChatBotVisible(false)}
        >
          <Ionicons name="close-outline" size={30} color="white" />
        </TouchableOpacity>

        <WebView
        source={{uri: 'https://ddna-oncare360-inc3250--health-care-assistant.soului.dh.soulmachines.cloud/?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1NzA0NDMsImlzcyI6InNpZ25lZF91cmwtNzIwZTk5YjEtNDE0ZC00YTNhLWI5ZDktZGIyOGZmNTAzOTMwIiwiZXhwIjoxODExODg0MDQzLCJlbWFpbCI6Im9uY2FyZTM2MC1pbmMzMjUwLS1oZWFsdGgtY2FyZS1hc3Npc3RhbnRAZGRuYS5zdHVkaW8iLCJzb3VsSWQiOiJkZG5hLW9uY2FyZTM2MC1pbmMzMjUwLS1oZWFsdGgtY2FyZS1hc3Npc3RhbnQifQ.aVYVtV7bS0dluHbg84zsV20ZgSstotNUPnXj16YIG7s'}}
        style={styles.webview}
        />
      </View>
    </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 393,
    bottom: 1,
    left: 0 ,
    position: 'absolute',
    alignContent:'center'
  },
  chatbotButton:{
    position:'absolute',
    bottom:20,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 50,
    padding: 15,
    elevation: 8,
  },
  modalContainer:{
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton:{
    position: 'absolute',
    top: 20,
    right:20,
    zIndex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 25,
  },
  webview:{
    flex:1,
    marginTop: 50,
  },
});
