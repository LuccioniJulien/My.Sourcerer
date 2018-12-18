import React from "react";
import { Query } from "react-apollo";
import { Row, Col, Card, Avatar, Badge, Skeleton } from "antd";
import PROFIL_QUERY from "./query";
import "./index.css";

export const Profil = name => (
  <Query query={PROFIL_QUERY} errorPolicy="all" variables={name}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Card style={{ width: 650, marginBottom: 16 }}>
            <Skeleton active />
          </Card>
        );
      if (error) return `Error!`;
      const {
        avatarUrl,
        login,
        contributionsCollection,
        repositories,
        followers,
        following,
        bio
      } = data.user;
      return (
        <Row>
          <Col span={24}>
            <Card
              title="Profil"
              style={{ width: 650, marginBottom: 16 }}
              extra={<p>{login}</p>}
            >
              <Col span={6}>
                <Avatar size={64} src={avatarUrl} />
              </Col>
              <Col span={5}>
                Commits:{" "}
                <Badge
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={999}
                  count={contributionsCollection.totalCommitContributions}
                />
                <br />
                Repos:{" "}
                <Badge
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={999}
                  count={repositories.totalCount}
                />
                <br />
                Ligne of code: OVER NEIN THOUSAND
              </Col>
              <Col span={5}>
                Followers:{" "}
                <Badge
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={999}
                  count={followers.totalCount}
                />
                <br />
                Following:{" "}
                <Badge
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={999}
                  count={following.totalCount}
                />
                <br />
              </Col>
              <Col span={5}>
                Bio:
                <br />
                {bio}
              </Col>
            </Card>
          </Col>
        </Row>
      );
    }}
  </Query>
);
