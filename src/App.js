import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context';

import './App.css';
import SearchInput from './SearchInput';

const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql"
});

const authLink = setContext((_, { headers }) => {
    const token = process.env.REACT_APP_GITHUB_API_KEY;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <SearchInput />
            </div>
        </ApolloProvider>
    );
}

export default App;
