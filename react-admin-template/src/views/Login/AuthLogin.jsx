import React, { useState, useContext } from 'react';
import { UserContext } from 'context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// material-ui
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';

//  third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from 'assets/images/logo_meko_no_mori.png';

// ==============================|| CUSTOM LOGIN ||============================== //

const basePath = 'http://localhost:8000/toko-kyu-ryu';

const AuthLogin = ({ ...rest }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 3;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const { idPengguna, password } = values;
    try {
      const response = await fetch(`${basePath}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username: idPengguna, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setLoginError('');
        setLoginAttempts(0);
        // Store user info or token as needed
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        navigate(`/`);
      } else {
        const attemptsLeft = maxAttempts - (loginAttempts + 1);
        if (attemptsLeft > 0) {
          setLoginError(data.error || 'ID Pengguna atau Password salah.');
          setLoginAttempts(loginAttempts + 1);
        } else {
          setLoginError('Anda telah mencapai batas percobaan login. Silakan coba lagi nanti.');
          setLoginAttempts(0);
        }
        setErrors({ submit: loginError });
      }
    } catch (error) {
      setLoginError('Terjadi kesalahan saat login. Silakan coba lagi.');
      setErrors({ submit: loginError });
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{
          idPengguna: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          idPengguna: Yup.string().max(255).required('ID Pengguna wajib diisi'),
          password: Yup.string().max(255).required('Password wajib diisi')
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.400', borderRadius: 2 }}>
            <form noValidate onSubmit={handleSubmit} {...rest}>
              <Grid container justifyContent="center" sx={{ mb: 2 }}>
                <Grid item>
                  <img
                    src={logo}
                    alt="Logo Toko KyuRyu"
                    width={100}
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.location.reload()}
                  />
                </Grid>
              </Grid>
              <TextField
                error={Boolean(touched.idPengguna && errors.idPengguna)}
                fullWidth
                helperText={touched.idPengguna && errors.idPengguna}
                label="ID Pengguna"
                margin="normal"
                name="idPengguna"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.idPengguna}
                variant="outlined"
              />

              <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text">
                    {errors.password}
                  </FormHelperText>
                )}
              </FormControl>

              {loginError && (
                <Box mt={2}>
                  <FormHelperText error>{loginError}</FormHelperText>
                </Box>
              )}

              <Box mt={2}>
                <Button color="primary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;

