import React from "react";
import Button from "@material-ui/core/Button";

type FileImportButtonProps = {
  id: string;
  buttonText: string;
  fileType: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FileImportButton = ({
  id,
  buttonText,
  fileType,
  onChange
}: FileImportButtonProps) => (
  <React.Fragment>
    <input
      accept={fileType}
      id={id}
      style={{ display: "none" }}
      type="file"
      onChange={onChange}
    />
    <label htmlFor={id}>
      <Button component="span" variant="contained" color="primary">
        {buttonText}
      </Button>
    </label>
  </React.Fragment>
);
