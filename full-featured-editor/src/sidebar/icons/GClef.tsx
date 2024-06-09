import { rem } from "@mantine/core"

interface GClefIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function GClefIcon({ size, style, ...others }: GClefIconProps) {
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
      {/* <path d="M 10.223 14.276 C 9.947 13.826 10.432 12.987 10.994 12.748 C 11.915 12.356 12.685 12.45 13.734 12.45 C 15.141 12.45 16.07 13.432 15.963 14.525 C 15.79 16.3 13.438 16.466 11.162 16.303 C 9.015 16.15 7.715 15.234 8.093 13.481 C 8.639 10.955 11.385 8.579 13.196 6.523 C 14.059 5.541 14.347 3.259 12.592 3.305 C 11.536 3.332 11.524 4.294 11.641 5.113 L 13.127 19.593 C 13.206 20.366 12.193 20.922 11.286 20.604 C 10.567 20.353 10.315 19.658 10.755 19.15 C 10.945 18.931 10.982 18.831 11.32 18.856" /> */}
      <path
        d="M 10.223 14.276 C 9.947 13.826 9.904 12.875 10.735 12.48 C 11.639 12.05 12.717 11.901 13.745 12.111 C 15.138 12.396 16.07 13.432 15.963 14.525 C 15.79 16.3 13.438 16.466 11.162 16.303 C 9.015 16.15 7.715 15.234 8.093 13.481 C 8.639 10.955 11.385 8.579 13.196 6.523 C 14.059 5.541 14.347 3.259 12.592 3.305 C 11.536 3.332 11.524 4.294 11.641 5.113 L 13.127 19.593 C 13.206 20.366 12.193 20.922 11.286 20.604 C 10.567 20.353 10.315 19.658 10.755 19.15 C 10.945 18.931 11.657 18.813 11.717 19.099"
        transform="matrix(1, 0, 0, 1, 0, 1.1102230246251565e-16)"
      />
    </svg>
  )
}