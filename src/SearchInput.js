import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import AutocompleteResults from './AutocompleteResults';

import './SearchInput.css';
import useDebounce from './useDebounce';

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
    const debouncedSearchText = useDebounce(searchText, 300);
    const [ searchResults, setSearchResults ] = useState([]);
    const [ activeResultIndex, setActiveResult ] = useState(-1);
    const [ runQuery, { data } ] = useLazyQuery(reactIssueQuery);
    useEffect(() => {
        if (debouncedSearchText) {
            runQuery({ variables: { searchQuery: `repo:facebook/react is:issue ${debouncedSearchText}` }});
        }
    }, [debouncedSearchText, runQuery]);
    useEffect(() => {
        if (data) {
            setSearchResults(dataToResults(data));
            setActiveResult(-1);
        }
    }, [data, setSearchResults, setActiveResult]);

    const onChange = (e) => { setSearchText(e.target.value) };
    const onKeyDown = (e) => {
        if (e.keyCode === 38 && activeResultIndex > -1) { // up arrow
            setActiveResult(activeResultIndex - 1);
        } else if (e.keyCode === 40 && activeResultIndex < searchResults.length - 1) { // down arrow
            setActiveResult(activeResultIndex + 1);
        } else if (e.keyCode === 13 && activeResultIndex > -1 && activeResultIndex < searchResults.length) { // enter key
            window.location = searchResults[activeResultIndex].url;
        }
    }

    return (
        <div className="searchInputWrapper">
            <input className="searchInput" onChange={onChange} onKeyDown={onKeyDown} placeholder="Enter Search Terms" />
            { searchResults && searchResults.length > 0 ?
                <AutocompleteResults searchResults={searchResults} activeResultIndex={activeResultIndex} /> : null
            }
        </div>
    );
};

export default SearchInput;
