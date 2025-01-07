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

export type CreatePengeluaran = {
  jumlah: number
  tanggal: string
  kategori: string
  deskripsi: string
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
  save?: (payload: CreatePengeluaran) => void
  update?: (payload: CreatePengeluaran, id: string) => void
  onClose: VoidFunction;
  currentValue?: CreatePengeluaran;
};

export default function ModalCreate({ id, currentValue, open, view, edit, onClose, save, update }: Props) {

  const newMenuSchemna = Yup.object().shape({
    jumlah: Yup.number().required("Jumlah Harus di isi"),
    tanggal: Yup.string().required("tanggal Harus di isi"),
    kategori: Yup.string().required("Kategori Harus di isi"),
    deskripsi: Yup.string().required("deskripsi Harus di isi"),
  });

  const defaultValues = useMemo(
    () => ({
      jumlah: currentValue?.jumlah || 0,
      tanggal: currentValue?.tanggal || '',
      kategori: currentValue?.kategori || '',
      deskripsi: currentValue?.deskripsi || '',
    }),
    [currentValue]
  );

  const methods = useForm({
    resolver: yupResolver(newMenuSchemna),
    defaultValues,
  });

  useEffect(() => {
    const updatedDefaultValues = { ...defaultValues };
    setValue('jumlah', updatedDefaultValues.jumlah);
    setValue('tanggal', updatedDefaultValues.tanggal);
    setValue('kategori', updatedDefaultValues.kategori);
    setValue('deskripsi', updatedDefaultValues.deskripsi);
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
        <DialogTitle>{edit ? "Edit Target Tabungan" : "Buat Target Tabungan" }</DialogTitle>

        <DialogContent>

          <Box
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >

            <RHFTextField disabled={view} sx={{mt: 1}} type='number' name="jumlah" label={'Jumlah'} />
            <RHFTextField disabled={view} sx={{mt: 1}} type='date' name="tanggal" label={'Tanggal'} />
            <RHFSelect disabled={view} sx={{mt: 1}} name="kategori" label={'Kategori'} >
            {CURRENCIES.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
            </RHFSelect>
            <RHFTextField disabled={view} sx={{mt: 1}} rows={3} multiline name="deskripsi" label={'Deskripsi'} />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
              {'Kembali'}
            </Button>

          { !view && <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {edit ? 'Ubah' : 'Simpan'}
            </LoadingButton> }
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
