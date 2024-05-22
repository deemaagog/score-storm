import { rem } from "@mantine/core"

interface QuarterNoteIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

export function QuarterNoteIcon({ size, style, ...others }: QuarterNoteIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      style={{ width: rem(size), height: rem(size), ...style }}
      {...others}
    >
      <g id="g11065" transform="matrix(0.564303, 0, 0, 0.510073, -240.826015, -3.199067)">
        <path d="m451.09 49.39c3.3958-1.82 5.2053-5.1146 4.0922-7.593-1.1873-2.6436-5.267-3.3897-9.1066-1.6654-3.8396 1.7244-5.9922 5.2694-4.8049 7.913 1.1873 2.6436 5.267 3.3897 9.1066 1.6654 0.23997-0.10777 0.48628-0.19874 0.71268-0.32007z" />
        <path id="path11058" d="M 455.225 43.056 L 455.225 9.468" strokeWidth={"2.48204px"} />
      </g>
    </svg>
  )
}
