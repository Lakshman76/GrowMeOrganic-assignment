import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Chevron from "./Chevron";
import toast from "react-hot-toast";

interface allItems {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: string;
  date_end: string;
}

function Paginator() {
  const API = "https://api.artic.edu/api/v1/artworks?page=";
  const [userData, setUserData] = useState<allItems[]>([]);
  const [selectedItems, setSelectedItems] = useState<allItems[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchData(page: number): Promise<{ data: allItems[]; total: number }> {
    const response = fetch(API + page);
    toast.promise(response, {
      loading: "Loading...",
      success: <b>Success!</b>,
      error: <b>Error</b>,
    });
    const responseData = await (await response).json();
    const data = responseData.data;
    const total = responseData.pagination.total;
    return { data, total };
  }

  useEffect(() => {
    async function loadInitialData() {
      const { data, total } = await fetchData(currentPage);
      setUserData(data);
      setTotalRecords(total);
    }
    loadInitialData();
  }, [currentPage]);

  async function fetchMultiplePages(startPage: number, rowsNeeded: number): Promise<allItems[]> {
    const rows = [];
    let currentPage = startPage;
    let remainingRows = rowsNeeded;

    // Keep fetching pages until we have enough rows
    while (remainingRows > 0) {
      const { data } = await fetchData(currentPage);
      const rowsToSelect = Math.min(data.length, remainingRows);
      
      rows.push(...data.slice(0, rowsToSelect));
      remainingRows -= rowsToSelect;

      currentPage += 1; // Move to the next page if more rows are needed

      if (data.length === 0) {
        break;
      }
    }
    return rows;
  }

  // Handle row selection across multiple pages
  const handleSelectRows = async (rows: number) => {
    if (rows <= 12) {
      const selected = userData.slice(0, rows);
      setSelectedItems(selected);
    } else {
      const selectedRows = await fetchMultiplePages(currentPage, rows); // Fetch rows across multiple pages
      setSelectedItems(selectedRows);
    }
  };

  return (
    <div className="card">
      <DataTable
        value={userData}
        paginator
        rows={12}
        totalRecords={totalRecords}
        lazy
        first={(currentPage - 1) * 12}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode={"multiple"}
        selection={selectedItems!}
        onSelectionChange={(e) => {
          setSelectedItems(e.value);
        }}
        onPage={(e) => setCurrentPage((e?.page ?? 1) + 1)}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="title"
          header={<Chevron onSelectRows={handleSelectRows} />}
        ></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist_display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>
    </div>
  );
}
export default Paginator;
