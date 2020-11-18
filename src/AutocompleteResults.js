import './AutocompleteResults.css';

const AutocompleteResult = ({ searchResult }) => {
    const titleString = searchResult.title.length > 40 ?
        `${searchResult.title.substr(0, 40)}...` : searchResult.title;
    const resultTitle = <span className="issueTitle">{titleString}</span>

    const resultLabels = searchResult.labels && searchResult.labels.length > 0 ?
        (<>{searchResult.labels.map((label) => <span key={label} className="issueLabel">{label}</span>)}</>) : null;

    return (
        <li className="searchResult">
            <a href={searchResult.url}><div>{resultTitle}{resultLabels ? " " : null}{resultLabels}</div></a>
        </li>
    );
};

const AutocompleteResults = ({ searchResults }) => {
    return (
        <ul className="searchResults">
            { searchResults.map((result, index) => (
                <AutocompleteResult key={result.url} searchResult={result} />)
            )}
        </ul>
    );
};

export default AutocompleteResults;
