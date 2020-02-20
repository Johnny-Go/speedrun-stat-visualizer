import React, { ReactElement } from 'react'
import { Segment } from '../types'
import DurationLineChart from './DurationLineChart'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'

type SplitListProps = {
  data: Segment[] | null
}

const useStyles = makeStyles(() => ({
  root: {
    '&$expanded': {
      border: '1px solid black',
      margin: 'auto'
    }
  },
  expanded: {}
}))

const SplitList: React.FC<SplitListProps> = ({ data }): ReactElement | null => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const classes = useStyles()

  if (!data) {
    return null
  }
  if (!data.length) {
    return <Typography>No splits present in file</Typography>
  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }

  const mappedTags = data?.map(
    (item: Segment, index: number): ReactElement => {
      const panelId = `${index}-${item.name}`
      return (
        <ExpansionPanel
          key={panelId}
          TransitionProps={{ unmountOnExit: true }}
          expanded={expanded === panelId}
          onChange={handleChange(panelId)}
          classes={classes}
        >
          <ExpansionPanelSummary>
            <Typography>{item.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <DurationLineChart
              chartTitle="Split Duration over Time"
              data={item.attemptHistory}
              xAxisLabel="Attempt"
              yAxisLabel="Split Duration"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    }
  )

  return <React.Fragment>{mappedTags}</React.Fragment>
}

export default SplitList
