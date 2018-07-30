import React, {Component} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import OrganisationApi from "../../../data/api/OrganisationApi";
import PropTypes from "prop-types";


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
        alert(error)
      });
  };

  renderDialog() {

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
              label="Teknisk navn"
              disabled
              fullWidth
              value={this.state.organisation.name}
              onChange={this.updateOrganisationState}
            />
            <TextField
              name="displayName"
              label="Visningsnavn"
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
            <TextField
              name="primaryAsset"
              label="Primær ressurs"
              disabled
              fullWidth
              value={this.state.organisation.primaryAssetId !== null ? this.state.organisation.primaryAssetId : 'Ikke tilgjengelig'}
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
  };

  render() {
    return this.renderDialog();
  };
}

OrganisationView.propTypes = {
  organisation: PropTypes.any.isRequired,
  onClose: PropTypes.any.isRequired,
  show: PropTypes.any.isRequired
};

export default OrganisationView;
