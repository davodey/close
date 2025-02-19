import React, {useCallback} from "react";

const ListItem = React.memo(({ item, selected, onToggle }) => {
    // Handle selection toggling
    const handleClick = useCallback(() => {
        onToggle(item);
    }, [item, onToggle]);

    return (
        <li className={`list-item list-item--${item.color} ${selected ? "selected" : ""}`}>
            <button onClick={handleClick}>{item.name}</button>
        </li>
    );
});

export default ListItem;