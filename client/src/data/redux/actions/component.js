import {
    CREATE_COMPONENT_SUCCESS,
    DELETE_COMPONENT_SUCCESS,
    FETCH_COMPONENTS_ERROR,
    FETCH_COMPONENTS_SUCCESS,
    UPDATE_COMPONENT_SUCCESS
} from "./types"

export function fetchComponentsSuccess(payload) {
    return {
        type: FETCH_COMPONENTS_SUCCESS,
        payload
    }
}

export function fetchComponentsError() {
    return {
        type: FETCH_COMPONENTS_ERROR
    }
}

export function createComponentSuccess(payload) {
    return {
        type: CREATE_COMPONENT_SUCCESS,
        payload
    }
}

export function updateComponentSuccess(payload) {
    return {
        type: UPDATE_COMPONENT_SUCCESS,
        payload
    }
}

export function deleteComponentSuccess(payload) {
    return {
        type: DELETE_COMPONENT_SUCCESS,
        payload
    }
}
