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
import ModalCreate, { CreateTabungan } from './modal-create-edit';
import { useCallback, useEffect, useState } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { alert } from 'src/theme/overrides/components/alert';
import { enqueueSnackbar } from 'notistack';
import ModalView from './modal-view';
import ModalAnggaran, { CreateAnggaran } from './modal-anggaran';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'jumlah', label: 'Jumlah', align: 'center' },
  { id: 'deadline', label: 'Deadline', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

export default function TwoView() {
  const settings = useSettingsContext();

  const table = useTable();

  const theme = useTheme()

  const [data, setData] = useState<any>([])
  const [progress, setProgress] = useState<any>()
  const [anggaran, setAnggaran] = useState<any>()
  const [editData, setEditData] = useState<CreateTabungan>()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [id, setId] = useState<string>('')

  const get = useCallback(async () => {
    try {

      const res = await axios.get(endpoints.tabungan);

      setData(res.data.data)
    } catch (error) {
      console.log(error);

    }
  }, []);

  const getDetail = useCallback(async (id: string) => {
    try {

      const res = await axios.get(endpoints.tabungan + `/${id}/progress`);

      setProgress(res.data)
      onView.onTrue()
    } catch (error) {
      console.log(error);

    }
  }, []);

  const getAnggaran = useCallback(async (onView: boolean) => {
    try {

      const res = await axios.get(endpoints.anggaran);
      setAnggaran(res.data.anggaran)
      if (onView) {
        onAnggaran.onTrue()
      }
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

  const onSave = useCallback(async (payload: CreateTabungan) => {
    try {
      await axios.post(endpoints.tabungan, payload);

      get()
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const onEdit = useCallback(async (payload: CreateTabungan, id: string) => {
    try {
      await axios.put(endpoints.tabungan + `/${id}`, payload);

      setEditData({jumlah: 0, deadline: ''})
      get()
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const onDelete = useCallback(async (id: string) => {
    try {
      await axios.delete(endpoints.tabungan + `/${id}`);
      get()
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleEdit = async (data: CreateTabungan, id: string) => {
    setEditData(data)
    setId(id)
    setIsEdit(true)
    if (editData) {
      onFill.onTrue()
    }
  }

  const handleClose = async () => {
    setEditData({jumlah: 0, deadline: ''})
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
  const onView = useBoolean()
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignContent="center"
        paddingTop="30px"
      >
        <Typography variant="h4" sx={{ fontWeight: '800' }}>
          Target Tabungan
        </Typography>
        <Stack
        justifyContent="space-between"
        direction="row"
        alignContent="center">
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
            Tambah Target Tabungan
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
        <Table size={table.dense ? 'small' : 'medium'} sx={{ maxWidth: 500 }}>
          <TableHeadCustom
            order={table.order}
            orderBy={table.orderBy}
            headLabel={TABLE_HEAD}
            rowCount={5}
            numSelected={table.selected.length}
            onSort={table.onSort}
          />

          <TableBody>
            {data.map((item: any) => {
              return (
                <TableRow hover sx={{ color: theme.palette.common.black }}>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    {item.jumlah ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.jumlah)
                    : 'Rp 0'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    {item.deadline}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '700' }} align="center">
                    <IconButton
                      onClick={() => getDetail(item.id)}
                      size="small"
                      >
                      <Iconify icon="icon-park-twotone:eyes" />
                    </IconButton>
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
      <ModalView
        open={onView.value}
        onClose={()=> onView.onFalse()}
        id={id}
        target={progress}
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
