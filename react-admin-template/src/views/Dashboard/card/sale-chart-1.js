const chartData = {
  options: {
    chart: {
      sparkline: {
        enabled: true
      },
      type: 'line',
      height: 115
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#fff'],

    stroke: {
      curve: 'smooth',
      width: 3
    },
    yaxis: {
      min: 20,
      max: 100
    },
    tooltip: {
      theme: 'light',
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => 'Sales/Order Per Day'
        }
      },
      marker: {
        show: false
      }
    }
  },
  series: [
    {
      name: 'series1',
      data: [55, 35, 75, 25, 90, 50]
    }
  ]
};

export default chartData;
