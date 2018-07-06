import React, {Component} from "react";
import {Avatar, Card, CardContent, CardHeader, Divider, Grid, Typography, withStyles} from "@material-ui/core";
import {green} from "@material-ui/core/colors";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import BusinessIcon from "@material-ui/icons/Business";
import ApiIcon from "@material-ui/icons/WebAsset";
import ContactIcon from "@material-ui/icons/Person";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fetchComponents} from "../../data/redux/dispatchers/component";
import LoadingProgress from "../../common/LoadingProgress";
import {withContext} from "../../data/context/withContext";
import {fetchOrganisations} from "../../data/redux/dispatchers/organisation";
import {fetchContacts} from "../../data/redux/dispatchers/contact";

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
        height: '100%',
    },
    cardContent: {
        textAlign: 'center',
    },
    cardLink: {
        textDecoration: 'none'
    },
    avatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500],
    },
});

class Dashboard extends Component {


    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.fetchOrganisations();
        this.props.fetchContacts();
        this.props.fetchComponents();
    }


    render() {
        const {classes, contacts, organisations, components} = this.props;
        if (contacts && organisations && components) {
            return (
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        <Grid item xs={4}>
                            <Link to="contacts" className={classes.cardLink}>
                                <Card className={classes.card}>
                                    <CardHeader
                                        title="Kontakter"
                                        avatar={
                                            <Avatar className={classes.avatar}>
                                                <ContactIcon className={classes.avatar}/>
                                            </Avatar>
                                        }
                                        subheader="Antall"
                                    />
                                    <Divider/>
                                    <CardContent className={classes.cardContent}>
                                        <Typography type="display4">
                                            {contacts.length}
                                        </Typography>
                                    </CardContent>

                                </Card>
                            </Link>
                        </Grid>
                        <Grid item xs={4}>
                            <Link to="organisations" className={classes.cardLink}>
                                <Card className={classes.card}>
                                    <CardHeader
                                        title="Organisasjon"
                                        avatar={
                                            <Avatar className={classes.avatar}>
                                                <BusinessIcon className={classes.avatar}/>
                                            </Avatar>
                                        }
                                        subheader="Antall"
                                    />
                                    <Divider/>
                                    <CardContent className={classes.cardContent}>
                                        <Typography type="display4">
                                            {organisations.length}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                        <Grid item xs={4}>
                            <Link to="components" className={classes.cardLink}>
                                <Card className={classes.card}>
                                    <CardHeader
                                        title="Komponenter"
                                        avatar={
                                            <Avatar className={classes.avatar}>
                                                <ApiIcon className={classes.avatar}/>
                                            </Avatar>
                                        }
                                        subheader="Antall"
                                    />
                                    <Divider/>
                                    <CardContent className={classes.cardContent}>
                                        <Typography type="display4">
                                            {components.length}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    </Grid>
                </div>

            );
        }
        else {
            return (<LoadingProgress/>)
        }
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        organisations: state.organisation.organisations,
        contacts: state.contact.contacts,
        components: state.component.components,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchOrganisations: fetchOrganisations,
        fetchContacts: fetchContacts,
        fetchComponents: fetchComponents,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withContext(Dashboard)));