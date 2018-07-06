import {apiUrl} from "./apiUrl";

class ComponentApi {

    static fetchComponents() {
        const url = apiUrl + `/api/components`;
        return fetch(url, {method: 'GET'}).then(response => {
                return response.json();
            }).catch(error => {
                return error;
            })
    }

    static getComponents() {
        const url = apiUrl + `/api/components`;
        return fetch(url, {method: 'GET'})
            .then(response => Promise.all([response, response.json()]));
    }

    static createComponent(component) {
        const url = apiUrl + `/api/components`;
        const request = new Request(url, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dn: component.dn,
                name: component.name,
                description: component.description,
                basePath: component.basePath
            })
        });

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static updateComponent(component) {
        const url = apiUrl + `/api/components/${component.name}`;
        const request = new Request(url, {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dn: component.dn,
                name: component.name,
                description: component.description,
                basePath: component.basePath,
            })
        });

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static deleteComponent(component) {
        const url = apiUrl + `/api/components/${component.name}`;
        const request = new Request(url, {method: 'DELETE'});

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }
}

export default ComponentApi