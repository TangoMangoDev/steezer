
import { useSortableTable } from '@hooks/useSortableTable';
import { TableColumn } from '../../types/player';
import './SortableTable.css';

interface SortableTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
}

function SortableTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  onRowClick, 
  className = '',
  emptyMessage = 'No data available'
}: SortableTableProps<T>) {
  const { sortedData, sortConfig, handleSort } = useSortableTable(data);

  if (data.length === 0) {
    return (
      <div className="empty-table-message">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className="sortable-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column.key}
                className={`
                  ${column.sortable !== false ? 'sortable' : ''} 
                  ${sortConfig.column === column.key ? `sorted-${sortConfig.direction}` : ''}
                  ${column.className || ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                {column.label}
                {column.sortable !== false && (
                  <span className="sort-indicator">
                    {sortConfig.column === column.key && (
                      sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr 
              key={index}
              className={onRowClick ? "clickable-row" : ""}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map(column => (
                <td 
                  key={column.key}
                  className={column.className || ''}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;