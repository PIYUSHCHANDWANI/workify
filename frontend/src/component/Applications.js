import { useState, useContext } from "react";
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
  Container,
  Box,
  Fade,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import BusinessIcon from "@material-ui/icons/Business";
import WorkIcon from "@material-ui/icons/Work";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import TimerIcon from "@material-ui/icons/Timer";
import EventIcon from "@material-ui/icons/Event";
import StarIcon from "@material-ui/icons/Star";

import { SetPopupContext } from "../App";
import { useJobApplications, usePagination } from "../lib/hooks";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "93vh",
    padding: theme.spacing(4),
    background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
  },
  header: {
    marginBottom: theme.spacing(4),
  },
  applicationCard: {
    marginBottom: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  jobTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
    "& svg": {
      marginRight: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  skill: {
    backgroundColor: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.palette.primary.main + "30",
    },
  },
  statusChip: {
    padding: theme.spacing(1, 2),
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
  },
  rateButton: {
    marginTop: theme.spacing(2),
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    position: "relative",
    width: "100%",
    maxWidth: 400,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  ratingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(3),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    height: 48,
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
  noApplications: {
    textAlign: "center",
    padding: theme.spacing(6),
    background: "rgba(0,0,0,0.02)",
    borderRadius: theme.shape.borderRadius * 2,
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application, onRatingChange } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const handleRatingSubmit = async () => {
    const success = await onRatingChange(application.job._id, rating);
    if (success) {
      setOpen(false);
    }
  };

  const statusColors = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Card className={classes.applicationCard}>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={9}>
            <Typography variant="h5" className={classes.jobTitle}>
              {application.job.title}
            </Typography>
            
            <div className={classes.infoItem}>
              <BusinessIcon />
              <Typography>{application.recruiter.name}</Typography>
            </div>
            
            <div className={classes.infoItem}>
              <WorkIcon />
              <Typography>{application.job.jobType}</Typography>
            </div>
            
            <div className={classes.infoItem}>
              <MonetizationOnIcon />
              <Typography>₹ {application.job.salary} per month</Typography>
            </div>
            
            <div className={classes.infoItem}>
              <TimerIcon />
              <Typography>
                {application.job.duration !== 0
                  ? `${application.job.duration} month`
                  : "Flexible"}
              </Typography>
            </div>
            
            <div className={classes.infoItem}>
              <EventIcon />
              <Typography>Applied on: {appliedOn.toLocaleDateString()}</Typography>
            </div>
            
            {(application.status === "accepted" || application.status === "finished") && (
              <div className={classes.infoItem}>
                <EventIcon />
                <Typography>Joined on: {joinedOn.toLocaleDateString()}</Typography>
              </div>
            )}

            <div className={classes.skillsContainer}>
              {application.job.skillsets.map((skill, index) => (
                <Chip key={index} label={skill} className={classes.skill} />
              ))}
            </div>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Chip
                label={application.status.toUpperCase()}
                className={classes.statusChip}
                style={{
                  backgroundColor: statusColors[application.status] + "20",
                  color: statusColors[application.status],
                }}
              />

              {(application.status === "accepted" || application.status === "finished") && (
                <Button
                  variant="contained"
                  className={classes.rateButton}
                  startIcon={<StarIcon />}
                  onClick={() => setOpen(true)}
                >
                  Rate Job
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={classes.modal}
        closeAfterTransition
      >
        <Fade in={open}>
          <div className={classes.modalContent}>
            <Typography variant="h6" gutterBottom align="center">
              Rate Your Experience
            </Typography>
            <div className={classes.ratingContainer}>
              <Rating
                name="job-rating"
                size="large"
                value={rating === -1 ? null : rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submitButton}
                onClick={handleRatingSubmit}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </Card>
  );
};

const Applications = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const { applications, loading, error, fetchApplications, updateApplicationStatus } = useJobApplications();
  
  // Use pagination hook
  const {
    currentPage,
    setCurrentPage,
    paginatedItems: paginatedApplications,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = usePagination(applications, 5);

  const handleRatingChange = async (jobId, rating) => {
    try {
      await updateApplicationStatus(jobId, { rating });
      setPopup({
        open: true,
        severity: "success",
        message: "Rating updated successfully",
      });
      return true;
    } catch (err) {
      setPopup({
        open: true,
        severity: "error",
        message: "Error updating rating",
      });
      return false;
    }
  };

  if (loading) {
    return (
      <Container className={classes.container}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Box className={classes.header}>
        <Typography variant="h4" gutterBottom>
          My Applications
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Track and manage your job applications
        </Typography>
      </Box>

      {applications.length > 0 ? (
        <>
          {paginatedApplications.map((application) => (
            <ApplicationTile 
              key={application._id} 
              application={application}
              onRatingChange={handleRatingChange}
            />
          ))}
          
          {/* Pagination Controls */}
          <Box display="flex" justifyContent="center" mt={4} gap={2}>
            <Button
              variant="outlined"
              disabled={!hasPrevPage}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Typography variant="body1" style={{ margin: "0 16px" }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={!hasNextPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      ) : (
        <Box className={classes.noApplications}>
          <Typography variant="h6" gutterBottom>
            No Applications Found
          </Typography>
          <Typography color="textSecondary">
            You haven't applied to any jobs yet. Start exploring opportunities!
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Applications;
