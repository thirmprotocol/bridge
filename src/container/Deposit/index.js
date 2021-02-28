/* eslint-disable react-hooks/exhaustive-deps */

import { Avatar, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, FormControl, Grid, InputLabel, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Snackbar, Step, StepContent, StepLabel, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft, TrendingFlat } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import {
  useRecoilState
} from 'recoil';
import { useMappingContract, useThirmContract } from '../../hooks';
import { formatAddress } from '../../utils';
import config from './../../utils/config/index';
import { getThirmTokenContract } from './../../utils/index';
import { addressState, assetState, thirmBalState } from './../../utils/recoilState';
import { bridgeTheme, GoBackButton, StyledButton, StyledInputArea, StyledList, StyledListItem, StyledStepper } from './../globalStyle';
import { DepositWrapper } from './style';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade in ref={ref} {...props} />;
});

function Deposit() {

  const [address, setAddress] = useRecoilState(addressState);

  const [asset, setAsset] = useRecoilState(assetState);

  const [currentStep, setCurrentStep] = useState(0);

  const { account, library } = useWeb3React();

  const [tokensList, setTokensList] = useState([]);

  const [thirmBal, setThirmBal] = useRecoilState(thirmBalState);

  const [burnBal, setBurnBal] = useState("0");

  const [coinAddressMapped, setCoinAddressMapped] = useState(false);

  const steps = ['Approve THIRM', 'Finish Mapping'];

  const [stepperPosition, setStepperPosition] = useState(0);

  const mappingContract = useMappingContract();

  const thirmContract = useThirmContract();

  const [processingIndicator, setProcessingIndicator] = useState(false);

  const [approvedAlready, setApprovedAlready] = useState(false);

  const [snackBar, setSnackBar] = useState({
    status: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    let stale = false;
    const getTokensList = async () => {
      let tokensListTemp = [...config.tokens];
      if (!stale) {
        setTokensList(tokensListTemp);
      }

      const bal = await thirmContract.balanceOf(account);
      const tokenBal = parseFloat(formatEther(bal)).toFixed(8);

      if (!stale) {
        setThirmBal(tokenBal);
      }

      const toBurnEth = formatEther(await mappingContract.BURN_AMOUNT());

      if (!stale) {
        setBurnBal(toBurnEth);
      }
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, [coinAddressMapped]);

  useEffect(() => {
    let stale = false;
    const checkWithdrawSteps = async () => {
      try {

        if (stepperPosition === 0) {

          const tokenAllowance = await thirmContract.allowance(account, config.MAPPING_CONTRACT_ADDRESS);

          const bal = await thirmContract.balanceOf(account);
          if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal) && !stale) {
            setApprovedAlready(true)
            setStepperPosition(1);
          } else {
            setApprovedAlready(true);
          }
        }

      } catch (e) {
        console.log(e);
      }
    }

    if (tokensList.length > 0) {
      checkWithdrawSteps();
    }

    return () => {
      stale = true;
    };


  }, [tokensList, stepperPosition, currentStep, coinAddressMapped]);

  const handleChange = (prop) => (event) => {
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!address) return;
    const addressToMap = address.trim();
    if (currentStep === 0) {
      try {
        const mappedAddress = await mappingContract.addressMap(addressToMap);
        if (mappedAddress !== '0x0000000000000000000000000000000000000000') {
          setCoinAddressMapped(true);
          setCurrentStep(2);
        } else {
          setCurrentStep(1);
          setCoinAddressMapped(false);
        }

      } catch (e) {
        console.log(e);
        setCurrentStep(1);
      }
      return;
    }

    setCurrentStep(prevStep =>
      prevStep + 1
    );
  }

  const onBack = () => {
    if (currentStep === 2 || coinAddressMapped) {
      setCurrentStep(0);
      return;
    }
    setCurrentStep(prevStep =>
      prevStep - 1
    );
  }

  const handleBack = () => {
    setStepperPosition((prevActiveStep) => prevActiveStep - 1);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const openDepositDialog = () => {
    setOpenDialog(true);
  };

  const closeDepositDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBar({
      status: false,
      type: "success",
      message: ""
    });
  };

  const approveThirm = async () => {
    if (processingIndicator) return;

    try {

      const tokenContract = getThirmTokenContract(library, account, config.THIRM_TOKEN_ADDRESS);

      const allowance = await thirmContract.allowance(account, config.MAPPING_CONTRACT_ADDRESS);

      const bal = await thirmContract.balanceOf(account);


      if (!allowance.eq(0) && allowance.gte(bal)) {
        setStepperPosition(1);
        return;
      }

      const toBurnAllowance = parseEther((burnBal * 10).toString());

      const approved = await tokenContract.approve(config.MAPPING_CONTRACT_ADDRESS, toBurnAllowance);

      setProcessingIndicator(true);
      library.once(approved.hash, (done) => {

        if (done.status === 1) {
          setStepperPosition(1);
          setSnackBar({
            status: true,
            type: "success",
            message: `THIRM approved`
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `THIRM approval failed.`
          });
        }

        setProcessingIndicator(false);
      });

    } catch (e) {
      console.log(e);
    }

  }

  const mapCoin = async () => {
    if (processingIndicator || coinAddressMapped) return;
    const addressToMap = address.trim();
    try {
      const withdrawed = await mappingContract.setAddressMap(addressToMap, {
        gasLimit: 500000
      });

      setProcessingIndicator(true);
      library.once(withdrawed.hash, (done) => {

        if (done.status === 1) {
          setSnackBar({
            status: true,
            type: "success",
            message: `Your address has been mapped.`
          });
          setCurrentStep(2);
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `Address mapping failed.`
          });
        }
        setProcessingIndicator(false);
      });

    } catch (e) {
      console.log(e);
    }
  };

  if (tokensList.length === 0) return <DepositWrapper></DepositWrapper>;

  if (currentStep === 0) {
    return <DepositWrapper>
      <div className="top-bar">
        <div></div>
        <div className="balance-info">
          <p>{thirmBal} THIRM</p>
        </div>
      </div>
      <StyledInputArea>
        <FormControl variant="outlined" fullWidth >
          <InputLabel htmlFor="outlined-adornment-address">Your {tokensList[asset].coin} Address</InputLabel>
          <OutlinedInput
            value={address}
            onChange={handleChange('address')}
            id="outlined-adornment-address"
            labelWidth={160}
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
                    <MenuItem value={index} key={index}>
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

      <StyledButton className="next-button" fullWidth variant="contained" color="primary" onClick={onNext} disabled={!address}>
        <span>Next</span>
        <TrendingFlat />
      </StyledButton>
    </DepositWrapper>
  }

  if (currentStep === 1) {
    return <DepositWrapper>
      <div className="top-bar">
        <GoBackButton color="primary" onClick={onBack}>
          <KeyboardArrowLeft /> Go Back
          </GoBackButton>
        <div className="balance-info">
          <p>{thirmBal} THIRM</p>
        </div>
      </div>
      <StyledStepper activeStep={stepperPosition} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {
                index === 0 && <>
                  <div className="button-groups">
                    <Button
                      disabled={stepperPosition === 0}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                    <StyledButton
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={approveThirm}
                    >
                      {processingIndicator && <><CircularProgress size={24} color="secondary" />Approving..</>}
                      {!processingIndicator && <>
                        Approve THIRM</>
                      }
                    </StyledButton>
                  </div>
                </>
              }

              {
                index === 1 && <>
                  <div className="button-groups">
                    <Button
                      disabled={stepperPosition === 0 || approvedAlready}
                      onClick={handleBack}
                    >
                      Back
                          </Button>
                    <StyledButton fullWidth variant="contained" color="primary" onClick={mapCoin}>
                      {processingIndicator && <><CircularProgress size={24} color="secondary" />Mapping..</>}
                      {!processingIndicator && <>
                        Map {tokensList[asset].coin} address</>
                      }
                    </StyledButton>
                  </div>
                </>
              }
            </StepContent>
          </Step>
        ))}
      </StyledStepper>
      <Alert severity="info">{burnBal} THIRM will be burned for the address mapping. It is a one time process to prevent spam.</Alert>

      <Snackbar open={snackBar.status} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackBarClose} severity={snackBar.type}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </DepositWrapper>
  }

  if (currentStep === 2) {
    return <DepositWrapper>
      <div className="top-bar">
        <GoBackButton color="primary" onClick={onBack}>
          <KeyboardArrowLeft /> Go Back
          </GoBackButton>
        <div className="balance-info">
          <p>{thirmBal} THIRM</p>
        </div>
      </div>
      <h5 className="list-title">Your Deposit Summary</h5>

      <StyledList>

        <StyledListItem>
          <ListItemText primary="Asset" />
          <ListItemSecondaryAction>
            {tokensList[asset].coin}
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
      <StyledButton className="next-button" fullWidth variant="contained" color="primary" onClick={openDepositDialog}>
        Deposit {tokensList[asset].coin}
      </StyledButton>

      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDepositDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ padding: 24, textAlign: "center", color: bridgeTheme.primaryColor }}>{`DEPOSIT ${tokensList[asset].coin}`}</DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ padding: "16px 24px", textAlign: "center" }}
          >
            <QRCode value={tokensList[asset].depositAddress} size={250} />
          </DialogContentText>
          <div
            style={{ padding: 16, textAlign: "center", fontSize: 11 }}
          >
            <OutlinedInput
              value={tokensList[asset].depositAddress}
              id="outlined-adornment-address"
              fullWidth
              style={{ width: 300 }}
            />
          </div>

          <DialogContentText
            style={{ textAlign: "center", fontSize: 11 }}
          >
            <CopyToClipboard text={tokensList[asset].depositAddress} onCopy={() => {
              setSnackBar({
                status: true,
                type: "info",
                message: `Deposit address copied.`
              });
            }}>
              <Button>Copy Deposit Address</Button>
            </CopyToClipboard>
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

      <Snackbar open={snackBar.status} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackBarClose} severity={snackBar.type}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </DepositWrapper>
  }

  return (<DepositWrapper></DepositWrapper>);
}

export default Deposit;