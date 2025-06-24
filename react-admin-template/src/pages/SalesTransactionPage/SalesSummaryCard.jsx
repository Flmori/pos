import React from 'react';
import { Card, CardHeader, CardContent, Divider, Typography, TextField } from '@mui/material';

const SalesSummaryCard = ({
  totalPrice,
  memberId,
  memberInfo,
  onMemberIdChange,
  totalPayable
}) => {
  return (
    <Card>
      <CardHeader title="Ringkasan Penjualan" />
      <Divider />
      <CardContent>
        <Typography>Total Harga: Rp {totalPrice.toLocaleString()}</Typography>
        <TextField
          label="ID Member (Opsional)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={memberId}
          onChange={onMemberIdChange}
        />
        {memberInfo && (
          <>
            <Typography>Nama Member: {memberInfo.name}</Typography>
            <Typography>Diskon: {memberInfo.discount}%</Typography>
          </>
        )}
        <Typography variant="h6" sx={{ mt: 2 }}>
          TOTAL BAYAR: Rp {totalPayable.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SalesSummaryCard;
