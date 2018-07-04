import {apiUrl} from "./apiUrl";

class OrganisationApi {

    static fetchOrganisations() {
        const url = apiUrl + `/api/organisations`;
        return fetch(url, {method: 'GET'}).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }

    static getOrganisations() {
        const url = apiUrl + `/api/organisations`;
        return fetch(url, {method: 'GET'})
            .then(response => Promise.all([response, response.json()]));
    }

    static createOrganisation(organisation) {
        const url = apiUrl + `/api/organisations`;
        const request = new Request(url, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: organisation.name,
                orgNumber: organisation.orgNumber,
                displayName: organisation.displayName,
            })
        });

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static updateOrganisation(organisation) {
        const url = apiUrl + `/api/organisations/${organisation.name}`;
        const request = new Request(url, {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dn: organisation.dn,
                name: organisation.name,
                orgNumber: organisation.orgNumber,
                displayName: organisation.displayName,
            })
        });

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static deleteOrganisation(organisation) {
        const request = new Request(apiUrl + `/api/organisations/${organisation.name}`, {method: 'DELETE'});
        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static getLegalContact(organisation) {
        const url = apiUrl + `/api/organisations/${organisation.name}/contacts/legal`;
        return fetch(url, {method: 'GET'})
            .then(response => {
                return response.json();
            });
    }

    static setLegalContact(organisation, contact) {
        const url = apiUrl + `/api/organisations/${organisation.name}/contacts/legal/${contact.nin}`;
        return fetch(url, {method: 'PUT'})
            .then(response => {
                return response
            }).catch(error => {
                return error
            })
    }

    static unsetLegalContact(organisation, contact) {
        const request = new Request(apiUrl + `/api/organisations/${organisation.name}/contacts/legal/${contact.nin}`, {method: 'DELETE'});
        return fetch(request)
            .then(response => {
                return response;
            }).catch(error => {
                return error;
            });
    }

}

export default OrganisationApi