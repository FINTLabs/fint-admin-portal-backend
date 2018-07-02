import PropTypes from "prop-types";
import {blue} from "@material-ui/core/colors/index";
import React from "react";
import WarningMessageBox from "../../common/WarningMessageBox";
import {
    Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography,
    withStyles
} from "@material-ui/core";
import BusinessIcon from '@material-ui/icons/Business';
import {withContext} from "../../data/context/withContext";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import OrganisationView from "./view/OrganisationView";
import OrganisationApi from "../../data/api/OrganisationApi";


const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    organisationList: {
        width: '75%',
    },
    title: {
        paddingLeft: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
    },
    listItem: {
        borderBottom: '1px dashed lightgray',
    },
    itemAvatar: {
        color: '#fff',
        backgroundColor: theme.palette.secondary.main,
    },
    removeIcon: {
        color: theme.palette.primary.light,
    },
    setLegalIcon: {
        color: blue[700],
    },
});

class OrganisationList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            askToRemoveOrganisation: false,
            showOrganisation: false,
            organisation: {},
            message: ''
        };
    }

    askToRemoveOrganisation = (organisation) => {
        this.setState({
            askToRemoveOrganisation: true,
            message: `Er du sikker på at du vil fjerne ${organisation.name}?`,
            organisation: organisation,
        });
    };

    onCloseRemoveOrganisation = (confirmed) => {
        this.setState({
            askToRemoveOrganisation: false,
        });

        if (confirmed) {
            this.removeOrganisation(this.state.organisation);
        }
    };

    removeOrganisation = (organisation) => {
        OrganisationApi.deleteOrganisation(organisation).then(() => {
            this.props.notify(`${organisation.name} ble fjernet.`);
            this.props.fetchOrganisations();
        }).catch(error => {
            alert(error);
        });
    };

    onCloseOrganisationView = () => {
        this.setState({
            showOrganisation: false,
        });
    };

    showOrganisationView = (organisation) => {
        this.setState({
            organisation: organisation,
            showOrganisation: true,
        });
    };

    render() {
        const {organisations, classes} = this.props;
        return (
            <div className={classes.root}>
                <WarningMessageBox
                    show={this.state.askToRemoveOrganisation}
                    message={this.state.message}
                    onClose={this.onCloseRemoveOrganisation}
                />
                <OrganisationView
                    organisation={this.state.organisation}
                    onClose={this.onCloseOrganisationView}
                    show={this.state.showOrganisation}
                    notify={this.props.notify}
                />
                <div className={classes.organisationList}>
                    <Typography variant="headline" className={classes.title}>Organisasjoner</Typography>
                    <Divider/>
                    <List>
                        {organisations.map((organisation) =>
                            <ListItem className={classes.listItem} key={organisation.dn}>
                                <ListItemAvatar>
                                    <Avatar className={classes.itemAvatar}>
                                        <BusinessIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={organisation.displayName}
                                    secondary={organisation.name}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Remove"
                                                onClick={() => this.askToRemoveOrganisation(organisation)}>
                                        <RemoveIcon className={classes.removeIcon}/>
                                    </IconButton>
                                    <IconButton aria-label="Settings"
                                                onClick={() => this.showOrganisationView(organisation)}>
                                        <SettingsIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>,
                        )}
                    </List>
                </div>
            </div>
        );
    }
}

OrganisationList.propTypes = {
    fetchOrganisations: PropTypes.any.isRequired,
    organisations: PropTypes.array.isRequired,
    notify: PropTypes.any.isRequired,
};

export default withStyles(styles)(withContext(OrganisationList))