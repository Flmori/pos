import React from 'react';
import { Box, Button } from '@mui/material';

const CategoryMenu = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <Box sx={{ mt: 2, overflowX: 'auto', whiteSpace: 'nowrap' }}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'contained' : 'outlined'}
          sx={{ mr: 1, display: 'inline-block' }}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </Box>
  );
};

export default CategoryMenu;
