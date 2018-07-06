import React from "react";
import Button from "@material-ui/core/Button";
import {
    Avatar, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, List, ListItem, ListItemAvatar,
    ListItemSecondaryAction, ListItemText, withStyles,
} from "@material-ui/core";
import ContactIcon from "@material-ui/icons/Person";
import AddIconCircle from "@material-ui/icons/AddCircle";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import OrganisationApi from "../../../data/api/OrganisationApi";
import InformationMessageBox from "../../../common/InformationMessageBox";
import PropTypes from "prop-types";
import {withContext} from "../../../data/context/withContext";

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
    contactList: {
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
    removeIcon: {
        color: theme.palette.primary.light,
    },
});

class OrganisationAddLegalContact extends React.Component {

    onSearch = (searchString) => {
        let contacts = this.props.contacts;
        if (contacts) {
            this.setState({
                filteredContacts: contacts.filter(c =>
                    //c.firstName.toLowerCase().includes(searchString.toLowerCase())
                    c.nin === searchString
                    || c.lastName.toLowerCase().includes(searchString.toLowerCase())
                ),
            });
        }
    };

    onCloseAddContact = (confirmed) => {
        this.setState({
            askToAddContact: false,
        });

        if (confirmed) {
            this.setLegalContact(this.props.organisation, this.state.contact);
        }
    };

    askToAddContact = (contact) => {
        this.setState({
            askToAddContact: true,
            message: `Vil du sette ${contact.firstName} ${contact.lastName} som juridisk kontakt?`,
            contact: contact,
        });
    };

    setLegalContact = (organisation, contact) => {
        OrganisationApi.setLegalContact(organisation, contact)
            .then(response => {
                this.props.notify(`${contact.firstName} ${contact.lastName} ble satt som juridisk kontakt.`);
                this.props.fetchContacts();
                this.onSearch(this.state.searchString);
            }).catch(error => {
            alert(error);
        });
    };

    askToRemoveLegalContact = (contact) => {
        this.setState({
            askToRemoveLegalContact: true,
            message: `Vil du fjerne ${contact.firstName} ${contact.lastName} som juridisk kontakt?`,
            contact: contact,
        });
    };

    onCloseRemoveLegalContact = (confirmed) => {
        this.setState({
            askToRemoveLegalContact: false,
        });

        if (confirmed) {
            this.unsetLegalContact(this.props.organisation, this.state.contact);
        }
    };

    unsetLegalContact = (organisation, contact) => {
        OrganisationApi.unsetLegalContact(organisation, contact).then(response => {
            this.props.notify(`${contact.firstName} ${contact.lastName} er ikke lenger juridisk kontakt.`);
            this.props.fetchContacts();
            this.onSearch(this.state.searchString);
            this.setState({
                currentLegalContact: {},
                searchString: ''
            })
        })
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.contacts !== prevState.contacts) {
            return {
                contacts: nextProps.contacts,
            };
        }

        if (nextProps.currentLegalContact !== prevState.currentLegalContact) {
            return {
                currentLegalContact: nextProps.currentLegalContact,
            };
        }

        return null;
    }

    onChangeSearch = (event) => {
        this.setState({
            searchString: event.target.value,
        });
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            contacts: [],
            organisation: props.organisation,
            filteredContacts: [],
            searchString: '',
            askToAddContact: false,
            askToRemoveLegalContact: false,
            message: '',
            currentLegalContact: props.currentLegalContact,
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <InformationMessageBox
                    show={this.state.askToAddContact}
                    message={this.state.message}
                    onClose={this.onCloseAddContact}
                />
                <InformationMessageBox
                    show={this.state.askToRemoveLegalContact}
                    message={this.state.message}
                    onClose={this.onCloseRemoveLegalContact}
                />
                <Dialog
                    open={this.props.show}
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
                            placeholder="Søk på etternavn"
                            className={classes.searchInput}
                            inputProps={{
                                'aria-label': 'Description',
                            }}
                            onChange={this.onChangeSearch}
                            onKeyUp={() => this.onSearch(this.state.searchString)}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <div className={classes.contactList}>

                            {this.state.currentLegalContact.dn ?
                                (<List>
                                    <ListItem className={classes.listItem} key={this.state.currentLegalContact.dn}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.itemAvatar}>
                                                <ContactIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={this.state.currentLegalContact.firstName}
                                            secondary={this.state.currentLegalContact.lastName}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton color="secondary" aria-label="Add"
                                                        onClick={() => this.askToRemoveLegalContact(this.state.currentLegalContact)}>
                                                <RemoveIcon className={classes.removeIcon}/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>)
                                :
                                (<div/>)
                            }


                            <List>
                                {this.state.filteredContacts.map((contact) =>
                                    <ListItem className={classes.listItem} key={contact.dn}>
                                        <ListItemAvatar>
                                            <Avatar className={classes.itemAvatar}>
                                                <ContactIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={contact.firstName}
                                            secondary={contact.lastName}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton color="secondary" aria-label="Add"
                                                        onClick={() => this.askToAddContact(contact)}>
                                                <AddIconCircle/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>,
                                )}
                            </List>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} variant="raised" color="primary">
                            Lukk
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


OrganisationAddLegalContact.propTypes = {
    organisation: PropTypes.any.isRequired,
    classes: PropTypes.any.isRequired,
    fetchContacts: PropTypes.any.isRequired,
    notify: PropTypes.any.isRequired,
    show: PropTypes.any.isRequired,
    onClose: PropTypes.any.isRequired,
    currentLegalContact: PropTypes.any,
    contacts: PropTypes.any,
};

export default withStyles(styles)(withContext(OrganisationAddLegalContact));