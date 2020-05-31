import React from 'react';
import { Icon } from '@iconify/react';
import searchIcon from '@iconify/icons-uil/search';

import './Search.css';

const searchBox = props => {
  const classes = ['search-box'];
  if (props.className !== undefined) {
    classes.push(props.className);
  }

  return (
    <span className={classes.join(' ')}>
      <span className="search-prefix">
        <Icon icon={searchIcon} />
      </span>
      <input type="text" placeholder={props.placeholder} onChange={props.onChange} />
    </span>
  );
};

export default searchBox;