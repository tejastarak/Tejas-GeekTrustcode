import React from "react";

const DeleteSeletedRows = ({ handleDeleteSelected, selectedRows }) => {
  return (
    <button
      onClick={handleDeleteSelected}
      disabled={selectedRows.length === 0}
      className="delete-selected-button"
    >
      Delete Seleted
    </button>
  );
};

export default DeleteSeletedRows;
