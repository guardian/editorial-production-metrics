import React from 'react';
import {PaginatedTable, Tr, Th, Td} from './Table';

const ArticleCommissionedLengthTable = ({ articles }) => {
    articles.sort(
        (a1, a2) => a2.wordCount - a1.wordCount
    );
    return(
        <div>
            <h3>Articles with a Commissioned Length</h3>
            <PaginatedTable pageSize={10} pagesAround={0} alternate head={
                <Tr>
                    <Th>Headline</Th>
                    <Th></Th>
                    <Th>Word Count</Th>
                    <Th>Commissioned Word Count</Th>
                    <Th>Number of words over</Th>
                </Tr>
            }>
                {articles.map(x => 
                    <Tr key={x.path}>
                        <Td><a href={`https://www.theguardian.com/${x.path}`} target="_blank" rel="noopener noreferrer">{x.headline}</a></Td>
                        <Td><a href={`https://dashboard.ophan.co.uk/info?path=/${x.path}`} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                        <Td>{x.wordCount}</Td>
                        <Td>{x.commissionedWordLength}</Td>
                        <Td>{x.wordCount - x.commissionedWordLength}</Td>
                    </Tr>
                )}
            </PaginatedTable>
        </div>
    );
};

export default ArticleCommissionedLengthTable;
