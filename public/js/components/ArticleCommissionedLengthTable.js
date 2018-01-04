import React from 'react';

const compare = (article1, article2) => {
    return article2.commissionedWordCount - article1.commissionedWordCount;
}

const ArticleCommissionedLengthTable = ({articles}) => {
    const noCommissioningLength = articles.filter(article => article.commissionedWordCount == 0)
    const sortedArticles = articles.filter(article => article.commissionedWordCount > 0).sort(compare)
    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Headline</th>
                        <th></th>
                        <th>Word Count</th>
                        <th>Commissioned Word Count</th>
                    </tr>
                </thead>
                <tbody>
                    {noCommissioningLength.map(x => 
                        <tr key={x.path}>
                            <td><a href={"https://www.theguardian.com/"+x.path} target="_blank">{x.headline}</a></td>
                            <td><a href={"https://dashboard.ophan.co.uk/info?path=/"+x.path}>Ophan</a></td>
                            <td>{x.wordCount}</td>
                            <td>{x.commissionedWordCount}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Headline</th>
                        <th></th>
                        <th>Word Count</th>
                        <th>Commissioned Word Count</th>
                        <th>Number of words over</th>
                    </tr>
                </thead>
                <tbody>
                {sortedArticles.map(x => 
                    <tr key={x.path}>
                        <td><a href={"https://www.theguardian.com/"+x.path} target="_blank">{x.headline}</a></td>
                        <td><a href={"https://dashboard.ophan.co.uk/info?path=/"+x.path}>Ophan</a></td>
                        <td>{x.wordCount}</td>
                        <td>{x.commissionedWordCount}</td>
                        <td>{x.wordCount - x.commissionedWordCount}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ArticleCommissionedLengthTable;
