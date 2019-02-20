export const TagID2Friendly = (tagID, allTags) => {
    const selectedTag = allTags.filter(tag => tag.tagID === tagID)[0]
    return selectedTag.label
} 