import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [goodTags, setGoodTags] = useState([]);
  const [badTags, setBadTags] = useState([]);
  const [tags, setTags] = useState([]);

  const updateGoodTags = (tag) => {
    const updatedGoodTags = goodTags.includes(tag)
      ? goodTags.filter((gTag) => gTag !== tag)
      : [...goodTags, tag];
    setGoodTags(updatedGoodTags);
  };

  const updateBadTags = (tag) => {
    const updatedBadTags = badTags.includes(tag)
      ? badTags.filter((bTag) => bTag !== tag)
      : [...badTags, tag];
    setBadTags(updatedBadTags);
  };

  const updateTags = (newTags) => {
    setTags(newTags);
  };

  return (
    <FilterContext.Provider value={{ goodTags, updateGoodTags, badTags, updateBadTags, tags, updateTags }}>
      {children}
    </FilterContext.Provider>
  );
};