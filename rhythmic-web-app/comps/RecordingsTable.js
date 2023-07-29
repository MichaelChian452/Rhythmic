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

import gradeStyles from './gradeStyles.module.css';

function getGrade(grade) {
    const roundedGrade = grade.match(/^-?\d+(?:\.\d{0,3})?/)[0]
    const val = parseFloat(roundedGrade) * 100;
    let color = "red";
    if (val <= 40) {
        color = "red";
    } else if (val > 40 && val <= 60) {
        color = "yellow";
    } else if (val > 60 && val <= 90) {
        color = "LightGreen";
    } else {
        color = "green";
    }
    return (
        <div className={gradeStyles.grade} style={{"background-color": color}}>
            {val}
        </div>
    );
}

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
    console.log('RecordingsTable recordings=', recordings);
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
                    {recordings.map(({ id, grade }) => (
                        <StyledTableRow key={id}>
                            <StyledTableCell><Link href={`${projectPath}/recording/${id}`}>{id}</Link></StyledTableCell>
                            <StyledTableCell>{getGrade(grade)}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}