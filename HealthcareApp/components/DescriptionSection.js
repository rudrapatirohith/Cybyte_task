import React from "react";
import {View,Text,StyleSheet} from  'react-native';

const DescriptionSection = ({subtitle,description})=>(
    <View>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.description}>{description}</Text>
    </View>
);

const styles = StyleSheet.create({
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 10,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
  });
  
  export default DescriptionSection;