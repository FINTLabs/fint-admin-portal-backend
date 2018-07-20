import {apiUrl} from "./apiUrl";

class ContactApi {

    static fetchContacts() {
        const url = apiUrl + `/api/contacts`;
        const request = new Request(url, {method:'GET'});
        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }

    static getContacts() {
        const url = apiUrl + `/api/contacts`;
        return fetch(url, {method: 'GET'})
            .then(response => Promise.all([response, response.json()]));
    }

    static createContact(contact) {
        const url = apiUrl + `/api/contacts`;
        const request = new Request(url, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nin: contact.nin,
                firstName: contact.firstName,
                lastName: contact.lastName,
                mail: contact.mail,
                mobile: contact.mobile
            })
        });

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static updateContact(contact) {
        const request = new Request(apiUrl + `/api/contacts/${contact.nin}`, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(contact)
        });

        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }

    static deleteContact(contact) {
        const request = new Request(apiUrl + `/api/contacts/${contact.nin}`, {method: 'DELETE'});
        return fetch(request).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }
}

export default ContactApi;
