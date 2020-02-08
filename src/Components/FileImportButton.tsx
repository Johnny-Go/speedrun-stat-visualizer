import React from "react";
import Button from "@material-ui/core/Button";

type FileImportButtonProps = {
  id: string;
  children: React.ReactNode;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FileImportButton = ({
  id,
  children,
  accept,
  onChange
}: FileImportButtonProps) => (
  <React.Fragment>
    <input
      accept={accept}
      id={id}
      style={{ display: "none" }}
      type="file"
      onChange={onChange}
    />
    <label htmlFor={id}>
      <Button component="span" variant="contained" color="primary">
        {children}
      </Button>
    </label>
  </React.Fragment>
);
