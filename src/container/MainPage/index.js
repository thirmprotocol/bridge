import {
  Box,
  Button,
  CardContent,
  Container,
  Tab,
  Tabs,
} from "@material-ui/core";
import React from "react";
import Deposit from "./../Deposit/index";
import Withdraw from "./../Withdraw/index";
import {
  ExternalLinks,
  MainAlert,
  MainAppBar,
  MainCard,
  MainWrapper,
} from "./style";

import pancakeImage from "../../assets/images/pancake.png";
import bscscanImage from "../../assets/images/bscscan.png";
import config from "../../utils/config";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function MainPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainWrapper>
      <Container maxWidth="xs">
        <MainAlert icon={false} severity="success" variant="outlined">
          ThirmVM is currently work in progress. Please don’t use assets you
          can’t afford to lose.
        </MainAlert>
        <MainCard elevation={5}>
          <MainAppBar
            position="static"
            elevation={0}
            className={value === 1 && "change"}
          >
            <Tabs
              value={value}
              indicatorColor="primary"
              onChange={handleChange}
              aria-label="THIRM function"
              centered
              variant="fullWidth"
            >
              <Tab label="Deposit" />
              <Tab label="Withdraw" />
            </Tabs>
          </MainAppBar>
          <CardContent>
            <TabPanel value={value} index={0}>
              <Deposit />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Withdraw />
            </TabPanel>
          </CardContent>
        </MainCard>
        <ExternalLinks>
          <Button
            href={`https://bscscan.com/token/${config.THIRM_TOKEN_ADDRESS}`}
            target="_blank"
            startIcon={<img src={bscscanImage} alt="bscscan"></img>}
          >
            View on BSCSCAN
          </Button>
          <Button
            href={`https://pancakeswap.info/token/${config.THIRM_TOKEN_ADDRESS}`}
            target="_blank"
            startIcon={<img src={pancakeImage} alt="pancake"></img>}
          >
            Trade on Pancakeswap
          </Button>
        </ExternalLinks>
      </Container>
    </MainWrapper>
  );
}

export default MainPage;
