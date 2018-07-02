import React from "react";
import {connect} from "react-redux";
import {withContext} from "../../data/context/withContext";
import withStyles from "@material-ui/core/es/styles/withStyles";
import {fetchOrganisations} from "../../data/redux/dispatchers/organisation";
import LoadingProgress from "../../common/LoadingProgress";
import AutoHideNotification from "../../common/AutoHideNotification";
import OrganisationList from "./OrganisationList";
import OrganisationNew from "./add/OrganisationNew";
import {bindActionCreators} from "redux";

const styles = () => ({
    root: {}
});

class OrganisationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notify: false,
            notifyMessage: "",
        };
    }

    componentDidMount() {
        this.props.fetchOrganisations();
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

    onCloseOrganisationNew = () => {
        this.props.fetchOrganisations();
    };

    render() {
        if (this.props.organisations === undefined) {
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
                <OrganisationNew
                    notify={this.notify}
                    onClose={this.onCloseOrganisationNew}
                />
                <OrganisationList
                    notify={this.notify}
                    organisations={this.props.organisations}
                    fetchOrganisations={this.props.fetchOrganisations}
                />
            </div>
        );
    }
}

OrganisationContainer.propTypes = {};

function mapStateToProps(state) {
    return {
        organisations: state.organisation.organisations,
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchOrganisations: fetchOrganisations,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, matchDispatchToProps)(withContext(OrganisationContainer)));