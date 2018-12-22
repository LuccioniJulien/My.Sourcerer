import React, { Component } from "react";
import { Layout, Input, message, notification } from "antd";

import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

import { Profil } from "./widgets/profil";
import { Pie } from "./widgets/pie";
import { Column } from "./widgets/Column";
import { Repos } from "./widgets/repos";
import "./App.css";

const Search = Input.Search;
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
  state = {
    userName: "LuccioniJulien"
  };

  handleClickSearch = login => {
    this.setState({ userName: null})
    client
      .query({
        query: gql`
      query {
        user(login: ${login}) {
          name
          login
        }
      }
      `
      })
      .then(result => this.handleResult(result))
      .catch(result => message.error(result.graphQLErrors[0].message));
  };
  handleResult(result) {
    if (result.errors) {
      message.error(`This User doesn't exist`);
      this.setState({ userName: null });
      return;
    }
    localStorage.setItem("user", result.data.user.login);
    this.setState({ userName: result.data.user.login });
  }

  componentDidMount() {
    // const userName = localStorage.getItem("user");
    // if (userName) {
    //   this.setState({ userName });
    // }
    notification.open({
      message: "CORS error",
      duration: 10,
      description: (
        <>
          <p>If a CORS error occure on the first launch</p>
          <p>just refresh the page with:</p>
          <p>cmd + r</p>
        </>
      )
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Header className="App-header">My Sourcerer</Header>
        <Layout>
          <Content className="App-content">
            <Search
              placeholder="search another user with login"
              onSearch={this.handleClickSearch}
              style={{ width: 650, marginBottom: 16 }}
            />
            {this.state.userName ? (
              <>
                <Profil user={this.state.userName} />
                <Repos user={this.state.userName} />
                <Pie user={this.state.userName} />
                <Column user={this.state.userName} />
              </>
            ) : (
              ""
            )}
          </Content>
        </Layout>
      </ApolloProvider>
    );
  }
}

export default App;
