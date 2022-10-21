import React, { useEffect, useState } from 'react'

interface PaginationControlsProps {
    setLanguage: React.Dispatch<React.SetStateAction<string>>
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
    setPage: React.Dispatch<React.SetStateAction<number>>
    page: number
    itemsPerPage: number
    lastPage: number
}

function PaginationControls(props: PaginationControlsProps) {

    const maxItems = props.itemsPerPage * (props.lastPage-1) + props.itemsPerPage
    const lastPage = Math.floor(props.lastPage)

    const [minItemNumber, setMinItemNumber] = useState(1 + props.itemsPerPage * (props.page-1))
    const [maxItemNumber, setMaxItemNumber] = useState(props.itemsPerPage * (props.page-1) + props.itemsPerPage)

    useEffect(() => {
        setMinItemNumber(1 + props.itemsPerPage * (props.page-1))
        setMaxItemNumber(props.itemsPerPage * (props.page-1) + props.itemsPerPage)
    }, [props.itemsPerPage, props.page])
    

    return (
    <nav className='items-center pt-3' aria-label='Table navigation'>
        <div className='flex flex-row justify-between items-center gap-3'>
            {/* Language selector */}
            <div className='inline-flex flex-row gap-2'>
            <select onChange={e => props.setLanguage(e.target.value)} className="cursor-pointer">
                <option value="Finnish">F</option>
                <option value="Swedish">S</option>
                <option value="English">E</option>
            </select>
            <div className='hidden sm:inline-flex'>
            <span className='text-sm font-normal text-slate-400'>Showing <span className='font-semibold text-slate-700'>
                {minItemNumber}-{maxItemNumber}
                </span> of <span className='font-semibold text-slate-700'>{maxItems}</span>
            </span>
            </div>
            <div className='inline-flex sm:hidden'>
            <span className='text-sm font-normal text-slate-400'><span className='font-semibold text-slate-700'>
            {minItemNumber}-{maxItemNumber}</span>
            </span>
            </div>
            </div>
            {/* Pagination controls */}
            <div className='inline-flex items-center gap-3'>
            {/* Items per page */}
            <div className='items-center hidden sm:inline-block'>
                <span className='text-sm font-normal text-slate-400'>Display </span>
                <select className='cursor-pointer text-sm font-semibold text-slate-700 border border-indigo-50 py-2 px-3 rounded-xl appearance-none hover:bg-indigo-50'
                onChange={e => {
                    props.setPage(1)
                    props.setItemsPerPage(+e.target.value)
                }}>
                <option>10</option>
                <option>25</option>
                <option>50</option>
                </select>
                <span className='text-sm font-normal text-slate-400'> items </span>
            </div>
            {/* Page navigation */}
            <ul className='inline-flex'>
                <li>
                <a className='cursor-pointer block py-2 px-3 ml-0 leading-tight text-slate-400 bg-white rounded-l-xl border border-indigo-50 hover:bg-indigo-50 hover:text-slate-700'
                onClick={_ => props.setPage(props.page == 1 ? 1 : props.page - 1)}>
                    <span className='sr-only'>Previous</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </a>
                </li>
                <li>
                <a className='cursor-pointer block py-2 px-3 leading-tight text-slate-400 bg-white border border-indigo-50 hover:bg-indigo-50 hover:text-slate-700'
                onClick={_ => props.setPage(1)}>1</a>
                </li>
                <li>
                    <a className='cursor-pointer block py-2 px-3 leading-tight text-slate-400 bg-white border border-indigo-50 hover:bg-indigo-50 hover:text-slate-700'
                    onClick={_ => props.setPage(props.page == lastPage ? lastPage : props.page + 1)}>{props.page == lastPage ? lastPage : props.page + 1}</a>
                </li>
                <li>
                    <a className='cursor-pointer data block py-2 px-3 leading-tight text-slate-400 bg-white border border-indigo-50 hover:bg-indigo-50 hover:text-slate-700'>...</a>
                    </li>
                <li>
                <a className='cursor-pointer block py-2 px-3 leading-tight text-slate-400 bg-white border border-indigo-50 hover:bg-indigo-50 hover:text-slate-700'
                onClick={_ => props.setPage(lastPage)}>{lastPage}</a>
                </li>
                <li>
                <a className='cursor-pointer block py-2 px-3 mr-0 leading-tight text-slate-400 bg-white rounded-r-xl border border-indigo-50 hover:bg-indigo-50 hover:text-slate-700'
                onClick={_ => props.setPage(props.page == lastPage ? lastPage : props.page + 1)}>
                    <span className="sr-only">Next</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                </a>
                </li>
                <li></li>
            </ul>
            </div>
        </div>
      </nav>
  )
}

export default PaginationControls