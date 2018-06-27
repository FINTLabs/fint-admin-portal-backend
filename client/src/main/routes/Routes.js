import React from "react";
import {Route} from "react-router-dom";
import Dashboard from "../../features/dashboard/Dashboard";
import Organisation from "../../features/Organisation/Organisation";
import Contact from "../../features/Contact/Contact";
import Component from "../../features/Component/Component";


class Routes extends React.Component {

    render() {
        return (
            <div>
                <Route exact path='/' component={Dashboard}/>
                <Route exact path='/organisations' component={Organisation}/>
                <Route exact path='/contacts' component={Contact}/>
                <Route exact path='/components' component={Component}/>
            </div>
        );
    }
}

export default Routes;
