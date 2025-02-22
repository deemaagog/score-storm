import { FunctionComponent, forwardRef } from "react"
import { ActionIcon, Tooltip } from "@mantine/core"
import { IconProps } from "@tabler/icons-react"
import styles from "./ActionButton.module.css"

export interface CustomIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string
}

type ActionButtonProps = {
  Icon: FunctionComponent<Omit<IconProps, "ref">> | FunctionComponent<CustomIconProps>
  active?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  tooltip?: string
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ Icon, active, disabled, onClick, tooltip }, ref) => {
    return (
      <Tooltip openDelay={1000} label={tooltip} disabled={!tooltip}>
        <ActionIcon
          className={styles.actionButton}
          size="xl"
          variant="white"
          data-active={active || undefined}
          disabled={disabled}
          onClick={onClick}
          ref={ref}
        >
          <Icon size={32} strokeWidth={1.5} />
        </ActionIcon>
      </Tooltip>
    )
  },
)
