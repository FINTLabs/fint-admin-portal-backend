import {
    CREATE_CONTACT_SUCCESS,
    DELETE_CONTACT_SUCCESS,
    FETCH_CONTACTS_ERROR,
    FETCH_CONTACTS_SUCCESS,
    UPDATE_CONTACT_SUCCESS
} from "./types"

export function fetchContactsSuccess(payload) {
    return {
        type: FETCH_CONTACTS_SUCCESS,
        payload
    }
}

export function fetchContactsError() {
    return {
        type: FETCH_CONTACTS_ERROR
    }
}

export function createContactSuccess(payload) {
    return {
        type: CREATE_CONTACT_SUCCESS,
        payload
    }
}

export function updateContactSuccess(payload) {
    return {
        type: UPDATE_CONTACT_SUCCESS,
        payload
    }
}

export function deleteContactSuccess(payload) {
    return {
        type: DELETE_CONTACT_SUCCESS,
        payload
    }
}