import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'https://graphqlzero.almansi.me/api' }),
  cache: new InMemoryCache(),
});
