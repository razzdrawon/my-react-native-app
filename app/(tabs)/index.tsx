import React from 'react';
import { StyleSheet, View } from 'react-native';
import PostsList from '../../components/PostsList';

export default function Index() {
  return (
    <View style={styles.container}>
      <PostsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});