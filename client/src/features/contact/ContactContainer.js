import React from "react";
import ListContact from "./ListContact";


class ContactContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            contacts: this.props.contacts
        }
    }

    render() {
        console.log(this.props.contacts, 'hei');
        return (
            <div>
                <ListContact contacts={this.props.contacts}/>
            </div>
        );
    }
}

export default ContactContainer