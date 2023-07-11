"use client"

import Link from 'next/link'
import Image from 'next/image'

import path from 'node:path';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function ProjectsTable({ projects }) {
    console.log('ProjectsTable, projects=', projects);

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
                        <StyledTableCell><h3>Thumbnail</h3></StyledTableCell>
                        <StyledTableCell><h3>Project Name</h3></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map(({id, projectName, thumbnail}) => (
                        <StyledTableRow key={id}>
                            <StyledTableCell><Image src={`/api/assets/thumbnail/${thumbnail}`} alt="Project Image" width="100" height="70" style={{'borderRadius':'5px'}}/></StyledTableCell>
                            <StyledTableCell><Link href={`/project/${id}`}>{projectName}</Link></StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}