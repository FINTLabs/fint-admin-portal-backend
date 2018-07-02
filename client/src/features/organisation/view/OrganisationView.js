import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import OrganisationApi from "../../../data/api/OrganisationApi";

class OrganisationView extends Component {


    constructor(props) {
        super(props);
        this.state = {
            open: props.show,
            organisation: props.organisation,
        };

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps !== prevState) {
            return {
                open: nextProps.show,
                organisation: nextProps.organisation,
            };
        }

        return null;
    }

    handleCancel = () => {
        //this.setState({open: false,});
        this.props.onClose();
    };

    updateOrganisationState = (event) => {
        const field = event.target.name;

        const organisation = this.state.organisation;
        organisation[field] = event.target.value;
        return this.setState({organisation: organisation});
    };

    updateOrganisation = () => {
        OrganisationApi.updateOrganisation(this.state.organisation)
            .then(response => {
                this.props.notify("Organisasjonen ble oppdatert.");
                this.props.onClose();
            })
            .catch(error => {
            });

    };

    render() {
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleCancel}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Organisasjon</DialogTitle>
                    <DialogContent>

                        <TextField
                            name="name"
                            label="Navn"
                            required
                            fullWidth
                            value={this.state.organisation.name}
                            onChange={this.updateOrganisationState}
                        />
                        <TextField
                            name="dn"
                            label="Teknisk navn"
                            required
                            fullWidth
                            value={this.state.organisation.dn}
                            onChange={this.updateOrganisationState}
                        />
                        <TextField
                            name="displayName"
                            label="Vist navn"
                            required
                            fullWidth
                            value={this.state.organisation.displayName}
                            onChange={this.updateOrganisationState}
                        />
                        <TextField
                            name="orgNumber"
                            label="Organisasjonsnummer"
                            required
                            fullWidth
                            value={this.state.organisation.orgNumber}
                            onChange={this.updateOrganisationState}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCancel()} color="primary">
                            Avbryt
                        </Button>
                        <Button onClick={() => this.updateOrganisation()} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

OrganisationView.propTypes = {
    organisation: PropTypes.any.isRequired,
    onClose: PropTypes.any.isRequired,
    show: PropTypes.any.isRequired
};

export default OrganisationView;