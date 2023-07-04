"use client"

import { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

export default function ProjectsTable(data) {

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
    
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [projects, setProjects] = useState(data['data']);

    const handleImage = (link) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setPreviewImageUrl(reader.result);
        });
    
        reader.readAsDataURL(link);
        return 1;
    };

    return (
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Project Name</StyledTableCell>
                        <StyledTableCell>thumbnail</StyledTableCell>
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