import PropTypes from 'prop-types';
import React, { useContext } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { useMediaQuery, Divider, Drawer, Grid, Box, Typography, Avatar } from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import MenuList from './MenuList';
import { drawerWidth } from 'config.js';
import { UserContext } from 'context/UserContext';

// assets
import logo from 'assets/images/logo.svg';

// custom style
const Nav = styled('nav')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    width: drawerWidth,
    flexShrink: 0
  }
}));

// ==============================|| SIDEBAR ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  const { user } = useContext(UserContext);
  const username = user?.username || 'Guest';
  const role = user?.role || user?.nama_role || user?.Role?.nama_role || 'guest'; // Fallback to 'User' if no role is found

  // Filter menu items based on role (example: hide User Management if not Owner)
  // This requires passing user role to MenuList or filtering menu items here
  // For simplicity, we will pass user role as prop to MenuList and filter there

  const drawer = (
    <>
      <Box sx={{ display: { md: 'none', xs: 'block' } }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          elevation={5}
          alignItems="center"
          spacing={0}
          sx={{
            ...theme.mixins.toolbar,
            lineHeight: 0,
            background: theme.palette.primary.main,
            boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
          }}
        >
          <Grid item>
            <img src={logo} alt="Logo" />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: theme.palette.grey[100], mb: 1, borderRadius: 1 }}>
        <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>{username.charAt(0)}</Avatar>
        <Box>
          <Typography variant="subtitle1" noWrap>
            {username}
          </Typography>
          <Typography variant="caption" color="textSecondary" noWrap>
            {role}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <PerfectScrollbar style={{ height: 'calc(100vh - 130px)', padding: '10px' }}>
        {console.log('User role passed to MenuList:', role)}
        <MenuList userRole={role} />
        {console.log('MenuList rendered')}
      </PerfectScrollbar>
    </>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Nav>
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)',
            top: { md: 64, sm: 0 }
          }
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </Nav>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object
};

export default Sidebar;
