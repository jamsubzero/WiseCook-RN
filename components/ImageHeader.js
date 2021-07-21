import React from 'react';
import {View, Image, Text} from 'react-native';

const ImageHeader = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <Image
        style={{width: 40, height: 40, marginRight: 5}}
        source={require('../images/wise.png')}
        resizeMode="contain"
      />
      <Text style={{fontSize: 20, color: 'white'}}>WiseCook</Text>
    </View>
  );
};

export default ImageHeader;