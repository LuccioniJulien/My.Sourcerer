import React from "react";
import { Query } from "react-apollo";
import { Row, Col, Card, Avatar, Badge, Skeleton } from "antd";
import PROFIL_QUERY from "./query";
import getLoc from "../../helper";
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
      const {
        avatarUrl,
        login,
        contributionsCollection,
        repositories,
        followers,
        following,
        bio
      } = data.user;
      const { nodes: repos } = data.user.repositories;
      const { total } = getLoc(repos);
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
                Ligne of code:{" "}
                <Badge
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={9999999}
                  count={total}
                />
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
