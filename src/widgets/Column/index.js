import React from "react";
import { Query } from "react-apollo";
import { Row, Col, Card, Skeleton } from "antd";
import ReactChartkick, { ColumnChart } from "react-chartkick";
import Chart from "chart.js";
import COLUMN_QUERY from "./query";
import getLoc from "../../helper";

import "./index.css";

ReactChartkick.addAdapter(Chart);

export const Column = name => (
  <Query query={COLUMN_QUERY} variables={name}>
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
      const { nodes: repos } = data.user.repositories;
      const { langDictionnary } = getLoc(repos);
      let series = [];
      for (const key in langDictionnary) {
        series.push([key, langDictionnary[key]]);
      }
      return (
        <Row>
          <Card
            title="Column chart, ligne of code by primary language"
            style={{ width: 650, marginBottom: 16 }}
          >
            <Col span={24}>
              <ColumnChart data={series} />
            </Col>
          </Card>
        </Row>
      );
    }}
  </Query>
);
