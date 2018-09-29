

export const UserPagination = (userCount) => {
        const usePagination = (userCount > 10) ? true : false;
        const totalPages = userCount / 10;
        const firstPageEnd = userCount < 10? userCount : null;
        return({'usePagination': usePagination, 'totalPages': totalPages, 'firstPageEnd': firstPageEnd})
}

export const PageIndicies = (pageNumber, totalPages) => {
    
    const startIndex = (pageNumber - 1) * 10
    const isPageComplete = (totalPages - startIndex) > 9 ? true : false;
    const endIndex = isPageComplete ? (pageNumber * 10) : (totalPages - (pageNumber - 1)) * 10
    return {'start': startIndex, 'end':endIndex}
    
}

