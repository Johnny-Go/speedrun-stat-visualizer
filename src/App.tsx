import React, { ReactElement } from 'react'
import moment from 'moment'
import logo from './logo.svg'
import './App.css'
import FileImportButton from './Components/FileImportButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import xml2js from 'xml2js'
import { Attempt, Segment } from './types'
import DurationLineChart from './Components/DurationLineChart'
import SplitList from './Components/SplitList'

const App: React.FC = (): ReactElement => {
  const [attemptHistory, setAttemptHistory] = React.useState<Attempt[] | null>(null)
  const [segmentData, setSegmentData] = React.useState<Segment[] | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string>()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e?.target?.files?.[0]) {
      return null
    }

    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = () => {
      const xml = reader.result?.toString()

      if (xml) {
        xml2js
          .parseStringPromise(xml, { trim: true, mergeAttrs: true })
          .then(function(result: any) {
            const history = parseAttemptHistoryFromFile(result)
            const segments = parseSegmentsFromFile(result)
            setAttemptHistory(history)
            setSegmentData(segments)
          })
          .catch(function(err: string) {
            setErrorMessage(err)
            return null
          })
      }
    }
    reader.readAsText(file)
  }

  function parseAttemptHistoryFromFile(fileObject: any): Attempt[] {
    const history: Attempt[] = fileObject?.Run?.AttemptHistory?.[0]?.Attempt?.flatMap(
      ({ id, RealTime }: any): Attempt[] => {
        return id && RealTime
          ? [{ x: Number(id), y: moment.duration(RealTime).as('milliseconds') }]
          : []
      }
    )

    return history
  }

  function parseSegmentsFromFile(fileObject: any): Segment[] {
    const segmentData: Segment[] = fileObject?.Run?.Segments?.[0]?.Segment?.map(
      ({ Name, SplitTimes, BestSegmentTime, SegmentHistory }: any): Segment => {
        const name: string | null = Name?.[0]

        let pbTime: number | null = null
        if (
          SplitTimes?.[0]?.SplitTime?.[0]?.name?.[0]?.toUpperCase() === 'PERSONAL BEST' &&
          SplitTimes?.[0]?.SplitTime?.[0]?.RealTime
        ) {
          pbTime = moment.duration(SplitTimes[0].SplitTime[0].RealTime).as('milliseconds')
        }

        let goldTime: number | null = null
        if (BestSegmentTime?.[0]?.RealTime) {
          goldTime = moment.duration(BestSegmentTime[0].RealTime).as('milliseconds')
        }

        let history: Attempt[] | null = SegmentHistory?.[0]?.Time?.flatMap(
          ({ id, RealTime }: any): Attempt[] => {
            return id && RealTime
              ? [{ x: Number(id), y: moment.duration(RealTime).as('milliseconds') }]
              : []
          }
        )
        history = history === undefined ? null : history

        return { name, pbTime, goldTime, attemptHistory: history }
      }
    )
    return segmentData
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <FileImportButton id="import-split-button" accept=".lss" onChange={handleFile}>
          Import LiveSplit File
        </FileImportButton>
        <br />
        <TextField multiline style={{ width: '25%' }} value={errorMessage} variant="outlined" />
        <br />
        <Grid container>
          <Grid item xs={6} style={{ border: '1px solid red' }}>
            <SplitList data={segmentData} />
          </Grid>
          <Grid item xs={6} style={{ border: '1px solid red' }}>
            <DurationLineChart
              chartTitle="Run Duration over Time"
              data={attemptHistory}
              xAxisLabel="Attempt"
              yAxisLabel="Run Duration"
            />
          </Grid>
        </Grid>
      </header>
    </div>
  )
}

export default App
