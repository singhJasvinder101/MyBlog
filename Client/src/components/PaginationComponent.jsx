import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'

const PaginationComponent = ({ currentPage, paginationLinksNumber, onPageChange }) => {
  const pageSize = 5

  const handlePreviousClick = async () => {
    onPageChange(currentPage - 1)
  }


  const renderPageNumbers = () => {
    const totalPages = paginationLinksNumber;
    const pageNumbers = [];  

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
    // console.log(currentPage)
    // console.log(paginationLinksNumber)
    // if (currentPage < paginationLinksNumber) {
    // setLoading(true)
    onPageChange(currentPage + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(false)
  }


  return (
    <div className='mb-5 bottom-pagination'>
      <nav aria-label="Page navigation example m-auto" style={{ 'maxWidth': '19rem', 'margin': 'auto' }}>
        <ul className="pagination">
          <li className="page-item">
            <button
              disabled={currentPage <= 1}
              className="btn btn-primary"
              onClick={handlePreviousClick}>
              Previous
            </button>
          </li>
          {renderPageNumbers()}
          <li className="page-item">
            <button
              disabled={!(currentPage + 1 <= paginationLinksNumber)}
              className="btn btn-primary"
              onClick={handleNextClick}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default PaginationComponent