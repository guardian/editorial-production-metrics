import React from "react";
import { Table, Td, Tr, Th } from "./Table";

const CountTable = ({ bands, title }) => (
    <div>
        <h3>{title}</h3>
        <Table
            centered
            alternate
            headTitle="Bands"
            bodyTitle="Count"
            head={
                <Tr>
                    {bands.map(({ label }) => <Th key={label}>{label}</Th>)}
                    <Th>Total</Th>
                </Tr>
            }
        >
            <Tr>
                {bands.map(({ label, count }) => <Td key={label}>{count}</Td>)}
                <Td>{calculateTotal(bands)}</Td>
            </Tr>
        </Table>
    </div>
);

const calculateTotal = (bands) => bands.reduce((acc, band) => acc + band.count, 0);

export default CountTable;
