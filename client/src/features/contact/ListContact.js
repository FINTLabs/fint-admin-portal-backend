import React from 'react';
import {
    Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography,
    withStyles
} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import SettingsIcon from "@material-ui/icons/Settings";
import ContactIcon from "@material-ui/icons/Person";
import SetLegalIcon from "@material-ui/icons/AccountBalance";

class ListContact extends React.Component {

    render() {
        return (
            <div>
                <Typography variant="headline">Kontakter</Typography>
                <Divider/>
                <List>
                    {this.props.contacts.map((contact) =>
                        <ListItem key={contact.dn}>
                            <ListItemAvatar>
                                <Avatar>
                                    <ContactIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={contact.firstName}
                                secondary={contact.lastName}
                            />
                            <ListItemSecondaryAction>

                                <IconButton aria-label="Remove">
                                    <RemoveIcon/>
                                </IconButton>
                                <IconButton aria-label="Legal">
                                    <SetLegalIcon/>
                                </IconButton>
                                <IconButton aria-label="Settings">
                                    <SettingsIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>,
                    )}
                </List>
            </div>
        );
    }
}

export default withStyles(ListContact)