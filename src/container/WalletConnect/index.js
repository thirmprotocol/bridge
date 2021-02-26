import { Avatar, Button, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useWeb3React } from '@web3-react/core';
import MetaMaskIcon from '../../assets/images/metamask.png';
import { getErrorMessage } from './../../hooks/index';
import { ConnectWrapper } from './style';


const ConnectWallet = (props) => {
  const { error } = useWeb3React();

  const { connectorsByName, activate, setActivatingConnector } = props;

  const activateWallet = async (currentConnector, name) => {
    setActivatingConnector(currentConnector);
    await activate(connectorsByName[name]);
    window.localStorage.setItem('wallet', name);
  };

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <ConnectWrapper>
        <p className="heading-info">Transfer your cryptocurrency assets between multiple blockchains</p>
        <p className="sub-heading-info">To mint or release assets, connect your wallet.</p>
        {connectorsByName &&
          Object.keys(connectorsByName).map((name) => {
            const currentConnector = connectorsByName[name];
            return (
              <div key={name}>
                {currentConnector && name === 'Injected' && (
                  <Button
                    variant="outlined" color="primary"
                    key={name}
                    onClick={() => {
                      activateWallet(currentConnector, name);
                    }}
                  >
                    <Avatar alt="Meta Mask" src={MetaMaskIcon} />
                    <p className="button-label">Connect With Metamask</p>
                  </Button>
                )}
              </div>
            );
          })}
        <div className="error-message">
          {!!error && <Alert severity="error">
            <div dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }} />
          </Alert>}
        </div>
      </ConnectWrapper>
    </Grid>
  );
};

export default ConnectWallet;