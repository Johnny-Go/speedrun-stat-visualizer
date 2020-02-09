import React from 'react'
import Button from '@material-ui/core/Button'

type FileImportButtonProps = {
  id: string
  children: React.ReactNode
  accept: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FileImportButton = (props: FileImportButtonProps) => (
  <React.Fragment>
    <input
      accept={props.accept}
      id={props.id}
      style={{ display: 'none' }}
      type="file"
      onChange={props.onChange}
    />
    <label htmlFor={props.id}>
      <Button component="span" variant="contained" color="primary">
        {props.children}
      </Button>
    </label>
  </React.Fragment>
)

export default FileImportButton
