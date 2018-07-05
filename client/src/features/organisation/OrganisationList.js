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
import AccountBalanceIcon from "@material-ui/icons/AccountBalance"
import OrganisationView from "./view/OrganisationView";
import OrganisationApi from "../../data/api/OrganisationApi";
import OrganisationAddLegalContact from "./add/OrganisationAddLegalContact";


const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    organisationList: {
        width: '90%',
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
            askToAddLegalContact: false,
            askToRemoveOrganisation: false,
            showOrganisation: false,
            organisation: {},
            currentLegalContact: {},
            message: ''
        };
    }

    askToAddLegalContact(organisation) {
        OrganisationApi.getLegalContact(organisation).then(legalContact => {
            this.setState({
                askToAddLegalContact: true,
                organisation: organisation,
                contacts: this.props.fetchContacts(),
                currentLegalContact: legalContact
            });
        })

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
        console.log(organisation);
        OrganisationApi.deleteOrganisation(organisation).then(response => {
            if (response.status === 202) {
                this.props.notify(`${organisation.name} ble fjernet.`);
            }
            else {
                this.props.notify("Noe gikk galt");
            }
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

    onCloseAddLegalContact = () => {
        this.setState({
            askToAddLegalContact: false
        })
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
                <OrganisationAddLegalContact
                    notify={this.props.notify}
                    fetchContacts={this.props.fetchContacts}
                    contacts={this.props.contacts}
                    onClose={this.onCloseAddLegalContact}
                    currentLegalContact={this.state.currentLegalContact}
                    organisation={this.state.organisation}
                    show={this.state.askToAddLegalContact}
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
                    <List className={classes.organisationList}>
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
                                    <IconButton aria-label="Legal"
                                                onClick={() => this.askToAddLegalContact(organisation)}>
                                        <AccountBalanceIcon className={classes.setLegalIcon}/>
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
    contacts: PropTypes.any.isRequired,
    fetchContacts: PropTypes.any.isRequired,
    notify: PropTypes.any.isRequired,
};

export default withStyles(styles)(withContext(OrganisationList))