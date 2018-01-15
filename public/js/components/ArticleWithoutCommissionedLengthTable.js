import React from 'react';
import {PaginatedTable, Tr, Th, Td} from './Table';
import { articleURL, ophanURL } from "../utils/GuRoutes";

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
            {articles.map((article, i) => (
                <Tr key={article.path || i}>
                    <Td><a href={articleURL(article.path)} target="_blank" rel="noopener noreferrer">{article.headline}</a></Td>
                    <Td><a href={ophanURL(article.path)} target="_blank" rel="noopener noreferrer">Ophan</a></Td>
                    <Td>{article.wordCount}</Td>
                </Tr>
            ))}
        </PaginatedTable>
    </div>
);

export default ArticleCommissionedLengthTable;
