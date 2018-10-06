

export const ConfigPagination = (userCount) => {
    const usePagination = (userCount > 10) ? true : false;
    const totalPages = usePagination ? userCount / 10 : 1;
    const firstPageEnd = userCount < 10? userCount : null;
    return({'Pagination': usePagination, 'totalPages': totalPages, 'firstPageEnd': firstPageEnd})
}

export const PageIndicies = (pageNumber, totalPages) => {

const startIndex = (pageNumber - 1) * 10
const isPageComplete = (totalPages - startIndex) > 9 ? true : false;
const endIndex = isPageComplete ? (pageNumber * 10) : (totalPages - (pageNumber - 1)) * 10
return {'start': startIndex, 'end':endIndex}

}

