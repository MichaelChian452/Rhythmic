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
    
    // const getProjects = async () => {
    //     const query = await fetch('/api/projects');
    //     const response = query.json();
    //     console.log(response);
    //     return response;
    // }

    // const projs = await getProjects();

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
                    {projects.map((project) => (
                        <StyledTableRow>
                            <StyledTableCell><Link href={`/project/${project['id']}`}>{project['projectName']}</Link></StyledTableCell>
                            <StyledTableCell><Image src={(project['base64'])} alt="Project Image" width="100" height="50" style={{'border-radius':'5px'}}/></StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}