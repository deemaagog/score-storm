import { rem } from "@mantine/core"
import { CustomIconProps } from "../ActionButton"

export const NaturalIcon: React.FC<CustomIconProps> = ({ size, style, ...others }) => {
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
      <path
        d="M 8.697 4.032 L 8.739 15.074 L 15.248 13.062"
        transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, -4.440892098500626e-16)"
      />
      <path d="M 8.743 11.413 L 15.241 9.499 L 15.283 19.968" />
    </svg>
  )
}
