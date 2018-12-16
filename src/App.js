import React, { Component } from "react";
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Layout } from "antd";

import { Profil } from "./widgets/profil";
import { Pie } from "./widgets/pie";
import { Column } from "./widgets/Column";
import { Repos } from "./widgets/repos";
import "./App.css";

const { Content, Header } = Layout;

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.REACT_APP_TOKEN}`
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Header className="App-header">My Sourcerer</Header>
        <Layout>
          <Content className="App-content">
            <Profil />
            <Repos />
            <Pie />
            <Column />
          </Content>
        </Layout>
      </ApolloProvider>
    );
  }
}

export default App;
