import {
    CREATE_ORGANISATION_SUCCESS, DELETE_ORGANISATION_SUCCESS, FETCH_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
    FETCH_ORGANISATIONS_SUCCESS, SET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS,
    UNSET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS, UPDATE_ORGANISATION_SUCCESS
} from "../actions/types";

export default function organisation(state = [], action) {
    switch (action.type) {
        case FETCH_ORGANISATIONS_SUCCESS:
            return {...state, organisations: action.payload};
        case CREATE_ORGANISATION_SUCCESS:
            return {...state, organisations: action.payload};
        case UPDATE_ORGANISATION_SUCCESS:
            return state;
        case DELETE_ORGANISATION_SUCCESS:
            return {...state, organisations: state.organisations.filter(organisation => action.payload !== organisation)};
        case FETCH_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS:
            return {...state, legalContact: action.payload};
        case SET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS:
            return {...state, legalContact: action.payload};
        case UNSET_LEGAL_CONTACT_FOR_ORGANISATION_SUCCESS:
            return {...state, legalContact: state.legalContact.filter(legalContact => action.payload !== legalContact)};
        default:
            return state
    }
}