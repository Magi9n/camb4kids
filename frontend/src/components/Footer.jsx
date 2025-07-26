import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import logomangocashfooter from '../assets/logomangocashfooter.svg';

const Footer = () => {
  return (
    <Box sx={{ 
      bgcolor: '#000', 
      color: 'white', 
      py: 6,
      fontFamily: 'Roboto, sans-serif'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Columna 1: Empresa */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 18, 
              mb: 3 
            }}>
              Empresa
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Nosotros
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Empresas
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Trabaja con Nosotros
              </Typography>
            </Box>
          </Grid>

          {/* Columna 2: Ayuda */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 18, 
              mb: 3 
            }}>
              Ayuda
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Atención al Cliente
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Preguntas Frecuentes
              </Typography>
            </Box>
          </Grid>

          {/* Columna 3: Más Información */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 18, 
              mb: 3 
            }}>
              Más Información
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Promociones
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Configurar Alertas
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Tipo de Cambio Hoy
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                ¿Qué es MangosCash?
              </Typography>
            </Box>
          </Grid>

          {/* Columna 4: Legal */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 18, 
              mb: 3 
            }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Términos y Condiciones
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Políticas de Privacidad
              </Typography>
              <Typography sx={{ 
                fontFamily: 'Roboto, sans-serif', 
                color: '#8b8e96', 
                fontSize: 14,
                cursor: 'pointer',
                '&:hover': { color: 'white' }
              }}>
                Libro de Reclamaciones
              </Typography>
            </Box>
          </Grid>

          {/* Columna 5: Horarios */}
          <Grid item xs={12} sm={6} md={2.4}>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              color: 'white', 
              fontWeight: 700, 
              fontSize: 18, 
              mb: 3 
            }}>
              Horarios
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  color: '#8b8e96', 
                  fontSize: 14
                }}>
                  Lunes A Viernes
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  color: 'white', 
                  fontWeight: 700, 
                  fontSize: 14 
                }}>
                  9:00 AM – 7:00 PM
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  color: '#8b8e96', 
                  fontSize: 14
                }}>
                  Sábado
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  color: 'white', 
                  fontWeight: 700, 
                  fontSize: 14 
                }}>
                  9:00 AM – 2:00 PM
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  color: '#8b8e96', 
                  fontSize: 14
                }}>
                  Atención Por WhatsApp
                </Typography>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  color: 'white', 
                  fontWeight: 700, 
                  fontSize: 14 
                }}>
                  +51 929 382 969
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Logo en la parte inferior */}
        <Box sx={{ 
          mt: 6, 
          pt: 4, 
          borderTop: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2
        }}>
          <img 
            src={logomangocashfooter} 
            alt="MangosCash" 
            style={{ 
              height: 40, 
              width: 'auto',
              filter: 'brightness(0) invert(1)' // Hace el logo blanco
            }} 
          />
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            color: '#8b8e96', 
            fontSize: 12, 
            textAlign: 'center',
            lineHeight: 1.4,
            width: '100%'
          }}>
            © {new Date().getFullYear()} MangosCash. Todos los derechos reservados. | 
            Plataforma de cambio digital segura y confiable en Perú.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 
 