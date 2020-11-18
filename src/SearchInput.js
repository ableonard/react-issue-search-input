import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import AutocompleteResults from './AutocompleteResults';

import './SearchInput.css';

const reactIssueQuery = gql`
    query searchReactIssues($searchQuery: String!) {
        search(query: $searchQuery, first:10, type:ISSUE) {
            edges {
                node {
                    ... on Issue {
                        title
                        url
                        labels(first:10) {
                            nodes {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;

const dataToResults = (json) => {
    return json.search.edges.map((edge) => {
        return {
            title: edge.node.title,
            url: edge.node.url,
            labels: edge.node.labels ? edge.node.labels.nodes.map((label) => label.name) : []
        };
    });
};

const SearchInput = () => {
    const [ searchText, setSearchText ] = useState("");
    const [ searchResults, setSearchResults ] = useState([]);
    const [ runQuery, { data } ] = useLazyQuery(reactIssueQuery);
    useEffect(() => {
        if (searchText) {
            runQuery({ variables: { searchQuery: `repo:facebook/react is:issue ${searchText}` }});
        }
    }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (data) {
            setSearchResults(dataToResults(data));
        }
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="searchInputWrapper">
            <input className="searchInput" placeholder="Enter Search Terms" onChange={(e) => { setSearchText(e.target.value) }} />
            { searchResults && searchResults.length > 0 ?
                <AutocompleteResults searchResults={searchResults} /> : null
            }
        </div>
    );
};

export default SearchInput;
