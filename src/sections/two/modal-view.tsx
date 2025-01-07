import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// _mock
import { USER_STATUS_OPTIONS } from 'src/_mock';
// types
// assets
import { countries } from 'src/assets/data';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { Slider, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Target = {
  target: number
  progress: number
  remaining_budget: number
}

type Props = {
  id?: string
  open: boolean;
  onClose: VoidFunction;
  target: Target
};

const prices = [
  { value: 0, label: '0%' },
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' },
];

export default function ModalView({ id, open, onClose, target }: Props) {
  function valueLabelFormatDefault(value: number) {
    return `${value}%`;
  }

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 600 },
      }}
    >
      <DialogTitle>Target Tabungan</DialogTitle>

      <DialogContent>
        <Box sx={{ p: 3 }}>
          <Typography variant='body1'>
            Target Tabungan : {target?.target ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(target.target)
                              : 'Rp 0'}
          </Typography>
          <Typography variant='body1'>
            Saldo Tabungan  :
            {target?.remaining_budget ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(target.remaining_budget)
            : 'Rp 0'}
          </Typography>
          <Slider
            step={1}
            marks={prices}
            max={100}
            value={target?.progress}
            valueLabelDisplay="on"
            getAriaValueText={valueLabelFormatDefault}
            valueLabelFormat={valueLabelFormatDefault}
            sx={{mt: 5}}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
