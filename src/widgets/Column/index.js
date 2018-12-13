import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Row, Col, Card, Skeleton } from "antd";
import ReactChartkick, { ColumnChart } from 'react-chartkick'
import Chart from 'chart.js'
import "./index.css";

ReactChartkick.addAdapter(Chart)
export const COLUMN_QUERY = gql`
  query {
    user(login: "LuccioniJulien") {
      repositories(first: 100) {
        nodes {
          name
          primaryLanguage {
            name
            color
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
        }
        totalCount
      }
    }
  }
`;

export const Column = () => (
  <Query query={COLUMN_QUERY}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Card style={{ width: 650, marginBottom: 16 }}>
            <Skeleton active />
          </Card>
        );
      if (error) return `${error}!`;
      const { nodes: repos } = data.user.repositories;
      const languages = repos
        .filter(l => l.primaryLanguage && l.defaultBranchRef)
        .map(l => {
          const { name: language, color } = l.primaryLanguage;
          let loc = 0;
          for (const item of l.defaultBranchRef.target.history.nodes) {
            loc += item.additions;
          }
          return {
            language,
            loc,
            color
          };
        });
      let temp = {};
      for (const lang of languages) {
        const nb = temp[lang.language] || 0;
        temp[lang.language] = nb + lang["loc"];
      }
      let series = [];
      for (const key in temp) {
        series.push([key,temp[key]]);
      }
      return (
        <Row>
          <Col span={24}>
            <Card style={{ width: 650, marginBottom: 16 }}>
              <Col span={24}>
                <ColumnChart data={series} />
              </Col>
            </Card>
          </Col>
        </Row>
      );
    }}
  </Query>
);
