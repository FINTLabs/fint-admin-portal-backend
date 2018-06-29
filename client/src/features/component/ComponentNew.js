import React, {Component} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, withStyles} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ComponentApi from "../../data/api/ComponentApi";
import PropTypes from "prop-types";


const styles = (theme) => ({
    createComponentButton: {
        margin: theme.spacing.unit,
        top: theme.spacing.unit * 10,
        right: theme.spacing.unit * 3,
        position: 'absolute',
    },
    dialogContent: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    }
});

class ComponentNew extends Component {


    constructor(props) {
        super(props);
        this.state = {
            component: {},
            open: false,
        };
    }

    openCreateDialog = () => {
        this.setState({
            open: true,
        })
    };

    handleCancel = () => {
        this.setState({open: false});
    };

    updateComponentState = (event) => {
        const field = event.target.name;

        const component = this.state.component;
        component[field] = event.target.value;
        return this.setState({component: component});
    };

    createComponent = () => {
        console.log(this.state.component);
        ComponentApi.createComponent(this.state.component)
            .then(response => {
                if (response.status === 201) {
                    this.props.notify("Komponenten ble opprettet");
                }
                else {
                    this.props.notify("Komponenten finnes fra før");
                }
                this.setState({open: false});
                this.props.onClose();
            })
            .catch(() => {
                this.props.notify("Det oppsto en feil ved opprettelse av komponenten.");
            });
    };

    isFormValid = () => {
        const component = this.state.component;
        return component.dn && component.name && component.description && component.basePath;
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button onClick={() => this.openCreateDialog()} variant="fab" color="secondary" aria-label="add"
                        className={classes.createComponentButton}>
                    <AddIcon/>
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleCancel}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Komponent</DialogTitle>
                    <DialogContent className={classes.dialogContent}>

                        <TextField
                            name="dn"
                            label="Teknisk navn"
                            required
                            fullWidth
                            onChange={this.updateComponentState}
                        />
                        <TextField
                            name="name"
                            label="Navn"
                            required
                            fullWidth
                            onChange={this.updateComponentState}
                        />
                        <TextField
                            name="description"
                            label="Beskrivelse"
                            required
                            fullWidth
                            onChange={this.updateComponentState}
                        />
                        <TextField
                            name="basePath"
                            label="Sti"
                            required
                            fullWidth
                            onChange={this.updateComponentState}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCancel()} color="primary">
                            Avbryt
                        </Button>
                        <Button disabled={!this.isFormValid()} onClick={() => this.createComponent()} color="primary">
                            Opprett
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

ComponentNew.propTypes = {
    classes: PropTypes.any.isRequired,
    notify: PropTypes.any.isRequired,
    onClose: PropTypes.any.isRequired,
};

export default withStyles(styles)(ComponentNew);