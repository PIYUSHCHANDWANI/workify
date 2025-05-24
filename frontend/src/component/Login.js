import { useContext, useState } from "react";
import { FaGoogle } from "react-icons/fa";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  Container,
  Box,
  Divider,
} from "@material-ui/core";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "93vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: "450px",
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(4),
    "& svg": {
      fontSize: "3rem",
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2),
    },
  },
  form: {
    width: "100%",
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: "46px",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  divider: {
    flexGrow: 1,
  },
  dividerText: {
    margin: theme.spacing(0, 2),
    color: theme.palette.text.secondary,
  },
  googleButton: {
    backgroundColor: "#DB4437",
    color: "white",
    "&:hover": {
      backgroundColor: "#B33225",
    },
    height: "46px",
  },
  signupPrompt: {
    textAlign: "center",
    marginTop: theme.spacing(2),
  },
  signupLink: {
    color: theme.palette.primary.main,
    cursor: "pointer",
    fontWeight: 500,
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const history = useHistory();

  const [loggedin, setLoggedin] = useState(isAuth());
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Container className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.logo}>
          <PersonIcon />
          <Typography variant="h4" component="h1">
            Welcome Back
          </Typography>
        </div>
        <form className={classes.form} noValidate>
          <EmailInput
            label="Email Address"
            value={loginDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputField}
            required
          />
          <PasswordInput
            label="Password"
            value={loginDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
            className={classes.inputField}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submitButton}
            onClick={() => handleLogin()}
          >
            Login
          </Button>

          <div className={classes.dividerContainer}>
            <Divider className={classes.divider} />
            <Typography variant="body2" className={classes.dividerText}>
              OR
            </Typography>
            <Divider className={classes.divider} />
          </div>

          <Button
            variant="contained"
            fullWidth
            className={classes.googleButton}
            startIcon={<FaGoogle />}
            onClick={() =>
              (window.location.href = "http://localhost:4444/auth/google")
            }
          >
            Sign in with Google
          </Button>

          <Typography variant="body2" className={classes.signupPrompt}>
            Don't have an account?{" "}
            <span
              className={classes.signupLink}
              onClick={() => history.push("/signup")}
            >
              Sign up
            </span>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
