import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../app/common/hooks";
import { Routes } from "../../../shared/Routes.constants";
import {
  closeWarningModal,
  requestDeleteProblem,
  WarningTypes,
} from "../ProblemEditorContainer/problemEditorContainerSlice";

interface Props {}

export const WarningDialog = (props: Props) => {
  const history = useHistory();
  const showModal = useAppSelector(
    (state) => state.problemEditorContainer.showWarningModal
  );
  const warningType = useAppSelector(
    (state) => state.problemEditorContainer.warningType
  );
  const dispatch = useDispatch();
  return (
    <Dialog
      open={showModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to{" "}
        {warningType === WarningTypes.Delete ? "delete" : "leave"}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {warningType === WarningTypes.Delete
            ? "This action will be permanent."
            : "Leaving this page before submitting will mean losing your progress on this problem."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (warningType === WarningTypes.Delete) {
              dispatch(requestDeleteProblem());
            }
            history.push(Routes.Modules);
          }}
          variant="contained"
          color="error"
        >
          Yes
        </Button>
        <Button
          onClick={() => dispatch(closeWarningModal())}
          variant="contained"
          color="primary"
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
