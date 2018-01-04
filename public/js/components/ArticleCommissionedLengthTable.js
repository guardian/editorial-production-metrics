import React from 'react';

const ArticleCommissionedLengthTable = ({articles}) => {
    console.log(articles[0]);
    return(
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
                {articles.map(x => 
                    <tr key={x.path}>
                        <td><a href={"https://www.theguardian.com/"+x.path} target="_blank">{x.headline}</a></td>
                        <td><a href={"https://dashboard.ophan.co.uk/info?path=/"+x.path}>Ophan</a></td>
                        <td>{x.wordCount}</td>
                        <td>{x.commissionedWordCount}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ArticleCommissionedLengthTable;
