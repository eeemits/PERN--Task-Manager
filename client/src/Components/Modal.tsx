import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import { type ChangeEvent, type FunctionComponent } from 'react';
import { STATUS } from '../utils/const';
import type { TaskList } from '../@types';

export interface KeepMountedModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: TaskList) => Promise<void>;
  value: TaskList;
  setValue: (value: TaskList) => void;
}

export const KeepMountedModal: FunctionComponent<KeepMountedModalProps> = ({
  open,
  onClose,
  onSubmit,
  value,
  setValue,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (value.title && value.description && value.status) {
      onSubmit(value);
      onClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
          {value.id ? 'Edit Task' : 'Add New Task'}
        </Typography>
        <Box
          component="form"
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Title"
            name="title"
            variant="outlined"
            value={value.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            value={value.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            id="outlined-select-status"
            select
            label="Select"
            value={value.status}
            helperText="Please select your status"
            onChange={(e) => setValue({ ...value, status: e.target.value })}
          >
            {STATUS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {value.id ? 'Update Task' : 'Add Task'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
