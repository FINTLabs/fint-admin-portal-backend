import React from "react";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import ComponentApi from "../../../data/api/ComponentApi";
import Checkbox from "@material-ui/core/Checkbox";


const styles = (theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.secondary.main,
  },
  endpointMainTitle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    paddingTop: theme.spacing.unit * 5,
  },
  endpointsCell: {
    paddingLeft: theme.spacing.unit * 5,
  },
  dialogContent: {
    marginTop: theme.spacing.unit * 5,
  },
  table: {
  }
});

class ComponentsView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: props.show,
      component: props.component
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.show !== prevState.show) {
      return {
        open: nextProps.show,
        component: nextProps.component
      };
    }
    return null;
  }

  handleCancel = () => {
    this.setState({open: false,});
    this.props.onClose();
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
    console.log(JSON.stringify(component));
    return this.setState({ component: component });
  };

  updateComponent = () => {
    ComponentApi.updateComponent(this.state.component)
      .then(response => {
        this.props.notify("Komponenten ble oppdatert.");
        this.props.onClose();
      })
      .catch(error => {
      });
    this.props.onClose();
  };


  isFormValid = () => {
    const component = this.state.component;
    return component.dn && component.name && component.description && component.basePath;
  };

  render() {
    const {classes} = this.props;
    const component = Object.assign({}, this.props.component);
    return (
      <div>
        <div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
          >
            <DialogTitle id="form-dialog-title"
                         className={classes.dialogTitle}>{component.description}</DialogTitle>
            <DialogContent
              className={classes.dialogContent}>


              <Table className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell variant='head'>Navn</TableCell>
                    <TableCell variant='body'>{this.state.component.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Beskrivelse</TableCell>
                    <TableCell variant='body'>
                      <TextField
                        name="description"
                        label="Beskrivelse"
                        required
                        fullWidth
                        value={this.state.component.description}
                        onChange={this.updateComponentState}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Sti</TableCell>
                    <TableCell variant='body'>
                      <TextField
                        name="basePath"
                        label="Sti"
                        required
                        fullWidth
                        value={this.state.component.basePath}
                        onChange={this.updateComponentState}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Port</TableCell>
                    <TableCell variant='body'>
                      <TextField
                        name="port"
                        label="Port"
                        required
                        fullWidth
                        type="number"
                        value={this.state.component.port}
                        onChange={this.updateComponentState}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Åpne data</TableCell>
                    <TableCell variant='body'>
                      <Checkbox
                        name="openData"
                        checked={this.state.component.openData}
                        onChange={this.updateComponentCheckBoxState}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'>Felles</TableCell>
                    <TableCell variant='body'>
                      <Checkbox
                        name="common"
                        checked={this.state.component.common}
                        onChange={this.updateComponentCheckBoxState}
                      />
                    </TableCell>
                  </TableRow>


                  <TableRow>
                    <TableCell variant='head' colSpan={2}
                               className={classes.endpointMainTitle}>Endepunkter</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'
                               className={classes.endpointsCell}>Produksjon</TableCell>
                    <TableCell variant='body'><a target="_blank"
                                                 href={`https://api.felleskomponent.no${component.basePath}`}>https://api.felleskomponent.no{component.basePath}</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' className={classes.endpointsCell}>Beta</TableCell>
                    <TableCell variant='body'><a target="_blank"
                                                 href={`https://beta.felleskomponent.no${component.basePath}`}>https://beta.felleskomponent.no{component.basePath}</a></TableCell>
                  </TableRow>
                  <TableRow>

                    <TableCell variant='head'
                               className={classes.endpointsCell}>Play-with-FINT</TableCell>
                    <TableCell variant='body'><a target="_blank"
                                                 href={`https://play-with-fint.felleskomponent.no${component.basePath}`}>https://play-with-fint.felleskomponent.no{component.basePath}</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' colSpan={2}
                               className={classes.endpointMainTitle}>Swagger</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'
                               className={classes.endpointsCell}>Produksjon</TableCell>
                    <TableCell variant='body'><a target="_blank"
                                                 href={`https://api.felleskomponent.no${component.basePath}/swagger-ui.html`}>https://api.felleskomponent.no{component.basePath}/swagger-ui.html</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head' className={classes.endpointsCell}>Beta</TableCell>
                    <TableCell variant='body'><a target="_blank"
                                                 href={`https://beta.felleskomponent.no${component.basePath}/swagger-ui.html`}>https://beta.felleskomponent.no{component.basePath}/swagger-ui.html</a></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant='head'
                               className={classes.endpointsCell}>Play-with-FINT</TableCell>
                    <TableCell variant='body'><a target="_blank"
                                                 href={`https://play-with-fint.felleskomponent.no${component.basePath}/swagger-ui.html`}>https://play-with-fint.felleskomponent.no{component.basePath}/swagger-ui.html</a></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.handleCancel()} color="primary">
                Avbryt
              </Button>
              <Button disabled={!this.isFormValid()} onClick={() => this.updateComponent()} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    )

  }
}


ComponentsView.propTypes = {
  show: PropTypes.bool.isRequired,
  component: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default withStyles(styles)(ComponentsView);
