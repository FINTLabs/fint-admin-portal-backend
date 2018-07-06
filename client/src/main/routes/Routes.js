import React from "react";
import {Route} from "react-router-dom";
import Dashboard from "../../features/dashboard/Dashboard";
import OrganisationContainer from "../../features/organisation/OrganisationContainer";
import ContactContainer from "../../features/contact/ContactContainer";
import ComponentContainer from "../../features/component/ComponentContainer";


class Routes extends React.Component {

    render() {
        return (
            <div>
                <Route exact path='/' component={Dashboard}/>
                <Route exact path='/organisations' component={OrganisationContainer}/>
                <Route exact path='/contacts' component={ContactContainer}/>
                <Route exact path='/components' component={ComponentContainer}/>
            </div>
        );
    }
}

export default Routes;
