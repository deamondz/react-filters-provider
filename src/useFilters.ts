import { ReactNode, useEffect, useMemo, useReducer } from 'react';

import {
    defaultInitialFilterValues,
    defaultIsEmbedded,
    defaultShouldGetFilterValuesFromLocation,
} from './defaults';
import { useTableConfig, useTableProps } from './contexts';


export type FiltersValueType = null | string | number | boolean;

export type FiltersValuesType = {
    [filterName: string]: FiltersValueType;
};

export type FiltersStateType = {
    tmpFilters: FiltersValuesType;
    appliedFilters: FiltersValuesType;
    shouldUpdateUrl: boolean;
};

export type FilterActionType =
    | {
        type: ACTIONS.SET_FILTER;
        payload: { name: string; value: FiltersValueType }
      }
    | {
        type: ACTIONS.SET_FILTERS;
        payload: FiltersValuesType
      }
    | {
          type: ACTIONS.SET_AND_APPLY_FILTERS;
          payload: FiltersValuesType;
      }
    | {
        type: ACTIONS.RESET_FILTERS;
        payload: FiltersValuesType;
      }
    | {
          type: ACTIONS.APPLY_FILTER;
          payload: { name: string; value: FiltersValueType };
      }
    | {
        type: ACTIONS.APPLY_FILTERS;
      }
    | {
        type: ACTIONS.SET_SHOULD_UPDATE_URL;
        payload: boolean;
      };

export enum ACTIONS {
    SET_FILTER = 'SET_FILTER',
    SET_FILTERS = 'SET_FILTERS',
    SET_AND_APPLY_FILTERS = 'SET_AND_APPLY_FILTERS',
    RESET_FILTERS = 'RESET_FILTERS',
    APPLY_FILTER = 'APPLY_FILTER',
    APPLY_FILTERS = 'APPLY_FILTERS',
    SET_SHOULD_UPDATE_URL = 'SET_SHOULD_UPDATE_URL'
}

function generateInitialFilters(filterValues: FiltersValuesType) {
    return {
        tmpFilters: filterValues,
        appliedFilters: filterValues,
        shouldUpdateUrl: false,
    };
}

function filtersReducer(state: FiltersStateType, action: FilterActionType) {
    switch (action.type) {
        // Изменение текущего фильтра
        case ACTIONS.SET_FILTER: {
            const { name, value } = action.payload;

            return {
                ...state,
                tmpFilters: {
                    ...state.tmpFilters,
                    [name]: value,
                },
            };
        }

        // Изменение нескольких текущих фильтров
        case ACTIONS.SET_FILTERS: {
            return {
                ...state,
                tmpFilters: {
                    ...state.tmpFilters,
                    ...action.payload,
                },
            };
        }

        // Установить значения всем фильтрам
        case ACTIONS.SET_AND_APPLY_FILTERS: {
            const newValues = { ...action.payload };

            if (!('page' in action.payload)) {
                newValues['page'] = 1;
            }

            return {
                ...state,
                appliedFilters: newValues,
                tmpFilters: newValues,
                shouldUpdateUrl: true,
            };
        }

        // Вернуть фильтры в начальное положение
        case ACTIONS.RESET_FILTERS: {
            const newValues = generateInitialFilters(action.payload);

            return {
                ...newValues, 
                shouldUpdateUrl: true,
            };
        }

        // Изменить применённый фильтр
        case ACTIONS.APPLY_FILTER: {
            const { name, value } = action.payload;
            const newValues = {
                ...state.appliedFilters,
                [name]: value,
            };

            if (name !== 'page') {
                newValues['page'] = 1;
            }

            return {
                ...state,
                appliedFilters: newValues,
                shouldUpdateUrl: true,
            };
        }

        // Применить текущие фильтры
        case ACTIONS.APPLY_FILTERS: {
            const newValues = state.tmpFilters;

            return {
                ...state,
                appliedFilters: newValues,
                shouldUpdateUrl: true,
            };
        }

        case ACTIONS.SET_SHOULD_UPDATE_URL: {
            return {
                ...state,
                shouldUpdateUrl: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export type UseFiltersActionsType = {
    setFilter: (name: string, value: FiltersValueType) => void;
    setFilters: (values: FiltersValuesType) => void;
    setAndApplyFilters: (values: FiltersValuesType) => void;
    applyFilter: (name: string, value: FiltersValueType) => void;
    applyFilters: () => void;
    resetFilters: () => void;
};

export type UseFiltersType = [FiltersStateType, UseFiltersActionsType];

export function useFilters(): UseFiltersType {
    const props = useTableProps();
    const { encodeSearchParams, decodeSearchParams, useNavigate, useLocation } = useTableConfig();
    const navigate = useNavigate();
    const location = useLocation();

    const isEmbedded = props.isEmbedded !== undefined ? props.isEmbedded : defaultIsEmbedded;
    const shouldGetFilterValuesFromLocation =
        props.shouldGetFilterValuesFromLocation !== undefined
            ? props.shouldGetFilterValuesFromLocation
            : defaultShouldGetFilterValuesFromLocation;

    const initialFilterValues = {
        ...defaultInitialFilterValues,
        ...props.initialFilterValues,
    };

    const initialFilterValuesWithParams = (shouldGetFilterValuesFromLocation
        ? {
            ...initialFilterValues,
            ...decodeSearchParams!(location.search),
        }
        : initialFilterValues
    );

    const [state, dispatch] = useReducer(filtersReducer, initialFilterValuesWithParams, generateInitialFilters);
    const appliedFiltersStr = encodeSearchParams!(state.appliedFilters);

    // Обновление URL при изменении применённых фильтров
    useEffect(() => {
        if (!isEmbedded && state.shouldUpdateUrl) {
            navigate(appliedFiltersStr);
            dispatch({
                type: ACTIONS.SET_SHOULD_UPDATE_URL,
                payload: false,
            });
        }
    }, [isEmbedded, state.shouldUpdateUrl]);

    // Обновление фильтров при изменении URL
    useEffect(() => {
        dispatch({
            type: ACTIONS.SET_AND_APPLY_FILTERS,
            payload: initialFilterValuesWithParams,
        });
        dispatch({
            type: ACTIONS.SET_SHOULD_UPDATE_URL,
            payload: false,
        });
    }, [location]);

    const actions = useMemo<UseFiltersActionsType>(
        () => ({
            setFilter: (name: string, value: FiltersValueType) => {
                dispatch({
                    type: ACTIONS.SET_FILTER,
                    payload: { name, value },
                });
            },
            setFilters: (values: FiltersValuesType) => {
                dispatch({
                    type: ACTIONS.SET_FILTERS,
                    payload: values,
                });
            },
            setAndApplyFilters: (values: FiltersValuesType) => {
                dispatch({
                    type: ACTIONS.SET_AND_APPLY_FILTERS,
                    payload: values,
                });
            },
            applyFilter: (name: string, value: FiltersValueType) => {
                dispatch({
                    type: ACTIONS.APPLY_FILTER,
                    payload: { name, value },
                });
            },
            applyFilters: () => {
                dispatch({
                    type: ACTIONS.APPLY_FILTERS,
                });
            },
            resetFilters: () => {
                dispatch({
                    type: ACTIONS.RESET_FILTERS,
                    payload: initialFilterValues,
                });
            },
        }),
        [initialFilterValues],
    );

    return [state, actions];
}
