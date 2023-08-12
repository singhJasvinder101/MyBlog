import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'

const PaginationComponent = ({ currentPage, paginationLinksNumber, onPageChange }) => {
  // const [page, setPage] = useState(1)
  // const totalresults = 15
  const pageSize = 5

  // so use loading and set loading as prop or state
  // until the products load if only pagination is shown then its not visually appealing so 
  // it must also removed when there is loading 

  const handlePreviousClick = async () => {
    console.log("previous")
    onPageChange(currentPage - 1)
  }

  {console.log(paginationLinksNumber)}

  const renderPageNumbers = () => {
    // const totalPages = Math.ceil(totalresults / pageSize);
    const totalPages = paginationLinksNumber;
    const pageNumbers = [];     //  1 2 3 4  with their styles [] between previous and next buttons
    
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <a onClick={() => { onPageChange(i) }} style={{ cursor: 'pointer' }} className="page-link">
            {i}
          </a>
        </li>
      );
    }

    return pageNumbers;
  };

  const handleNextClick = async () => {
    console.log("next")
    if (page + 1 <= paginationLinksNumber) {
      setLoading(true)
      onPageChange(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    } else {
      // Do nothing if next page exceeds total number of pages
    }
    setLoading(false)
  }


  return (
    <div className='mb-5 bottom-pagination'>
      <nav aria-label="Page navigation example m-auto" style={{ 'maxWidth': '19rem', 'margin': 'auto' }}>
        <ul className="pagination">
          <li className="page-item"><button disabled={currentPage <= 1} className="btn btn-primary" onClick={handlePreviousClick}>Previous</button></li>
          {renderPageNumbers()}
          <li className="page-item"><button disabled={!(currentPage + 1 <= paginationLinksNumber)} className="btn btn-primary" onClick={handleNextClick}>Next</button></li>
        </ul>
      </nav>
    </div>
  )
}

export default PaginationComponent