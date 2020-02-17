import React, { ReactElement } from 'react'
import moment from 'moment'
import logo from './logo.svg'
import './App.css'
import FileImportButton from './Components/FileImportButton'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import xml2js from 'xml2js'
import { Attempt } from './types'
import DurationLineChart from './Components/DurationLineChart'

const App: React.FC = (): ReactElement => {
  const [attemptHistory, setAttemptHistory] = React.useState<Attempt[]>([])
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
          .parseStringPromise(xml, { trim: true })
          .then(function(result: any) {
            const history = parseAttemptHistoryFromFile(result)
            setAttemptHistory(history)
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
      ({ $, RealTime }: any) => {
        return $?.id && RealTime?.[0]
          ? { x: Number($.id), y: moment.duration(RealTime[0]).as('milliseconds') }
          : []
      }
    )

    return history
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
          <Grid item xs={4} style={{ border: '1px solid red' }} />
          <Grid item xs={8} style={{ border: '1px solid red' }}>
            <DurationLineChart
              chartTitle="Run Duration over Time"
              data={attemptHistory}
              xAxisLabel="Attempt"
              yAxisLabel="Run Duration"
            />
          </Grid>
        </Grid>
        <br />
        <TextField
          multiline
          style={{ width: '75%' }}
          value={attemptHistory.map((a: Attempt) => `x:${a.x}, y:${a.y}`).join('\n')}
          variant="outlined"
        />
      </header>
    </div>
  )
}

export default App
