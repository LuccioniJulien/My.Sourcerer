import React from "react";
import { Query } from "react-apollo";
import { Row, Col, Card, Collapse, Tag, Icon, Avatar, Skeleton } from "antd";
import "./index.css";
import REPOS_QUERY from "./query";
const Panel = Collapse.Panel;

export const Repos = ({ user: name }) => {
  const variables = {
    name,
    startCursor: null,
    endCursor: null,
    first: 5,
    last: null
  };
  return (
    <Query query={REPOS_QUERY} errorPolicy="all" variables={variables}>
      {({ loading, error, data, fetchMore }) => {
        if (loading)
          return (
            <Card style={{ width: 650, height: 352, marginBottom: 16 }}>
              <Skeleton paragraph={{ rows: 8 }} active />
            </Card>
          );
        if (error) {
          if (!data) {
            if (error) {
              return (
                <Card style={{ width: 650, marginBottom: 16 }}>
                  <p>Upssss...</p>
                  <p>It must be a CORS errors</p>
                  <p>Error:</p>
                  <p>{`${error}`}</p>
                </Card>
              );
            }
          }
        }
        const { nodes: repos } = data.user.repositories;
        const { avatarUrl, login } = data.user;
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
                        fetchMore({
                          variables: {
                            endCursor: null,
                            startCursor,
                            first: null,
                            last: 5
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            return Object.assign({}, prev, fetchMoreResult);
                          }
                        });
                    }}
                  >
                    <Icon type="up" />
                  </Tag>
                  <br />
                  <Collapse>
                    {repos.map((x, id) => {
                      if (!x.collaborators) {
                        x.collaborators = { nodes: [{ avatarUrl, login }] };
                      }
                      // verification pour eviter le plantage sur des dépots vides
                      if (x.primaryLanguage == null) {
                        x.primaryLanguage = {};
                        x.primaryLanguage.name = "nothing";
                        x.primaryLanguage.color = "blue";
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
                                <div style={{ width: 120, textAlign: "center" }}>
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
                      if (hasNextPage) {
                        fetchMore({
                          variables: {
                            endCursor,
                            startCursor: null,
                            first: 5,
                            last: null
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev;
                            return Object.assign({}, prev, fetchMoreResult);
                          }
                        });
                      }
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
};
