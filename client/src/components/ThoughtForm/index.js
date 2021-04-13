import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      try {
        // could potentionally not exist yet, so wrap in a try...catch

        const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

        // prepend the newest thought to the front of the array
        cache.writeQuery({
          query: QUERY_THOUGHTS,
          data: { thoughts: [addThought, ...thoughts] },
        });
      } catch (err) {
        /* handle error */
        console.error(err);
      }
      // update me objects's cache, appending new thought to the end of the array
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
      });
    },
  });
  const [thoughtText, setThoughtText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setThoughtText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add thought to Database
      await addThought({
        variables: { thoughtText },
      });

      // clear form value
      setThoughtText('');
      setCharacterCount(0);
    } catch (err) {
      /* handle error */
      console.error(err);
    }
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button type="submit" className="btn-col-12 col-md-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
