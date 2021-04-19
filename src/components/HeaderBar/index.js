/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Popover } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import OnlineIcon from "../../assets/images/online.png";
import { formatAddress } from "../../utils";
import { injected } from "./../../hooks/connectors";
import config from "./../../utils/config/index";
import { ConnectionCard, HeaderWrapper, LogoWrapper } from "./style";

function HeaderBar() {
  const { deactivate, active, account, connector, chainId } = useWeb3React();

  const [walletName, setWalletName] = useState("");

  const [walletIcon, setWalletIcon] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const getWalletNameAndIcon = () => {
      if (!account) return;

      if (connector === injected) {
        setWalletName("Meta Mask");
      } else {
        setWalletName("");
      }

      if (connector === injected) {
        setWalletIcon(OnlineIcon);
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
  const id = open ? "simple-popover" : undefined;

  const history = useHistory();

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Link to="/">
          <img
            src="https://avatars0.githubusercontent.com/u/67930090?s=200&v=4"
            alt="thirm"
          />
        </Link>
        <h3>THIRM BRIDGE</h3>
      </LogoWrapper>
      <div>
        {active && (
          <>
            <Button color="primary" onClick={handleClick}>
              <Avatar
                src={walletIcon}
                alt="wallet"
                variant="circular"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <span className="account-address">
                {account && formatAddress(account)}
              </span>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <ConnectionCard>
                <ul className="connection-info">
                  <li className="connection-info-list">
                    <b>Status</b>
                    <p>{active ? "Connected" : ""}</p>
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
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleClose();
                    localStorage.removeItem("wallet");
                    deactivate();
                    history.push("/");
                  }}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  Disconnect
                </Button>
              </ConnectionCard>
            </Popover>
          </>
        )}

        {!active && (
          <>
            <Button variant="outlined" color="primary">
              <span>Not Connected</span>
            </Button>
          </>
        )}
      </div>
    </HeaderWrapper>
  );
}

export default HeaderBar;
