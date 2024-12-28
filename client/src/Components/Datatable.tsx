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
  CircularProgress,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { CustomButton } from './CustomButton';

interface EnhancedTableProps {
  headCells: readonly HeadCell[];
  onRequestSort: (property: keyof TaskList) => void;
  order: Order;
  orderBy: string;
}

export const EnhancedTableHead: FunctionComponent<EnhancedTableProps> = (
  props: EnhancedTableProps
) => {
  const { order, orderBy, onRequestSort, headCells } = props;

  const createSortHandler = (property: keyof TaskList) => () =>
    onRequestSort(property);

  return (
    <TableHead>
      <TableRow style={{ borderBottom: '2px solid #969696' }}>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id || index}
            align={headCell.numeric ? 'center' : 'left'}
            style={{ fontWeight: 'bold' }}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable && headCell.id ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label.toUpperCase()}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label.toUpperCase()
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export interface BasicTableProps {
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRequestSort: (property: keyof TaskList) => void;
  item: TaskList[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (task: TaskList) => void;
  order: Order;
  orderBy: string;
  page: number;
  rowsPerPage: number;
  tableHeader: readonly HeadCell[];
  totalRows: number;
}

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        mt: 2,
        border: '1px solid #969696',
        borderRadius: '8px',
      }}
    >
      <Paper>
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
          <TableContainer
            sx={{
              backgroundColor: '#fbfbfb',
              width: 800,
              flex: 1, // flexChild
            }}
          >
            <Table sx={{ margin: '0 auto' }} size="medium">
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
                      <TableCell
                        align="right"
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 2,
                        }}
                      >
                        <CustomButton
                          label="Delete"
                          buttonType={true}
                          color="error"
                          variant="filled"
                          onClick={() => onDelete(task.id!)} // Trigger delete function on click
                        />
                        <CustomButton
                          label="edit"
                          buttonType={true}
                          onClick={() => onEdit({ ...task })} // Trigger edit function on click
                        />
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
