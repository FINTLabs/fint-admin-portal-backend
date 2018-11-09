import React, {Component} from "react";
import {
    Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography,
    withStyles
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import RemoveIcon from "@material-ui/icons/RemoveCircle";
import ComponentIcon from "@material-ui/icons/WebAsset";
import AutoHideNotification from "../../common/AutoHideNotification";
import PropTypes from "prop-types";
import ComponentsView from "./view/ComponentsView";
import {withContext} from "../../data/context/withContext";
import WarningMessageBox from "../../common/WarningMessageBox";
import ComponentApi from "../../data/api/ComponentApi";
import {fetchComponents} from "../../data/redux/dispatchers/component";
import Sort from "../../common/utils/Sort";


const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    componentList: {
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
    addIcon: {
        color: theme.palette.secondary.dark,
    },
    removeIcon: {
        color: theme.palette.primary.light,
    },
});

class ComponentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            askToRemoveComponent: false,
            message: '',
            component: {},
            notify: false,
            notifyMessage: '',
            showComponent: false,
        };
    }

    onCloseNotification = () => {
        this.setState({
            notify: false,
            notifyMessage: '',
        });
    };

    askToRemoveComponent = (component) => {
        this.setState({
            askToRemoveComponent: true,
            message: `Er du sikker på at du vil fjerne ${component.name}?`,
            component: component,
        });
    };

    onCloseRemoveComponent = (confirmed) => {
        this.setState({
            askToRemoveComponent: false,
        });

        if (confirmed) {
            this.removeComponent(this.state.component);
        }
    };

    removeComponent = (component) => {
        ComponentApi.deleteComponent(component).then(() => {
            this.props.notify(`${component.name} ble fjernet.`);
            this.props.fetchComponents();
        }).catch(error => {
            alert(error);
        });
    };

    showComponent = (component) => {
        this.setState({
            showComponent: true,
            component: component,
        });
    };

    onCloseShowComponent = () => {
        this.setState({
            showComponent: false,
        });
        fetchComponents();
    };


    render() {
        const {classes} = this.props;
        const components = this.props.components.sort(Sort.alphabetically);


        return (
            <div className={classes.root}>
                <AutoHideNotification
                    showNotification={this.state.notify}
                    message={this.state.notifyMessage}
                    onClose={this.onCloseNotification}/>
                <WarningMessageBox
                    show={this.state.askToRemoveComponent}
                    message={this.state.message}
                    onClose={this.onCloseRemoveComponent}
                />
                <ComponentsView
                    component={this.state.component}
                    show={this.state.showComponent}
                    onClose={this.onCloseShowComponent}
                />
                <div className={classes.componentList}>
                    <Typography variant="headline" className={classes.title}>Komponenter</Typography>
                    <Divider/>
                    <List>
                        {components.map((component) =>
                            <ListItem className={classes.listItem} key={component.dn}>
                                <ListItemAvatar>
                                    <Avatar className={classes.itemAvatar}>
                                        <ComponentIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={component.description}
                                    secondary={component.basePath}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Remove"
                                                onClick={() => this.askToRemoveComponent(component)}>
                                        <RemoveIcon className={classes.removeIcon}/>
                                    </IconButton>
                                    <IconButton aria-label="Settings" onClick={() => this.showComponent(component)}>
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

ComponentList.propTypes = {
    classes: PropTypes.any.isRequired,
    components: PropTypes.array.isRequired,
    fetchComponents: PropTypes.any.isRequired,
    notify: PropTypes.any.isRequired
};


export default withStyles(styles)(withContext(ComponentList));


