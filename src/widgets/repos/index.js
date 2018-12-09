import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { Layout, Row, Col, Card, Collapse, Tag, Icon, Avatar } from "antd";

import "./index.css";
const { Content } = Layout;
const Panel = Collapse.Panel;

const REPOS_QUERY = gql`
  query {
    user(login: "LuccioniJulien") {
      repositories(first: 5, privacy: PUBLIC) {
        nodes {
          name
          description
          primaryLanguage {
            name
            color
          }
          collaborators(first: 5) {
            totalCount
            nodes {
              avatarUrl
              name
              login
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          primaryLanguage {
            name
            color
          }
          languages(first: 100) {
            totalCount
            nodes {
              name
              color
            }
          }
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
`;

class Repos extends Component {
  state = {
    repos: [],
    REPOS_QUERY
  };

  componentDidMount() {}

  setCursor(cursor) {
    const NEW_QUERY = gql`
query {
    user(login: "LuccioniJulien") {
      repositories(first: 5, privacy: PUBLIC,${cursor}) {
        nodes {
          name
          description
          primaryLanguage {
            name
            color
          }
          collaborators(first: 5) {
            totalCount
            nodes {
              avatarUrl
              name
              login
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
          primaryLanguage {
            name
            color
          }
          languages(first: 100) {
            totalCount
            nodes {
              name
              color
            }
          }
        }
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }  
`;
    this.setState({ REPOS_QUERY: NEW_QUERY });
  }
  handlePreviousClick = cursor => {
    console.log("backward");
    this.setCursor(`before:"${cursor}"`);
  };

  handleNextClick = cursor => {
    console.log("foward");
    this.setCursor(`after:"${cursor}"`);
  };

  render() {
    const name = "";
    return (
      <Query query={this.state.REPOS_QUERY} variables={{ name }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error!`;
          const { nodes: repos } = data.user.repositories;
          const {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage
          } = data.user.repositories.pageInfo;
          return (
            <Row>
              <Col span={24}>
                <Card>
                  <div style={{ width: 600, textAlign: "center" }}>
                    <Tag
                      style={{ marginBottom: 8 }}
                      onClick={() => {
                        if (hasPreviousPage)
                          this.handlePreviousClick(endCursor);
                      }}
                    >
                      <Icon type="up" />
                    </Tag>
                    <br />
                    <Collapse>
                      {repos.map((x, id) => {
                        if (x.primaryLanguage == null) {
                          x.primaryLanguage = {};
                          x.primaryLanguage.name = "nothing";
                          x.primaryLanguage.color = "#ffffff";
                        }
                        if (x.defaultBranchRef == null) {
                          x.defaultBranchRef = {
                            target: {
                              history: {
                                totalCount: 0
                              }
                            }
                          };
                        }
                        return (
                          <Panel
                            style={{ textAlign: "left" }}
                            header={
                              <>
                                <Tag color={x.primaryLanguage.color}>
                                  <div
                                    style={{ width: 70, textAlign: "center" }}
                                  >
                                    {x.primaryLanguage.name}
                                  </div>
                                </Tag>
                                <Tag color="blue">
                                  Commits:{" "}
                                  {x.defaultBranchRef.target.history.totalCount}
                                </Tag>
                                {x.name}
                              </>
                            }
                            key={id + 1}
                          >
                            <p>{x.description}</p>
                            <Row>
                              {x.languages.nodes.map(r => {
                                return (
                                  <Tag style={{ margin: 8 }} color={r.color}>
                                    {r.name}
                                  </Tag>
                                );
                              })}
                            </Row>
                            <Row>
                              {x.collaborators.nodes.map(c => {
                                return (
                                  <Col
                                    span={3}
                                    style={{
                                      margin: 16,
                                      width: 85,
                                      textAlign: "center"
                                    }}
                                  >
                                    <Row>
                                      <Avatar
                                        style={{ margin: 8 }}
                                        size={64}
                                        src={c.avatarUrl}
                                      />
                                    </Row>
                                    <p>{c.login}</p>
                                  </Col>
                                );
                              })}
                            </Row>
                          </Panel>
                        );
                      })}
                    </Collapse>
                    <Tag
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        if (hasNextPage) this.handleNextClick(endCursor);
                      }}
                    >
                      <Icon type="down" />
                    </Tag>
                  </div>
                </Card>
              </Col>
            </Row>
          );
        }}
      </Query>
    );
  }
}

export default Repos;
