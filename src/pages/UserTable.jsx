import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Table, TableHead, TableBody,
  Card, CardContent, TableRow, TableCell
} from '@mui/material';
import {
  IconTableCell, HeaderTableRow, StyledTableRow, StyledTableCell, HeaderCell, DialogStyledTableContainer
} from '../styles/tableStyles';
import { StyledCheckbox } from '../styles/styledComponents';

const UserTable = ({
  type,
  columns,
  columnMapping,
  users,
  handleSelectAll,
  selectAll,
  IconComponent,
  backgroundColor = 'transparent'
}) => (
  <Card style={{ marginTop: '20px', backgroundColor: backgroundColor }}>
    <CardContent>
      <Typography variant="h6">
        {`${type.charAt(0).toUpperCase() + type.slice(1)} Users`}
      </Typography>
      <DialogStyledTableContainer>
        <Table>
          <TableHead>
            <HeaderTableRow>
              <IconTableCell style={{ display: 'flex', alignItems: 'center' }}>
                <StyledCheckbox
                  onChange={() => handleSelectAll(type)}
                  checked={selectAll[type]}
                />
              </IconTableCell>
              {columns.map((column, index) => (
                <HeaderCell key={`${column}-${index}`} style={{ fontWeight: 'bold' }}>{columnMapping[column]}</HeaderCell>
              ))}
            </HeaderTableRow>
          </TableHead>
          <TableBody>
            {users.length ? (
              users.map((user, index) => (
                <StyledTableRow key={index}>
                  <IconTableCell>
                    <StyledCheckbox
                      onChange={() => handleSelectAll(type)}
                      checked={selectAll[type]}
                    />
                    <IconComponent color={type === 'added' ? 'primary' : type === 'edited' ? 'primary' : 'error'} />
                  </IconTableCell>
                  {columns.map((column, innerIndex) => (
                    <StyledTableCell
                      key={`${column}-${index}-${innerIndex}`} 
                      style={
                        user.changedFields?.includes(column)
                          ? { background: 'linear-gradient(45deg, #c77f00 30%, #FF8E53 90%)', border: 0, boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)', }
                          : {}
                      }
                    >
                      <span>
                        {user.user_data?.[column] ?? '-'}
                      </span>
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

UserTable.propTypes = {
  type: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  selectAll: PropTypes.objectOf(PropTypes.bool).isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  backgroundColor: PropTypes.string,
  columnMapping: PropTypes.object.isRequired,
};

export default UserTable;
