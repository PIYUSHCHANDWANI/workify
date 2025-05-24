import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
  Card,
  CardContent,
  Box,
  Container,
  Divider,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import TimerIcon from "@material-ui/icons/Timer";
import CodeIcon from "@material-ui/icons/Code";
import BrushIcon from "@material-ui/icons/Brush";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  searchInput: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  filterButton: {
    width: "100%",
  },
  jobCard: {
    marginBottom: theme.spacing(2),
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[4],
    },
  },
  jobTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  jobInfo: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    "& svg": {
      marginRight: theme.spacing(1),
      fontSize: "1.2rem",
    },
  },
  skillChip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
  },
  applyButton: {
    marginTop: theme.spacing(2),
  },
  filterModal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterPaper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    maxWidth: 500,
    width: "90%",
  },
  sortGroup: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
  header: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    padding: theme.spacing(6, 0),
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.contrastText,
  },
  statsContainer: {
    marginBottom: theme.spacing(6),
  },
  statCard: {
    padding: theme.spacing(3),
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  statLabel: {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
    fontWeight: 500,
  },
  categorySection: {
    marginBottom: theme.spacing(6),
  },
  categoryCard: {
    padding: theme.spacing(3),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
    },
  },
  categoryIcon: {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  searchSection: {
    marginBottom: theme.spacing(6),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
      opacity: 0.1,
      borderRadius: theme.shape.borderRadius,
    },
  },
  featuredSection: {
    marginBottom: theme.spacing(8),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      opacity: 0.05,
      borderRadius: theme.shape.borderRadius,
    },
  },
  sectionTitle: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 60,
      height: 4,
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: 2,
    },
  },
  testimonialCard: {
    padding: theme.spacing(4),
    height: '100%',
    position: 'relative',
    overflow: 'visible',
    '&::before': {
      content: '"""',
      position: 'absolute',
      top: -20,
      left: 20,
      fontSize: '4rem',
      color: theme.palette.primary.main,
      opacity: 0.1,
      fontFamily: 'serif',
    },
  },
  testimonialAvatar: {
    width: 64,
    height: 64,
    marginBottom: theme.spacing(2),
    border: `3px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[3],
  },
  companyLogosSection: {
    background: theme.palette.background.default,
    padding: theme.spacing(6, 0),
    marginBottom: theme.spacing(8),
  },
  companyLogo: {
    height: 40,
    opacity: 0.7,
    transition: 'all 0.3s ease',
    filter: 'grayscale(100%)',
    '&:hover': {
      opacity: 1,
      filter: 'grayscale(0%)',
      transform: 'scale(1.1)',
    },
  },
  statsCard: {
    ...theme.statsCard,
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
      opacity: 0.1,
    },
  },
  categoryCard: {
    ...theme.categoryCard,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${theme.palette.primary.light}10 0%, ${theme.palette.primary.main}10 100%)`,
      transition: 'transform 0.3s ease',
      transform: 'translateY(100%)',
    },
    '&:hover::before': {
      transform: 'translateY(0)',
    },
  },
  jobCard: {
    ...theme.jobCard,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::after': {
      opacity: 1,
    },
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    <Card className={classes.jobCard}>
      <CardContent>
        <Typography variant="h6" className={classes.jobTitle}>
          {job.title}
        </Typography>
        <Box mb={2}>
          <Rating value={job.rating !== -1 ? job.rating : null} readOnly precision={0.5} />
        </Box>
        <div className={classes.jobInfo}>
          <BusinessIcon />
          <Typography>{job.recruiter.name}</Typography>
        </div>
        <div className={classes.jobInfo}>
          <MonetizationOnIcon />
          <Typography>₹ {job.salary} per month</Typography>
        </div>
        <div className={classes.jobInfo}>
          <TimerIcon />
          <Typography>
            Duration: {job.duration !== 0 ? `${job.duration} month` : "Flexible"}
          </Typography>
        </div>
        <div className={classes.jobInfo}>
          <LocationOnIcon />
          <Typography>Deadline: {deadline}</Typography>
        </div>
        <Divider style={{ margin: "16px 0" }} />
        <Typography variant="subtitle2" gutterBottom>
          Required Skills:
        </Typography>
        <div>
          {job.skillsets.map((skill) => (
            <Chip key={skill} label={skill} className={classes.skillChip} />
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className={classes.applyButton}
          onClick={() => {
            setOpen(true);
          }}
          disabled={userType() === "recruiter"}
        >
          Apply Now
        </Button>
      </CardContent>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (upto 250 words)"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n != "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            style={{ padding: "10px 50px", backgroundColor: "green", color:"white" }}
            onClick={() => handleApply()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Card>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
              // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
style={{ padding: "10px 50px", backgroundColor: "green", color:"white" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const classes = useStyles();

  return (
    <>
      <Box className={classes.header}>
        <Container maxWidth="lg">
          <Grid container spacing={4} className={classes.statsContainer}>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.statCard}>
                <Typography className={classes.statValue}>{jobs.length}</Typography>
                <Typography className={classes.statLabel}>Active Jobs</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.statCard}>
                <Typography className={classes.statValue}>50+</Typography>
                <Typography className={classes.statLabel}>Companies</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.statCard}>
                <Typography className={classes.statValue}>1000+</Typography>
                <Typography className={classes.statLabel}>Job Seekers</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box className={classes.searchSection} py={4}>
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item xs={12} md={8}>
              <TextField
                label="Search Jobs"
                value={searchOptions.query}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    query: event.target.value,
                  })
                }
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    getData();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => getData()}>
                        <SearchIcon />
                      </IconButton>
                      <IconButton onClick={() => setFilterOpen(true)}>
                        <FilterListIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                variant="outlined"
                placeholder="Search by job title, company, or skills..."
              />
            </Grid>
          </Grid>
        </Box>

        <Box className={classes.featuredSection}>
          <Typography variant="h4" align="center" gutterBottom className={classes.sectionTitle}>
            Featured Jobs
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            Discover your next career opportunity
          </Typography>
          <Grid container spacing={3} style={{ marginTop: '2rem' }}>
            {jobs.slice(0, 3).map((job) => (
              <Grid item xs={12} md={4} key={job._id}>
                <JobTile job={job} featured />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className={classes.companyLogosSection}>
          <Typography variant="h6" align="center" gutterBottom color="textSecondary">
            Trusted by leading companies
          </Typography>
          <Grid container spacing={4} justify="center" alignItems="center">
            {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta'].map((company) => (
              <Grid item key={company}>
                <Typography variant="h6" className={classes.companyLogo}>
                  {company}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className={classes.categorySection}>
          <Typography variant="h5" gutterBottom align="center" style={{ marginBottom: '2rem' }}>
            Popular Job Categories
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <BusinessIcon className={classes.categoryIcon} />, title: "Business", count: "150+" },
              { icon: <CodeIcon className={classes.categoryIcon} />, title: "Technology", count: "200+" },
              { icon: <BrushIcon className={classes.categoryIcon} />, title: "Design", count: "100+" },
              { icon: <TrendingUpIcon className={classes.categoryIcon} />, title: "Marketing", count: "80+" },
            ].map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.title}>
                <Paper className={classes.categoryCard}>
                  {category.icon}
                  <Typography variant="h6" gutterBottom>
                    {category.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {category.count} jobs
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mb={8}>
          <Typography variant="h4" align="center" gutterBottom className={classes.sectionTitle}>
            Success Stories
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
            Hear from our happy job seekers
          </Typography>
          <Grid container spacing={4} style={{ marginTop: '2rem' }}>
            {[
              {
                name: 'John Doe',
                role: 'Software Engineer at Google',
                text: 'Found my dream job through this platform. The process was smooth and efficient.',
              },
              {
                name: 'Jane Smith',
                role: 'UI/UX Designer at Apple',
                text: 'Great platform for creative professionals. Highly recommended!',
              },
              {
                name: 'Mike Johnson',
                role: 'Product Manager at Amazon',
                text: 'The quality of job listings and employers is outstanding.',
              },
            ].map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.name}>
                <Paper elevation={2} className={classes.testimonialCard}>
                  <Typography variant="body1" paragraph style={{ fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{testimonial.name}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {testimonial.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mb={8}>
          <Typography variant="h4" align="center" gutterBottom className={classes.sectionTitle}>
            Latest Jobs
          </Typography>
          <Grid container spacing={3}>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <JobTile job={job} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper style={{ padding: '3rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)' }}>
                  <Typography variant="h5" gutterBottom>No jobs found</Typography>
                  <Typography color="textSecondary">
                    Try adjusting your search criteria or check back later for new opportunities
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        {jobs.length > 0 && (
          <Box className={classes.paginationContainer}>
            <Pagination
              count={10}
              color="primary"
              size="large"
              style={{ marginTop: '2rem' }}
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>

      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default Home;
