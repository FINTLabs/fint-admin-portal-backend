import React from "react";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BusinessIcon from "@material-ui/icons/Business";
import ContactsIcon from "@material-ui/icons/Contacts";
import ViewCompactIcon from "@material-ui/icons/ViewCompact";
import {Link} from "react-router-dom";

const menuLink = {
    textDecoration: 'none'
};

export const MENU_ITEMS = (
    <div>
        <Link to="/" style={menuLink}>
            <ListItem button>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItem>
        </Link>
        <Link to="/organisations" style={menuLink}>
            <ListItem button>
                <ListItemIcon>
                    <BusinessIcon/>
                </ListItemIcon>
                <ListItemText primary="Organisations"/>
            </ListItem>
        </Link>
        <Link to="/contacts" style={menuLink}>
            <ListItem button>
                <ListItemIcon>
                    <ContactsIcon/>
                </ListItemIcon>
                <ListItemText primary="Contacts"/>
            </ListItem>
        </Link>
        <Link to="/components" style={menuLink}>
            <ListItem button>
                <ListItemIcon>
                    <ViewCompactIcon/>
                </ListItemIcon>
                <ListItemText primary="Components"/>
            </ListItem>
        </Link>
    </div>
);