import React from "react";
import Button from "@material-ui/core/Button";
import {
    Avatar, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, List, ListItem, ListItemAvatar,
    ListItemSecondaryAction, ListItemText, withStyles,
} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import BusinessIcon from "@material-ui/icons/Business";
import AddIconCircle from "@material-ui/icons/AddCircle";
import OrganisationApi from "../../../data/api/OrganisationApi";
import InformationMessageBox from "../../../common/InformationMessageBox";
import PropTypes from "prop-types";
import {withContext} from "../../../data/context/withContext";
import OrganisationNew from "./OrganisationNew";
import {getOrganisationsFromBronnoysund} from "./getOrganisationsFromBronnoysund";

const styles = (theme) => ({
    addButton: {
        margin: 0,
        top: 100,
        left: 'auto',
        bottom: 'auto',
        right: 50,
        position: 'fixed',
    },
    root: {},
    dialog: {
        height: '75%',
    },
    organisationList: {
        marginRight: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 2,
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

    searchInput: {
        margin: theme.spacing.unit,
        width: '80%',
    },


});

class OrganisationAddExisting extends React.Component {


    handleCancel = () => {
        this.setState({showOrganisationAdd: false, filteredOrganisations: []});
    };

    openAddDialog = () => {
        this.setState({showOrganisationAdd: true,});
    };

    onSearch = (searchString) => {
        getOrganisationsFromBronnoysund(searchString).then(organisations => {
            this.setState({
                filteredOrganisations: organisations
            });
        });
    };

    onCloseAddOrganisation = (confirmed) => {
        this.setState({
            askToAddOrganisation: false,
        });

        if (confirmed) {
            this.addExitingOrganisation(this.state.organisation);
        }
    };

    askToAddOrganisation = (organisation) => {
        this.setState({
            askToAddOrganisation: true,
            message: `Vil du legge til ${organisation.displayName}?`,
            organisation: organisation,
        });
    };

    addExitingOrganisation = (organisation) => {
        OrganisationApi.createOrganisation(organisation)
            .then(response => {
                this.props.notify(`${organisation.displayName} ble lagt til.`);
                this.props.fetchOrganisations();
                this.onSearch(this.state.searchString);
            }).catch(error => {
            alert(error);
        });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organisations !== prevState.organisations) {
            return {
                organisations: nextProps.organisations,
            };
        }
        return null;
    }

    onChangeSearch = (event) => {
        this.setState({
            searchString: event.target.value,
        });
    };

    onCloseCreateOrganisation = () => {
        this.setState({
            showOrganisationAdd: false,
            filteredOrganisations: []
        });
        this.props.fetchOrganisations()
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            showOrganisationAdd: false,
            filteredOrganisations: [],
            searchString: '',
            askToAddOrganisation: false,
            message: '',
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <InformationMessageBox
                    show={this.state.askToAddOrganisation}
                    message={this.state.message}
                    onClose={this.onCloseAddOrganisation}
                />
                <Button
                    variant="fab" color="secondary"
                    className={classes.addButton}
                    onClick={this.openAddDialog}
                >
                    <Add/>
                </Button>
                <Dialog
                    open={this.state.showOrganisationAdd}
                    aria-labelledby="form-dialog-title"
                    fullWidth
                    classes={{
                        paper: classes.dialog,
                    }}
                >
                    <DialogTitle id="form-dialog-title">
                        <Input
                            autoFocus
                            value={this.state.searchString}
                            placeholder="Søk på organisasjonsnummer"
                            className={classes.searchInput}
                            inputProps={{
                                'aria-label': 'Description',
                            }}
                            onChange={this.onChangeSearch}
                            onKeyUp={() => this.onSearch(this.state.searchString)}
                        />
                        <OrganisationNew
                            notify={this.props.notify}
                            onClose={this.onCloseCreateOrganisation}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <div className={classes.organisationList}>
                            <List>
                                {this.state.filteredOrganisations.map((organisation) =>
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
                                            <IconButton color="secondary" aria-label="Add"
                                                        onClick={() => this.askToAddOrganisation(organisation)}>
                                                <AddIconCircle/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>,
                                )}
                            </List>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} variant="raised" color="primary">
                            Lukk
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


OrganisationAddExisting.propTypes = {
    classes: PropTypes.any.isRequired,
    fetchOrganisations: PropTypes.any.isRequired,
    notify: PropTypes.any.isRequired
};

export default withStyles(styles)(withContext(OrganisationAddExisting));
