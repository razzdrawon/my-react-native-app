import React from 'react';
import { StyleSheet, View } from 'react-native';
import GqlPostsList from '../../components/GqlPostsList';

export default function Index() {
  return (
    <View style={styles.container}>
      <GqlPostsList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});