import React from 'react'
import logo from './logo.svg'
import './App.css'
import FileImportButton from './Components/FileImportButton'
import TextField from '@material-ui/core/TextField'
import xml2js from 'xml2js'
import Attempt from './types'

const App = () => {
  const [attemptHistory, setAttemptHistory] = React.useState<Attempt[]>([])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e && e.target && e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      let reader = new FileReader()
      reader.onload = () => {
        const xml = reader.result?.toString()

        if (xml) {
          xml2js.parseString(xml, { trim: true }, async function(err, result) {
            //todo: display error nicely in UI
            if (err) {
              console.log(err)
            }

            await getAttemptHistory(result)
          })
        }
      }
      reader.readAsText(file)
    }
  }

  async function getAttemptHistory(xml: any) {
    let atmptHistory: Attempt[] = []

    xml?.Run?.AttemptHistory?.[0]?.Attempt?.forEach((attempt: any) => {
      if (attempt?.$?.id && attempt?.RealTime?.[0]) {
        atmptHistory.push({ x: attempt.$.id, y: attempt.RealTime[0] })
      }
    })

    setAttemptHistory(atmptHistory)
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
        <TextField
          multiline
          value={attemptHistory.map((a: Attempt) => `x:${a.x}, y:${a.y}`).join('\n')}
          style={{ width: '75%' }}
          variant="outlined"
        />
      </header>
    </div>
  )
}

export default App
