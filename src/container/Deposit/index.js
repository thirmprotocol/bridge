import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, InputAdornment, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Slide, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import oopsImage from '../../assets/images/oops.png';
import { useMainContract } from '../../hooks';
import config from './../../utils/config/index';
import { DepositWrapper } from './style';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Deposit() {

  const [values, setValues] = useState({
    amount: null,
    asset: 0,
    address: ""
  });

  const [currentStep, setCurrentStep] = useState(0);

  const { account } = useWeb3React();

  const [tokensList, setTokensList] = useState([]);

  const [coinAddressMapped, setCoinAddressMapped] = useState(false);

  const mainContract = useMainContract();

  useEffect(() => {
    let stale = false;
    const getTokensList = async () => {
      let tokensListTemp = [...config.tokens];
      if (!stale) {
        setTokensList(tokensListTemp);
      }
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, []);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onNext = async () => {
    if (!values.amount || !values.address || values.amount <= 0) return;

    setCoinAddressMapped(false);
    try {
      const mappedAddress = await mainContract.getAddressMap(values.address);
      if (mappedAddress !== '0x0000000000000000000000000000000000000000') {
        setCoinAddressMapped(true);
      }
      setCurrentStep(1);
    } catch (e) {
      console.log(e);
      setCurrentStep(1);
    }

    setCurrentStep(1);
  }

  const onBack = () => {
    setCurrentStep(0);
  }

  const [openDialog, setOpenDialog] = React.useState(false);

  const openDepositDialog = () => {
    setOpenDialog(true);
  };

  const closeDepositDialog = () => {
    setOpenDialog(false);
  };

  if (tokensList.length === 0) return null;

  return (
    <DepositWrapper>
      {
        currentStep === 0 && <>
          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              value={values.amount}
              onChange={handleChange('amount')}
              endAdornment={<InputAdornment position="end">{tokensList[values.asset].coin}</InputAdornment>}
              aria-describedby="outlined-amount-helper-text"
              labelWidth={0}
            />
            <FormHelperText id="outlined-amount-helper-text">Amount</FormHelperText>
          </FormControl>

          <FormControl variant="outlined" fullWidth>
            <OutlinedInput
              value={values.address}
              onChange={handleChange('address')}
              aria-describedby="outlined-amount-helper-text"
              labelWidth={0}
            />
            <FormHelperText id="outlined-amount-helper-text">{tokensList[values.asset].coin} Address</FormHelperText>
          </FormControl>
          <List>
            <ListItem>
              <ListItemText id="switch-list-label-bluetooth" primary="Asset" />
              <ListItemSecondaryAction>
                <FormControl>
                  <Select
                    value={values.asset}
                    onChange={handleChange('asset')}
                  >
                    {
                      tokensList.map((tkn) =>
                        <MenuItem value={tkn.id}>
                          <Grid container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Avatar alt={tkn.name} src={tkn.image} />
                            <Typography style={{ marginLeft: 16, marginRight: 16 }}>
                              {tkn.coin}
                            </Typography>
                          </Grid>
                        </MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </ListItemSecondaryAction>
            </ListItem>


            <ListItem>
              <ListItemText id="switch-list-label-bluetooth" primary="Destination" />
              <ListItemSecondaryAction>
                <p>{account.slice(0, 15)}...</p>
              </ListItemSecondaryAction>
            </ListItem>

            <ListItem>
              <ListItemText id="switch-list-label-bluetooth" primary="You will Receive" />
              <ListItemSecondaryAction>
                <p>{tokensList[values.asset].name}</p>
              </ListItemSecondaryAction>
            </ListItem>

          </List>

          <Button fullWidth variant="contained" color="primary" onClick={onNext} disabled={!values.amount || !values.address}>
            Next
          </Button>
        </>
      }

      {
        currentStep === 1 && <>
          {
            coinAddressMapped && <Grid container
              direction="column"
              justify="center"
              alignItems="flex-start">
              <Button color="primary" onClick={onBack}>
                <KeyboardArrowLeft /> Go Back
            </Button>
              <img className="deposit-error-image" src={oopsImage} alt="oops" />
              <p className="oops-message">
                Your address is not mapped yet for deposit.<br />
                Please email us at <a href="mailto:developer@thirm.com">developer@thirm.com</a> for the mapping.
              </p>
            </Grid>
          }

          {
            !coinAddressMapped && <>
              <Button color="primary" onClick={onBack}>
                <KeyboardArrowLeft /> Go Back
            </Button>

              <List>

                <ListItem>
                  <ListItemText id="switch-list-label-bluetooth" primary="Asset" />
                  <ListItemSecondaryAction>
                    {tokensList[values.asset].coin}
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText id="switch-list-label-bluetooth" primary="Amount" />
                  <ListItemSecondaryAction>
                    {values.amount} {tokensList[values.asset].coin}
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText id="switch-list-label-bluetooth" primary={`${tokensList[values.asset].coin} Address`} />
                  <ListItemSecondaryAction>
                    <p>{values.address.slice(0, 15)}...</p>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText id="switch-list-label-bluetooth" primary="Destination" />
                  <ListItemSecondaryAction>
                    <p>{account.slice(0, 15)}...</p>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText id="switch-list-label-bluetooth" primary="You will Receive" />
                  <ListItemSecondaryAction>
                    <p>{tokensList[values.asset].name}</p>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              <Button fullWidth variant="contained" color="primary" onClick={openDepositDialog}>
                Deposit
            </Button>

              <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeDepositDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">{`Deposit ${tokensList[values.asset].coin}`}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description"
                    style={{ padding: 24, textAlign: "center" }}
                  >
                    <QRCode value={tokensList[values.asset].depositAddress} size={250} />
                    <p>

                      {tokensList[values.asset].depositAddress.slice(0, 25)}...

                    </p>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeDepositDialog} color="primary">
                    Dismiss
                </Button>
                  <Button onClick={closeDepositDialog} color="primary">
                    Done
                </Button>
                </DialogActions>
              </Dialog>
            </>
          }
        </>
      }
    </DepositWrapper>
  );
}

export default Deposit;