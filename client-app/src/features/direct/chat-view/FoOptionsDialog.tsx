import Dialog from "@mui/material/Dialog/Dialog";
import Stack from "@mui/material/Stack/Stack";
import Paper from "@mui/material/Paper/Paper";
import Typography from "@mui/material/Typography/Typography";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import React, { useState } from "react";
import Button from "@mui/material/Button/Button";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export interface Props {
  open: boolean;
  onClose: () => void;
}

export default observer(function FoOptionsDialog({ open, onClose }: Props) {
  const handleClose = () => {
    onClose();
  };

  const {directStore: {showSenderName, setShowSenderName}} = useStore();
  const [value, setValue] = useState(showSenderName);

  return (
    <Dialog onClose={handleClose} open={open} sx={{ minWidth: "50vw" }}>
      <Paper>
        <Stack sx={{ padding: "2rem" }}>
          <Typography variant="h4">Forward Message</Typography>
          <Typography>
            You can remove the sender's name so that this message will look like
            it was sent by you.
          </Typography>
          <FormControlLabel
            sx={{ margin: "1.5rem 0" }}
            control={
              <Checkbox
                defaultChecked={value}
                onChange={(e) => setValue(e.target.checked)}
              />
            }
            label={`Show sender's name`}
          />
          <Stack flexDirection="row" justifyContent="flex-end">
            <Button
              variant="text"
              onClick={() => { setShowSenderName(value); handleClose(); }}
            >
              Done
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Dialog>
  );
});
