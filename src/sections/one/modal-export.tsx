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

// ----------------------------------------------------------------------

export type exportPengeluaran = {
  startDate: string
  endDate: string
}

const CURRENCIES = [
  'Makanan',
  'Transportasi',
  'Hiburan',
  'Pendidikan',
  'Kesehatan',
];
type Props = {
  id?: string
  open: boolean;
  edit: boolean;
  view?: boolean;
  save?: (payload: exportPengeluaran) => void
  update?: (payload: exportPengeluaran, id: string) => void
  onClose: VoidFunction;
  currentValue?: exportPengeluaran;
};

export default function ModalExport({ id, currentValue, open, view, edit, onClose, save, update }: Props) {

  const newMenuSchemna = Yup.object().shape({
    startDate: Yup.string().required("Jumlah Harus di isi"),
    endDate: Yup.string().required("tanggal Harus di isi"),
  });

  const defaultValues = useMemo(
    () => ({
      startDate: currentValue?.startDate || '',
      endDate: currentValue?.endDate|| '',
    }),
    [currentValue]
  );

  const methods = useForm({
    resolver: yupResolver(newMenuSchemna),
    defaultValues,
  });

  useEffect(() => {
    const updatedDefaultValues = { ...defaultValues };
    setValue('startDate', updatedDefaultValues.startDate);
    setValue('endDate', updatedDefaultValues.endDate);
  }, [currentValue]);

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
      if (edit && update) {
        update(data, id!)
      } else if (!edit && save) {
        save(data);
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
        <DialogTitle>{"Export Data Pengeluaran"}</DialogTitle>

        <DialogContent>

          <Box
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >

            <RHFTextField disabled={view} sx={{mt: 1}} type='date' name="startDate" label={'Dari Tanggal'} />
            <RHFTextField disabled={view} sx={{mt: 1}} type='date' name="endDate" label={'Sampai Tanggal'} />

          </Box>
        </DialogContent>

        <DialogActions>
            <Button variant="outlined" onClick={onClose}>
              {'Kembali'}
            </Button>

            <LoadingButton type="submit" color='primary' variant="contained" loading={isSubmitting}>
              {'Export'}
            </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
