/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Popover } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoginKeyIcon from '../../assets/images/login-key.svg';
import MetaMaskIcon from '../../assets/images/metamask.png';
import { injected } from './../../hooks/connectors';
import config from './../../utils/config/index';
import { ConnectionCard, HeaderWrapper } from './style';


function HeaderBar() {

  const { deactivate, active, account, connector, chainId } = useWeb3React();

  const [walletName, setWalletName] = useState('');

  const [walletIcon, setWalletIcon] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const getWalletNameAndIcon = () => {
      if (!account) return;

      if (connector === injected) {
        setWalletName('Meta Mask');
      } else {
        setWalletName('');
      }

      if (connector === injected) {
        setWalletIcon(MetaMaskIcon);
      } else {
        setWalletIcon(LoginKeyIcon);
      }
    };

    getWalletNameAndIcon();
  }, [account, chainId]);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const history = useHistory();

  return (
    <HeaderWrapper>
      <h3>THIRM BRIDGE</h3>
      <>
        {active && <>

          <Button aria-describedby={id} color="primary" onClick={handleClick}>
            <Avatar src={walletIcon} alt="wallet" />
            <span>
              {account && account.substr(0, 4)}...{account && account.substr(36)}
            </span>
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <ConnectionCard>
              <ul className="connection-info">
                <li className="connection-info-list">
                  <b>Status</b>
                  <p>{active ? 'Connected' : ''}</p>
                </li>
                <li className="connection-info-list">
                  <b>Wallet</b>
                  <p>{walletName}</p>
                </li>
                <li className="connection-info-list">
                  <b>Network</b>
                  <p>{config.network}</p>
                </li>
              </ul>

              <Button
                color="secondary"
                variant="contained"
                fullWidth
                onClick={() => {
                  handleClose();
                  localStorage.removeItem('wallet');
                  deactivate();
                  history.push('/');
                }}
              >
                Disconnect
				    </Button>

            </ConnectionCard>
          </Popover>
        </>
        }

        {
          !active && <>
            <Button variant="outlined" aria-describedby={id} color="primary" onClick={handleClick}>
              <Avatar src={LoginKeyIcon} alt="wallet" />
              <span>
                Connect
              </span>
            </Button>
          </>
        }
      </>
    </HeaderWrapper>
  );
}

export default HeaderBar;
