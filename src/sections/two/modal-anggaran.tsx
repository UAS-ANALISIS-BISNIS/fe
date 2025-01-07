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
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export type CreateAnggaran = {
  jumlah: number
}

type Props = {
  id?: string
  open: boolean;
  view?: boolean;
  save?: (payload: CreateAnggaran) => void
  update?: (payload: CreateAnggaran) => void
  onClose: VoidFunction;
  currentValue?: CreateAnggaran;
};

export default function ModalAnggaran({ id, currentValue, open, view, onClose, update }: Props) {

  const newMenuSchemna = Yup.object().shape({
    jumlah: Yup.number().required("Jumlah Harus di isi").min(currentValue?.jumlah ?? 0, `Jumlah nominal minimal ${currentValue?.jumlah} `),
  });

  const defaultValues = useMemo(
    () => ({
      jumlah: 0,
    }),
    [currentValue]
  );

  const methods = useForm({
    resolver: yupResolver(newMenuSchemna),
    defaultValues,
  });

  // useEffect(() => {
  //   const updatedDefaultValues = { ...defaultValues };
  //   setValue('jumlah', updatedDefaultValues.jumlah);
  // }, [currentValue]);

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      if (update) {
        update(data)
      }
    } catch (error) {
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 350 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{"Perbarui Anggaran" }</DialogTitle>

        <DialogContent>

          <Box
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Typography>
            Anggaran Saat Ini: {currentValue?.jumlah
                                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(currentValue.jumlah)
                                : 'Rp 0'}
            </Typography>

            <RHFTextField disabled={view} sx={{mt: 1}} type='number' name="jumlah" label={'Jumlah'} />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
              {'Kembali'}
            </Button>

          { !view && <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {'Simpan'}
            </LoadingButton> }
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
