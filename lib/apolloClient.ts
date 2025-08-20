import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://graphqlzero.almansi.me/api',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: ["options", ["search", "sort"]],
            merge(existing = { data: [], meta: undefined }, incoming) {
              const mergedData = [...(existing?.data ?? []), ...(incoming?.data ?? [])];
              return { data: mergedData, meta: incoming?.meta };
            },
          },
        },
      },
    },
  }),
});
