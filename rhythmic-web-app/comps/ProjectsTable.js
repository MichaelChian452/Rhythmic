"use client"

import Link from 'next/link'
import Image from 'next/image'

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function ProjectsTable({ projects }) {
    // console.log('ProjectsTable, projects=', projects);

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

    return (
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell><h3>Project Name</h3></StyledTableCell>
                        <StyledTableCell><h3>thumbnail</h3></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map(({id, projectName, base64}) => (
                        <StyledTableRow key={id}>
                            <StyledTableCell><Link href={`/project/${id}`}>{projectName}</Link></StyledTableCell>
                            <StyledTableCell><Image src={base64} alt="Project Image" width="100" height="50" style={{'borderRadius':'5px'}}/></StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}