/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Snackbar, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import {
  useRecoilState
} from 'recoil';
import { useMainContract } from '../../hooks';
import { useThirmContract } from './../../hooks/index';
import config from './../../utils/config/index';
import { formatAddress, getThirmTokenContract } from './../../utils/index';
import { addressState, amountState, assetState } from './../../utils/recoilState';
import { StyledButton, StyledInputArea, StyledList, StyledListItem } from './../globalStyle';
import { StyledStepContent, WithdrawWrapper } from './style';

function getSteps() {
  return ['Check withdraw information', 'Approve THIRM', 'Approve token', 'Finish Withdraw'];
}

const ALLOWANCE_LIMIT = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");


function Withdraw() {

  const [amount, setAmount] = useRecoilState(amountState);

  const [address, setAddress] = useRecoilState(addressState);

  const [asset, setAsset] = useRecoilState(assetState);

  const [currentStep, setCurrentStep] = useState(0);

  const [tokensList, setTokensList] = useState([]);

  const [snackBar, setSnackBar] = useState({
    status: false,
    type: "success",
    message: ""
  });

  const { account, library } = useWeb3React();

  const [processingApproval, setProcessingApproval] = useState(false);

  const mainContract = useMainContract();

  const thirmContract = useThirmContract();

  const [stepperPosition, setStepperPosition] = useState(0);

  const steps = getSteps();

  const [tokenBal, setTokenBal] = useState(0.00000000);

  useEffect(() => {
    let stale = false;
    const getTokensList = async () => {
      let tokensListTemp = [...config.tokens];

      if (!stale) {
        setTokensList(tokensListTemp);
      }

      const tokenContract = getThirmTokenContract(library, account, tokensListTemp[asset].address);
      const bal = await tokenContract.balanceOf(account);
      const tokenBal = parseFloat(formatEther(bal)).toFixed(8)

      if (!stale) {
        setTokenBal(tokenBal);
      }
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, []);

  useEffect(() => {
    const checkWithdrawSteps = async () => {
      try {

        if (stepperPosition === 1) {
          const thirmContract = getThirmTokenContract(library, account, config.THIRM_TOKEN_ADDRESS);

          const allowance = await thirmContract.allowance(account, config.CONTRACT_ADDRESS);

          const bal = await thirmContract.balanceOf(account);
          if (!allowance.eq(0) && allowance.gte(bal)) {
            setStepperPosition(2);
          }

        } else if (stepperPosition === 2) {
          const tokenContract = getThirmTokenContract(library, account, tokensList[asset].address);

          const tokenAllowance = await tokenContract.allowance(account, config.CONTRACT_ADDRESS);

          const bal = await tokenContract.balanceOf(account);

          if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal)) {
            setStepperPosition(3);
          }
        }

      } catch (e) {
        console.log(e);
      }
    }

    if (tokensList.length > 0) {
      checkWithdrawSteps();
    }


  }, [tokensList, stepperPosition]);

  const handleChange = (prop) => (event) => {
    if (prop === "amount") setAmount(event.target.value);
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!amount || !address || amount <= 0) return;
    setCurrentStep(1);
  }

  const withdrawCoin = async () => {

    try {
      const tknAmount = parseEther(amount);
      const withdrawed = await mainContract.registerWithdrawal(tokensList[asset].coin, address, tknAmount, {
        gasLimit: 500000
      });

      setProcessingApproval(true);
      library.once(withdrawed.hash, (done) => {

        if (done.status === 1) {
          setProcessingApproval(false);
          setSnackBar({
            status: true,
            type: "success",
            message: `Token withdrawn`
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `Token withdraw failed.`
          });
          setProcessingApproval(false);
        }
      });

    } catch (e) {
      console.log(e);
    }
  };

  const onBack = () => {
    setCurrentStep(0);
  }

  const startWithdraw = () => {
    setStepperPosition(1);
  };

  const handleBack = () => {
    setStepperPosition((prevActiveStep) => prevActiveStep - 1);
  };

  const approveThirm = async () => {

    try {

      const tokenContract = getThirmTokenContract(library, account, config.THIRM_TOKEN_ADDRESS);

      const allowance = await thirmContract.allowance(account, config.CONTRACT_ADDRESS);

      const bal = await thirmContract.balanceOf(account);

      if (!allowance.eq(0) && allowance.gte(bal)) {
        return;
      }

      const approved = await tokenContract.approve(config.CONTRACT_ADDRESS, ALLOWANCE_LIMIT);

      setProcessingApproval(true);
      library.once(approved.hash, (done) => {

        if (done.status === 1) {
          setStepperPosition(2);
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

        setProcessingApproval(false);
      });

    } catch (e) {
      console.log(e);
    }

  }

  const approveCurrentToken = async () => {

    try {

      const tokenContract = getThirmTokenContract(library, account, tokensList[asset].address);

      const tokenAllowance = await tokenContract.allowance(account, config.CONTRACT_ADDRESS);

      const bal = await tokenContract.balanceOf(account);

      if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal)) {
        setStepperPosition(3);
        return;
      }

      const approved = await tokenContract.approve(config.CONTRACT_ADDRESS, ALLOWANCE_LIMIT);

      setProcessingApproval(true);
      library.once(approved.hash, (done) => {

        if (done.status === 1) {
          setStepperPosition(3);
          setSnackBar({
            status: true,
            type: "success",
            message: `${tokensList[asset].name} token Approved`
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `${tokensList[asset].name} token approval failed.`
          });
        }
        setProcessingApproval(false);
      });

    } catch (e) {
      console.log(e);
    }
  }

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

  const onTokenMax = () => {
    setAmount(tokenBal);
  };


  if (tokensList.length === 0) return null;

  return (
    <WithdrawWrapper>
      {
        currentStep === 0 && <>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                value={amount}
                onChange={handleChange('amount')}
                endAdornment={<InputAdornment position="end">{tokensList[asset].name}</InputAdornment>}
                id="outlined-adornment-amount"
                labelWidth={60}
                type="number"
              />
            </FormControl>
          </StyledInputArea>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Destination {tokensList[asset].coin} Address</InputLabel>
              <OutlinedInput
                value={address}
                onChange={handleChange('address')}
                aria-describedby="outlined-amount-helper-text"
                labelWidth={200}
                id="outlined-adornment-address"
              />
            </FormControl>
          </StyledInputArea>
          <div className="balance-info">
            <p>You have <span onClick={onTokenMax}>{tokenBal} {tokensList[asset].name}</span></p>
          </div>
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
                              {tkn.name}
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
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                <p>{tokensList[asset].coin}</p>
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
          <Button color="primary" onClick={onBack}>
            <KeyboardArrowLeft /> Go Back
          </Button>

          <Stepper activeStep={stepperPosition} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StyledStepContent>
                  {
                    index === 0 && <>
                      <StyledList>
                        <StyledListItem>
                          <ListItemText primary="Asset" />
                          <ListItemSecondaryAction>
                            {tokensList[asset].name}
                          </ListItemSecondaryAction>
                        </StyledListItem>

                        <StyledListItem>
                          <ListItemText primary="Amount" />
                          <ListItemSecondaryAction>
                            {amount} {tokensList[asset].name}
                          </ListItemSecondaryAction>
                        </StyledListItem>

                        <StyledListItem>
                          <ListItemText primary={`${tokensList[asset].coin} Address`} />
                          <ListItemSecondaryAction>
                            {formatAddress(address)}
                          </ListItemSecondaryAction>
                        </StyledListItem>

                        <StyledListItem>
                          <ListItemText primary="You will Receive" />
                          <ListItemSecondaryAction>
                            {tokensList[asset].coin}
                          </ListItemSecondaryAction>
                        </StyledListItem>
                      </StyledList>

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
                          onClick={startWithdraw}
                        >
                          Continue
                          </StyledButton>
                      </div>
                    </>
                  }

                  {
                    index === 1 && <>
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
                          {processingApproval && <CircularProgress size={24} />} Approve THIRM
                          </StyledButton>
                      </div>
                    </>
                  }

                  {
                    index === 2 && <>
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
                          onClick={approveCurrentToken}
                        >
                          {processingApproval && <CircularProgress size={24} />} Approve {tokensList[asset].name}
                        </StyledButton>
                      </div>
                    </>
                  }

                  {
                    index === 3 && <>
                      <div className="button-groups">
                        <Button
                          disabled={stepperPosition === 0}
                          onClick={handleBack}
                        >
                          Back
                          </Button>
                        <StyledButton fullWidth variant="contained" color="primary" onClick={withdrawCoin}>
                          Withdraw
                        </StyledButton>
                      </div>
                    </>
                  }
                </StyledStepContent>
              </Step>
            ))}
          </Stepper>
        </>

      }

      <Snackbar open={snackBar.status} autoHideDuration={6000} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackBarClose} severity={snackBar.type}>
          {snackBar.message}
        </Alert>
      </Snackbar>
    </WithdrawWrapper>
  );
}

export default Withdraw;