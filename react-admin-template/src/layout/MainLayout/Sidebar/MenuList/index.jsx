import React from 'react';

// material-ui
import { Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import menuItem from 'menu-items';

// ==============================|| MENULIST ||============================== //

const MenuList = ({ userRole }) => {
  // Filter menu items based on userRole and roles property
  const filteredItems = menuItem.items
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter((child) => {
          if (!child.roles) return true;
          return child.roles.includes(userRole);
        });
        return { ...item, children: filteredChildren };
      }
      return item;
    })
    .filter((item) => (item.children ? item.children.length > 0 : true));

  const navItems = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={0} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return navItems;
};

export default MenuList;
