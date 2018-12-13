import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { Row, Col, Card, Collapse, Tag, Icon, Avatar, Skeleton } from "antd";

import "./index.css";
const Panel = Collapse.Panel;

const REPOS_QUERY = gql`
  query {
    user(login: "LuccioniJulien") {
      repositories(first: 5, privacy: PUBLIC) {
        nodes {
          name
          resourcePath
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

  setCursor(cursor, position = "first") {
    const NEW_QUERY = gql`
query {
    user(login: "LuccioniJulien") {
      repositories(${position}: 5, privacy: PUBLIC,${cursor}) {
        nodes {
          name
          resourcePath
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
                  nodes {
                    additions
                  }
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
    this.setCursor(`before:"${cursor}"`, "last");
  };

  handleNextClick = cursor => {
    console.log("foward");
    this.setCursor(`after:"${cursor}"`,"first");
  };

  render() {
    const name = "";
    return (
      <Query query={this.state.REPOS_QUERY} variables={{ name }}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Card style={{ width: 650, height: 352, marginBottom: 16 }}>
                <Skeleton paragraph={{ rows: 8 }} active />
              </Card>
            );
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
                <Card style={{ width: 650, marginBottom: 16 }}>
                  <div style={{ width: 600, textAlign: "center" }}>
                    <Tag
                      style={{ marginBottom: 8 }}
                      onClick={() => {
                        if (hasPreviousPage)
                          this.handlePreviousClick(startCursor);
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
                            key={id + 1}
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
                          >
                            <p>{x.description}</p>
                            <p>{x.resourcePath}</p>
                            <Row>
                              {x.languages.nodes.map((r, id) => {
                                return (
                                  <Tag
                                    key={id}
                                    style={{ margin: 8 }}
                                    color={r.color}
                                  >
                                    {r.name}
                                  </Tag>
                                );
                              })}
                            </Row>
                            <Row>
                              {x.collaborators.nodes.map((c, id) => {
                                return (
                                  <Col
                                    span={3}
                                    style={{
                                      margin: 16,
                                      width: 85,
                                      textAlign: "center"
                                    }}
                                    key={id}
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
