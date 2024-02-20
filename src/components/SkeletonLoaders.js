import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {color} from '../theme';

export const RowLoader = () => {
  return (
    <View style={styles.rowLoaderView}>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderCircle} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderCircle} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderCircle} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderCircle} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderCircle} />
      </SkeletonPlaceholder>
    </View>
  );
};

export const BannerLoader = () => {
  return (
    <View
      style={[styles.rowLoaderView, {backgroundColor: color.palette.white}]}>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderRect} />
      </SkeletonPlaceholder>
    </View>
  );
};

export const ProductRectLoader = () => {
  return (
    <View
      style={[styles.rowLoaderView, {backgroundColor: color.palette.white}]}>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderProdRect} />
      </SkeletonPlaceholder>
    </View>
  );
};

export const ProductFlatRectLoader = () => {
  return (
    <View
      style={[
        styles.rowLoaderView,
        {
          backgroundColor: color.palette.white,
          flexDirection: 'column',
          flex: 1,
          marginHorizontal: 10,
        },
      ]}>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderFlatProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderFlatProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderFlatProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderFlatProdRect} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderFlatProdRect} />
      </SkeletonPlaceholder>
    </View>
  );
};

export const ProfileLoader = () => {
  return (
    <View
      style={[
        styles.rowLoaderView,
        {
          backgroundColor: color.palette.white,
          marginHorizontal: 10,
        },
      ]}>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.loaderFlatProdRect} />
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  rowLoaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    // backgroundColor: color.palette.white,
  },
  loaderCircle: {
    height: 60,
    width: 60,
    backgroundColor: 'red',
    borderRadius: 100,
  },
  loaderRect: {
    height: 120,
    width: 300,
    marginLeft: 20,
    marginVertical: 12,
  },
  loaderProdRect: {
    height: 160,
    width: 100,
    marginLeft: 20,
    marginVertical: 12,
  },
  loaderFlatProdRect: {
    height: 120,
    width: Dimensions.get('screen').width - 60,
    marginLeft: 20,
    marginVertical: 12,
  },
});
