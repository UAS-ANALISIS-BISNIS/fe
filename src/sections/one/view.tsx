// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { Button, IconButton, Stack, Table, TableBody, TableCell, TableRow, useTheme } from '@mui/material';
import { TableHeadCustom, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import ModalCreate, { CreatePengeluaran } from './modal-create-edit';
import { useCallback, useEffect, useState } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { alert } from 'src/theme/overrides/components/alert';
import { enqueueSnackbar } from 'notistack';
import ModalAnggaran, { CreateAnggaran } from '../two/modal-anggaran';
import ModalExport, { exportPengeluaran } from './modal-export';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'jumlah', label: 'Jumlah', align: 'center' },
  { id: 'tanggal', label: 'tanggal', align: 'center' },
  { id: 'kategori', label: 'Kategori', align: 'center' },
  { id: 'deskripsi', label: 'Deskripsi', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

export default function OneView() {
  const settings = useSettingsContext();

  const table = useTable();

  const theme = useTheme()

  const [data, setData] = useState<any>([])
  const [progress, setProgress] = useState<any>()
  const [anggaran, setAnggaran] = useState<any>()
  const [editData, setEditData] = useState<CreatePengeluaran>()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [id, setId] = useState<string>('')

  const get = useCallback(async () => {
    try {

      const res = await axios.get(endpoints.pengeluaran);

      setData(res.data)
    } catch (error) {
      console.log(error);

    }
  }, []);

  const getAnggaran = useCallback(async (onView: boolean) => {
    try {

      const res = await axios.get(endpoints.anggaran);

      console.log(res);

      setAnggaran(res.data.anggaran)
      if (onView) {
        onAnggaran.onTrue()
      }
    } catch (error) {
      console.log(error);

    }
  }, []);

  const handleExport = useCallback(async (payload: exportPengeluaran) => {
    try {

      const res = await axios.get(endpoints.laporan + `/${payload.startDate}/${payload.endDate}`);

      const blob = new Blob([res.data], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded_file.pdf';
      a.click();

      URL.revokeObjectURL(url);
      onExport.onFalse()
    } catch (error) {
      console.log(error);

    }
  }, []);

  const updateAnggaran = useCallback(async (payload: CreateAnggaran) => {
    try {
      await axios.put(endpoints.anggaran, payload);

    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const onSave = useCallback(async (payload: CreatePengeluaran) => {
    try {
      await axios.post(endpoints.pengeluaran, payload);

      get()
      getAnggaran(false)
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const onEdit = useCallback(async (payload: CreatePengeluaran, id: string) => {
    try {
      await axios.put(endpoints.pengeluaran + `/${id}`, payload);

      setEditData({jumlah: 0, tanggal: '', kategori: '', deskripsi: ''})
      get()
      getAnggaran(false)
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const onDelete = useCallback(async (id: string) => {
    try {
      await axios.delete(endpoints.pengeluaran + `/${id}`);
      get()
      getAnggaran(false)
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleEdit = async (data: CreatePengeluaran, id: string) => {
    setEditData(data)
    setId(id)
    setIsEdit(true)
    if (editData) {
      onFill.onTrue()
    }
  }

  const handleClose = async () => {
    setEditData({jumlah: 0, tanggal: '', kategori: '', deskripsi: ''})
    setId('')
    setIsEdit(false)
    onFill.onFalse()
  }

  useEffect(() => {
    get()
    getAnggaran(false)
  }, [])

  console.log(progress);

  const onFill = useBoolean()
  const onAnggaran = useBoolean()
  const onExport = useBoolean()
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignContent="center"
        paddingTop="30px"
      >
        <Typography variant="h4" sx={{ fontWeight: '800' }}>
          List Pengeluaran
        </Typography>
        <Stack
        justifyContent="space-between"
        direction="row"
        alignContent="center">
          <Button
            component={RouterLink}
            onClick={()=> onExport.onTrue()}
            variant="contained"
            color="info"
            sx={{
              // paddingX: 2.4,
              // paddingY: 1.5,
              // borderRadius: '50px',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: theme.palette.secondary.main,
              },
              mr:2,
              boxShadow: theme.customShadows.secondary,
            }}
          >
            Export Anggaran
          </Button>

          <Button
            component={RouterLink}
            onClick={()=> getAnggaran(true)}
            variant="contained"
            color="secondary"
            sx={{
              // paddingX: 2.4,
              // paddingY: 1.5,
              // borderRadius: '50px',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: theme.palette.secondary.main,
              },
              mr:2,
              boxShadow: theme.customShadows.secondary,
            }}
          >
            Perbarui Anggaran
          </Button>

          <Button
            component={RouterLink}
            onClick={()=> onFill.onTrue()}
            variant="contained"
            color="primary"
            sx={{
              // paddingX: 2.4,
              // paddingY: 1.5,
              // borderRadius: '50px',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },

              boxShadow: theme.customShadows.secondary,
            }}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Tambah Catatan Pengeluaran
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          // bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          // border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
        justifyItems={'center'}
      >
        <Typography variant='body1' sx={{mt: 2, mb: 2}}>
        Anggaran Saat Ini: <b> {anggaran?.jumlah
                                ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(anggaran.jumlah)
                                : 'Rp 0'}</b>
        </Typography>
        <Table size={table.dense ? 'small' : 'medium'} sx={{ maxWidth: 700 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={5}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />

          <TableBody>
            {data?.map((item: any) => {
              return (
                <TableRow hover sx={{ color: theme.palette.common.black }}>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    {item.jumlah ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.jumlah)
                    : 'Rp 0'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    {item.tanggal}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    {item.kategori}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    {item.deskripsi}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    <IconButton
                      onClick={() => handleEdit(item, item.id)}
                      size="small"
                      sx={{ color: '#3A57E8' }}
                    >
                      <Iconify icon="fa-regular:edit" />
                    </IconButton>
                    <IconButton
                      onClick={() => onDelete(item.id)}
                      size="small"
                      sx={{ color: '#C03221' }}
                    >
                      <Iconify icon="iconamoon:trash-simple-duotone" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
      <ModalCreate
        open={onFill.value}
        onClose={handleClose}
        edit={isEdit}
        id={id}
        currentValue={editData}
        save={onSave}
        update={onEdit}
      />
      <ModalExport
        open={onExport.value}
        onClose={()=> onExport.onFalse}
        edit={false}
        save={handleExport}
      />
      <ModalAnggaran
        open={onAnggaran.value}
        onClose={()=> onAnggaran.onFalse()}
        id={id}
        currentValue={anggaran}
        update={updateAnggaran}
      />
    </Container>
  );
}

