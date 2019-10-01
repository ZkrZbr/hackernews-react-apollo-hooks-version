import React from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks';


const Link = (props) => {
    // [voteMutation, { data, error, loading }]
    const [voteMutation] = useMutation(
        VOTE_MUTATION,
        {
            update(store, { data: { vote } }) {
                props.updateStoreAfterVote(store, vote, props.link.id)
            }
        }
    );

    const authToken = localStorage.getItem(AUTH_TOKEN)

    const onSubmit = (e) => {
        e.preventDefault();
        //voteMutation({ variables: { linkId: props.link.id } }).then().catch();
        voteMutation({ variables: { linkId: props.link.id } });
    };

    return (
        <div className="flex mt2 items-start">
            <div className="flex items-center">
                <span className="gray">{props.index + 1}.</span>
                {authToken && (
                    <div className="ml1 gray f11" onClick={onSubmit}>
                        ▲
                    </div>
                )}
            </div>
            <div className="ml1">
                <div>
                    {props.link.description} ({props.link.url})
                </div>
                <div className="f6 lh-copy gray">
                    {props.link.votes.length} votes | by{' '}
                    {props.link.postedBy
                        ? props.link.postedBy.name
                        : 'Unknown'}{' '}
                    {timeDifferenceForDate(props.link.createdAt)}
                </div>
            </div>
        </div>
    )
};

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

export default Link;
