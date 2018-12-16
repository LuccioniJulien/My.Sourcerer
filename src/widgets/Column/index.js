import React from "react";
import { Query } from "react-apollo";
import { Row, Col, Card, Skeleton } from "antd";
import ReactChartkick, { ColumnChart } from "react-chartkick";
import Chart from "chart.js";
import COLUMN_QUERY from "./query";

import "./index.css";

ReactChartkick.addAdapter(Chart);

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
            loc -= item.deletions;
          }
          return {
            language,
            loc,
            color
          };
        });
      let temp = {};
      for (const lang of languages) {
        temp[lang.language] = (temp[lang.language] || 0) + lang["loc"];
      }
      let series = [];
      for (const key in temp) {
        series.push([key, temp[key]]);
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
