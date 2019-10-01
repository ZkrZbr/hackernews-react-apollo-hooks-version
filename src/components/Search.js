import React, { useState }  from 'react'
import gql from 'graphql-tag'
import Link from './Link'
import {useApolloClient} from 'react-apollo'

const Search  = () => {
    const [links, setLinks] = useState([]);
    const [filter, setFilter] = useState('');
    const client = useApolloClient(); //  !useQuery cus have to be outside any function

    const _executeSearch = async () => {
        const result = await client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter },
        })
        setLinks(result.data.feed.links)
    };

    return (
        <div>
            <div>
                <label className="mb-2">Search</label>
                <input
                    type='text'
                    onChange={e => setFilter(e.target.value)}
                    className="form-control mb-2"
                />
                <button className="pointer mr2 btn btn-outline-primary btn-sm"
                        onClick={() => _executeSearch()}>OK</button>
            </div>
            {links.map((link, index) => (
                <Link key={link.id} link={link} index={index} />
            ))}
        </div>
    );
};

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

export default Search;
