/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Snackbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft, TrendingFlat } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import {
  useRecoilState
} from 'recoil';
import checkIcon from '../../assets/images/check.png';
import { useControllerContract } from './../../hooks/index';
import config from './../../utils/config/index';
import { formatAddress, getThirmTokenContract } from './../../utils/index';
import { addressState, amountState, assetState, tokenBalState } from './../../utils/recoilState';
import { GoBackButton, StyledButton, StyledInputArea, StyledList, StyledListItem } from './../globalStyle';
import { WithdrawWrapper } from './style';

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

  const [processingIndicator, setProcessingIndicator] = useState(false);

  const controllerContract = useControllerContract();

  const [tokenBal, setTokenBal] = useRecoilState(tokenBalState);

  useEffect(() => {
    let stale = false;
    const getTokensList = async () => {
      let tokensListTemp = [...config.tokens];

      if (!stale) {
        setTokensList(tokensListTemp);
      }

      const tokenContract = getThirmTokenContract(library, account, tokensListTemp[asset].address);
      const bal = await tokenContract.balanceOf(account);
      const tokenBal = parseFloat(formatEther(bal)).toFixed(8);

      if (!stale) {
        setTokenBal(tokenBal);
      }
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, [currentStep]);

  const handleChange = (prop) => (event) => {
    if (prop === "amount") setAmount(event.target.value);
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!amount || !address || amount <= 0) return;

    if (currentStep === 1) {
      const tokenContract = getThirmTokenContract(library, account, tokensList[asset].address);

      const tokenAllowance = await tokenContract.allowance(account, config.CONTROLLER_CONTRACT_ADDRESS);

      const bal = await tokenContract.balanceOf(account);

      if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal)) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
      return;
    }

    setCurrentStep(prevStep =>
      prevStep + 1
    );
  }

  const withdrawCoin = async () => {
    if (processingIndicator) return;
    const addressToMap = address.trim();
    try {
      const tknAmount = parseEther(amount);
      const withdrawed = await controllerContract.registerWithdrawal(tokensList[asset].coin, addressToMap, tknAmount, {
        gasLimit: 500000
      });

      setProcessingIndicator(true);
      library.once(withdrawed.hash, (done) => {

        if (done.status === 1) {
          setCurrentStep(4);
          setSnackBar({
            status: true,
            type: "success",
            message: `${tokensList[asset].name} withdraw completed.`
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `${tokensList[asset].coin} withdraw failed.`
          });
        }
        setProcessingIndicator(false);
      });

    } catch (e) {
      console.log(e);
    }
  };



  const approveCurrentToken = async () => {
    if (processingIndicator) return;
    try {

      const tokenContract = getThirmTokenContract(library, account, tokensList[asset].address);

      const tokenAllowance = await tokenContract.allowance(account, config.CONTROLLER_CONTRACT_ADDRESS);

      const bal = await tokenContract.balanceOf(account);

      if (!tokenAllowance.eq(0) && tokenAllowance.gte(bal)) {
        setCurrentStep(3);
        return;
      }

      const approved = await tokenContract.approve(config.CONTROLLER_CONTRACT_ADDRESS, ALLOWANCE_LIMIT);

      setProcessingIndicator(true);
      library.once(approved.hash, (done) => {

        if (done.status === 1) {
          setCurrentStep(3);
          setSnackBar({
            status: true,
            type: "success",
            message: `${tokensList[asset].name} token approval completed.`
          });
        } else {
          setSnackBar({
            status: true,
            type: "error",
            message: `${tokensList[asset].name} token approval failed.`
          });
        }
        setProcessingIndicator(false);
      });

    } catch (e) {
      console.log(e);
    }
  }

  const onBack = async () => {
    if (currentStep > 1) {
      setCurrentStep(1);
      return;
    }
    setCurrentStep(prevStep =>
      prevStep - 1
    );
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


  if (tokensList.length === 0) return (<WithdrawWrapper></WithdrawWrapper>);


  return (
    <WithdrawWrapper>
      <div className="top-bar">
        {
          currentStep === 0 ? <div></div> : <GoBackButton color="primary" onClick={onBack}>
            <KeyboardArrowLeft /> Go Back
          </GoBackButton>
        }
        <div className="balance-info">
          <p>{tokenBal} {tokensList[asset].name}</p>
        </div>
      </div>
      {
        currentStep === 0 && <>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Your {tokensList[asset].coin} Address</InputLabel>
              <OutlinedInput
                value={address}
                onChange={handleChange('address')}
                aria-describedby="outlined-amount-helper-text"
                labelWidth={160}
                id="outlined-adornment-address"
                endAdornment={
                  <>
                    <InputAdornment position='end'>
                      <Button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.readText().then(text => setAddress(text));
                          }
                        }}>
                        Paste
                  </Button>
                    </InputAdornment>
                  </>}
              />
            </FormControl>
          </StyledInputArea>
          <StyledInputArea>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                value={amount}
                onChange={handleChange('amount')}
                endAdornment={
                  <>
                    <InputAdornment position='end'>
                      <Button
                        onClick={onTokenMax}>
                        MAX
                  </Button>
                    </InputAdornment>
                    <InputAdornment position="end">{tokensList[asset].name}</InputAdornment>
                  </>}
                id="outlined-adornment-amount"
                labelWidth={70}
                type="number"
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
          <StyledButton className="next-button" fullWidth variant="contained" color="primary" onClick={onNext}>

            {/* disabled={!amount || !address || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(tokenBal)} */}

            <span>Next</span>
            <TrendingFlat />
          </StyledButton>
        </>
      }

      {
        currentStep === 1 && <>
          <h5 className="list-title">Your Withdraw Summary</h5>
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

          <StyledButton className="next-button" fullWidth variant="contained" color="primary" onClick={onNext}>
            <span>Next</span>
            <TrendingFlat />
          </StyledButton>
        </>
      }

      {
        currentStep === 2 && <>

          <div className="action-area">
            <img src={tokensList[asset].image} alt={tokensList[asset].name} />
            <p>Approve {tokensList[asset].name}</p>
          </div>

          <StyledButton className={`next-button ${processingIndicator && "processing"}`} fullWidth variant="contained" color="primary" onClick={approveCurrentToken}>
            {processingIndicator && <><CircularProgress size={24} color="secondary" />Approving..</>}
            {!processingIndicator && <>
              Approve {tokensList[asset].name}</>
            }
          </StyledButton>
        </>
      }

      {
        currentStep === 3 && <>
          <div className="action-area">
            <img src={tokensList[asset].image} alt={tokensList[asset].name} />
            <p>Withdraw {tokensList[asset].coin}</p>
          </div>

          <StyledButton className={`next-button ${processingIndicator && "processing"}`} fullWidth variant="contained" color="primary" onClick={withdrawCoin}>
            {processingIndicator && <><CircularProgress size={24} color="secondary" />Withdrawing..</>}
            {!processingIndicator && <>Withdraw {tokensList[asset].coin}</>}
          </StyledButton>
        </>
      }

      {
        currentStep === 4 && <div className="action-area">
          <img src={checkIcon} alt="done" />
          <p>Withdraw Completed</p>
          <GoBackButton color="primary" onClick={onBack}>
            Go Back
          </GoBackButton>
        </div>
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