import { Tooltip, UnstyledButton, rem } from "@mantine/core"
import styles from "./AsideButton.module.css"

export const AsideButton = ({ Icon, label, onClick, active }: any) => (
  <Tooltip label={label} position="right" openDelay={500} key={label}>
    <UnstyledButton onClick={onClick} className={styles.actionButton} data-active={active || undefined}>
      <Icon style={{ width: rem(24), height: rem(24) }} stroke={1.7} />
    </UnstyledButton>
  </Tooltip>
)
