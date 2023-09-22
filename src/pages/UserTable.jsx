import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Table, TableHead, TableBody, TableCell,
  Card, CardContent
} from '@mui/material';
import {
  IconTableCell, HeaderTableRow, StyledTableRow
} from '../styles/tableStyles';
import { StyledCheckbox } from '../styles/styledComponents';

const UserTable = ({ 
  type, 
  columns, 
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
      <Table>
        <TableHead>
          <HeaderTableRow>
            <IconTableCell style={{ display: 'flex', alignItems: 'center' }}>
              <StyledCheckbox
                onChange={() => handleSelectAll(type)}
                checked={selectAll[type]}
              />
            </IconTableCell>
            {columns.map(col => (
              <TableCell key={col} style={{ fontWeight: 'bold' }}>{col}</TableCell>
            ))}
          </HeaderTableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <StyledTableRow key={index}>
              <IconTableCell>
                <StyledCheckbox
                  onChange={() => handleSelectAll(type)}
                  checked={selectAll[type]}
                />
                <IconComponent color={type === 'added' ? 'primary' : type === 'edited' ? 'primary' : 'error'} />
              </IconTableCell>
              {columns.map(col => (
                <TableCell key={col}>
                  <span>
                    {user.user_data?.[col] ?? '-'}
                  </span>
                </TableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
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
  backgroundColor: PropTypes.string // Add this new propType
};

export default UserTable;
