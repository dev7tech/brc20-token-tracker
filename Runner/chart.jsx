import { createChart } from "lightweight-charts";
import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { getChart } from "./datas";
import style from "../src/styles/coin.module.css";
function Chart(props) {
  const chart_ref = useRef();
  const [data, setData] = useState();
  async function CreateCharts() {
    const chartData = await getChart(props.data);
    setData(chartData);
  }

  useEffect(() => {
    if (data === undefined) return;
    const option = {
      width: chart_ref.current.clientWidth,
      height: 700,
      rightPriceScale: {
        scaleMargins: {
          top: 0.3,
          bottom: 0.25,
        },
        borderVisible: false,
      },
      layout: {
        background: { color: "transparent" },
        textColor: "#C3BCDB",
      },
      timeScale: {
        borderVisible: false,
      },
      grid: {
        horzLines: {
          color: "#eee",
          visible: false,
        },
        vertLines: {
          color: "rgba(0,0,0,0.3)",
        },
      },
      crosshair: {
        horzLine: {
          visible: false,
          labelVisible: false,
        },
        vertLine: {
          visible: true,
          style: 0,
          width: 2,
          color: "rgba(12, 28, 16, 0.1)",
          labelVisible: false,
        },
      },
    };
    const chart = createChart(chart_ref.current, option);
    const lineSeries = chart.addAreaSeries({
      topColor:
        data && data.change > 0 ? "rgb(25, 156, 99)" : "rgb(145, 56, 49)",
      bottomColor: "rgb(0, 0, 0)",
      lineColor: data && data.change > 0 ? "#19d98b" : "#e73842",
      lineWidth: 4,
    });
    console.log(data);
    const seriesData = data
      ? data.history.map((item, index) => ({
          time: item.timestamp,
          value: Number(item.price),
        }))
      : [{ time: moment.now(), value: 0 }];
    lineSeries.setData(seriesData.reverse());
  }, [data]);

  useEffect(() => {
    if (props.data) CreateCharts();
  }, [props.data]);

  return (
    <div className={style.chart}>
      <div
        style={{
          borderRadius: "11px",
          width: "100%",
          border: "1px solid #2b2b34",
          position: "relative",
          marginTop: "50px",
          display: "block",
        }}
        ref={chart_ref}
      ></div>
    </div>
  );
}

export default Chart;
