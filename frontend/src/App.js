import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, makeStyles, ThemeProvider, CssBaseline } from "@material-ui/core";

import theme from './theme';
import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import isAuth, { userType } from "./lib/isAuth";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
    backgroundColor: theme.palette.background.default,
  },
  container: {
    padding: theme.spacing(3),
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  }
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SetPopupContext.Provider value={setPopup}>
        <BrowserRouter>
          <div className={classes.root}>
            <Navbar />
            <Grid container className={classes.body}>
              <Grid item className={classes.container}>
                <Switch>
                  <Route exact path="/">
                    <Welcome />
                  </Route>
                  <Route exact path="/login">
                    <Login />
                  </Route>
                  <Route exact path="/signup">
                    <Signup />
                  </Route>
                  <Route exact path="/logout">
                    <Logout />
                  </Route>
                  <Route exact path="/home">
                    <Home />
                  </Route>
                  <Route exact path="/applications">
                    <Applications />
                  </Route>
                  <Route exact path="/profile">
                    {userType() === "recruiter" ? (
                      <RecruiterProfile />
                    ) : (
                      <Profile />
                    )}
                  </Route>
                  <Route exact path="/addjob">
                    <CreateJobs />
                  </Route>
                  <Route exact path="/myjobs">
                    <MyJobs />
                  </Route>
                  <Route exact path="/job/applications/:jobId">
                    <JobApplications />
                  </Route>
                  <Route exact path="/employees">
                    <AcceptedApplicants />
                  </Route>
                  <Route>
                    <ErrorPage />
                  </Route>
                </Switch>
              </Grid>
            </Grid>
            <MessagePopup
              open={popup.open}
              severity={popup.severity}
              message={popup.message}
              setOpen={(status) =>
                setPopup({
                  ...popup,
                  open: status,
                })
              }
            />
          </div>
        </BrowserRouter>
      </SetPopupContext.Provider>
    </ThemeProvider>
  );
}

export default App;
