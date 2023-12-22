import { useEffect, useRef } from "react";
import styles from "./index.module.less";
import * as echarts from "echarts";

const Grid = () => {
  const item2Ref = useRef(null);
  const chart2 = useRef(null);

  const initItem2 = () => {
    chart2.current = echarts.init(item2Ref.current);
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // Use axis to trigger tooltip
          type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
        },
      },
      legend: {},
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      series: [
        {
          name: "Direct",
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: [320, 302, 301, 334, 390, 330, 320],
        },
        {
          name: "Mail Ad",
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Affiliate Ad",
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ad",
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: [150, 212, 201, 154, 190, 330, 410],
        },
        {
          name: "Search Engine",
          type: "bar",
          stack: "total",
          label: {
            show: true,
          },
          emphasis: {
            focus: "series",
          },
          data: [820, 832, 901, 934, 1290, 1330, 1320],
        },
      ],
    };

    chart2.current.setOption(option);
  };

  useEffect(() => {
    initItem2();

    window.addEventListener("resize", () => {
      chart2.current.resize();
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div className={styles.Grid}>
      <div className={styles.girdWrapper}>
        <div className={styles.item1}></div>
        <div className={styles.item2} ref={item2Ref}></div>
        <div className={styles.item3}>item3</div>
      </div>
    </div>
  );
};

export default Grid;
