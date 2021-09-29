import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Comment, Search, SearchProps, SearchResultData, SearchResultProps } from 'semantic-ui-react'
import agent from '../api/agent';
import { SearchResult } from '../models/search';

export default function SearchBar() {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState<string | undefined>('');
    const [results, setResults] = useState<SearchResult[]>([]);

    console.log('results',results)

    useEffect(() => {
        if(value) {
            const fetchData = async (term: string) => {
                return await agent.Search.search(term);
            }
            
            setLoading(true);
            fetchData(value).then(results => { setResults(results); setLoading(false); }).catch(() => setLoading(false));

            
        } else {
            setResults([]);
        }
    }, [value]);

    const onResultSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: SearchResultData) => {
        setValue('');
    }
    
    const handleSearchChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, data: SearchProps) => {
        setValue(data.value);
    }

    const resultRenderer = ({image, displayName, username}: SearchResultProps) => {
    
        return (
            <Comment.Group as={Link} to={`/profiles/${username}`}>
                <Comment>
                    <Comment.Avatar src={image || '/assets/user.png'} />
                    <Comment.Content>
                        <Comment.Author>{username}</Comment.Author>
                        <Comment.Text>{displayName}</Comment.Text>
                    </Comment.Content>
                </Comment>
            </Comment.Group>
    )}

    return (
        <Search
            loading={loading}
            onResultSelect={onResultSelect}
            onSearchChange={handleSearchChange}
            resultRenderer={resultRenderer}
            results={results}
            value={value}
        />
        
    )
}
