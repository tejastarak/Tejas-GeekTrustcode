import React, { useEffect, useState } from "react";
import axios from "axios";
import Config from "../ApiCall/Config";
import Table from "./Table/Table";
import DeleteSeletedRows from "./DeleteSeletedRows";
import "../Styles/Styles.css";
import { toast } from "react-toastify";
import EditModel from "./EditModel/EditModel";
import { LiaAngleDoubleLeftSolid } from "react-icons/lia";
import { LiaAngleLeftSolid } from "react-icons/lia";
import { LiaAngleRightSolid } from "react-icons/lia";
import { LiaAngleDoubleRightSolid } from "react-icons/lia";

const MainUserInterface = () => {
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilaterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditingRowdata, setIsEditingRowdata] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Featch the data useing ApiCall ,inside of the axios library

  const featchData = async () => {
    try {
      const response = await axios.get(`${Config.backendpoint}`);
      //   console.log(response);
      const data = response.data;
      //   console.log(data);
      setUserData(data);
      setFilaterData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    featchData();
  }, []);

  //    Search input handleChange

  const handleSearch = (e) => {
    const getSearch = e.target.value.toLowerCase();

    if (getSearch.length > 0) {
      const searchValues = userData.filter((value) => {
        return (
          value.name.toLowerCase().includes(getSearch) ||
          value.email.toLowerCase().includes(getSearch) ||
          value.role.toLowerCase().includes(getSearch)
        );
      });
      setUserData(searchValues);
    } else {
      setUserData(filterData);
    }
    setSearchQuery(getSearch);
  };

  // Paginations
  const itemPerPage = 10;
  const totalPages = Math.ceil(userData.length / itemPerPage);
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  const currentPages = userData.slice(startIndex, endIndex);

  const getPageNum = () => {
    const pageNumber = [];
    for (let curpage = 1; curpage <= totalPages; curpage++)
      pageNumber.push(curpage);
    return pageNumber;
  };

  const pageNumbers = getPageNum(totalPages);

  const handleFirstpage = () => {
    setCurrentPage(1);
    setSelectedRows([])
  };
  const handlePrivespage = () => {
    setCurrentPage(currentPage - 1);
    setSelectedRows([])

  };
  const handleNextpage = () => {
    setCurrentPage(currentPage + 1);
    setSelectedRows([])

  };
  const handleLastpage = () => {
    setCurrentPage(totalPages);
    setSelectedRows([])

  };
  const handleClickpage = (page) => {
    setCurrentPage(page);
    setSelectedRows([])

  };

  // Checkbox function

  const handleRowSelection = (e, id) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedRows([...selectedRows, id]);
      toast.success("Selected", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    }
  };

  const handleSelectAllRows = (e) => {
    const isAllSelected = e.target;
    const allseletedIds = currentPages.map((user) => user.id);

    if (isAllSelected && selectedRows.length !== allseletedIds.length) {
      setSelectedRows(allseletedIds);
      toast.warn("Hey You Selected All !", {
        position: toast.POSITION.TOP_CENTER,
        theme: "dark",
      });
    } else {
      setSelectedRows([]);
    }
  };

  const handleDeleteSelected = () => {
    const updateUsers = userData.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUserData(updateUsers);
    setFilaterData(updateUsers);
    setSelectedRows([]);
    toast.error("Selected rows deleted successfully", {
      position: toast.POSITION.TOP_CENTER,
    }
    );
  };
  const handleDelete = (id) => {
    // if (!selectedRows.includes(id)) {
    //   toast.error("Please select the row to delete.");
    //   return;
    // }

    setUserData(userData.filter((user) => user.id !== id));
    setSelectedRows([]);

    toast.error("Deleted Successfully!", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleEdit = (id) => {
    const rowToEdit = userData.find((user) => user.id === id);
    setIsEditingRowdata(rowToEdit);
    setIsModalOpen(true);
  };
  const handlClickSave = (editing) => {
    const updateData = [...userData];
    const indextobeEdited = updateData.findIndex(
      (item) => item.id === editing.id
    );
    if (indextobeEdited !== -1) {
      updateData[indextobeEdited] = editing;
      setUserData(updateData);
    }
    setIsEditingRowdata(null);
    toast.success("Successfully Updated", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  return (
    <>
      <div className="container">
       

        {/* <div className=""> */}
        <input
          type="search"
          name="name"
          placeholder="Search by name,email or role"
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          className="search-input"
        />
        {/* </div> */}
        <Table
          userData={currentPages}
          selectedRows={selectedRows}
          handleRowSelection={handleRowSelection}
          handleSelectAllRows={handleSelectAllRows}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        <div className="table-footer">
          <div className="pagination-container">
            {/* <span>
            page {totalPages < 1 ? 0 : currentPage} of {totalPages}
          </span> */}
            <div className="pagination">
              <button
                onClick={handleFirstpage}
                className={currentPage === 1 ? "active" : ""}
              >
                <LiaAngleDoubleLeftSolid />
              </button>
              <button
                onClick={handlePrivespage}
                className={currentPage === 1 ? "disabled" : ""}
              >
                <LiaAngleLeftSolid />
              </button>
              {/* Maping Pages */}
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  className={
                    currentPage === page ? "active" : ""
                  }
                >
                  <span
                    onClick={() => handleClickpage(page)}
                    className="page-links"
                  >
                    {page}
                  </span>
                </button>
              ))}
              <button
                onClick={handleNextpage}
                className={currentPage === totalPages ? "disabled" : ""}
              >
                <LiaAngleRightSolid />
              </button>
              <button
                onClick={handleLastpage}
                className={currentPage === totalPages ? "active" : ""}
              >
                <LiaAngleDoubleRightSolid />
              </button>
            </div>
          </div>
        </div>
        <DeleteSeletedRows
          handleDeleteSelected={handleDeleteSelected}
          selectedRows={selectedRows}
        />
        {isModalOpen && (
          <EditModel
            isEditingRowdata={isEditingRowdata}
            setIsModalOpen={setIsModalOpen}
            handlClickSave={handlClickSave}
          />
        )}
      </div>
    </>
  );
};

export default MainUserInterface;
