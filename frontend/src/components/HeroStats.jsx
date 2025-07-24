import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import CountUp from 'react-countup';

const stats = [
  { label: 'transacciones realizadas', value: 100000, prefix: '+', suffix: '', duration: 2 },
  { label: 'de soles transferidos', value: 8000000000, prefix: '+', suffix: '', duration: 2, format: v => `${Math.round(v/1e9)} mil millones` },
  { label: 'de usuarios registrados', value: 20000, prefix: '+', suffix: '', duration: 2 },
];

const HeroStats = () => {
  const theme = useTheme();
  return (
    <Box sx={{ bgcolor: '#000', color: '#fff', py: 6, textAlign: 'center' }}>
      <Grid container spacing={4} justifyContent="center">
        {stats.map((stat, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Typography variant="h3" fontWeight={700}>
              {stat.prefix}
              <CountUp
                end={stat.value}
                duration={stat.duration}
                separator="," 
                suffix={stat.suffix}
                formattingFn={stat.format}
                enableScrollSpy
                scrollSpyOnce
              />
              {stat.format && !stat.suffix ? '' : stat.suffix}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>{stat.label}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HeroStats; 