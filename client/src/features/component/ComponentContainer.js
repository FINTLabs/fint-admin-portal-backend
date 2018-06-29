import React from "react";
import LoadingProgress from "../../common/LoadingProgress";
import ComponentList from "./ComponentList";
import ComponentNew from "./ComponentNew";
import {fetchComponents} from "../../data/redux/dispatchers/component";
import {bindActionCreators} from "redux";
import withStyles from "@material-ui/core/es/styles/withStyles";
import {connect} from "react-redux";
import {withContext} from "../../data/context/withContext";

const styles = () => ({
    root: {},
});


class ComponentContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.fetchComponents();
    }

    notify = (message) => {
        this.setState({
            notify: true,
            notifyMessage: message,
        });
    };

    onCloseComponentNew = () => {
        this.props.fetchComponents();
    };

    notify = (message) => {
        this.setState({
            notify: true,
            notifyMessage: message,
        });
    };

    render() {
        if (this.props.components === undefined) {
            return <LoadingProgress/>;
        } else {
            return this.renderPosts();
        }
    }

    renderPosts() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <ComponentNew
                    notify={this.notify}
                    onClose={this.onCloseComponentNew}
                    afterCreateComponent={this.af}
                />
                <ComponentList
                    notify={this.notify}
                    components={this.props.components}
                    fetchComponents={this.props.fetchComponents}
                />
            </div>
        );
    }
}

ComponentContainer.propTypes = {};

function mapStateToProps(state) {
    return {
        components: state.component.components,
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchComponents: fetchComponents,
    }, dispatch);
}

export default withStyles(styles)(connect(mapStateToProps, matchDispatchToProps)(withContext(ComponentContainer)));
