import React, { useEffect } from 'react';

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// third-party
import { useSelector, useDispatch } from 'react-redux';

// project import
import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';

// project import actions
import * as actionTypes from 'store/actions';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch actions to activate template
    dispatch({ type: actionTypes.MENU_TYPE, navType: 'light' }); // or 'dark' if preferred
    dispatch({ type: actionTypes.MENU_OPEN, isOpen: 'dashboard' }); // set default active menu
  }, [dispatch]);

  return (
    <>
      {
        <NavigationScroll>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
              <CssBaseline />
              <Routes />
            </ThemeProvider>
          </StyledEngineProvider>
        </NavigationScroll>
      }
    </>
  );
};

export default App;
