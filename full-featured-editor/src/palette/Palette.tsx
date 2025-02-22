import { Box, Title } from "@mantine/core"
import { ASIDE_ACTIONS } from "../aside/Aside"
import classes from "./Palette.module.css"

export const Palette: React.FC<{ activeAction: string }> = ({ activeAction }) => {
  return (
    <Box className={classes.palette} p={20}>
      <Title c={"rgba(18,42,89, 1)"} mb={"xl"} fw={700} order={4}>
        {activeAction}
      </Title>
      {activeAction && ASIDE_ACTIONS.find((a) => a.label === activeAction)?.content}
    </Box>
  )
}
