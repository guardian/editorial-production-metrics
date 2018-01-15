import React from 'react';
import {PaginatedTable, Tr, Th, Td} from './Table';
import { wordCountOver } from "../utils/WordCountUtils";
import { articleURL, ophanURL } from "../utils/GuRoutes";

const ArticleCommissionedLengthTable = ({ articles }) => (
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
            {articles.map(article => (
                <Tr key={article.path}>
                    <Td><a href={articleURL(article.path)} target="_blank" rel="noopener noreferrer">{article.headline}</a></Td>
                    <Td><a href={ophanURL(article.path)} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                    <Td>{article.wordCount}</Td>
                    <Td>{article.commissionedWordLength}</Td>
                    <Td>{wordCountOver(article)}</Td>
                </Tr>
            ))}
        </PaginatedTable>
    </div>
);

export default ArticleCommissionedLengthTable;
