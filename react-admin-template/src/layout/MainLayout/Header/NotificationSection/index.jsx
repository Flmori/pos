import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Badge,
  Chip,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Typography,
  ListItemButton
} from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// assets
import QueryBuilderTwoToneIcon from '@mui/icons-material/QueryBuilderTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/toko-kyu-ryu/api/products/stock-report');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const filteredItems = data.filter(item => item.stok < 20);
        const items = filteredItems.map(item => ({
          id: item.id_barang,
          name: item.nama_barang,
          stock: item.stok
        }));
        setLowStockItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        sx={{
          minWidth: { sm: 50, xs: 35 }
        }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        aria-label="Notification"
        onClick={handleToggle}
        color="inherit"
      >
        <Badge color="error" variant="dot" invisible={lowStockItems.length === 0}>
          <NotificationsNoneTwoToneIcon sx={{ fontSize: '1.5rem' }} />
        </Badge>
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true // false by default
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <PerfectScrollbar style={{ height: 320, overflowX: 'hidden' }}>
                    <ListSubheader disableSticky>
                      <Chip size="small" color="primary" label="New" />
                    </ListSubheader>
                    {loading ? (
                      <Typography sx={{ p: 2 }}>Loading notifications...</Typography>
                    ) : error ? (
                      <Typography color="error" sx={{ p: 2 }}>
                        Error: {error}
                      </Typography>
                    ) : lowStockItems.length === 0 ? (
                      <Typography sx={{ p: 2 }}>Tidak ada produk dengan stok minimum.</Typography>
                    ) : (
                      lowStockItems.map((item) => (
                        <ListItemButton key={item.id} alignItems="flex-start" sx={{ pt: 0 }}>
                          <ListItemAvatar>
                            <WarningAmberIcon color="error" />
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="subtitle1">{item.name}</Typography>}
                            secondary={<Typography variant="subtitle2">{`Stok tersisa: ${item.stock}`}</Typography>}
                          />
                          <ListItemSecondaryAction sx={{ top: 22 }}>
                            <Grid container justifyContent="flex-end">
                              <Grid item>
                                <QueryBuilderTwoToneIcon
                                  sx={{
                                    fontSize: '0.75rem',
                                    mr: 0.5,
                                    color: theme.palette.grey[400]
                                  }}
                                />
                              </Grid>
                              <Grid item>
                                <Typography variant="caption" display="block" gutterBottom sx={{ color: theme.palette.grey[400] }}>
                                  now
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      ))
                    )}
                  </PerfectScrollbar>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
