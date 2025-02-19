import React, {useCallback, useState} from "react";
import ListItem from "./ListItem";

const List = ({ items }) => {
    const [selectedItems, setSelectedItems] = useState(new Map());

    // Clicking an item selects/unselects it
    const toggleSelect = useCallback((item) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Map(prevSelected);
            if (newSelected.has(item.name)) {
                newSelected.delete(item.name);
            } else {
                // Extract background color and text color from CSS variables
                const itemElement = document.querySelector(`.list-item--${item.color}`);
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
    const removeSelectedItem = (itemName) => {
        setSelectedItems((prevSelected) => {
            const newSelected = new Map(prevSelected);
            newSelected.delete(itemName);
            return newSelected;
        });
    };

    return (
        <>
            <div className="selected-items-container">
                <h2>Selected Items</h2>
                <div className="selected-items">
                    {selectedItems.size > 0 ? (
                        Array.from(selectedItems).map(([name, { backgroundColor, textColor }], index) => (
                            <span
                                key={index}
                                className="selected-badge"
                                style={{ backgroundColor, color: textColor }}
                            >
                                {name}
                                <button
                                    className="remove-btn"
                                    onClick={() => removeSelectedItem(name)}
                                    aria-label={`Remove ${name}`}
                                    style={{ color: textColor }} // Ensures "X" uses correct contrast
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
                {items.map((item, index) => (
                    <ListItem
                        key={index}
                        item={item}
                        selected={selectedItems.has(item.name)}
                        onToggle={toggleSelect}
                    />
                ))}
            </ul>
        </>
    );
};

export default List;