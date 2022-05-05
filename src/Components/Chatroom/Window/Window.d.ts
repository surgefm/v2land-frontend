export interface WindowProps {
  type: 'client' | 'newsroom';
  ids: number | number[];
  onClose: React.MouseEventHandler<HTMLElement>;
}
