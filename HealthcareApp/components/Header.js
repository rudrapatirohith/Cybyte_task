import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Header = () => (
  <View style={styles.headerContainer}>
    <Image
      source={require('../assets/OnCare360.jpg')}
      style={styles.headerImage}
    />
  </View>
);

const styles = StyleSheet.create({
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
});

export default Header;
