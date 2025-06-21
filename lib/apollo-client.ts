import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { onError } from "@apollo/client/link/error"

// Create HTTP link
const httpLink = createHttpLink({
  uri: typeof window === "undefined" ? "http://localhost:3000/api/graphql" : "/api/graphql",
  credentials: "same-origin",
})

// Auth link
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

// Error link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// Create Apollo Client
function createApolloClient() {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getFeaturedProducts: {
              merge(existing = [], incoming) {
                return incoming
              },
            },
            getProducts: {
              merge(existing = [], incoming) {
                return incoming
              },
            },
            getPrograms: {
              merge(existing = [], incoming) {
                return incoming
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
        notifyOnNetworkStatusChange: true,
      },
      query: {
        errorPolicy: "all",
      },
    },
    ssrMode: typeof window === "undefined",
    connectToDevTools: process.env.NODE_ENV === "development",
  })
}

// Create client instance
const client = createApolloClient()

export default client
