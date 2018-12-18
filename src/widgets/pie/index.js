import React from "react";
import { Query } from "react-apollo";
import PieChart from "react-minimal-pie-chart";
import { Row, Col, Card, Tag, Skeleton } from "antd";
import PIE_QUERY from "./query";

import "./index.css";

export const Pie = (name) => (
  <Query query={PIE_QUERY} variables={name}>
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
      let total = 0;
      for (const lang of languages) {
        const nb = temp[lang.language] || 0;
        temp[lang.language] = nb + lang["loc"];
        total += lang["loc"];
      }
      let series = [];
      for (const key in temp) {
        const buildObj = {
          title: key,
          value: temp[key],
          color: languages.find(x => x.language === key).color,
          ratio: ((temp[key] * 100) / total).toFixed(2)
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
                        style={{ width: 100, textAlign: "center" }}
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
