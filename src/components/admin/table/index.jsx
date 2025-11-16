"use client";

import React, { useState, useRef, useMemo } from "react";

export default function DataTable({ columns, data }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [colOrder, setColOrder] = useState(columns.map((c) => c.key));
  const [colWidths, setColWidths] = useState({});
  const [sortConfig, setSortConfig] = useState(null);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const dragCol = useRef(null);

  // -------------------------------------
  //  SELECT ROWS
  // -------------------------------------
  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, idx) => idx));
    }
  };

  // -------------------------------------
  //  REORDER COLUMNS
  // -------------------------------------
  const onDragStart = (key) => {
    dragCol.current = key;
  };

  const onDrop = (key) => {
    const newOrder = [...colOrder];
    const from = newOrder.indexOf(dragCol.current);
    const to = newOrder.indexOf(key);

    newOrder.splice(from, 1);
    newOrder.splice(to, 0, dragCol.current);

    setColOrder(newOrder);
  };

  // -------------------------------------
  //  RESIZE COLUMNS
  // -------------------------------------
  const startResize = (e, key) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = colWidths[key] || e.target.parentElement.offsetWidth;

    const onMove = (ev) => {
      const newWidth = startWidth + (ev.clientX - startX);
      setColWidths((prev) => ({ ...prev, [key]: Math.max(newWidth, 60) }));
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // -------------------------------------
  //  SORTING
  // -------------------------------------
  const sortedData = useMemo(() => {
    let temp = [...data];

    if (sortConfig) {
      temp.sort((a, b) => {
        const A = a[sortConfig.key] ?? "";
        const B = b[sortConfig.key] ?? "";

        if (A < B) return sortConfig.dir === "asc" ? -1 : 1;
        if (A > B) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return temp;
  }, [data, sortConfig]);

  const toggleSort = (key) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  // -------------------------------------
  //  FILTERING
  // -------------------------------------
  const filteredData = sortedData.filter((row) =>
    Object.keys(filters).every((key) => {
      const value = filters[key];
      if (!value) return true;
      return String(row[key] ?? "")
        .toLowerCase()
        .includes(value.toLowerCase());
    })
  );

  // -------------------------------------
  //  PAGINATION
  // -------------------------------------
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginated = filteredData.slice((page - 1) * pageSize, page * pageSize);

  // Order columns
  const orderedCols = colOrder.map((key) => columns.find((c) => c.key === key));

  return (
    <div className="w-full overflow-x-auto rounded-xl border-2 border-neutral-40 bg-neutral-10">
      <div className="p-4 rounded-xl">
        <table className="w-full table-auto text-left text-neutral-100 shadow-modal min-w-max">
          <thead className="bg-neutral-20">
            {/* HEADER */}
            <tr>
              <th className="px-4 py-3 border-b border-neutral-40">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-primary-main"
                />
              </th>

              {orderedCols.map((col) => (
                <th
                  key={col.key}
                  draggable
                  onDragStart={() => onDragStart(col.key)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(col.key)}
                  style={{ width: colWidths[col.key] }}
                  className="px-4 py-3 text-[14px] font-semibold text-neutral-90 border-b border-neutral-40 relative whitespace-nowrap"
                >
                  <span
                    onClick={() => toggleSort(col.key)}
                    className="cursor-pointer select-none flex items-center gap-1"
                  >
                    {col.label}
                    {sortConfig?.key === col.key &&
                      (sortConfig.dir === "asc" ? "▲" : "▼")}
                  </span>

                  {/* Resize Handle */}
                  <span
                    onMouseDown={(e) => startResize(e, col.key)}
                    className="absolute right-0 top-0 h-full w-[5px] cursor-col-resize"
                  ></span>
                </th>
              ))}
            </tr>

            {/* FILTER ROW */}
            <tr>
              <th className="px-4 py-2 border-b border-neutral-30"></th>

              {orderedCols.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 border-b border-neutral-30"
                >
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={filters[col.key] || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, [col.key]: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {paginated.map((row, idx) => (
              <tr key={idx} className="hover:bg-neutral-20 transition-colors">
                <td className="px-4 py-3 border-b border-neutral-30">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(idx)}
                    onChange={() => toggleRow(idx)}
                    className="w-4 h-4 accent-primary-main"
                  />
                </td>

                {orderedCols.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-[14px] text-neutral-80 border-b border-neutral-30 whitespace-nowrap"
                    style={{ width: colWidths[col.key] }}
                  >
                    {row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-neutral-70 text-sm">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
