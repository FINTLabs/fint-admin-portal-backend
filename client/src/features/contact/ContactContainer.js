import React from "react";
import {withStyles} from "@material-ui/core";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {fetchContacts} from "../../data/redux/dispatchers/contact";
import {connect} from "react-redux";
import {withContext} from "../../data/context/withContext";
import LoadingProgress from "../../common/LoadingProgress";
import AutoHideNotification from "../../common/AutoHideNotification";
import ContactList from "./ContactList";
import ContactNew from "./add/ContactNew";

const styles = () => ({
    root: {}
});

class ContactContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contacts: this.props.contacts,
            notify: false,
            notifyMessage: '',
        }
    }

    componentDidMount() {
        this.props.fetchContacts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.context !== this.props.context) {
            this.props.fetchContacts();
        }
    }

    afterUpdateContact = () => {
        this.fetchContacts();
    };

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

    onCloseContactNew = () => {
        this.props.fetchContacts();
    };

    render() {
        if (this.props.contacts === undefined) {
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
                <ContactList
                    contacts={this.props.contacts}
                    fetchContacts={this.props.fetchContacts}
                    afterUpdateContact={this.afterUpdateContact}
                    notify={this.notify}
                />
                <ContactNew
                    notify={this.notify}
                    onClose={this.onCloseContactNew}
                    afterCreateContact={this.props.fetchContacts}
                />
            </div>
        );
    }
}

ContactContainer.propTypes = {
    classes: PropTypes.any,
    contacts: PropTypes.any,
    fetchContacts: PropTypes.any,
};

function mapStateToProps(state) {
    return {
        contacts: state.contact.contacts,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchContacts: fetchContacts,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withContext(ContactContainer)));