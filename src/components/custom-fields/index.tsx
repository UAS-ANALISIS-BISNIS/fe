import { Stack, StackProps, Typography } from '@mui/material';

interface BlockProps extends StackProps {
  label?: string;
  children: React.ReactNode;
  isRequired?: boolean;
}
export default function Block({ label, children, isRequired, sx, ...other }: BlockProps) {
  return (
    <Stack sx={{ width: 1, ...sx }}>
      <Typography variant="subtitle2" sx={{ pb: '4px' }}>
        {label}
        {isRequired && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      {children}
    </Stack>
  );
}
