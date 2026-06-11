import React from 'react';
import { View } from 'react-native';
import ArrowRight from 'react-native-vector-icons/Feather';

const UploadedRoom = ({ navigation }) => {
  const handleBack = () => {
    navigation.navigate('Profile');
  };
  return (
    <View>
      <ArrowRight
        name="arrow-left"
        size={25}
        color="black"
        style={{
          position: 'absolute',
          top: 40,
          left: 15,
          backgroundColor: 'rgba(209, 209, 209, 0.86)',
          padding: 10,
          borderRadius: 15,
        }}
        onPress={() => handleBack()}
      />
    </View>
  );
};

export default UploadedRoom;
