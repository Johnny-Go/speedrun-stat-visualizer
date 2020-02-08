import React from 'react'
import Button from '@material-ui/core/Button'

type FileImportButtonProps = {
  id: string
  accept: string
  children: React.ReactNode
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileImportButton = ({ id, accept, children, onChange }: FileImportButtonProps) => (
  <React.Fragment>
    <input id={id} accept={accept} onChange={onChange} style={{ display: 'none' }} type="file" />
    <label htmlFor={id}>
      <Button color="primary" component="span" variant="contained">
        {children}
      </Button>
    </label>
  </React.Fragment>
)
