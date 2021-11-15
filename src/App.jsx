import React, { useEffect, useMemo, useState } from "react";
import { useTable, useExpanded, useSortBy } from "react-table";
import MOCK_DATA from "./MOCK_DATA.json";
import "./App.css";
import axios from "axios";

function BasicTable() {
  const [tableData, setTableData] = useState([]);

  const COLUMNS = [
    {
      id: "expander",
      Header: "Category",
      Cell: (prop) =>
        prop.row.canExpand ? (
          <span
            {...prop.row.getToggleRowExpandedProps({
              style: {
                paddingLeft: `${prop.row.depth * 2}rem`,
              },
            })}
          >
            {prop.row.isExpanded ? prop.value + "↓" : prop.value + " >"}
            {}
          </span>
        ) : null,
      disableSortBy: true,
      accessor: "category",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Price",
      accessor: "price",
      // Cell: (prop) => {
      //   return (
      //     <input
      //       type="number"
      //       value={prop.value}
      //       onChange={(e) => {
      //         let id = prop.row.original.id;
      //         priceChange(e, prop, id);
      //       }}
      //     />
      //   );
      // },
    },
  ];
  function priceChange(e, props, id) {
    let value = e.target.value;

    finalData.forEach((obj) => {
      obj.subRows.forEach((obj2) => {
        if (obj2.id === id) {
          console.log(obj2);
          obj2.price = value;
        }
      });
    });
    console.log(finalData);
  }
  const columns = useMemo(() => COLUMNS, []);
  let categoryArray = MOCK_DATA.map((obj) => {
    return obj.category;
  });
  let categoryArraySet = new Set([...categoryArray]);
  let finalData = [];
  let uniqueCategoryArray = Array.from(categoryArraySet);
  uniqueCategoryArray.map((str) => {
    let ans = MOCK_DATA.filter((obj) => {
      if (obj.category === str) {
        return obj;
      }
    });
    let obj = {};
    obj.subRows = ans;
    obj.category = str;
    finalData.push(obj);
  });

  const data = useMemo(() => finalData, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = useTable(
    {
      // defaultColumn,
      columns,
      data,
      // defaultColumn,
    },
    useSortBy,
    useExpanded
  );

  return (
    <>
      <div className="App">
        <h2>Impact Analytics</h2>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default BasicTable;
