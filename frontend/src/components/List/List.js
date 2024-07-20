import React from 'react';
import styles from './List.module.css';

const List = ({ items, onSelect, onDelete, showDeleteButton }) => {
  return (
    <ul className={styles.list}>
      {items.map(item => (
        <li key={item._id} className={styles.listItem}>
          <span onClick={() => onSelect(item._id)}>
            {item.name}
          </span>
          {showDeleteButton && <button onClick={() => onDelete(item._id)}>Delete</button>}
        </li>
      ))}
    </ul>
  );
};

export default List;
