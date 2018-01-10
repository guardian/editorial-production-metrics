import React from 'react';
import {Table, Tr, Th, Td} from './Table';

const compareKey = key => (article1, article2) => article2[key] - article1[key];

const ArticleCommissionedLengthTable = ({articles}) => {
    const noCommissioningLength = articles
      .filter(article => article.commissionedWordCount === 0)
      .sort(compareKey("wordCount"));
    const sortedArticles = articles
      .filter(article => article.commissionedWordCount > 0)
      .sort(compareKey("commissionedWordCount"));
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
                {noCommissioningLength.map(x => 
                    <Tr key={x.path}>
                        <Td><a href={`https://www.theguardian.com/${x.path}`} target="_blank" rel="noopener noreferrer">{x.headline}</a></Td>
                        <Td><a href={`https://dashboard.ophan.co.uk/info?path=/${x.path}`} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                        <Td>{x.wordCount}</Td>
                    </Tr>
                )}
            </Table>

            <h3>Articles with a Commissioned Length</h3>
            <Table alternate head={
                <Tr>
                    <Th>Headline</Th>
                    <Th></Th>
                    <Th>Word Count</Th>
                    <Th>Commissioned Word Count</Th>
                    <Th>Number of words over</Th>
                </Tr>
            }>
                {sortedArticles.map(x => 
                    <Tr key={x.path}>
                        <Td><a href={`https://www.theguardian.com/${x.path}`} target="_blank" rel="noopener noreferrer">{x.headline}</a></Td>
                        <Td><a href={`https://dashboard.ophan.co.uk/info?path=/${x.path}`} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                        <Td>{x.wordCount}</Td>
                        <Td>{x.commissionedWordCount}</Td>
                        <Td>{x.wordCount - x.commissionedWordCount}</Td>
                    </Tr>
                )}
            </Table>
        </div>
    );
};

export default ArticleCommissionedLengthTable;