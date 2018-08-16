import React from "react";
import {FormControl, FormHelperText, Input, InputLabel, withStyles} from "@material-ui/core";
import PropTypes from "prop-types";


const styles = () => {
};

class DomainNameValidationInput extends React.Component {

    onChangeUsername = (event) => {
        let username = event.target.value;
        let usernameValidator = new RegExp("^[a-z0-9.]{3,128}$");
        let valid = usernameValidator.test(username);

        this.setState({
            usernameValid: valid,
        });

        this.props.nameIsValid(valid);
        this.props.onChange(event);
    };

    constructor(props) {
        super(props);
        this.state = {
            usernameValid: true,

        };
    }

    render() {
        const {name, title} = this.props;
        return (
            <FormControl fullWidth error={!this.state.usernameValid} required>
                <InputLabel htmlFor="password">{title}</InputLabel>
                <Input
                    autoFocus
                    fullWidth
                    name={name}
                    onChange={this.onChangeUsername}
                />
                <FormHelperText>{this.state.usernameValid ? '' : 'Navnet kan bare inneholde a-z, og . (punktum). Det kan fra 3-128 tegn langt.'}</FormHelperText>
            </FormControl>
        );
    }
}

DomainNameValidationInput.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    nameIsValid: PropTypes.func.isRequired,
};
export default withStyles(styles)(DomainNameValidationInput);
