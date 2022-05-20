import { createContext, useContext, FC, ReactNode, useMemo } from "react";
import { decodeSearchParams, encodeSearchParams } from "./helpers";

import { FiltersValuesType, useFilters, UseFiltersType } from "./useFilters";

// -----------------------

export type TablePageProps = {
  isEmbedded?: boolean;
  shouldGetFilterValuesFromLocation?: boolean;
  initialFilterValues?: FiltersValuesType;
  [k: string]: any;
};

export const TablePropsContext = createContext<TablePageProps>(
  {} as TablePageProps
);

export function useTableProps() {
  return useContext(TablePropsContext);
}

export const TablePropsProvider: FC<{
  config: TablePageProps;
  children: ReactNode;
}> = ({ children, config }) => {
  return (
    <TablePropsContext.Provider value={config}>
      {children}
    </TablePropsContext.Provider>
  );
};

// --------------------------

/**
 * Этот контекст позволяет получать данные фильтров, а так же управлять этими фильтрами
 */
export const TableFiltersContext = createContext<UseFiltersType>(
  [] as unknown as UseFiltersType
);

export function useTableFilters() {
  return useContext(TableFiltersContext);
}

export const TableFiltersProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const filtersAndActions = useFilters();

  return (
    <TableFiltersContext.Provider value={filtersAndActions}>
      {children}
    </TableFiltersContext.Provider>
  );
};

// --------------------------
export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

export type TableConfigProps = {
  encodeSearchParams?: (searchParams: Record<string, any>) => string;
  decodeSearchParams?: (seachParams: string) => Record<string, any>;
  useLocation: () => Location;
  useNavigate: () => (url: string) => void;
};

/**
 * Этот контекст необходим для задания конфига
 */
export const TableConfigContext = createContext<TableConfigProps>(
  {} as TableConfigProps
);

export function useTableConfig() {
  return useContext(TableConfigContext);
}

const defaultTableConfig = {
  encodeSearchParams,
  decodeSearchParams,
};

export const TableConfigProvider: FC<{
  children: ReactNode;
  config: TableConfigProps;
}> = ({ children, config }) => {
  const localConfig = useMemo(
    () => ({
      ...defaultTableConfig,
      ...config,
    }),
    [config]
  );

  return (
    <TableConfigContext.Provider value={localConfig}>
      {children}
    </TableConfigContext.Provider>
  );
};
