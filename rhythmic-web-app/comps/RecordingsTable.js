"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function RecordingsTable(data) {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
    }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    }));
    
    const [recordings, setRecordings] = useState(data['data']);

    const projectPath = usePathname();

    return (
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Recording</StyledTableCell>
                        <StyledTableCell>Grading</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {recordings.map((rec) => (
                        <StyledTableRow>
                            <StyledTableCell><Link href={`${projectPath}/recording/${rec['id']}`}>{rec['id']}</Link></StyledTableCell>
                            <StyledTableCell>Grade</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}