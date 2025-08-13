import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const fetchData = async (endpoint) => {
  const response = await api.get(endpoint);
  return response.data;
};

export default function GetDataGrid({ endpoint, dataKey, editNote }) {
  const [data, setData] = useState([]);
  const [editRowsModel, setEditRowsModel] = useState({});

  useEffect(() => {
    fetchData(endpoint).then((result) => setData(result[dataKey]));
  }, [endpoint, dataKey]);

  const handleEditRowsModelChange = (model) => {
    setEditRowsModel(model);
  };

  const handleSaveClick = async (id) => {
    const updatedRowIndex = data.findIndex((item) => item[`${dataKey.slice(0, -1)}_id`] === id);
    const updatedRow = { ...data[updatedRowIndex], ...editRowsModel[id]?.data };

    try {
      await api.post('/admin/update', updatedRow);
      alert('Data updated successfully!');
      const updatedData = [...data];
      updatedData[updatedRowIndex] = updatedRow;
      setData(updatedData);
      setEditRowsModel((prevModel) => {
        const updatedModel = { ...prevModel };
        delete updatedModel[id];
        return updatedModel;
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete('/admin/delete', { data: { [`${dataKey.slice(0, -1)}_id`]: id } });
      alert('Data deleted successfully!');
      setData(data.filter((item) => item[`${dataKey.slice(0, -1)}_id`] !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  if (data.length === 0) return null;

  const columns = Object.keys(data[0]).map((key) => {
    return {
      field: key,
      headerName: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      width: 130,
      editable: true,
    };
  });

  columns.push({
    field: 'view',
    headerName: 'View',
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        onClick={() => editNote(params.row[`${dataKey.slice(0, -1)}_id`])}
      >
        View
      </Button>
    ),
  });

  columns.push({
    field: 'edit',
    headerName: 'Edit',
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleSaveClick(params.row[`${dataKey.slice(0, -1)}_id`])}
      >
        Edit
      </Button>
    ),
  });

  columns.push({
    field: 'delete',
    headerName: 'Delete',
    width: 100,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="error"
        onClick={() => handleDeleteClick(params.row[`${dataKey.slice(0, -1)}_id`])}
      >
        Delete
      </Button>
    ),
  });

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        style={{ border: 'none' }}
        rows={data.map((item) => ({ ...item, id: item[`${dataKey.slice(0, -1)}_id`] }))}
        columns={columns}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight={false}
      />
    </div>
  );
}