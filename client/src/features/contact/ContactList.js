import React from 'react';
import PropTypes from "prop-types";
import {
    Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography,
    withStyles
} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import ContactIcon from "@material-ui/icons/Person";
import WarningMessageBox from "../../common/WarningMessageBox";
import ContactApi from "../../data/api/ContactApi";
import ContactView from "./view/ContactView";
import {withContext} from "../../data/context/withContext";
import Sort from "../../common/utils/Sort";

const styles = (theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    contactList: {
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
});

class ContactList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            askToRemoveContact: false,
            showContact: false,
            contact: {},
            message: ''
        };
    }

    askToRemoveContact = (contact) => {
        this.setState({
            askToRemoveContact: true,
            message: `Er du sikker på at du vil fjerne ${contact.firstName} ${contact.lastName}?`,
            contact: contact,
        });
    };

    onCloseRemoveContact = (confirmed) => {
        this.setState({
            askToRemoveContact: false,
        });

        if (confirmed) {
            this.removeContact(this.state.contact);
        }
    };

    removeContact = (contact) => {
        ContactApi.deleteContact(contact).then(() => {
            this.props.notify(`${contact.firstName} ${contact.lastName} ble fjernet.`);
            this.props.fetchContacts();
        }).catch(error => {
            alert(error);
        });
    };

    showContactView = (contact) => {
        this.setState({
            contact: contact,
            showContact: true,
        });
    };

    onCloseContactView = () => {
        this.setState({
            showContact: false,
        });
    };

    render() {
        const {classes} = this.props;
        const contacts = this.props.contacts.sort(Sort.alphabetically);

        return (
            <div className={classes.root}>
                <WarningMessageBox
                    show={this.state.askToRemoveContact}
                    message={this.state.message}
                    onClose={this.onCloseRemoveContact}
                />
                <ContactView
                    contact={this.state.contact}
                    onClose={this.onCloseContactView}
                    show={this.state.showContact}
                    notify={this.props.notify}
                />
                <div className={classes.contactList}>
                    <Typography variant="headline" className={classes.title}>Kontakter</Typography>
                    <Divider/>
                    <List>
                        {contacts.map((contact) =>
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
                                    <IconButton aria-label="Remove" onClick={() => this.askToRemoveContact(contact)}>
                                        <RemoveIcon className={classes.removeIcon}/>
                                    </IconButton>
                                    <IconButton aria-label="Settings" onClick={() => this.showContactView(contact)}>
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

ContactList.propTypes = {
    fetchContacts: PropTypes.any.isRequired,
    contacts: PropTypes.array.isRequired,
    notify: PropTypes.any.isRequired,
    afterUpdateContact: PropTypes.func.isRequired,
};

export default withStyles(styles)(withContext(ContactList))