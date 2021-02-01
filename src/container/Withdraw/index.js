/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, List, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Step, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import React, { useEffect } from 'react';
import { useMainContract } from '../../hooks';
import { useThirmContract } from './../../hooks/index';
import config from './../../utils/config/index';
import { getThirmTokenContract } from './../../utils/index';
import { StyledButton, StyledInputArea, StyledListItem } from './../globalStyle';
import { WithdrawWrapper } from './style';

function getSteps() {
  return ['Check withdraw information', 'Approve THIRM', 'Approve token', 'Finish Withdraw'];
}

const ALLOWANCE_LIMIT = ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");


function Withdraw() {

  const [values, setValues] = React.useState({
    amount: null,
    asset: 0,
    address: ""
  });

  const [currentStep, setCurrentStep] = React.useState(0);

  const [tokensList, setTokensList] = React.useState([]);

  const { account, library } = useWeb3React();

  const [processingApproval, setProcessingApproval] = React.useState(false);

  const mainContract = useMainContract();

  const thirmContract = useThirmContract();

  const [stepperPosition, setStepperPosition] = React.useState(0);
  const steps = getSteps();

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

  useEffect(() => {
    const checkWithdrawSteps = async () => {
      try {

        if (stepperPosition === 1) {
          const thirmContract = getThirmTokenContract(library, account, config.THIRM_TOKEN_ADDRESS);

          const allowance = await thirmContract.allowance(account, config.CONTRACT_ADDRESS);

          const bal = await thirmContract.balanceOf(account);

          if (allowance.gte(bal)) {
            setStepperPosition(2);
          }

        } else if (stepperPosition === 2) {
          const tokenContract = getThirmTokenContract(library, account, tokensList[values.asset].address);

          const tokenAllowance = await tokenContract.allowance(account, config.CONTRACT_ADDRESS);

          const bal = await tokenContract.balanceOf(account);

          if (tokenAllowance.gte(bal)) {
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
    setValues({ ...values, [prop]: event.target.value });
  };

  const onNext = async () => {
    if (!values.amount || !values.address || values.amount <= 0) return;
    setCurrentStep(1);
  }

  const withdrawCoin = async () => {

    try {
      const tknAmount = parseEther(values.amount);
      const withdrawed = await mainContract.registerWithdrawal(tokensList[values.asset].coin, values.address, tknAmount, {
        gasLimit: 500000
      });

      setProcessingApproval(true);
      library.once(withdrawed.hash, (done) => {

        if (done.status === 1) {
          setProcessingApproval(false);
          // Success Message
        } else {
          //
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

      if (allowance.gte(bal)) {
        return;
      }

      const approved = await tokenContract.approve(config.CONTRACT_ADDRESS, ALLOWANCE_LIMIT);

      setProcessingApproval(true);
      library.once(approved.hash, (done) => {

        if (done.status === 1) {
          setStepperPosition(2);
        } else {
          // NOTIFY

        }

        setProcessingApproval(false);
      });

    } catch (e) {
      console.log(e);
    }

  }

  const approveCurrentToken = async () => {

    try {

      const tokenContract = getThirmTokenContract(library, account, tokensList[values.asset].address);

      const tokenAllowance = await tokenContract.allowance(account, config.CONTRACT_ADDRESS);

      const bal = await tokenContract.balanceOf(account);

      if (tokenAllowance.gte(bal)) {
        setStepperPosition(3);
        return;
      }

      const approved = await tokenContract.approve(config.CONTRACT_ADDRESS, ALLOWANCE_LIMIT);

      setProcessingApproval(true);
      library.once(approved.hash, (done) => {

        if (done.status === 1) {
          setStepperPosition(3);
        } else {
          //
        }
        setProcessingApproval(false);
      });

    } catch (e) {
      console.log(e);
    }
  }


  if (tokensList.length === 0) return null;

  return (
    <WithdrawWrapper>
      {
        currentStep === 0 && <>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                value={values.amount}
                onChange={handleChange('amount')}
                endAdornment={<InputAdornment position="end">{tokensList[values.asset].name}</InputAdornment>}
                id="outlined-adornment-amount"
                labelWidth={60}
                type="number"
              />
            </FormControl>
          </StyledInputArea>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Destination {tokensList[values.asset].coin} Address</InputLabel>
              <OutlinedInput
                value={values.address}
                onChange={handleChange('address')}
                aria-describedby="outlined-amount-helper-text"
                labelWidth={200}
                id="outlined-adornment-address"
              />
            </FormControl>
          </StyledInputArea>
          <List>
            <StyledListItem>
              <ListItemText primary="Asset" />
              <ListItemSecondaryAction>
                <FormControl variant="outlined">
                  <Select
                    value={values.asset}
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
              <ListItemText primary="You will Receive" />
              <ListItemSecondaryAction>
                <p>{tokensList[values.asset].coin}</p>
              </ListItemSecondaryAction>
            </StyledListItem>
          </List>
          <StyledButton fullWidth variant="contained" color="primary" onClick={onNext} disabled={!values.amount || !values.address}>
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
                <StepContent>
                  <div>
                    {
                      index === 0 && <>
                        <List>

                          <StyledListItem>
                            <ListItemText primary="Asset" />
                            <ListItemSecondaryAction>
                              {tokensList[values.asset].coin}
                            </ListItemSecondaryAction>
                          </StyledListItem>

                          <StyledListItem>
                            <ListItemText primary="Amount" />
                            <ListItemSecondaryAction>
                              {values.amount} {tokensList[values.asset].coin}
                            </ListItemSecondaryAction>
                          </StyledListItem>

                          <StyledListItem>
                            <ListItemText primary={`${tokensList[values.asset].coin} Address`} />
                            <ListItemSecondaryAction>
                              <p>{values.address.slice(0, 15)}...</p>
                            </ListItemSecondaryAction>
                          </StyledListItem>

                          <StyledListItem>
                            <ListItemText primary="Destination" />
                            <ListItemSecondaryAction>
                              <p>{account.slice(0, 10)}...</p>
                            </ListItemSecondaryAction>
                          </StyledListItem>

                          <StyledListItem>
                            <ListItemText primary="You will Receive" />
                            <ListItemSecondaryAction>
                              <p>{tokensList[values.asset].name}</p>
                            </ListItemSecondaryAction>
                          </StyledListItem>
                        </List>

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
                            {processingApproval && <CircularProgress size={24} />} Approve {tokensList[values.asset].name}
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
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </>

      }
    </WithdrawWrapper>
  );
}

export default Withdraw;