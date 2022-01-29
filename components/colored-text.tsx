import { FC } from "react";

export const ColoredText: FC<{ value: string | number; color: string }> = ({
  value,
  color,
}) => <span style={{ color }}>{value}</span>;
