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

function calculateTotal(bands) {
    let total = 0;
    bands.map(item => total = total + item.count);
    return total;
}

export default CountTable;
