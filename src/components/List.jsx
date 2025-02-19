import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import ListItem from "./ListItem";

const List = ({ items }) => {
    const [selectedItems, setSelectedItems] = useState(() => new Map());
    const itemRefs = useRef(new Map()); // Store refs for each item

    // Memoize items to prevent unnecessary recalculations
    const memoizedItems = useMemo(() => items, [items]);

    // Store ref for each list item
    const setItemRef = useCallback((node, itemName) => {
        if (node) {
            itemRefs.current.set(itemName, node);
        } else {
            itemRefs.current.delete(itemName);
        }
    }, []);

    // Clicking an item selects/unselects it
    const toggleSelect = useCallback((item) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Map(prevSelected);
            if (newSelected.has(item.name)) {
                newSelected.delete(item.name);
            } else {
                const itemElement = itemRefs.current.get(item.name);
                if (itemElement) {
                    const computedStyle = getComputedStyle(itemElement);
                    const backgroundColor = computedStyle.backgroundColor;
                    const textColor = computedStyle.getPropertyValue("--text-color") || computedStyle.color;

                    newSelected.set(item.name, { backgroundColor, textColor });
                }
            }
            return newSelected;
        });
    }, []);

    // Remove a selected item by clicking the "X"
    const removeSelectedItem = useCallback((itemName) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Map(prevSelected);
            newSelected.delete(itemName);
            return newSelected;
        });
    }, []);

    // Memoize the selected items array to prevent unnecessary re-renders
    const selectedItemsArray = useMemo(() => Array.from(selectedItems), [selectedItems]);

    return (
        <>
            <div className="selected-items-container">
                <h2>Selected Items</h2>
                <div className="selected-items">
                    {selectedItemsArray.length > 0 ? (
                        selectedItemsArray.map(([name, { backgroundColor, textColor }]) => (
                            <span
                                key={name}
                                className="selected-badge"
                                style={{ backgroundColor, color: textColor }}
                            >
                                {name}
                                <button
                                    className="remove-btn"
                                    onClick={() => removeSelectedItem(name)}
                                    aria-label={`Remove ${name}`}
                                    style={{ color: textColor }}
                                >
                                    ✕
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="placeholder-text">Please select an item.</span>
                    )}
                </div>
            </div>

            {/* List of items */}
            <ul className="list">
                {memoizedItems.map((item) => (
                    <ListItem
                        key={item.name}
                        item={item}
                        selected={selectedItems.has(item.name)}
                        onToggle={toggleSelect}
                        setItemRef={setItemRef} // Pass ref setter
                    />
                ))}
            </ul>
        </>
    );
};

export default React.memo(List);