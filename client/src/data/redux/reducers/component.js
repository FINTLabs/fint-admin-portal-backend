import {
    CREATE_COMPONENT_SUCCESS, DELETE_COMPONENT_SUCCESS, FETCH_COMPONENTS_SUCCESS,
    UPDATE_COMPONENT_SUCCESS
} from "../actions/types";

export default function component(state = [], action) {
    switch (action.type) {
        case FETCH_COMPONENTS_SUCCESS:
            return {...state, components: action.payload};
        case CREATE_COMPONENT_SUCCESS:
            return {...state, components: action.payload};
        case UPDATE_COMPONENT_SUCCESS:
            return state;
        case DELETE_COMPONENT_SUCCESS:
            return {...state, components: state.components.filter(component => action.payload !== component)};
        default:
            return state;
    }
}