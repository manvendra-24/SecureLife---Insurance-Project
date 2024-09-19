import React from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import { BiErrorCircle } from 'react-icons/bi'; 
import TableButton from './TableButton';

const TableData = ({ data, status, activateRow, deactivateRow, getInsideData, update }) => {
    if (!data || data.length === 0) {
        return (
            <Row className="justify-content-center mt-3">
                <Col xs={12} className="text-center">
                    <BiErrorCircle size={48} color="black" />
                    <p style={{ marginTop: '10px', color: '#495057' }}>No data is present.</p> 
                </Col>
            </Row>
        );    
    }

    const headers = Object.keys(data[0]).filter(header => header !== 'active');
    const filteredHeaders = status === 'Client' ? headers.filter(header => header !== 'agent') : headers;


    return (
        <Table striped bordered>
            <thead>
                <tr>
                    {filteredHeaders.map((header, index) => (
                        <th key={index} style={{ textTransform: 'capitalize' }}>{header}</th>
                    ))}
                    {getInsideData && <th>View Details</th>}
                    {update && <th>Update</th>}
                    {activateRow && deactivateRow && <th>Action</th>}

                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {filteredHeaders.map((header, colIndex) => (
                            <td key={colIndex}>
                                {typeof row[header] === 'object' && row[header] !== null
                                    ? JSON.stringify(row[header])
                                    : row[header]
                                }
                            </td>
                        ))}
                        
                        {status === "State" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.stateId)} variant="primary" text="View Cities"/>
                            </td>
                        )}
                        {status === "State" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.stateId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "State" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.stateId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.stateId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "Admin" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.adminId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "Admin" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.adminId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.adminId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "Agent" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.agentId)} variant="primary" text="View Cities"/>
                            </td>
                        )}
                        {status === "Agent" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.agentId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "Agent" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.agentId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.agentId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "Employee" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.employeeId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "Employee" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.employeeId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.employeeId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "Customer" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.customerId)} variant="primary" text="View Cities"/>
                            </td>
                        )}
                        {status === "Customer" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.customerId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "Customer" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.customerId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.customerId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "City" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.cityId)} variant="primary" text="View Cities"/>
                            </td>
                        )}
                        {status === "City" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.cityId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "City" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.cityId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.cityId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "Type" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.insuranceTypeId)} variant="primary" text="View Schemes"/>
                            </td>
                        )}
                        {status === "Type" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.insuranceTypeId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "Type" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.insuranceTypeId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.insuranceTypeId)} variant="success" text="Activate" />
                                )}
                            </td>
                        )}
                        {status === "Scheme" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.insuranceSchemeId)} variant="primary" text="View Plans"/>
                            </td>
                        )}
                        {status === "Scheme" && update && (
                            <td>
                                <TableButton onClick={()=> update(row.insuranceSchemeId)} variant="warning" text="Update"/>
                            </td>
                        )}
                        {status === "Scheme" && (
                            <td>
                                {row.active ? (
                                    <TableButton onClick={() => deactivateRow(row.insuranceSchemeId)} variant="danger" text="Deactivate" />
                                ) : (
                                    <TableButton onClick={() => activateRow(row.insuranceSchemeId)} variant="success" text="Activate" />
                                )}
                            </td>
                            
                        )}{status === "Withdrawal" && (
                            <td>
                                {row.status === "PENDING" ? (
                                    <td>
                                    <TableButton onClick={() => deactivateRow(row.withdrawalRequestId)} variant="danger" text="Reject" />
                                    <TableButton onClick={() => activateRow(row.withdrawalRequestId)} variant="success" text="Approve" />
                                    </td>
                                ) : (
                                    <td>
                                    {row.status === "APPROVED" ? (
                                        <TableButton variant="success" text="APPROVED" disabled/>
                                    ): (
                                        <TableButton variant="danger" text="REJECTED" disabled/>
                                    )}
                                    </td>
                                )}
                                
                            </td>
                        )}

                        {status === "Claim" && getInsideData && (
                            <td>
                                <TableButton onClick={()=> getInsideData(row.claimId)} variant="primary" text="View Documents"/>
                            </td>
                        )}
                        {status === "Claim" && (

                            <td>
                                {row.status === "PENDING" ? (
                                    <td>
                                    <TableButton onClick={() => deactivateRow(row.claimId)} variant="danger" text="Reject" />
                                    <TableButton onClick={() => activateRow(row.claimId)} variant="success" text="Approve" />
                                    </td>
                                ) : (
                                    <td>
                                    {row.status === "APPROVED" ? (
                                        <TableButton variant="success" text="APPROVED" disabled/>
                                    ): (
                                        <TableButton variant="danger" text="REJECTED" disabled/>
                                    )}
                                    </td>
                                )}
                                
                            </td>
                        )}
                    </tr>
                ))}

            </tbody>
        </Table>
    );
};

export default TableData;
