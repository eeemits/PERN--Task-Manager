import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FunctionComponent,
} from 'react';
import { EnhancedTable } from '../Components/Datatable';
import type { HeadCell, Order, TaskList } from '../@types';
import { Alert, type AlertColor } from '@mui/material';
import { KeepMountedModal } from '../Components/Modal';
import axios from 'axios';
import { DEFAULT_TASK } from '../utils/const';
import { CustomButton } from '../Components/CustomButton';

export const TaskManager: FunctionComponent = () => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof TaskList>('createdAt');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [items, setItems] = useState<TaskList[]>([]);
  const [alert, setAlert] = useState<
    { type: AlertColor; alertMessage: string } | undefined
  >();
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState<TaskList>(DEFAULT_TASK);

  const headCells: readonly HeadCell[] = [
    { id: 'title', numeric: false, label: 'Title', sortable: true },
    { id: 'status', numeric: false, label: 'Status' },
    { id: 'description', numeric: false, label: 'Description', sortable: true },
    { id: 'createdAt', numeric: false, label: 'Created At', sortable: true },
    { numeric: true, label: 'Actions' },
  ];

  const fetchTasks = useCallback(async () => {
    const offset = page * rowsPerPage;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8989/task/getTasks`, {
        params: {
          sortBy: orderBy,
          order,
          limit: rowsPerPage,
          offset,
        },
      });
      if (!response.data.status) throw new Error(response.data.message);

      setItems(response.data.rows);
      showAlert({ type: 'success', alertMessage: response.data.message });
      setLoading(false);
      setTotalRows(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [order, orderBy, page, rowsPerPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleRequestSort = (property: keyof TaskList) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showAlert = (config: { type: AlertColor; alertMessage: string }) => {
    setAlert(config);
    setTimeout(() => {
      setAlert(undefined);
    }, 2000);
  };

  const handleAddNewTask = async (task: TaskList) => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:8989/task/createTask',
        task
      );
      const data = response.data;
      if (!data.status) throw new Error(data.message);

      showAlert({ type: 'success', alertMessage: data.message });
      setTask({
        ...DEFAULT_TASK,
      });
      await fetchTasks();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showAlert({ type: 'error', alertMessage: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:8989/task/deleteTask/${id}`
      );

      const data = response.data;
      if (!data.status) throw new Error(data.message);

      showAlert({ type: 'success', alertMessage: data.message });
      await fetchTasks();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      showAlert({ type: 'error', alertMessage: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task: TaskList) => {
    setTask(task);
    setModalOpen(true);
  };

  const handleUpdateTask = useCallback(
    async (updatedTask: TaskList) => {
      try {
        setLoading(true);
        const response = await axios.put(
          `http://localhost:8989/task/updateTask/${updatedTask.id}`,
          updatedTask
        );

        const data = response.data;
        if (!data.status) throw new Error(data.message);

        showAlert({ type: 'success', alertMessage: data.message });
        await fetchTasks();
        setModalOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const alertMessage = error.response?.data?.message || error.message;
        showAlert({ type: 'error', alertMessage });
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks]
  );

  return (
    <div
      className="px-10 flex flex-col justify-center items-center min-h-screen"
      style={{ textAlign: 'center' }}
    >
      <h1>Task Manager</h1>

      <CustomButton
        label="Add Task"
        onClick={() => handleOpenModal(DEFAULT_TASK)}
      />

      <KeepMountedModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={task.id ? handleUpdateTask : handleAddNewTask}
        value={task}
        setValue={setTask}
      />

      {alert && (
        <Alert
          style={{
            width: '50%',
            margin: '0 auto',
            marginTop: 10,
            marginBottom: 10,
            textAlign: 'center',
          }}
          severity={alert.type}
        >
          {alert.alertMessage}
        </Alert>
      )}

      <EnhancedTable
        tableHeader={headCells}
        item={items}
        onDelete={handleDeleteTask}
        onEdit={handleOpenModal}
        loading={loading}
        handleRequestSort={handleRequestSort}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        order={order}
        orderBy={orderBy}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
      />
    </div>
  );
};
