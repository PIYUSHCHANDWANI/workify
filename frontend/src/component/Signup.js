import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  MenuItem,
  Input,
} from "@material-ui/core";
import axios from "axios";
import { useHistory, Redirect } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
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
    background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
  },
  paper: {
    padding: theme.spacing(4),
    maxWidth: "800px",
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  },
  form: {
    width: "100%",
  },
  inputBox: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    width: "100%",
    height: "48px",
    marginTop: theme.spacing(2),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    },
  },
  title: {
    marginBottom: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.primary.main,
    "& h4": {
      fontWeight: 700,
    },
  },
  userTypeContainer: {
    marginBottom: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(2),
  },
  userTypeButton: {
    padding: theme.spacing(2, 4),
    borderRadius: theme.shape.borderRadius,
    border: `2px solid ${theme.palette.divider}`,
    transition: "all 0.3s ease",
    "&.active": {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main + "10",
    },
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontWeight: 600,
  },
  chipInput: {
    marginBottom: theme.spacing(2),
    "& .MuiChip-root": {
      backgroundColor: theme.palette.primary.main + "20",
      color: theme.palette.primary.main,
      fontWeight: 500,
    },
  },
  fileUpload: {
    marginBottom: theme.spacing(2),
    "& .MuiPaper-root": {
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      },
    },
  },
  phoneInput: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "& .special-label": {
      backgroundColor: theme.palette.background.paper,
    },
    "& .form-control": {
      width: "100%",
      height: "56px",
      borderRadius: theme.shape.borderRadius,
      fontSize: "16px",
      "&:hover": {
        borderColor: theme.palette.primary.main,
      },
      "&:focus": {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
      },
    },
  },
}));

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid
          item
          container
          className={classes.inputBox}
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Grid item xs={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const history = useHistory(); // initialize history hook

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
    bio: "",
    contactNumber: "",
  });

  const [phone, setPhone] = useState("");

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  // Common function to handle successful signup
  const handleSuccessSignup = (response) => {
    setPopup({
      open: true,
      severity: "success",
      // Use the message from the response or a default one.
      message:
        response.data.message ||
        "Verification email sent. Please verify and login.",
    });
    // Redirect to login page after a short delay
    setTimeout(() => history.push("/login"), 2000);
  };

  const handleSignupApplicant = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          // Instead of logging in automatically, show the email verification message.
          handleSuccessSignup(response);
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
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleSignupRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          handleSuccessSignup(response);
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
      setInputErrorHandler(tmpErrorHandler);
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
    <div className={classes.container}>
      <Paper elevation={0} className={classes.paper}>
        <div className={classes.title}>
          <Typography variant="h4" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Join our community and start your journey
          </Typography>
        </div>

        <div className={classes.userTypeContainer}>
          <Button
            className={`${classes.userTypeButton} ${
              signupDetails.type === "applicant" ? "active" : ""
            }`}
            onClick={() => handleInput("type", "applicant")}
          >
            <Typography variant="subtitle1">Job Seeker</Typography>
          </Button>
          <Button
            className={`${classes.userTypeButton} ${
              signupDetails.type === "recruiter" ? "active" : ""
            }`}
            onClick={() => handleInput("type", "recruiter")}
          >
            <Typography variant="subtitle1">Employer</Typography>
          </Button>
        </div>

        <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={signupDetails.name}
                onChange={(event) => handleInput("name", event.target.value)}
                className={classes.inputBox}
                variant="outlined"
                fullWidth
                error={inputErrorHandler.name.error}
                helperText={inputErrorHandler.name.message}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("name", true, "Name is required");
                  } else {
                    handleInputError("name", false, "");
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <EmailInput
                label="Email"
                value={signupDetails.email}
                onChange={(event) => handleInput("email", event.target.value)}
                className={classes.inputBox}
                inputErrorHandler={inputErrorHandler}
                handleInputError={handleInputError}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                label="Password"
                value={signupDetails.password}
                onChange={(event) => handleInput("password", event.target.value)}
                className={classes.inputBox}
                error={inputErrorHandler.password.error}
                helperText={inputErrorHandler.password.message}
                onBlur={(event) => {
                  if (event.target.value === "") {
                    handleInputError("password", true, "Password is required");
                  } else {
                    handleInputError("password", false, "");
                  }
                }}
              />
            </Grid>

            {signupDetails.type === "applicant" ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className={classes.sectionTitle}>
                    Professional Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <MultifieldInput
                    education={education}
                    setEducation={setEducation}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ChipInput
                    className={`${classes.inputBox} ${classes.chipInput}`}
                    label="Skills"
                    variant="outlined"
                    helperText="Press enter to add skills"
                    onChange={(chips) =>
                      setSignupDetails({ ...signupDetails, skills: chips })
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className={classes.fileUpload}>
                    <FileUploadInput
                      className={classes.inputBox}
                      label="Resume (PDF/DOC)"
                      icon={<DescriptionIcon />}
                      uploadTo={apiList.uploadResume}
                      handleInput={handleInput}
                      identifier={"resume"}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className={classes.fileUpload}>
                    <FileUploadInput
                      className={classes.inputBox}
                      label="Profile Photo"
                      icon={<FaceIcon />}
                      uploadTo={apiList.uploadProfileImage}
                      handleInput={handleInput}
                      identifier={"profile"}
                    />
                  </div>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className={classes.sectionTitle}>
                    Company Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Company Name"
                    value={signupDetails.name}
                    onChange={(event) => handleInput("name", event.target.value)}
                    className={classes.inputBox}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.phoneInput}>
                    <PhoneInput
                      country={"in"}
                      value={signupDetails.contactNumber}
                      onChange={(phone) => handleInput("contactNumber", phone)}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    value={signupDetails.bio}
                    onChange={(event) => handleInput("bio", event.target.value)}
                    className={classes.inputBox}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  signupDetails.type === "applicant"
                    ? handleSignupApplicant()
                    : handleSignupRecruiter();
                }}
                className={classes.submitButton}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Signup;