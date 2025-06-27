import React from 'react';
import { Card, CardHeader, CardContent, Divider, Typography, TextField, Box } from '@mui/material';

const SalesSummaryCard = ({
  totalPrice,
  memberId,
  memberInfo,
  memberName,
  onMemberIdChange,
  totalPayable,
  useDiscount,
  setUseDiscount,
  pointsEarned,
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
            <Typography>Nama Member: {memberName}</Typography>
            <Typography>Diskon yang didapat: {memberInfo.poin_loyalitas ? Math.min(Math.floor(memberInfo.poin_loyalitas / 10) * 1, 20) : 0}%</Typography>
          </>
        )}
        <Typography>Loyalty Points Earned: {pointsEarned}</Typography>
        <Box sx={{ mt: 2 }}>
          <label>
            <input
              type="checkbox"
              checked={useDiscount}
              onChange={(e) => setUseDiscount(e.target.checked)}
            />
            {' '}Gunakan Diskon
          </label>
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          TOTAL BAYAR: Rp {totalPayable.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SalesSummaryCard;
