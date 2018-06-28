import OrganisationApi from "../../api/OrganisationApi";
import {
    createOrganisationSuccess,
    deleteOrganisationSuccess,
    fetchLegalContactForOrganisationError,
    fetchLegalContactForOrganisationSuccess,
    fetchOrganisationsError,
    fetchOrganisationsSuccess,
    setLegalContactForOrganisationSuccess,
    unsetLegalContactForOrganisationSuccess,
    updateOrganisationSuccess
} from "../actions/organisation";

export function fetchOrganisations(organisation) {
    return (dispatch) => {
        return OrganisationApi.fetchOrganisations(organisation).then(response => {
            dispatch(fetchOrganisationsSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}

export function getOrganisations() {
    return (dispatch) => {
        return OrganisationApi.getOrganisations().then(([response, json]) => {
            if (response.status === 200) {
                dispatch(fetchOrganisationsSuccess(json));
            }
            else {
                dispatch(fetchOrganisationsError());
            }
        })
    }
}

export function createOrganisation(organisation) {
    return (dispatch) => {
        return OrganisationApi.createOrganisation(organisation).then(response => {
            dispatch(createOrganisationSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}

export function updateOrganisation(organisation) {
    return (dispatch) => {
        return OrganisationApi.updateOrganisation(organisation).then(response => {
            dispatch(updateOrganisationSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}

export function deleteOrganisation(organisation) {
    return (dispatch) => {
        return OrganisationApi.deleteOrganisation(organisation).then(response => {
            dispatch(deleteOrganisationSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}

export function fetchLegalContactForOrganisation(organisation) {
    return (dispatch) => {
        return OrganisationApi.getLegalContact(organisation).then(([response, json]) => {
            if (response.status === 200) {
                dispatch(fetchLegalContactForOrganisationSuccess(json));
            }
            else {
                dispatch(fetchLegalContactForOrganisationError());
            }
        })
    }
}

export function setLegalContactForOrganisation(organisation, contact) {
    return (dispatch) => {
        return OrganisationApi.setLegalContact(organisation, contact).then(response => {
            dispatch(setLegalContactForOrganisationSuccess(response));
        }).catch(error => {
            throw(error);
        })
    }
}

export function unsetLegalContactForOrganisation(organisation, contact) {
    return (dispatch) => {
        return OrganisationApi.unsetLegalContact(organisation, contact).then(response => {
            dispatch(unsetLegalContactForOrganisationSuccess(response));
        }).catch(error => {
            throw(error);
        })
    }
}