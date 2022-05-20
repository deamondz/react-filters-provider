import { FC } from "react";

import {
  TablePageProps,
  TablePropsProvider,
  useFilters,
  useTableProps,
} from "@deamondz/react-filters-provider";

export const Table: FC = () => {
  const config = useTableProps();
  const [
    { tmpFilters, appliedFilters },
    { setFilter, setFilters, applyFilter, resetFilters, applyFilters },
  ] = useFilters();

  return (
    <>
      <label htmlFor="">tmpFilters</label>
      <pre>{JSON.stringify(tmpFilters, null, "    ")}</pre>
      <button
        onClick={() => {
          setFilter("page", 2);
        }}
      >
        setFilter('page')
      </button>
      |
      <button
        onClick={() => {
          setFilters({
            page: 2,
            boolean: true,
          });
        }}
      >
        setFilters()
      </button>
      |
      <button
        onClick={() => {
          applyFilters();
        }}
      >
        applyFilters()
      </button>
      |
      <hr />
      <label htmlFor="">appliedFilters</label>
      <pre>{JSON.stringify(appliedFilters, null, "    ")}</pre>
      <button
        onClick={() => {
          applyFilter("page", 2);
        }}
      >
        applyFilter('page')
      </button>
      |
      <button
        onClick={() => {
          applyFilter("test", 1);
        }}
      >
        applyFilter('test')
      </button>
      |
      <button
        onClick={() => {
          applyFilter("boolean", false);
        }}
      >
        applyFilter('boolean')
      </button>
      |
      <button
        onClick={() => {
          resetFilters();
        }}
      >
        resetFilters
      </button>
    </>
  );
};

export const TestPage: FC = () => {
  const config: TablePageProps = {};

  return (
    <TablePropsProvider config={config}>
      <Table />
    </TablePropsProvider>
  );
};
