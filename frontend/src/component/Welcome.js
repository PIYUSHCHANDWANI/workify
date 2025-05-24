import { Grid, Typography, Button, makeStyles, Container } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import WorkIcon from '@material-ui/icons/Work';
import SearchIcon from '@material-ui/icons/Search';
import BusinessIcon from '@material-ui/icons/Business';
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  hero: {
    minHeight: "93vh",
    display: "flex",
    alignItems: "center",
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    padding: theme.spacing(4, 0),
    color: theme.palette.primary.contrastText,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 700,
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
  },
  subtitle: {
    marginBottom: theme.spacing(6),
    color: "rgba(255, 255, 255, 0.9)",
    maxWidth: 600,
    lineHeight: 1.6,
  },
  buttonGroup: {
    display: "flex",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  button: {
    padding: theme.spacing(1.5, 4),
    fontSize: "1.1rem",
    borderRadius: theme.shape.borderRadius,
    textTransform: "none",
    fontWeight: 500,
  },
  findJobsButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  hireButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: theme.palette.primary.contrastText,
    backdropFilter: "blur(10px)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  },
  features: {
    display: "flex",
    gap: theme.spacing(4),
    justifyContent: "center",
    flexWrap: "wrap",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    color: "rgba(255, 255, 255, 0.9)",
    "& svg": {
      marginRight: theme.spacing(1),
      fontSize: "1.5rem",
    },
  },
}));

const Welcome = () => {
  const classes = useStyles();
  const history = useHistory();

  if (isAuth()) {
    history.push("/home");
  }

  return (
    <div className={classes.hero}>
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h2" component="h1" className={classes.title}>
          Find Your Dream Job or Hire Top Talent
        </Typography>
        <Typography variant="h6" className={classes.subtitle}>
          Connect with the best opportunities and talents. Our platform makes it easy to find the perfect job or the ideal candidate.
        </Typography>
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            className={`${classes.button} ${classes.findJobsButton}`}
            onClick={() => history.push("/login")}
            startIcon={<SearchIcon />}
          >
            Find Jobs
          </Button>
          <Button
            variant="contained"
            className={`${classes.button} ${classes.hireButton}`}
            onClick={() => history.push("/signup")}
            startIcon={<BusinessIcon />}
          >
            Post a Job
          </Button>
        </div>
        <div className={classes.features}>
          <div className={classes.feature}>
            <WorkIcon />
            <Typography>Thousands of Jobs</Typography>
          </div>
          <div className={classes.feature}>
            <SearchIcon />
            <Typography>Easy to Search</Typography>
          </div>
          <div className={classes.feature}>
            <BusinessIcon />
            <Typography>Top Companies</Typography>
          </div>
        </div>
      </Container>
    </div>
  );
};

export const ErrorPage = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.hero}>
      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h2" component="h1" className={classes.title}>
          404 - Page Not Found
        </Typography>
        <Typography variant="h6" className={classes.subtitle}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          className={`${classes.button} ${classes.findJobsButton}`}
          onClick={() => history.push("/")}
        >
          Go to Home
        </Button>
      </Container>
    </div>
  );
};

export default Welcome;
