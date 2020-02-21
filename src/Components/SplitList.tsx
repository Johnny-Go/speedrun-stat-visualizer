import React, { ReactElement } from 'react'
import { Segment } from '../types'
import DurationLineChart from './DurationLineChart'

import { makeStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'

type SplitListProps = {
  data: Segment[] | null
}

const useStylesExpansionPanel = makeStyles(() => ({
  root: {
    backgroundColor: '#282c34',
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
}))

const useStylesExpansionPanelSummary = makeStyles(() => ({
  root: {
    backgroundColor: '#4e535c',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
}))

const SplitList: React.FC<SplitListProps> = ({ data }): ReactElement | null => {
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const classesExpansionPanel = useStylesExpansionPanel()
  const classesExpansionPanelSummary = useStylesExpansionPanelSummary()

  if (!data) {
    return null
  }
  if (!data.length) {
    return <Typography>No splits present in file</Typography>
  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const expansionPanels = data?.map(
    (item: Segment, index: number): ReactElement => {
      const panelId = `${index}-${item.name}`
      return (
        <ExpansionPanel
          key={panelId}
          TransitionProps={{ unmountOnExit: true }}
          expanded={expanded === panelId}
          onChange={handleChange(panelId)}
          classes={classesExpansionPanel}
        >
          <ExpansionPanelSummary classes={classesExpansionPanelSummary}>
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

  return <React.Fragment>{expansionPanels}</React.Fragment>
}

export default SplitList
