import React from 'react';

const Table = ({ columns = [], data = [], className = '' }) => {
  return (
    <table className={`table table-striped table-bordered ${className}`}>
      <thead className="table-dark">
        <tr>
          {columns.map((col) => (
            <th key={col.accessor}>{col.Header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center">No data available</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.accessor}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
