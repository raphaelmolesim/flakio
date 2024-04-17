import { React, useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  elements,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

function transformData(data) {

  const labels = data.map((element) => element['handled_finished_at'])
  console.log("Labels: ", labels);

  const series = new Set();
  data.forEach((element) => series.add(element['job_name']))
  console.log("series: ", series)
  
  const datasets = []
  series.forEach((label) => {
    const dataPoints = data.filter((element) => element['job_name'] == label).map((element) => element['count(line)'])

    datasets.push({
      label: label,
      data: dataPoints,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    })
  })
  console.log(`datasets`, datasets)
  return { datasets };
}

export function Graph({ data }) {
  [internalData, setInternalData] = useState([])
  //const internalData = useRef([])

  useEffect(() => {
    const transformedData = { ... transformData(data) }
    console.log("useEffect", data.length, transformedData)
    setInternalData((currentData) => transformedData)
    //internalData = { ... transformData(data) }
  } , [data])

  if (internalData.length > 0) {
    return <Line options={options} data={internalData} />;
  } else {
    return (<p>No Data</p>) 
  }
}