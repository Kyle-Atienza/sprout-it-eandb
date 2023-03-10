import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getBatches,
  loadBatchesBySubstrate,
} from "../features/batch/batchSlice";
import { getMaterials } from "../features/inventory/inventorySlice";

import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export const AnalyticsSubstrateBatch = ({
  compareHarvestDefects,
  harvests,
}) => {
  const dispatch = useDispatch();

  const { finished, substrate, active } = useSelector((state) => state.batch);

  const [kusotBatch, setKusotBatch] = useState([]);
  const [dayamiBatch, setDayamiBatch] = useState([]);
  const [mixedBatch, setMixedBatch] = useState([]);

  useEffect(() => {
    dispatch(getBatches());
    dispatch(getMaterials());
    // dispatch(loadBatchesBySubstrate());
  }, []);

  useEffect(() => {
    if (mixedBatch) {
      // console.log(getBatchesDefectsSum(mixedBatch));
    }
  }, [mixedBatch]);

  useEffect(() => {
    setMixedBatch(
      [...active, ...finished].filter((batch) => {
        return !!(
          batch.materials.filter(({ material }) => {
            return material.name === "Kusot";
          }).length &&
          batch.materials.filter(({ material }) => {
            return material.name === "Dayami";
          }).length
        );
      })
    );

    setKusotBatch(
      [...active, ...finished].filter((batch) => {
        return !!(
          batch.materials.filter(({ material }) => {
            return material.name === "Kusot";
          }).length &&
          !batch.materials.filter(({ material }) => {
            return material.name === "Dayami";
          }).length
        );
      })
    );

    setDayamiBatch(
      [...active, ...finished].filter((batch) => {
        return !!(
          batch.materials.filter(({ material }) => {
            return material.name === "Dayami";
          }).length &&
          !batch.materials.filter(({ material }) => {
            return material.name === "Kusot";
          }).length
        );
      })
    );
  }, [active, finished]);

  const getBatchesHarvestSum = (batches) => {
    return (
      batches.reduce((prev, current) => {
        return (
          prev +
          current.harvests.reduce((prev, current) => {
            return prev + current.weight;
          }, 0)
        );
      }, 0) / batches.length
    );
  };

  const getDefectsSum = (batch) => {
    let length = 0;
    let defectsSum = 0;
    const defectedPhase = Object.keys(batch).filter(
      (key) => batch[key].defects
    );
    defectedPhase.forEach((phase) => {
      defectsSum += batch[phase].defects;
      length += 1;
    });
    return defectsSum / length;
  };

  const getBatchesDefectsSum = (batches, name) => {
    return batches.reduce((prev, current) => {
      return prev + getDefectsSum(current) || 0;
    }, 0);
  };

  const chartCompareHarvestDefects = {
    labels: ["Kusot", "Dayami", "Mixed"],
    datasets: [
      {
        label: "Total Harvests",
        backgroundColor: "#BCDEA2",
        data: [
          getBatchesHarvestSum(kusotBatch),
          getBatchesHarvestSum(dayamiBatch),
          getBatchesHarvestSum(mixedBatch),
        ],
      },
      {
        label: "Total Defects",
        backgroundColor: "#A29072",
        data: [
          getBatchesDefectsSum(kusotBatch, "kusot"),
          getBatchesDefectsSum(dayamiBatch, "dayami"),
          getBatchesDefectsSum(mixedBatch, "mixed"),
        ],
      },
    ],
  };

  const chartHarvests = {
    labels: ["Kusot", "Dayami", "Mix"],
    datasets: [
      {
        label: "Yield Percentage for Substrate Type",
        fill: true,
        data: [
          getBatchesHarvestSum(kusotBatch),
          getBatchesHarvestSum(dayamiBatch),
          getBatchesHarvestSum(mixedBatch),
        ],
        backgroundColor: ["#FC9035", "#4C8989", "#ADE3E5"],
      },
    ],
  };

  if (compareHarvestDefects) {
    return (
      <Bar
        data={chartCompareHarvestDefects}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Average Harvest and Defects per Substrate",
              fontSize: 20,
            },
          },
        }}
      />
    );
  } else if (harvests) {
    return (
      <Doughnut
        data={chartHarvests}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Yield Percentage per Substrate",
              fontSize: 24,
            },
          },
        }}
      />
    );
  }
};
