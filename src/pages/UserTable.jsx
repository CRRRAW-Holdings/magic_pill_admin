import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Table, TableHead, TableBody,
  Card, CardContent, TableRow, TableCell
} from '@mui/material';
import {
  IconTableCell, HeaderTableRow, StyledTableRow, StyledTableCell, HeaderCell, DialogStyledTableContainer
} from '../styles/tableStyles';

const UserTable = ({
  type,
  columns,
  columnMapping,
  users,
  IconComponent,
  backgroundColor = 'transparent'
}) => {

  const getChangeByFieldName = (user, fieldName) => {
    return user.changes && user.changes.find(change => change.field === fieldName);
  };

  const getDisplayValue = (user, column) => {
    const formatBoolean = (value) => {
      if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No'; 
      }
      return value;
    };
  
    if (type === 'edited') {
      const change = getChangeByFieldName(user, column);
      if (change) {
        return change.change;
      }
      return formatBoolean(user.updatedObject[column]);
    }
  
    return formatBoolean(user[column]);
  };
  
  return (
    <Card style={{ marginTop: '20px', backgroundColor: backgroundColor }}>
      <CardContent>
        <Typography variant="h6">
          {`${type.charAt(0).toUpperCase() + type.slice(1)} Users`}
        </Typography>
        <DialogStyledTableContainer>
          <Table>
            <TableHead>
              <HeaderTableRow>
                <IconTableCell />
                {columns.map((column, index) => (
                  <HeaderCell key={`${column}-${index}`} style={{ fontWeight: 'bold' }}>{columnMapping[column]}</HeaderCell>
                ))}
              </HeaderTableRow>
            </TableHead>
            <TableBody>
              {users.length ? (
                users.map((user, userIndex) => (
                  <StyledTableRow key={userIndex}>
                    <IconTableCell>
                      <IconComponent color={type === 'added' ? 'primary' : 'secondary'} />
                    </IconTableCell>
                    {columns.map((column, columnIndex) => (
                      <StyledTableCell
                        key={`${column}-${userIndex}-${columnIndex}`}
                        style={getChangeByFieldName(user, column) ? { background: 'linear-gradient(45deg, #c77f00 30%, #FF8E53 90%)' } : {}}
                      >
                        {getDisplayValue(user, column)}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <Typography variant="subtitle1" color="textSecondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogStyledTableContainer>
      </CardContent>
    </Card>
  );
};

UserTable.propTypes = {
  type: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  backgroundColor: PropTypes.string,
  columnMapping: PropTypes.object.isRequired,
};

export default UserTable;
