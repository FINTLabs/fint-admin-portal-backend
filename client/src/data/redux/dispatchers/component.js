import {
    createComponentSuccess,
    deleteComponentSuccess,
    fetchComponentsError,
    fetchComponentsSuccess,
    updateComponentSuccess
} from "../actions/component";
import ComponentApi from "../../api/ComponentApi";

export function fetchComponents() {
    return (dispatch) => {
        return ComponentApi.fetchComponents().then(response => {
            dispatch(fetchComponentsSuccess(response));
        }).catch(error => {
            throw(error);
        })
    }
}

export function getComponents() {
    return (dispatch) => {
        return ComponentApi.getComponents().then(([response, json]) => {
            if (response.status === 200) {
                dispatch(fetchComponentsSuccess(json));
            }
            else {
                dispatch(fetchComponentsError());
            }
        })
    }
}

export function createComponent(component) {
    return (dispatch) => {
        return ComponentApi.createComponent(component).then(response => {
            dispatch(createComponentSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}

export function updateComponent(component) {
    return (dispatch) => {
        return ComponentApi.updateComponent(component).then(response => {
            dispatch(updateComponentSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}

export function deleteComponent(component) {
    return (dispatch) => {
        return ComponentApi.deleteComponent(component).then(response => {
            dispatch(deleteComponentSuccess(response));
            return response;
        }).catch(error => {
            throw(error);
        })
    }
}