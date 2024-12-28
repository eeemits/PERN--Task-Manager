import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { type ChangeEvent, type FunctionComponent } from 'react';
import type { HeadCell, Order, TaskList } from '../@types';
import moment from 'moment';
import {
  Box,
  Button,
  CircularProgress,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

export interface BasicTableProps {
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (property: keyof TaskList) => void;
  item: TaskList[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  order: Order;
  orderBy: string;
  page: number;
  rowsPerPage: number;
  tableHeader: readonly HeadCell[];
  totalRows: number;
}

interface EnhancedTableProps {
  onRequestSort: (property: keyof TaskList) => void;
  order: Order;
  orderBy: string;
  headCells: readonly HeadCell[];
}

export const EnhancedTableHead: FunctionComponent<EnhancedTableProps> = (
  props: EnhancedTableProps
) => {
  const { order, orderBy, onRequestSort, headCells } = props;

  const createSortHandler = (property: keyof TaskList) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id || index}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable && headCell.id ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export const EnhancedTable: FunctionComponent<BasicTableProps> = (
  props: BasicTableProps
) => {
  const {
    tableHeader,
    item,
    onDelete,
    onEdit,
    order,
    handleRequestSort,
    loading,
    orderBy,
    handleChangePage,
    handleChangeRowsPerPage,
    totalRows,
    rowsPerPage,
    page,
  } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table
              sx={{ minWidth: 650, maxWidth: 800, margin: '0 auto' }}
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy as string}
                onRequestSort={handleRequestSort}
                headCells={tableHeader}
              />
              <TableBody>
                {item &&
                  item.length > 0 &&
                  item.map((task) => (
                    <TableRow hover key={task.title}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>
                        {moment(task.createdAt).format('YYYY-MM-DD')}
                      </TableCell>
                      <TableCell align="inherit">
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => onEdit(task.id!)} // Trigger edit function on click
                          style={{ marginRight: 8 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => onDelete(task.id!)} // Trigger delete function on click
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          size="medium"
          sx={{ minWidth: 650, maxWidth: 800, margin: '0 auto' }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
