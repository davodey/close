import React, { useCallback, useRef, useEffect, useMemo } from "react";

const ListItem = React.memo(({ item, selected, onToggle, setItemRef }) => {
    const itemRef = useRef(null);

    // Pass reference to parent (List) via setItemRef
    useEffect(() => {
        if (itemRef.current) {
            setItemRef(itemRef.current, item.name);
        }
    }, [setItemRef, item.name]);

    const handleClick = useCallback(() => {
        onToggle(item);
    }, [item, onToggle]);

    // Memoize className to prevent unnecessary recalculations
    const className = useMemo(() => {
        return `list-item list-item--${item.color} ${selected ? "selected" : ""}`;
    }, [item.color, selected]);

    return (
        <li ref={itemRef} className={className}>
            <button onClick={handleClick}>{item.name}</button>
        </li>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.item.name === nextProps.item.name &&
        prevProps.selected === nextProps.selected &&
        prevProps.onToggle === nextProps.onToggle
    );
});

export default ListItem;