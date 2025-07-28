import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip } from 'chart.js';
import { Box, Typography, Paper } from '@mui/material';
import api from '../services/api';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

const DolarHoyChart = ({ compact = false }) => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Llama al endpoint que devuelve la variación del dólar en la última hora
    api.get('/rates/hourly')
      .then(res => {
        console.log('Datos del gráfico:', res.data);
        if (res.data && res.data.length > 0) {
          setData(res.data.map(d => parseFloat(Number(d.value).toFixed(3))));
          setLabels(res.data.map(d => d.time));
          setError('');
        } else {
          setError('No hay datos disponibles para mostrar la variación del dólar');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar datos del gráfico:', err);
        setError('Error al cargar los datos del gráfico');
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Dólar',
        data,
        fill: true,
        backgroundColor: 'rgba(120, 60, 180, 0.10)',
        borderColor: '#7c3aed',
        pointRadius: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `S/ ${ctx.parsed.y.toFixed(3)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#eee' },
        ticks: { color: '#333', font: { family: 'Roboto', size: compact ? 10 : 12 } }
      },
      y: {
        grid: { color: '#eee' },
        ticks: { color: '#333', font: { family: 'Roboto', size: compact ? 10 : 12 }, callback: v => v.toFixed(3) }
      }
    }
  };

  return (
    <Paper sx={{ p: compact ? 2 : 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 2 }}>
      <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: compact ? 16 : 18, mb: 2 }}>
        EL DÓLAR HOY
      </Typography>
      <Box sx={{ width: '100%', height: compact ? 160 : 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif' }}>
            Cargando datos...
          </Typography>
        ) : error ? (
          <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif', textAlign: 'center', fontSize: compact ? 12 : 14 }}>
            {error}
          </Typography>
        ) : data.length > 0 ? (
          <Line data={chartData} options={options} height={compact ? 120 : 220} />
        ) : (
          <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif', textAlign: 'center', fontSize: compact ? 12 : 14 }}>
            No hay datos disponibles para mostrar la variación del dólar
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default DolarHoyChart; 