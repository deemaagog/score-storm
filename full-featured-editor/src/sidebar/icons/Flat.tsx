import { rem } from "@mantine/core"
import { CustomIconProps } from "../ActionButton"

export const FlatIcon: React.FC<CustomIconProps> = ({ size, style, ...others }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
      style={{ width: rem(size), height: rem(size), ...style }}
      {...others}
    >
      <path d="M 9.053 4.044 L 9.094 19.956 C 9.094 19.956 18.538 15.702 13.433 13.916 C 12.086 13.445 10.646 13.48 9.112 14.021" />
    </svg>
  )
}
