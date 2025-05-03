import React from 'react';
function List({ items }) {
return (
<ul>
    {items.map((item, index) => (
        <li key={index}></li>
    ))}
</ul>
);
}
