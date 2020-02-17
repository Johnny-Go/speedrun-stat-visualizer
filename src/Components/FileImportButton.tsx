import React, { ReactElement } from 'react'
import Button from '@material-ui/core/Button'

type FileImportButtonProps = {
  id: string
  accept: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FileImportButton: React.FC<FileImportButtonProps> = ({
  id,
  children,
  accept,
  onChange
}): ReactElement => (
  <React.Fragment>
    <input accept={accept} id={id} style={{ display: 'none' }} type="file" onChange={onChange} />
    <label htmlFor={id}>
      <Button component="span" variant="contained" color="primary">
        {children}
      </Button>
    </label>
  </React.Fragment>
)

export default FileImportButton
