import React from 'react';
import {PaginatedTable, Tr, Th, Td} from './Table';

const ArticleCommissionedLengthTable = ({ articles }) => (
    <div>
        <h3>Articles without a Commissioned Length</h3>
        <PaginatedTable pageSize={10} pagesAround={0} alternate head={
            <Tr>
                <Th>Headline</Th>
                <Th></Th>
                <Th>Word Count</Th>
            </Tr>
        }>
            {articles.map((x, i) => 
                <Tr key={x.path || i}>
                    <Td><a href={`https://www.theguardian.com/${x.path}`} target="_blank" rel="noopener noreferrer">{x.headline}</a></Td>
                    <Td><a href={`https://dashboard.ophan.co.uk/info?path=/${x.path}`} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                    <Td>{x.wordCount}</Td>
                </Tr>
            )}
        </PaginatedTable>
    </div>
);

export default ArticleCommissionedLengthTable;
