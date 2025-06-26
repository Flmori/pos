import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: () => {}
});

const rolesMap = {
  'RLS-001': 'Owner',
  'RLS-002': 'Kasir',
  'RLS-003': 'Pegawai Gudang'
};

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(null);

  const setUser = (userData) => {
    if (userData && !userData.nama_role && userData.id_role) {
      userData.nama_role = rolesMap[userData.id_role] || 'Kasir';
    }
    setUserState(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
    }
  };

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && !parsedUser.nama_role && parsedUser.id_role) {
          parsedUser.nama_role = rolesMap[parsedUser.id_role] || 'Kasir';
        }
        setUserState(parsedUser);
        localStorage.setItem('isAuthenticated', 'true');
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.setItem('isAuthenticated', 'false');
      }
    } else {
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
