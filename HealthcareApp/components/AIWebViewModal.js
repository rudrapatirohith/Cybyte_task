import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const AI_ASSISTANT_URL = 'https://ddna-oncare360-inc3250--health-care-assistant.soului.dh.soulmachines.cloud/?sig=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1NzA0NDMsImlzcyI6InNpZ25lZF91cmwtNzIwZTk5YjEtNDE0ZC00YTNhLWI5ZDktZGIyOGZmNTAzOTMwIiwiZXhwIjoxODExODg0MDQzLCJlbWFpbCI6Im9uY2FyZTM2MC1pbmMzMjUwLS1oZWFsdGgtY2FyZS1hc3Npc3RhbnRAZGRuYS5zdHVkaW8iLCJzb3VsSWQiOiJkZG5hLW9uY2FyZTM2MC1pbmMzMjUwLS1oZWFsdGgtY2FyZS1hc3Npc3RhbnQifQ.aVYVtV7bS0dluHbg84zsV20ZgSstotNUPnXj16YIG7s';

const AIWebViewModal = ({ modalVisible, closeWebView }) => (
  <Modal visible={modalVisible} animationType="slide">
    <View style={styles.webViewContainer}>
      <TouchableOpacity onPress={closeWebView} style={styles.closeButton}>
        <Ionicons name="close-outline" size={30} color="white" />
      </TouchableOpacity>
      <WebView source={{ uri: AI_ASSISTANT_URL }} style={styles.webview} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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

export default AIWebViewModal;
