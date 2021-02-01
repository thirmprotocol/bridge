import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Slide, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import {
  useRecoilState
} from 'recoil';
import oopsImage from '../../assets/images/oops.png';
import { useMainContract } from '../../hooks';
import { formatAddress } from '../../utils';
import config from './../../utils/config/index';
import { addressState, amountState, assetState } from './../../utils/recoilState';
import { StyledButton, StyledInputArea, StyledList, StyledListItem } from './../globalStyle';
import { DepositWrapper } from './style';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Deposit() {

  const [amount, setAmount] = useRecoilState(amountState);

  const [address, setAddress] = useRecoilState(addressState);

  const [asset, setAsset] = useRecoilState(assetState);

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
    if (prop === "amount") setAmount(event.target.value);
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!amount || !address || amount <= 0) return;

    setCoinAddressMapped(false);
    try {
      const mappedAddress = await mainContract.getAddressMap(address);
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
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                value={amount}
                onChange={handleChange('amount')}
                endAdornment={<InputAdornment position="end">{tokensList[asset].coin}</InputAdornment>}
                id="outlined-adornment-amount"
                labelWidth={60}
                type="number"
              />
            </FormControl>
          </StyledInputArea>

          <StyledInputArea>
            <FormControl variant="outlined" fullWidth >
              <InputLabel htmlFor="outlined-adornment-address">{tokensList[asset].coin} Address</InputLabel>
              <OutlinedInput
                value={address}
                onChange={handleChange('address')}
                id="outlined-adornment-address"
                labelWidth={110}
              />
            </FormControl>
          </StyledInputArea>
          <StyledList>
            <StyledListItem>
              <ListItemText primary="Asset" />
              <ListItemSecondaryAction>
                <FormControl variant="outlined">
                  <Select
                    value={asset}
                    onChange={handleChange('asset')}
                  >
                    {
                      tokensList.map((tkn, index) =>
                        <MenuItem value={index}>
                          <Grid container
                            direction="row"
                            justify="flex-start"
                            alignItems="center">
                            <Avatar alt={tkn.name} src={tkn.image} style={{
                              width: 24, height: 24
                            }} />
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
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="Destination" />
              <ListItemSecondaryAction>
                {formatAddress(account)}
              </ListItemSecondaryAction>
            </StyledListItem>

            <StyledListItem>
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                <p>{tokensList[asset].name}</p>
              </ListItemSecondaryAction>
            </StyledListItem>

          </StyledList>

          <StyledButton fullWidth variant="contained" color="primary" onClick={onNext} disabled={!amount || !address}>
            Next
          </StyledButton>
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

              <StyledList>

                <StyledListItem>
                  <ListItemText primary="Asset" />
                  <ListItemSecondaryAction>
                    {tokensList[asset].coin}
                  </ListItemSecondaryAction>
                </StyledListItem>

                <StyledListItem>
                  <ListItemText primary="Amount" />
                  <ListItemSecondaryAction>
                    {amount} {tokensList[asset].coin}
                  </ListItemSecondaryAction>
                </StyledListItem>

                <StyledListItem>
                  <ListItemText primary={`${tokensList[asset].coin} Address`} />
                  <ListItemSecondaryAction>
                    {formatAddress(address)}
                  </ListItemSecondaryAction>
                </StyledListItem>

                <StyledListItem>
                  <ListItemText primary="Destination" />
                  <ListItemSecondaryAction>
                    {formatAddress(account)}
                  </ListItemSecondaryAction>
                </StyledListItem>

                <StyledListItem>
                  <ListItemText primary="You will Receive" />
                  <ListItemSecondaryAction>
                    <p>{tokensList[asset].name}</p>
                  </ListItemSecondaryAction>
                </StyledListItem>
              </StyledList>
              <StyledButton fullWidth variant="contained" color="primary" onClick={openDepositDialog}>
                Deposit
            </StyledButton>

              <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={closeDepositDialog}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">{`Deposit ${tokensList[asset].coin}`}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description"
                    style={{ padding: 24, textAlign: "center" }}
                  >
                    <QRCode value={tokensList[asset].depositAddress} size={250} />
                    {formatAddress(tokensList[asset].depositAddress)}
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