import { Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, ListItemSecondaryAction, ListItemText, MenuItem, OutlinedInput, Select, Slide, Snackbar, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft, TrendingFlat } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import {
  useRecoilState
} from 'recoil';
import oopsImage from '../../assets/images/oops.png';
import { useMappingContract } from '../../hooks';
import { formatAddress } from '../../utils';
import config from './../../utils/config/index';
import { addressState, assetState } from './../../utils/recoilState';
import { GoBackButton, StyledButton, StyledInputArea, StyledList, StyledListItem } from './../globalStyle';
import { DepositWrapper } from './style';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Deposit() {

  const [address, setAddress] = useRecoilState(addressState);

  const [asset, setAsset] = useRecoilState(assetState);

  const [currentStep, setCurrentStep] = useState(0);

  const { account } = useWeb3React();

  const [tokensList, setTokensList] = useState([]);

  const [coinAddressMapped, setCoinAddressMapped] = useState(false);

  const mappingContract = useMappingContract();

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
    };
    getTokensList();
    return () => {
      stale = true;
    };
  }, []);

  const handleChange = (prop) => (event) => {
    if (prop === "address") setAddress(event.target.value);
    if (prop === "asset") setAsset(event.target.value);
  };

  const onNext = async () => {
    if (!address) return;

    setCoinAddressMapped(false);
    try {
      const mappedAddress = await mappingContract.addressMap(address);
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

  if (tokensList.length === 0) return null;

  if (currentStep === 0) {
    return <DepositWrapper>
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
      {
        !coinAddressMapped && <Grid container
          direction="column"
          justify="center"
          alignItems="flex-start">
          <GoBackButton color="primary" onClick={onBack}>
            <KeyboardArrowLeft /> Go Back
      </GoBackButton>
          <img className="deposit-error-image" src={oopsImage} alt="oops" />
          <p className="oops-message">
            Your address is not mapped yet for deposit.<br />
          Please email us at <a href="mailto:developer@thirm.com">developer@thirm.com</a> for the mapping.
        </p>
        </Grid>
      }

      {
        coinAddressMapped && <>
          <GoBackButton color="primary" onClick={onBack}>
            <KeyboardArrowLeft /> Go Back
      </GoBackButton>

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
            <DialogTitle style={{ padding: 24, textAlign: "center" }}>{`Deposit ${tokensList[asset].coin}`}</DialogTitle>
            <DialogContent>
              <DialogContentText
                style={{ padding: 24, textAlign: "center" }}
              >
                <QRCode value={tokensList[asset].depositAddress} size={230} />
              </DialogContentText>
              <DialogContentText
                style={{ padding: 16, textAlign: "center", fontSize: 11 }}
              >{tokensList[asset].depositAddress}</DialogContentText>
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
                  <Button link>Copy Deposit Address</Button>
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
        </>
      }
    </DepositWrapper>
  }

  return null
}

export default Deposit;