/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {Dimensions, Image, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {color} from '../theme';
import ImageViewer from 'react-native-image-zoom-viewer';

const width = Dimensions.get('window').width;
export const ViewImages = ({route}) => {
  const {url, source} = route?.params ?? {};
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.palette.black,
        paddingTop: 30,
      }}>
      <TouchableWithoutFeedback
        hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
        onPress={() => {
          navigation.navigate(source);
        }}>
        <Image
          source={require('../assets/icon/close.png')}
          style={{
            tintColor: color.palette.white,
            alignSelf: 'flex-end',
            height: 30,
            width: 30,
            right: 15,
          }}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          flex: 1,
          backgroundColor: color.palette.black,
          justifyContent: 'center',
        }}>
        <ImageViewer
          imageUrls={[
            {
              url: url,
            },
          ]}
          style={{resizeMode: 'cover', width: width, height: 500}}
        />
      </View>
    </View>
  );
};
