import React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Iconify from '../iconify';

interface CustomPaginationProps {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onChangePage: (page: number) => void;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  rowsPerPage,
  totalRows,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  const pageCount = Math.ceil(totalRows / rowsPerPage);
  const startRow = (page - 1) * rowsPerPage + 1;
  const endRow = Math.min(page * rowsPerPage, totalRows);

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    onChangeRowsPerPage(Number(event.target.value));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onChangePage(value);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
      <Pagination
        shape="rounded"
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        color='primary'
        renderItem={(item: any) => (
          <PaginationItem
            {...item}
            color='standard'
            variant='outlined'
            slots={{
              previous: () => (
                <Box display="flex" alignItems="center">
                  <Iconify icon="iconamoon:arrow-left-2-duotone" style={{ marginRight: 4 }} />
                  Back
                </Box>
              ),
              next: () => (
                <Box display="flex" alignItems="center">
                  Next
                  <Iconify icon="iconamoon:arrow-right-2-duotone" style={{ marginLeft: 4 }} />
                </Box>
              ),
            }}
            componentsProps={{
              previous: { 'aria-label': 'Previous' },
              next: { 'aria-label': 'Next' },
            }}
          />
        )}
      />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" >
        <Typography variant="body2" sx={{ mr: 2 }}>
            Result per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
          >
            {[5, 10, 20, 50].map((num) => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" alignItems="center" >
          <Typography variant="body2" sx={{ mx: 2 }}>
            {`${startRow}–${endRow} of ${totalRows}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomPagination;
