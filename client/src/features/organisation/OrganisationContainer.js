import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withContext} from "../../data/context/withContext";
import withStyles from "@material-ui/core/es/styles/withStyles";
import {fetchOrganisations} from "../../data/redux/dispatchers/organisation";
import LoadingProgress from "../../common/LoadingProgress";
import AutoHideNotification from "../../common/AutoHideNotification";
import OrganisationList from "./OrganisationList";
import {bindActionCreators} from "redux";
import OrganisationAddExisting from "./add/OrganisationAddExisting";
import {fetchContacts} from "../../data/redux/dispatchers/contact";

const styles = () => ({
    root: {}
});

class OrganisationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: this.props.contacts,
            organisations: this.props.organisations,
            notify: false,
            notifyMessage: "",
        };
    }

    componentDidMount() {
        this.props.fetchOrganisations();
        this.props.fetchContacts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.context !== this.props.context) {
            this.props.fetchOrganisations();
            this.props.fetchContacts();
        }
    }

    notify = (message) => {
        this.setState({
            notify: true,
            notifyMessage: message,
        });
    };

    onCloseNotification = () => {
        this.setState({
            notify: false,
            notifyMessage: '',
        });
    };

    render() {
        if (this.props.organisations === undefined || this.props.contacts === undefined) {
            return <LoadingProgress/>;
        } else {
            return this.renderPosts();
        }
    }

    renderPosts() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <AutoHideNotification
                    showNotification={this.state.notify}
                    message={this.state.notifyMessage}
                    onClose={this.onCloseNotification}
                />
                <OrganisationAddExisting
                    notify={this.notify}
                    fetchOrganisations={this.props.fetchOrganisations}
                />
                <OrganisationList
                    notify={this.notify}
                    organisations={this.props.organisations}
                    fetchOrganisations={this.props.fetchOrganisations}
                    contacts={this.props.contacts}
                    fetchContacts={this.props.fetchContacts}
                />
            </div>
        );
    }
}

OrganisationContainer.propTypes = {
    classes: PropTypes.any,
    contacts: PropTypes.any,
    organisations: PropTypes.any,
    fetchOrganisations: PropTypes.func,
    fetchContacts: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        organisations: state.organisation.organisations,
        contacts: state.contact.contacts,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchOrganisations: fetchOrganisations,
        fetchContacts: fetchContacts,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withContext(OrganisationContainer)));