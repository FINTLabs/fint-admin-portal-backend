import {
  CREATE_ORGANISATION_SUCCESS,
  DELETE_ORGANISATION_SUCCESS,
  FETCH_LEGAL_CONTACT_FOR_ORGANISATION_ERROR,
  FETCH_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
  FETCH_ORGANISATIONS_ERROR,
  FETCH_ORGANISATIONS_SUCCESS,
  SET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
  UNSET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
  UPDATE_ORGANISATION_SUCCESS
} from "./types"

export function fetchOrganisationsSuccess(payload) {
  return {
    type: FETCH_ORGANISATIONS_SUCCESS,
    payload
  }
}

export function fetchOrganisationsError() {
  return {
    type: FETCH_ORGANISATIONS_ERROR
  }
}

export function createOrganisationSuccess(payload) {
  return {
    type: CREATE_ORGANISATION_SUCCESS,
    payload
  }
}

export function updateOrganisationSuccess(payload) {
  return {
    type: UPDATE_ORGANISATION_SUCCESS,
    payload
  }
}

export function deleteOrganisationSuccess(payload) {
  return {
    type: DELETE_ORGANISATION_SUCCESS,
    payload
  }
}

export function fetchLegalContactForOrganisationSuccess(payload) {
  return {
    type: FETCH_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
    payload
  }
}

export function fetchLegalContactForOrganisationError() {
  return {
    type: FETCH_LEGAL_CONTACT_FOR_ORGANISATION_ERROR
  }
}

export function setLegalContactForOrganisationSuccess(payload) {
  return {
    type: SET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
    payload
  }
}

export function unsetLegalContactForOrganisationSuccess(payload) {
  return {
    type: UNSET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
    payload
  }
}
