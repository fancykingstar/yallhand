export const TagID2Friendly = (tagID, allTags) => {
    if(allTags.length === 0) return ''
    const selectedTag = allTags.filter(tag => tag.tagID === tagID)[0]
    return selectedTag.label
} 