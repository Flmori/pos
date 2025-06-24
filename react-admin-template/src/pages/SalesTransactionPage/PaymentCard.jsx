import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button
} from '@mui/material';

const PaymentCard = ({
  paymentType,
  amountPaid,
  change,
  onPaymentTypeChange,
  onAmountPaidChange,
  onSaveTransaction,
  onPrintReceipt,
  onCancelTransaction,
  transactionSaved
}) => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardHeader title="Pembayaran" />
      <Divider />
      <CardContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="payment-type-label">Tipe Pembayaran</InputLabel>
          <Select
            labelId="payment-type-label"
            value={paymentType}
            onChange={onPaymentTypeChange}
            label="Tipe Pembayaran"
          >
            <MenuItem value="Tunai">Tunai</MenuItem>
            <MenuItem value="Kredit">Kredit</MenuItem>
          </Select>
        </FormControl>
        {paymentType === 'Tunai' && (
          <TextField
            label="Jumlah Bayar"
            variant="outlined"
            fullWidth
            margin="normal"
            value={amountPaid}
            onChange={onAmountPaidChange}
            type="number"
          />
        )}
        {paymentType === 'Tunai' && (
          <Typography>Kembalian: Rp {change >= 0 ? change.toLocaleString() : 0}</Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onSaveTransaction}
        >
          Simpan Transaksi
        </Button>
        {transactionSaved && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={onPrintReceipt}
          >
            Cetak Nota
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          sx={{ mt: 1 }}
          onClick={onCancelTransaction}
        >
          Batal Transaksi
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
