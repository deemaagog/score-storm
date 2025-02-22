import { rem } from "@mantine/core"
import { CustomIconProps } from "../ActionButton"

export const DoubleFlatIcon: React.FC<CustomIconProps> = ({ size, style, ...others }) => {
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
      <path d="M 5.57 4.044 L 5.611 19.956 C 5.611 19.956 15.055 15.702 9.95 13.916 C 8.603 13.445 7.163 13.48 5.629 14.021" />
      <path d="M 12.537 4.044 L 12.578 19.956 C 12.578 19.956 22.022 15.702 16.917 13.916 C 15.57 13.445 14.13 13.48 12.596 14.021" />
    </svg>
  )
}
