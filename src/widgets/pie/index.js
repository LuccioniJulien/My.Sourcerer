import React from "react";
import { Query } from "react-apollo";
import PieChart from "react-minimal-pie-chart";
import { Row, Col, Card, Tag, Skeleton } from "antd";
import PIE_QUERY from "./query";
import getLoc from "../../helper";
import "./index.css";

export const Pie = ({ user }) => (
  <Query query={PIE_QUERY} variables={{ user, nb: 90 }}>
    {({ loading, error, data, fetchMore }) => {
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
      const { total, languages, langDictionnary } = getLoc(repos);
      let series = [];
      for (const key in langDictionnary) {
        const buildObj = {
          title: key,
          value: langDictionnary[key],
          color: languages.find(x => x.language === key).color,
          ratio: ((langDictionnary[key] * 100) / total).toFixed(2)
        };
        series.push(buildObj);
      }
      return (
        <Row>
          <Col span={24}>
            <Card style={{ width: 650, marginBottom: 16 }}>
              <Col span={12}>
                {series.map((x, id) => {
                  return (
                    <div key={id} style={{ marginBottom: 8 }}>
                      <Tag
                        style={{ width: 120, textAlign: "center" }}
                        color={x.color}
                      >
                        {x.title}
                      </Tag>
                      <Tag
                        style={{ width: 60, textAlign: "center" }}
                        color="blue"
                      >
                        {x.ratio} %
                      </Tag>
                      <Tag color="blue">loc: {x.value}</Tag>
                    </div>
                  );
                })}
              </Col>
              <Col span={12}>
                <PieChart data={series} animate={true} />
              </Col>
            </Card>
          </Col>
        </Row>
      );
    }}
  </Query>
);
