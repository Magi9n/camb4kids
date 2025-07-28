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
    // Llama al endpoint que devuelve los promedios del día actual
    api.get('/rates/daily-averages')
      .then(res => {
        console.log('Datos del gráfico (promedios):', res.data);
        if (res.data && res.data.length > 0) {
          // Filtrar solo las últimas 6 horas
          const now = new Date();
          const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          
          const filteredData = res.data.filter(item => {
            const itemTime = new Date();
            const [hours, minutes] = item.time.split(':');
            itemTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return itemTime >= sixHoursAgo;
          });

          // Agrupar por horas (cada 60 minutos)
          const hourlyData = [];
          const hourlyLabels = [];
          
          for (let i = 0; i < 6; i++) {
            const hourStart = new Date(now);
            hourStart.setHours(now.getHours() - 5 + i, 0, 0, 0);
            
            const hourEnd = new Date(hourStart);
            hourEnd.setHours(hourStart.getHours() + 1);
            
            const hourData = filteredData.filter(item => {
              const itemTime = new Date();
              const [hours, minutes] = item.time.split(':');
              itemTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
              return itemTime >= hourStart && itemTime < hourEnd;
            });
            
            if (hourData.length > 0) {
              const avgValue = hourData.reduce((sum, item) => sum + item.value, 0) / hourData.length;
              hourlyData.push(parseFloat(avgValue.toFixed(3)));
              hourlyLabels.push(hourStart.toLocaleTimeString('es-PE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }));
            } else {
              // Si no hay datos para esta hora, usar el último valor conocido o 0
              const lastValue = hourlyData.length > 0 ? hourlyData[hourlyData.length - 1] : 0;
              hourlyData.push(lastValue);
              hourlyLabels.push(hourStart.toLocaleTimeString('es-PE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }));
            }
          }
          
          setData(hourlyData);
          setLabels(hourlyLabels);
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
        pointRadius: 3,
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
        ticks: { color: '#333', font: { family: 'Roboto', size: compact ? 11 : 13 } }
      },
      y: {
        grid: { color: '#eee' },
        ticks: { color: '#333', font: { family: 'Roboto', size: compact ? 11 : 13 }, callback: v => v.toFixed(3) }
      }
    }
  };

  return (
    <Paper sx={{ p: compact ? 2 : 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 2 }}>
      <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: compact ? 16 : 18, mb: 2 }}>
        EL DÓLAR HOY
      </Typography>
      <Box sx={{ width: '100%', height: compact ? 200 : 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif' }}>
            Cargando datos...
          </Typography>
        ) : error ? (
          <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif', textAlign: 'center', fontSize: compact ? 12 : 14 }}>
            {error}
          </Typography>
        ) : data.length > 0 ? (
          <Line data={chartData} options={options} height={compact ? 160 : 280} />
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