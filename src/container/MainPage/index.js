import { Box, CardContent, Container, Tab, Tabs } from '@material-ui/core';
import React from 'react';
import Deposit from './../Deposit/index';
import Withdraw from './../Withdraw/index';
import { MainAlert, MainAppBar, MainCard, MainWrapper } from './style';


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
      {value === index && (
        <Box >
          {children}
        </Box>
      )}
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
      <Container maxWidth="xs"
      >
        <MainAlert icon={false} severity="success" variant="outlined">
          ThirmVM is currently work in progress. Please don’t use assets you can’t afford to lose.
      </MainAlert>
        <MainCard elevation={5}>
          <MainAppBar position="static" elevation={0} className={value === 1 && "change"}>
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
      </Container>
    </MainWrapper>
  );
}

export default MainPage;