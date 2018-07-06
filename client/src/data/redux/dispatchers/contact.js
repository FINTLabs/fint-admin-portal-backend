import {
    createContactSuccess,
    deleteContactSuccess,
    fetchContactsError,
    fetchContactsSuccess,
    updateContactSuccess,
} from "../actions/contact"

import ContactApi from "../../api/ContactApi";

export function fetchContacts(contact) {
    return function (dispatch) {
        return ContactApi.fetchContacts(contact).then(response => {
            dispatch(fetchContactsSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        });
    };
}

export function getContacts() {
    return (dispatch) => {
        return ContactApi.getContacts().then(([response, json]) => {
            if (response.status === 200) {
                dispatch(fetchContactsSuccess(json));
            }
            else {
                dispatch(fetchContactsError());
            }
        })
    }
}

export function createContact(contact) {
    return function (dispatch) {
        return ContactApi.createContact(contact).then(response => {
            dispatch(createContactSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        });
    };
}

export function updateContact(contact) {
    return function (dispatch) {
        return ContactApi.updateContact(contact).then(response => {
            dispatch(updateContactSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        });
    };
}

export function deleteContact(contact) {
    return function (dispatch) {
        return ContactApi.deleteContact(contact).then(() => {
            dispatch(deleteContactSuccess(contact));
        }).catch(error => {
            throw(error);
        })
    }
}