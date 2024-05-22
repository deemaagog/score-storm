import { rem } from "@mantine/core"

interface QuarterRestIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function QuarterRestIcon({ size, style, ...others }: QuarterRestIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      style={{ width: rem(size), height: rem(size), ...style }}
      {...others}
    >
      <path d="M 15.763 6.953 C 13.737 9.307 12.723 11.067 12.723 12.23 C 12.723 13.353 13.688 15.037 15.617 17.283 L 15.013 18.115 C 14.043 17.56 13.21 17.283 12.515 17.283 C 11.613 17.283 11.163 17.81 11.163 18.865 C 11.163 19.948 11.656 21.023 12.641 22.092 L 12.1 22.884 C 9.367 20.909 8 19.149 8 17.608 C 8 16.824 8.277 16.201 8.833 15.74 C 9.347 15.308 10.012 15.092 10.83 15.092 C 11.357 15.092 11.939 15.227 12.578 15.497 L 8.396 10.079 C 10.379 8.375 11.372 6.832 11.372 5.453 C 11.372 4.356 10.698 2.977 9.353 1.313 L 11.017 1.313 L 15.763 6.953" />
    </svg>
  )
}
