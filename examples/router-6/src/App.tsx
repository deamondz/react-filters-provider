import { FC, ReactElement } from "react";
import { useNavigate, useLocation } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  TableConfigProps,
  TableConfigProvider,
} from "@d.lukyanov/react-filters-provider";

import { TestPage } from "./TestPage";

const TableConfig: FC<{ children: ReactElement }> = ({ children }) => {
  const config: TableConfigProps = {
    useNavigate: useNavigate,
    useLocation: useLocation,
  };

  return <TableConfigProvider config={config}>{children}</TableConfigProvider>;
};

export const App: FC = () => {
  return (
    <BrowserRouter>
      <TableConfig>
        <Routes>
          <Route path="/" element={<TestPage />} />
        </Routes>
      </TableConfig>
    </BrowserRouter>
  );
};
