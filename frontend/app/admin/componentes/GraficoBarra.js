import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function GraficoBarra({ title, labels, data }) {
  const ref = useRef();
  const chartRef = useRef();

  useEffect(() => {
    const ctx = ref.current.getContext('2d');
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: title,
          data,
          backgroundColor: 'rgba(78, 115, 223, 0.8)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }, [labels, data]);

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
      </div>
      <div className="card-body" style={{ height: '300px' }}>
        <canvas ref={ref}></canvas>
      </div>
    </div>
  );
}