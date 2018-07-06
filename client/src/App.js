import React, {Component} from 'react';
import './App.css';
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import Main from "./main/Main";
import AppProvider from "./data/context/AppProvider";
import {CookiesProvider} from "react-cookie";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#f05545',
            main: '#b71c1c',
            dark: '#7f0000',
            contrastText: '#fff',
        },
        secondary: {
            light: '#98ee99',
            main: '#66bb6a',
            dark: '#338a3e',
            contrastText: '#000',
        },
    },
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CookiesProvider>
                    <AppProvider>
                        <Main/>
                    </AppProvider>
                </CookiesProvider>
            </MuiThemeProvider>
        );
    }
}

export default App;
