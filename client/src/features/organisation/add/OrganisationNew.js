import React, {Component} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, withStyles} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import OrganisationApi from "../../../data/api/OrganisationApi";


const styles = (theme) => ({
    createOrganisationButton: {
        margin: theme.spacing.unit,
        top: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
        position: 'absolute',
    },
    dialogContent: {
        marginRight: theme.spacing.unit,
        marginLeft: theme.spacing.unit,
    }
});

class OrganisationNew extends Component {


    constructor(props) {
        super(props);
        this.state = {
            organisation: {},
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

    updateOrganisationState = (event) => {

        const field = event.target.name;

        const organisation = this.state.organisation;
        organisation[field] = event.target.value;
        return this.setState({organisation: organisation});
    };

    createOrganisation = () => {
        OrganisationApi.createOrganisation(this.state.organisation)
            .then(response => {
                if (response.status === 201) {
                    this.props.notify("Kontakten ble opprettet");
                }
                else {
                    this.props.notify("Kontakten finnes fra før");
                }
                this.setState({open: false});
                this.props.onClose();
            })
            .catch(() => {
                this.props.notify("Det oppsto en feil ved opprettelse av kontakten.");
            });
    };

    isFormValid = () => {
        const organisation = this.state.organisation;
        return organisation.dn && organisation.name && organisation.displayName && organisation.orgNumber;
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <Button onClick={() => this.openCreateDialog()} variant="fab" color="secondary" aria-label="add"
                        className={classes.createOrganisationButton}>
                    <AddIcon/>
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleCancel}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Kontakt</DialogTitle>
                    <DialogContent className={classes.dialogContent}>

                        <TextField
                            name="name"
                            label="Navn"
                            required
                            fullWidth
                            onChange={this.updateOrganisationState}
                        />
                        <TextField
                            name="dn"
                            label="Teknisk navn"
                            fullWidth
                            required
                            onChange={this.updateOrganisationState}
                            defaultValue={`ou=,ou=organisations,o=FINT-TEST`}
                        />
                        <TextField
                            name="displayName"
                            label="Vist navn"
                            required
                            fullWidth
                            onChange={this.updateOrganisationState}
                        />
                        <TextField
                            name="orgNumber"
                            label="Organisasjonsnummer"
                            required
                            fullWidth
                            onChange={this.updateOrganisationState}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleCancel()} color="primary">
                            Avbryt
                        </Button>
                        <Button disabled={!this.isFormValid()} onClick={() => this.createOrganisation()} color="primary">
                            Opprett
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

OrganisationNew.propTypes = {
    classes: PropTypes.any.isRequired,
    notify: PropTypes.any.isRequired,
    onClose: PropTypes.any.isRequired,
};

export default withStyles(styles)(OrganisationNew);