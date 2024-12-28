import { type FunctionComponent, type ReactElement } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Chip, type ChipOwnProps } from '@mui/material';

// Custom Styled Button
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '10px 24px',
  fontSize: '12px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)',
  },
  '&:active': {
    backgroundColor: theme.palette.primary.light,
    boxShadow: 'none',
  },
}));

interface CustomButtonProps extends ChipOwnProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  buttonType?: boolean;
  propsIcon?: ReactElement<unknown>;
}

export const CustomButton: FunctionComponent<CustomButtonProps> = ({
  label,
  onClick,
  disabled = false,
  buttonType,
  propsIcon,
  ...rest
}) => {
  const handleClick = () => (onClick ? onClick() : {});

  return (
    <div>
      {buttonType ? (
        <Chip
          label={label}
          onClick={handleClick}
          disabled={disabled}
          color="primary"
          style={{
            margin: 2,
            padding: 8,
          }}
          variant="outlined"
          {...rest}
          icon={propsIcon ? propsIcon : undefined}
        />
      ) : (
        <StyledButton
          onClick={handleClick}
          color="primary"
          disabled={disabled}
          variant="contained"
        >
          {label}
        </StyledButton>
      )}
    </div>
  );
};
