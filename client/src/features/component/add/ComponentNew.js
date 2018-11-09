import React, {Component} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, withStyles} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ComponentApi from "../../../data/api/ComponentApi";
import PropTypes from "prop-types";
import NameValidationInput from "../../../common/NameValidationInput";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";


const styles = (theme) => ({
    createComponentButton: {
        margin: theme.spacing.unit,
        top: theme.spacing.unit * 10,
        right: theme.spacing.unit * 3,
        position: "absolute"
    },
    dialogContent: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit
    }
});

class ComponentNew extends Component {


    constructor(props) {
        super(props);
        this.state = {
            component: {
                /*
                openData: false,
                common: false,
                basePath: '',
                description: '',
                name: '',
                */
            },
            open: false
        };
    }

    openCreateDialog = () => {
        this.setState({
            open: true
        });
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

    updateComponentCheckBoxState = (event) => {
        const field = event.target.name;

        const component = this.state.component;
        component[field] = event.target.checked;
        return this.setState({component: component});
    };

    createComponent = () => {
        ComponentApi.createComponent(this.state.component)
            .then(response => {
                if (response.status === 201) {
                    this.props.notify("Komponenten ble opprettet");
                }
                else if (response.status === 302) {
                    this.props.notify("Komponenten finnes fra før");
                }
                else {
                    this.props.notify("Det oppsto en feil ved opprettelse av komponenten.");
                }
                this.setState({
                    open: false,
                    component: {}
                });
                this.props.onClose();
            })
            .catch(() => {
                this.props.notify("Det oppsto en feil ved opprettelse av komponenten.");
            });
    };

    nameIsValid = (valid) => {
        this.setState({nameIsValid: valid});
    };

    isFormValid = () => {
        const component = this.state.component;
        return this.state.nameIsValid && component.name && component.description && component.basePath;
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
                        <NameValidationInput
                            name="name"
                            title="Navn"
                            required
                            fullWidth
                            onChange={this.updateComponentState}
                            nameIsValid={this.nameIsValid}
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
                        <TextField
                            name="port"
                            label="Port"
                            required
                            fullWidth
                            type="number"
                            onChange={this.updateComponentState}
                        />
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.component.openData}
                                        onChange={this.updateComponentCheckBoxState}
                                    />
                                }
                                name="openData"
                                label="Åpne data"
                            />
                        </FormGroup>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.component.common}
                                        onChange={this.updateComponentCheckBoxState}
                                    />
                                }
                                name="common"
                                label="Felles"
                            />
                        </FormGroup>


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
    onClose: PropTypes.any.isRequired
};

export default withStyles(styles)(ComponentNew);
