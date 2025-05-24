import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  Chip,
  CircularProgress,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import EditIcon from "@material-ui/icons/Edit";
import SchoolIcon from "@material-ui/icons/School";
import WorkIcon from "@material-ui/icons/Work";
import EmailIcon from "@material-ui/icons/Email";
import Alert from "@material-ui/lab/Alert";

import { SetPopupContext } from "../App";
import { useProfile, useFormFields } from "../lib/hooks";
import FileUploadInput from "../lib/FileUploadInput";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "93vh",
    padding: theme.spacing(4),
    background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
  },
  profileCard: {
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    background: theme.palette.background.paper,
    position: "relative",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: theme.spacing(4),
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing(2),
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[3],
  },
  editButton: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    "&:hover": {
      background: theme.palette.background.paper,
      transform: "scale(1.1)",
    },
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    "& svg": {
      marginRight: theme.spacing(1),
      color: theme.palette.primary.main,
    },
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  skill: {
    backgroundColor: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.palette.primary.main + "30",
    },
  },
  educationCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.shadows[1],
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
    maxWidth: 600,
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    height: 48,
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    },
  },
}));

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
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
              fullWidth
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
      <Grid item style={{ alignSelf: "center" }}>
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

const Profile = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  
  // Use our custom hooks
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  
  // Form validation rules
  const validationRules = {
    name: { required: true, minLength: 3 },
    education: { required: true },
    skills: { required: true },
  };

  // Use form fields hook for edit form
  const { fields, errors, isValid, handleChange, setFields } = useFormFields(
    {
      name: "",
      education: [],
      skills: [],
      resume: "",
      profile: "",
    },
    validationRules
  );

  // Initialize form when opening modal
  const handleEditClick = () => {
    setFields({
      name: profile?.name || "",
      education: profile?.education || [],
      skills: profile?.skills || [],
      resume: profile?.resume || "",
      profile: profile?.profile || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    if (!isValid) {
      setPopup({
        open: true,
        severity: "error",
        message: "Please fill all required fields correctly",
      });
      return;
    }

    const success = await updateProfile(fields);
    if (success) {
      setPopup({
        open: true,
        severity: "success",
        message: "Profile updated successfully",
      });
      setOpen(false);
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
    <Container maxWidth="md" className={classes.container}>
      <Paper elevation={0} className={classes.profileCard}>
        <IconButton className={classes.editButton} onClick={handleEditClick}>
          <EditIcon />
        </IconButton>

        <div className={classes.avatarContainer}>
          <Avatar 
            className={classes.avatar}
            src={profile?.profile || "/default-avatar.png"}
            alt={profile?.name}
          />
          <Typography variant="h4" gutterBottom>
            {profile?.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <EmailIcon fontSize="small" style={{ verticalAlign: "middle", marginRight: 8 }} />
            {profile?.email}
          </Typography>
        </div>

        <Divider style={{ margin: "24px 0" }} />

        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            <SchoolIcon />
            Education
          </Typography>
          {profile?.education.map((edu, index) => (
            <Paper key={index} className={classes.educationCard}>
              <Typography variant="subtitle1" gutterBottom>
                {edu.institutionName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {edu.startYear} - {edu.endYear || "Present"}
              </Typography>
            </Paper>
          ))}
        </div>

        <div className={classes.section}>
          <Typography variant="h6" className={classes.sectionTitle}>
            <WorkIcon />
            Skills
          </Typography>
          <div className={classes.skillsContainer}>
            {profile?.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                className={classes.skill}
              />
            ))}
          </div>
        </div>

        {profile?.resume && (
          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              <DescriptionIcon />
              Resume
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DescriptionIcon />}
              href={profile.resume}
              target="_blank"
            >
              View Resume
            </Button>
          </div>
        )}
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
      >
        <div className={classes.modalContent}>
          <Typography variant="h5" gutterBottom>
            Edit Profile
          </Typography>
          <Divider style={{ margin: "16px 0" }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={fields.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
                fullWidth
                className={classes.inputField}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Education
              </Typography>
              <MultifieldInput
                education={fields.education}
                setEducation={(newEducation) => 
                  setFields(prev => ({ ...prev, education: newEducation }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <ChipInput
                label="Skills"
                variant="outlined"
                fullWidth
                value={fields.skills}
                onAdd={(chip) =>
                  setFields(prev => ({
                    ...prev,
                    skills: [...prev.skills, chip]
                  }))
                }
                onDelete={(chip, index) =>
                  setFields(prev => ({
                    ...prev,
                    skills: prev.skills.filter((_, i) => i !== index)
                  }))
                }
                className={classes.inputField}
                error={!!errors.skills}
                helperText={errors.skills}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FileUploadInput
                label="Update Resume"
                icon={<DescriptionIcon />}
                uploadTo={apiList.uploadResume}
                handleInput={(key, value) => 
                  setFields(prev => ({ ...prev, [key]: value }))
                }
                identifier="resume"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FileUploadInput
                label="Update Profile Photo"
                icon={<FaceIcon />}
                uploadTo={apiList.uploadProfileImage}
                handleInput={(key, value) => 
                  setFields(prev => ({ ...prev, [key]: value }))
                }
                identifier="profile"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUpdate}
                className={classes.submitButton}
                disabled={!isValid}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </Container>
  );
};

export default Profile;
