import React from 'react';
import {Table, Tr, Th, Td} from './Table';

const ArticleCommissionedLengthTable = ({ articles }) => {
    articles.sort(
        (a1, a2) => a2.commissionedWordCount - a1.commissionedWordCount
    );
    return(
        <div>
            <h3>Articles without a Commissioned Length</h3>
            <Table alternate head={
                <Tr>
                    <Th>Headline</Th>
                    <Th></Th>
                    <Th>Word Count</Th>
                </Tr>
            }>
                {articles.map(x => 
                    <Tr key={x.path}>
                        <Td><a href={`https://www.theguardian.com/${x.path}`} target="_blank" rel="noopener noreferrer">{x.headline}</a></Td>
                        <Td><a href={`https://dashboard.ophan.co.uk/info?path=/${x.path}`} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                        <Td>{x.wordCount}</Td>
                    </Tr>
                )}
            </Table>
        </div>
    );
};

export default ArticleCommissionedLengthTable;
