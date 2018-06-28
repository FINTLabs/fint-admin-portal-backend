import React from "react";
import {Route} from "react-router-dom";
import Dashboard from "../../features/dashboard/Dashboard";
import Organisation from "../../features/organisation/Organisation";
import ContactContainer from "../../features/contact/ContactContainer";
import Component from "../../features/component/Component";


class Routes extends React.Component {

    render() {
        return (
            <div>
                <Route exact path='/' component={Dashboard}/>
                <Route exact path='/organisations' component={Organisation}/>
                <Route exact path='/contacts' component={ContactContainer}/>
                <Route exact path='/components' component={Component}/>
            </div>
        );
    }
}

export default Routes;
