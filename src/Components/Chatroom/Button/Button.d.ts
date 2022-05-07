export interface ChatroomButtonProps {
  type: 'client' | 'newsroom';
  ids: number | number[];
  openByDefault?: boolean;
  presetMessage?: string;
}
