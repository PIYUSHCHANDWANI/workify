import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  useTheme,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Fade,
  useScrollTrigger,
  Slide,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import isAuth, { userType } from "../lib/isAuth";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import WorkIcon from '@material-ui/icons/Work';
import MenuIcon from '@material-ui/icons/Menu';
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
  },
  appBarScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(1, 3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 2),
    },
  },
  title: {
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.primary.main,
    '& svg': {
      marginRight: theme.spacing(1),
      fontSize: '2rem',
      color: theme.palette.primary.main,
    },
    '&:hover': {
      transform: 'translateY(-1px)',
    },
    transition: 'all 0.2s ease',
  },
  navButtons: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mobileMenu: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  button: {
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    fontWeight: 500,
    padding: theme.spacing(1, 2),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-1px)',
    },
  },
  activeButton: {
    backgroundColor: theme.palette.primary.main + '15',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main + '25',
    },
  },
  loginButton: {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  signupButton: {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
    },
  },
  menuPaper: {
    marginTop: theme.spacing(6),
    borderRadius: theme.shape.borderRadius,
    minWidth: 180,
  },
}));

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
    handleMenuClose();
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Add scroll listener
  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 20;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  });

  const renderNavButtons = () => (
    <>
      {isAuth() ? (
        userType() === "recruiter" ? (
          <>
            <Button
              color="inherit"
              onClick={() => handleClick("/home")}
              className={`${classes.button} ${window.location.pathname === "/home" ? classes.activeButton : ""}`}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => handleClick("/addjob")}
              className={`${classes.button} ${window.location.pathname === "/addjob" ? classes.activeButton : ""}`}
            >
              Add Jobs
            </Button>
            <Button
              color="inherit"
              onClick={() => handleClick("/myjobs")}
              className={`${classes.button} ${window.location.pathname === "/myjobs" ? classes.activeButton : ""}`}
            >
              My Jobs
            </Button>
            <Button
              color="inherit"
              onClick={() => handleClick("/employees")}
              className={`${classes.button} ${window.location.pathname === "/employees" ? classes.activeButton : ""}`}
            >
              Employees
            </Button>
            <Button
              color="inherit"
              onClick={() => handleClick("/profile")}
              className={`${classes.button} ${window.location.pathname === "/profile" ? classes.activeButton : ""}`}
              startIcon={<PersonIcon />}
            >
              Profile
            </Button>
            <Button
              onClick={() => handleClick("/logout")}
              className={`${classes.button} ${classes.loginButton}`}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={() => handleClick("/home")}
              className={`${classes.button} ${window.location.pathname === "/home" ? classes.activeButton : ""}`}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => handleClick("/applications")}
              className={`${classes.button} ${window.location.pathname === "/applications" ? classes.activeButton : ""}`}
            >
              Applications
            </Button>
            <Button
              color="inherit"
              onClick={() => handleClick("/profile")}
              className={`${classes.button} ${window.location.pathname === "/profile" ? classes.activeButton : ""}`}
              startIcon={<PersonIcon />}
            >
              Profile
            </Button>
            <Button
              onClick={() => handleClick("/logout")}
              className={`${classes.button} ${classes.loginButton}`}
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </>
        )
      ) : (
        <>
          <Button
            onClick={() => handleClick("/login")}
            className={`${classes.button} ${classes.loginButton}`}
          >
            Login
          </Button>
          <Button
            onClick={() => handleClick("/signup")}
            className={`${classes.button} ${classes.signupButton}`}
          >
            Signup
          </Button>
        </>
      )}
    </>
  );

  return (
    <HideOnScroll {...props}>
      <AppBar position="fixed" className={`${classes.appBar} ${scrolled ? classes.appBarScrolled : ''}`}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h5" className={classes.title} onClick={() => handleClick("/")}>
            <WorkIcon />
            Workify
          </Typography>
          
          <Box className={classes.navButtons}>
            {renderNavButtons()}
          </Box>

          <IconButton
            edge="start"
            className={classes.mobileMenu}
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id="mobile-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
            classes={{ paper: classes.menuPaper }}
          >
            {isAuth() ? (
              userType() === "recruiter" ? (
                [
                  { text: "Home", path: "/home" },
                  { text: "Add Jobs", path: "/addjob" },
                  { text: "My Jobs", path: "/myjobs" },
                  { text: "Employees", path: "/employees" },
                  { text: "Profile", path: "/profile" },
                  { text: "Logout", path: "/logout" },
                ].map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => handleClick(item.path)}
                    selected={window.location.pathname === item.path}
                  >
                    {item.text}
                  </MenuItem>
                ))
              ) : (
                [
                  { text: "Home", path: "/home" },
                  { text: "Applications", path: "/applications" },
                  { text: "Profile", path: "/profile" },
                  { text: "Logout", path: "/logout" },
                ].map((item) => (
                  <MenuItem
                    key={item.path}
                    onClick={() => handleClick(item.path)}
                    selected={window.location.pathname === item.path}
                  >
                    {item.text}
                  </MenuItem>
                ))
              )
            ) : (
              [
                { text: "Login", path: "/login" },
                { text: "Signup", path: "/signup" },
              ].map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={() => handleClick(item.path)}
                  selected={window.location.pathname === item.path}
                >
                  {item.text}
                </MenuItem>
              ))
            )}
          </Menu>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
