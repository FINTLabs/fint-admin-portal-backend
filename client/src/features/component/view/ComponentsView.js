import React from "react";
import Button from "@material-ui/core/Button";
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Table, TableCell, TableRow,
    withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import {TableBody, TextField} from "@material-ui/core";
import ComponentApi from "../../../data/api/ComponentApi";


const styles = (theme) => ({
    dialogTitle: {
        backgroundColor: theme.palette.secondary.main,
    },
    endpointMainTitle: {
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    endpointsCell: {
        paddingLeft: theme.spacing.unit * 5,
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
                                     className={classes.dialogTitle}>Komponent: {component.description}</DialogTitle>
                        <DialogContent>

                            <Table className={classes.table}>
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant='head'>Navn</TableCell>
                                        <TableCell variant='body'>
                                            <TextField
                                                name="name"
                                                label="Navn"
                                                required
                                                fullWidth
                                                value={this.state.component.name}
                                                onChange={this.updateComponentState}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant='head'>dn</TableCell>
                                        <TableCell variant='body'>
                                            <TextField
                                                name="dn"
                                                label="dn"
                                                disabled
                                                fullWidth
                                                value={this.state.component.dn}
                                            />
                                        </TableCell>
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
