import { TagID2Friendly } from "../SharedCalculations/TagID2Friendly";
export const getDisplayTags = (tags, classes) => {
    let displayTags = tags;
    if (displayTags.length !== 0) {
      displayTags = displayTags.map(tag =>
        TagID2Friendly(tag, classes)
      );
    }
    else {
      displayTags = "(No Tag)"
    }
    displayTags = tags.length > 1 ? tags.join(", ") : displayTags;
    return displayTags;
  }
