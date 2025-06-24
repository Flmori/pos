import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton } from '@mui/material';

// project import
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from 'config.js';

import logoMeko from 'assets/images/logo_meko_no_mori.png';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <Box width={drawerWidth} sx={{ zIndex: 1201 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Grid item>
              <Box mt={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={logoMeko} alt="Logo" style={{ height: 40, width: 'auto', marginRight: 8 }} />
                <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#ffffff' }}>
                  kyu ryu
                </Box>
              </Box>
            </Grid>
          </Box>
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
