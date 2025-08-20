import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';

const GqlPostsList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: { page: 1, limit: 10 },
  });

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
        <Text style={styles.centerText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}> 
        <Text style={styles.error}>Error: {error.message}</Text>
      </View>
    );
  }

  const posts = data?.posts?.data ?? [];

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: any) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }: any) => (
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={3}>{item.body}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  centerText: { marginTop: 8, color: '#666' },
  error: { color: '#e74c3c' },
  list: { padding: 16 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  body: { fontSize: 14, color: '#666', lineHeight: 20 },
});

export default GqlPostsList;
