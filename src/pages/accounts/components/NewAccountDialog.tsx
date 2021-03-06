import React from "react";
import { Grid, Chip, Typography, TextField, MenuItem } from "@mui/material";
import { requestNewAccount } from "../AdminAccountsPage.slice";
import { useAppDispatch } from "../../../app/common/hooks";
import { INewAccount, rolesEnum } from "../types";
import Dialog from "../../../shared/GenericDialog";
import { isBlank } from "../../../shared/utils";

interface NewAccountDialogProps {
  open: boolean;
  handleClose: () => void;
}

const emptyAccount: INewAccount = {
  role: rolesEnum.TA,
  username: "",
  password: "",
  name: "",
};

export function NewAccountDialog({ open, handleClose }: NewAccountDialogProps) {
  const dispatch = useAppDispatch();

  const [newAccount, setNewAccount] = React.useState<INewAccount>(emptyAccount);

  // email textfiel ref & validation
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const validEmail = emailInputRef.current?.validity.valid;
  const [touchedEmail, setTouchedEmail] = React.useState<boolean>(false);

  // username & name validation
  const [nameError, setNameError] = React.useState<boolean>(false);
  const [passwordError, setPasswordError] = React.useState<boolean>(false);

  const DialogTitle = (
    <>
      <Typography variant="button" fontSize="subtitle2" color="primary">
        Creating New Account
      </Typography>
      <Typography variant="h5" component="div" fontWeight="bold">
        {newAccount.name ? newAccount.name : "No name"}{" "}
        <Chip
          label={newAccount.role}
          color={
            newAccount.role === rolesEnum.Professor ? "primary" : undefined
          }
        />
      </Typography>
    </>
  );

  const handleNewAccount = () => {
    const { name, password, username } = newAccount;

    if (isBlank(name)) {
      setNameError(true);
    }

    if (isBlank(password)) {
      setPasswordError(true);
    }

    if (isBlank(username)) {
      setTouchedEmail(true);
    }

    if (!isBlank(name) && !isBlank(password) && validEmail) {
      dispatch(requestNewAccount(newAccount));
      handleDialogClose();
    }
  };

  const handleDialogClose = () => {
    setTouchedEmail(false);
    setNameError(false);
    setPasswordError(false);
    setNewAccount(emptyAccount);
    handleClose();
  };

  const FooterButtons = [
    {
      label: "Cancel",
      onClick: () => handleDialogClose(),
      color: "error",
    },
    {
      label: "Add New Account",
      onClick: () => handleNewAccount(),
      variant: "contained",
    },
  ];

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      title={DialogTitle}
      handleClose={handleDialogClose}
      footerContent={FooterButtons}
    >
      <Grid container>
        <Typography>
          After filling the account information, click save to send it to the
          database.
        </Typography>

        <Grid item xs={12}>
          <TextField
            label="Name"
            required
            fullWidth
            margin="dense"
            value={newAccount.name}
            onChange={(event) => {
              const input = event.target.value;
              setNameError(isBlank(input));
              setNewAccount({ ...newAccount, name: input });
            }}
            error={nameError}
            helperText={
              !nameError ? "Firstname and lastname" : "Please enter a name"
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            type="email"
            label="Email"
            required
            fullWidth
            margin="dense"
            value={newAccount.username}
            onChange={(event) => {
              setTouchedEmail(true);
              setNewAccount({ ...newAccount, username: event.target.value });
            }}
            inputRef={emailInputRef}
            error={!validEmail && touchedEmail}
            helperText={
              !validEmail && touchedEmail
                ? "Please enter a valid email"
                : "Used as the username"
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            type="password"
            label="Password"
            required
            fullWidth
            margin="dense"
            value={newAccount.password}
            onChange={(event) => {
              const pass = event.target.value;
              setPasswordError(isBlank(pass));
              setNewAccount({ ...newAccount, password: pass });
            }}
            error={passwordError}
            helperText={
              !passwordError
                ? "Used to access this account"
                : "Please enter a password"
            }
          />
        </Grid>

        <Grid container direction="row" justifyContent="space-between">
          <Grid item xs={6}>
            <TextField
              type="tel"
              label="Phone number (disabled)"
              margin="dense"
              value={newAccount.phone}
              onChange={(event) =>
                setNewAccount({ ...newAccount, phone: event.target.value })
              }
              helperText="Contact information for this account"
              disabled
            />
          </Grid>

          <Grid item xs={5}>
            <TextField
              select
              label="Role"
              required
              fullWidth
              margin="dense"
              value={newAccount.role}
              helperText="Permissions"
              onChange={(event) =>
                setNewAccount({
                  ...newAccount,
                  role: event.target.value as rolesEnum,
                })
              }
            >
              <MenuItem value={rolesEnum.TA}>{rolesEnum.TA}</MenuItem>
              <MenuItem value={rolesEnum.Professor}>
                {rolesEnum.Professor}
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}
